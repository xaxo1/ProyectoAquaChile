/**
 * Reglas de validación compartidas por todos los formularios.
 * Cada función devuelve un objeto { campo: 'mensaje' } solo con los campos
 * que tienen error. Si el objeto está vacío, el formulario es válido.
 */

export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Celular chileno: 9 dígitos que comienzan con 9, con o sin +56.
export const REGEX_TELEFONO = /^(\+?56)?9\d{8}$/;
export const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' ]+$/;

export function tieneErrores(errores) {
  return Object.keys(errores).length > 0;
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
  if (!datos.familiaCargo) errores.familiaCargo = 'Selecciona la familia de cargo.';

  return errores;
}

export function validarSolicitud(datos) {
  const errores = {};
  if (!datos.candidatoId) errores.candidatoId = 'Selecciona un candidato.';
  if (!(datos.cargo ?? '').trim()) errores.cargo = 'Indica el cargo.';
  if (!datos.familiaCargo) errores.familiaCargo = 'Selecciona la familia de cargo.';
  if (!(datos.analista ?? '').trim()) errores.analista = 'Indica el analista que solicita.';
  return errores;
}

export function validarEvaluacion(datos) {
  const errores = {};
  if (!datos.fechaEvaluacion) errores.fechaEvaluacion = 'Indica la fecha de la evaluación.';
  if (!datos.resultado) errores.resultado = 'Selecciona un resultado.';
  const obs = (datos.observaciones ?? '').trim();
  if (obs.length < 20) errores.observaciones = 'Escribe al menos 20 caracteres de observaciones.';
  return errores;
}
