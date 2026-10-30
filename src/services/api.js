/**
 * Funciones para comunicarse con el backend.
 * Todas las peticiones pasan por aquí para agregar el token de sesión
 * y manejar los errores de la misma forma.
 */
const CLAVE_SESION = 'aquachile-sesion';

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch {
    return null;
  }
}

export function guardarSesion(sesion) {
  if (sesion) localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  else localStorage.removeItem(CLAVE_SESION);
}

export class ErrorApi extends Error {
  constructor(mensaje, status, errores = {}) {
    super(mensaje);
    this.status = status;
    this.errores = errores;
  }
}

// Se llama cuando el token expira (lo define AuthContext)
let alExpirarSesion = () => {};
export function onSesionExpirada(fn) {
  alExpirarSesion = fn;
}

async function peticion(metodo, ruta, cuerpo) {
  const token = obtenerSesion()?.token;
  let respuesta;
  try {
    respuesta = await fetch(`/api${ruta}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ErrorApi('No se pudo conectar con el servidor.', 0);
  }

  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    if (respuesta.status === 401 && token) alExpirarSesion();
    throw new ErrorApi(datos.error ?? 'Ocurrió un error inesperado.', respuesta.status, datos.errores);
  }
  return datos;
}

export const api = {
  login: (credenciales) => peticion('POST', '/auth/login', credenciales),

  listarCandidatos: () => peticion('GET', '/candidatos'),
  crearCandidato: (datos) => peticion('POST', '/candidatos', datos),
  actualizarCandidato: (id, datos) => peticion('PUT', `/candidatos/${id}`, datos),

  listarSolicitudes: () => peticion('GET', '/solicitudes'),
  crearSolicitud: (datos) => peticion('POST', '/solicitudes', datos),
  actualizarSolicitud: (id, datos) => peticion('PUT', `/solicitudes/${id}`, datos),
  cambiarEtapa: (id, etapa, comentario) => peticion('PATCH', `/solicitudes/${id}/etapa`, { etapa, comentario }),

  listarEvaluaciones: () => peticion('GET', '/solicitudes/evaluaciones'),
  guardarEvaluacion: (solicitudId, datos) => peticion('PUT', `/solicitudes/${solicitudId}/evaluacion`, datos),

  listarEvaluadores: () => peticion('GET', '/usuarios/evaluadores'),

  enviarPostulacion: (datos) => peticion('POST', '/postulaciones', datos),
};
