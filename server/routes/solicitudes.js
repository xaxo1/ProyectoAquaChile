import { Router } from 'express';
import { query } from '../db.js';
import { soloRol } from '../middleware/auth.js';
import {
  tieneErrores,
  validarCambioEtapa,
  validarEvaluacion,
  validarSolicitud,
} from '../../src/utils/validaciones.js';

const router = Router();

const SELECT_SOLICITUD = `
  SELECT id, candidato_id AS "candidatoId", cargo, familia_cargo AS "familiaCargo", ubicacion,
         analista, responsable_id AS "responsableId", etapa, fecha_solicitud AS "fechaSolicitud",
         fecha_entrevista AS "fechaEntrevista", observaciones
  FROM solicitudes`;

const SELECT_EVALUACION = `
  SELECT id, solicitud_id AS "solicitudId", fecha_evaluacion AS "fechaEvaluacion",
         resultado, observaciones, estado
  FROM evaluaciones`;

// Agrega a cada solicitud su historial de etapas
async function conHistorial(solicitudes) {
  if (!solicitudes.length) return [];
  const { rows } = await query(
    `SELECT solicitud_id AS "solicitudId", etapa, fecha, comentario, usuario
     FROM historial_etapas WHERE solicitud_id = ANY($1) ORDER BY id`,
    [solicitudes.map((s) => s.id)]
  );
  return solicitudes.map((s) => ({
    ...s,
    historial: rows.filter((h) => h.solicitudId === s.id).map(({ solicitudId, ...h }) => h),
  }));
}

export async function buscarSolicitud(id) {
  const { rows } = await query(`${SELECT_SOLICITUD} WHERE id = $1`, [id]);
  if (!rows[0]) return null;
  const [solicitud] = await conHistorial(rows);
  return solicitud;
}

async function buscarEvaluacion(solicitudId) {
  const { rows } = await query(`${SELECT_EVALUACION} WHERE solicitud_id = $1`, [solicitudId]);
  return rows[0] ?? null;
}

export async function insertarSolicitud(datos, usuario) {
  const { rows } = await query(
    `INSERT INTO solicitudes (candidato_id, cargo, familia_cargo, ubicacion, analista, responsable_id, observaciones)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [
      Number(datos.candidatoId), datos.cargo.trim(), datos.familiaCargo, datos.ubicacion ?? '',
      datos.analista.trim(), datos.responsableId || null, (datos.observaciones ?? '').trim(),
    ]
  );
  await query(
    'INSERT INTO historial_etapas (solicitud_id, etapa, comentario, usuario) VALUES ($1, $2, $3, $4)',
    [rows[0].id, 'recibida', 'Solicitud creada', usuario]
  );
  return buscarSolicitud(rows[0].id);
}

router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(404).json({ error: 'Solicitud no encontrada.' });
  next();
});

router.get('/', async (req, res) => {
  const { rows } = await query(`${SELECT_SOLICITUD} ORDER BY fecha_solicitud DESC, id DESC`);
  res.json(await conHistorial(rows));
});

router.get('/evaluaciones', async (req, res) => {
  const { rows } = await query(SELECT_EVALUACION);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const solicitud = await buscarSolicitud(Number(req.params.id));
  if (!solicitud) return res.status(404).json({ error: 'Solicitud no encontrada.' });
  res.json({ ...solicitud, evaluacion: await buscarEvaluacion(solicitud.id) });
});

router.post('/', async (req, res) => {
  const errores = validarSolicitud(req.body ?? {});
  if (tieneErrores(errores)) return res.status(400).json({ error: 'Revisa los datos de la solicitud.', errores });

  const existe = await query('SELECT 1 FROM candidatos WHERE id = $1', [Number(req.body.candidatoId)]);
  if (!existe.rowCount) return res.status(400).json({ error: 'El candidato seleccionado no existe.' });

  res.status(201).json(await insertarSolicitud(req.body, req.usuario.nombre));
});

// Asignar responsable, fecha de entrevista u observaciones
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const actual = await buscarSolicitud(id);
  if (!actual) return res.status(404).json({ error: 'Solicitud no encontrada.' });

  const { responsableId, fechaEntrevista, observaciones } = { ...actual, ...req.body };
  if (responsableId) {
    const evaluador = await query("SELECT 1 FROM usuarios WHERE id = $1 AND rol = 'evaluador'", [responsableId]);
    if (!evaluador.rowCount) return res.status(400).json({ error: 'El responsable debe ser un evaluador.' });
  }

  await query(
    'UPDATE solicitudes SET responsable_id = $1, fecha_entrevista = $2, observaciones = $3 WHERE id = $4',
    [responsableId || null, fechaEntrevista || null, observaciones ?? '', id]
  );
  res.json(await buscarSolicitud(id));
});

router.patch('/:id/etapa', async (req, res) => {
  const id = Number(req.params.id);
  const solicitud = await buscarSolicitud(id);
  if (!solicitud) return res.status(404).json({ error: 'Solicitud no encontrada.' });

  const { etapa, comentario } = req.body ?? {};
  const evaluacion = await buscarEvaluacion(id);
  const error = validarCambioEtapa(solicitud, etapa, evaluacion);
  if (error) return res.status(400).json({ error });

  await query('UPDATE solicitudes SET etapa = $1 WHERE id = $2', [etapa, id]);
  await query(
    'INSERT INTO historial_etapas (solicitud_id, etapa, comentario, usuario) VALUES ($1, $2, $3, $4)',
    [id, etapa, (comentario ?? '').trim() || 'Cambio de etapa', req.usuario.nombre]
  );
  // Con el informe enviado la evaluación queda finalizada; si se retrocede, vuelve a "En proceso"
  if (evaluacion) {
    await query('UPDATE evaluaciones SET estado = $1 WHERE solicitud_id = $2', [
      etapa === 'enviado' ? 'Finalizada' : 'En proceso',
      id,
    ]);
  }

  res.json({ solicitud: await buscarSolicitud(id), evaluacion: await buscarEvaluacion(id) });
});

// Solo el profesional evaluador registra la evaluación
router.put('/:id/evaluacion', soloRol('evaluador'), async (req, res) => {
  const id = Number(req.params.id);
  const solicitud = await buscarSolicitud(id);
  if (!solicitud) return res.status(404).json({ error: 'Solicitud no encontrada.' });
  if (!['realizada', 'enviado'].includes(solicitud.etapa)) {
    return res.status(400).json({ error: 'La evaluación se registra después de realizar la entrevista.' });
  }

  const errores = validarEvaluacion(req.body ?? {});
  if (tieneErrores(errores)) return res.status(400).json({ error: 'Revisa los datos de la evaluación.', errores });

  const { fechaEvaluacion, resultado, observaciones } = req.body;
  const estado = solicitud.etapa === 'enviado' ? 'Finalizada' : 'En proceso';
  await query(
    `INSERT INTO evaluaciones (solicitud_id, fecha_evaluacion, resultado, observaciones, estado)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (solicitud_id)
     DO UPDATE SET fecha_evaluacion = $2, resultado = $3, observaciones = $4, estado = $5`,
    [id, fechaEvaluacion, resultado, observaciones.trim(), estado]
  );
  res.json(await buscarEvaluacion(id));
});

export default router;
