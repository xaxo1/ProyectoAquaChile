import { Router } from 'express';
import { query } from '../db.js';
import { tieneErrores, validarCandidato } from '../../src/utils/validaciones.js';

const router = Router();

const SELECT_CANDIDATO = `
  SELECT id, nombre, email, telefono, cargo, familia_cargo AS "familiaCargo",
         ubicacion, origen, fecha_registro AS "fechaRegistro"
  FROM candidatos`;

// Normaliza los datos antes de guardarlos
export function limpiarCandidato(datos) {
  return {
    nombre: datos.nombre.trim(),
    email: datos.email.trim().toLowerCase(),
    telefono: datos.telefono.replace(/\s/g, ''),
    cargo: datos.cargo.trim(),
    familiaCargo: datos.familiaCargo,
    ubicacion: datos.ubicacion ?? '',
    origen: datos.origen || 'Interno',
  };
}

export async function insertarCandidato(datos) {
  const c = limpiarCandidato(datos);
  const { rows } = await query(
    `INSERT INTO candidatos (nombre, email, telefono, cargo, familia_cargo, ubicacion, origen)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [c.nombre, c.email, c.telefono, c.cargo, c.familiaCargo, c.ubicacion, c.origen]
  );
  return buscarCandidato(rows[0].id);
}

async function buscarCandidato(id) {
  const { rows } = await query(`${SELECT_CANDIDATO} WHERE id = $1`, [id]);
  return rows[0];
}

router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(404).json({ error: 'Candidato no encontrado.' });
  next();
});

router.get('/', async (req, res) => {
  const { rows } = await query(`${SELECT_CANDIDATO} ORDER BY fecha_registro DESC, id DESC`);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const candidato = await buscarCandidato(Number(req.params.id));
  if (!candidato) return res.status(404).json({ error: 'Candidato no encontrado.' });
  res.json(candidato);
});

router.post('/', async (req, res) => {
  const errores = validarCandidato(req.body ?? {});
  if (tieneErrores(errores)) return res.status(400).json({ error: 'Revisa los datos del candidato.', errores });
  res.status(201).json(await insertarCandidato(req.body));
});

router.put('/:id', async (req, res) => {
  const errores = validarCandidato(req.body ?? {});
  if (tieneErrores(errores)) return res.status(400).json({ error: 'Revisa los datos del candidato.', errores });

  const c = limpiarCandidato(req.body);
  const { rowCount } = await query(
    `UPDATE candidatos SET nombre = $1, email = $2, telefono = $3, cargo = $4,
       familia_cargo = $5, ubicacion = $6, origen = $7
     WHERE id = $8`,
    [c.nombre, c.email, c.telefono, c.cargo, c.familiaCargo, c.ubicacion, c.origen, Number(req.params.id)]
  );
  if (!rowCount) return res.status(404).json({ error: 'Candidato no encontrado.' });
  res.json(await buscarCandidato(Number(req.params.id)));
});

export default router;
