import { Router } from 'express';
import { insertarCandidato } from './candidatos.js';
import { insertarSolicitud } from './solicitudes.js';
import { tieneErrores, validarCandidato } from '../../src/utils/validaciones.js';

const router = Router();

// POST /api/postulaciones: formulario público (no requiere sesión).
// Crea el candidato y su solicitud en "Evaluación recibida", como hacía el Forms.
router.post('/', async (req, res) => {
  const datos = req.body ?? {};
  const errores = validarCandidato(datos);
  if (!(datos.analista ?? '').trim()) errores.analista = 'Indica quién solicita la evaluación.';
  if (tieneErrores(errores)) return res.status(400).json({ error: 'Revisa los datos del formulario.', errores });

  const candidato = await insertarCandidato(datos);
  const solicitud = await insertarSolicitud(
    { ...candidato, candidatoId: candidato.id, analista: datos.analista, observaciones: datos.observaciones },
    `${datos.analista.trim()} (formulario público)`
  );
  res.status(201).json({ candidato, solicitud });
});

export default router;
