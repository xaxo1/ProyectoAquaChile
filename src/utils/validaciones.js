/**
 * Reglas de validación compartidas por los formularios y por la API.
 * Cada función devuelve un objeto { campo: 'mensaje' } solo con los campos
 * que tienen error. Si el objeto está vacío, los datos son válidos.
 */
import { ETAPAS, FAMILIAS_CARGO, ORIGENES, RESULTADOS } from '../data/catalogos.js';

export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Celular chileno: 9 dígitos que comienzan con 9, con o sin +56.
export const REGEX_TELEFONO = /^(\+?56)?9\d{8}$/;
export const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' ]+$/;
const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;

export function tieneErrores(errores) {
  return Object.keys(errores).length > 0;
}

export function validarLogin(datos) {
  const errores = {};
  const email = (datos.email ?? '').trim();
  if (!email) errores.email = 'Ingresa tu correo.';
  else if (!REGEX_EMAIL.test(email)) errores.email = 'El correo no tiene un formato válido.';
  if (!datos.password) errores.password = 'Ingresa tu contraseña.';
  return errores;
}

export function validarCandidato(datos) {
  const errores = {};
  const nombre = (datos.nombre ?? '').trim();
  const email = (datos.email ?? '').trim();
  const telefono = (datos.telefono ?? '').replace(/\s/g, '');

  if (!nombre) errores.nombre = 'Ingresa el nombre del candidato.';
  else if (nombre.length < 3) errores.nombre = 'El nombre debe tener al menos 3 letras.';
  else if (!REGEX_NOMBRE.test(nombre)) errores.nombre = 'El nombre solo puede tener letras y espacios.';

  if (!email) errores.email = 'Ingresa un correo electrónico.';
  else if (!REGEX_EMAIL.test(email)) errores.email = 'Usa un correo válido, por ejemplo nombre@correo.cl.';

  if (!telefono) errores.telefono = 'Ingresa un teléfono de contacto.';
  else if (!REGEX_TELEFONO.test(telefono)) errores.telefono = 'Usa un celular chileno, por ejemplo +56912345678.';

  if (!(datos.cargo ?? '').trim()) errores.cargo = 'Indica el cargo al que postula.';
  if (!FAMILIAS_CARGO.includes(datos.familiaCargo)) errores.familiaCargo = 'Selecciona la familia de cargo.';
  if (datos.origen && !ORIGENES.includes(datos.origen)) errores.origen = 'El origen debe ser Interno o Externo.';

  return errores;
}

export function validarSolicitud(datos) {
  const errores = {};
  if (!datos.candidatoId) errores.candidatoId = 'Selecciona un candidato.';
  if (!(datos.cargo ?? '').trim()) errores.cargo = 'Indica el cargo.';
  if (!FAMILIAS_CARGO.includes(datos.familiaCargo)) errores.familiaCargo = 'Selecciona la familia de cargo.';
  if (!(datos.analista ?? '').trim()) errores.analista = 'Indica el analista que solicita.';
  return errores;
}

export function validarEvaluacion(datos) {
  const errores = {};
  if (!REGEX_FECHA.test(datos.fechaEvaluacion ?? '')) errores.fechaEvaluacion = 'Indica la fecha de la evaluación.';
  if (!RESULTADOS.includes(datos.resultado)) errores.resultado = 'Selecciona un resultado.';
  const obs = (datos.observaciones ?? '').trim();
  if (obs.length < 20) errores.observaciones = 'Escribe al menos 20 caracteres de observaciones.';
  return errores;
}

/**
 * Reglas del negocio para mover una solicitud de etapa.
 * Devuelve un mensaje de error o null si el cambio está permitido.
 */
export function validarCambioEtapa(solicitud, etapaNueva, evaluacion) {
  const orden = ETAPAS.map((e) => e.id);
  const actual = orden.indexOf(solicitud.etapa);
  const nueva = orden.indexOf(etapaNueva);

  if (nueva === -1) return 'La etapa indicada no existe.';
  if (nueva === actual) return 'La solicitud ya está en esa etapa.';
  // Solo se avanza o retrocede de a una etapa, igual que en el Planner.
  if (Math.abs(nueva - actual) > 1) return 'Solo puedes avanzar o retroceder una etapa a la vez.';

  if (etapaNueva === 'agendada' && nueva > actual) {
    if (!solicitud.responsableId) return 'Asigna un evaluador antes de agendar la entrevista.';
    if (!solicitud.fechaEntrevista) return 'Indica la fecha de la entrevista antes de agendarla.';
  }
  if (etapaNueva === 'enviado' && !evaluacion) {
    return 'Registra la evaluación antes de marcar el informe como enviado.';
  }
  return null;
}
