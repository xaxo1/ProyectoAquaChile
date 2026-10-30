// Crea las tablas y carga los datos de prueba: npm run db:init
import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { ETAPAS } from '../../src/data/catalogos.js';
import * as datos from './datosPrueba.js';

const ORDEN = ETAPAS.map((e) => e.id);

async function iniciar() {
  const schema = fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');
  await pool.query(schema);
  console.log('Tablas creadas');

  const hash = await bcrypt.hash(datos.PASSWORD_PRUEBA, 10);
  const idUsuario = {};
  for (const u of datos.usuarios) {
    const { rows } = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id',
      [u.nombre, u.email, hash, u.rol]
    );
    idUsuario[u.clave] = rows[0].id;
  }

  const idCandidato = {};
  for (const c of datos.candidatos) {
    const { rows } = await pool.query(
      `INSERT INTO candidatos (nombre, email, telefono, cargo, familia_cargo, ubicacion, origen, fecha_registro)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [c.nombre, c.email, c.telefono, c.cargo, c.familiaCargo, c.ubicacion, c.origen, c.fechaRegistro]
    );
    idCandidato[c.clave] = rows[0].id;
  }

  const idSolicitud = {};
  for (const s of datos.solicitudes) {
    const candidato = datos.candidatos.find((c) => c.clave === s.candidato);
    const { rows } = await pool.query(
      `INSERT INTO solicitudes (candidato_id, cargo, familia_cargo, ubicacion, analista, responsable_id,
         etapa, fecha_solicitud, fecha_entrevista, observaciones)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [
        idCandidato[s.candidato], candidato.cargo, candidato.familiaCargo, candidato.ubicacion, s.analista,
        s.responsable ? idUsuario[s.responsable] : null, s.etapa, s.fechas[0], s.fechaEntrevista ?? null,
        s.observaciones ?? '',
      ]
    );
    idSolicitud[s.candidato] = rows[0].id;

    // Historial: una fila por cada etapa por la que pasó la solicitud
    for (let i = 0; i <= ORDEN.indexOf(s.etapa); i++) {
      await pool.query(
        'INSERT INTO historial_etapas (solicitud_id, etapa, fecha, comentario, usuario) VALUES ($1, $2, $3, $4, $5)',
        [rows[0].id, ORDEN[i], s.fechas[i], i === 0 ? 'Solicitud creada' : 'Cambio de etapa', s.analista]
      );
    }
  }

  for (const e of datos.evaluaciones) {
    const solicitud = datos.solicitudes.find((s) => s.candidato === e.candidato);
    await pool.query(
      `INSERT INTO evaluaciones (solicitud_id, fecha_evaluacion, resultado, observaciones, estado)
       VALUES ($1, $2, $3, $4, $5)`,
      [idSolicitud[e.candidato], e.fechaEvaluacion, e.resultado, e.observaciones,
        solicitud.etapa === 'enviado' ? 'Finalizada' : 'En proceso']
    );
  }

  console.log('Datos de prueba cargados');
}

iniciar()
  .catch((err) => {
    console.error('Error al iniciar la base de datos:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
