/**
 * DATOS SIMULADOS DEL MVP
 * Todos los nombres, correos y teléfonos son ficticios (requisito del caso:
 * no usar datos reales de candidatos). En la etapa 2 estos datos vivirán
 * en la base de datos y llegarán desde la API REST.
 */

// Etapas reales del proceso (mismas columnas del Planner "Status Evaluaciones").
// "estado" es la equivalencia con los estados sugeridos en el anexo.
export const ETAPAS = [
  { id: 'recibida', nombre: 'Evaluación recibida', estado: 'Pendiente' },
  { id: 'agendada', nombre: 'Entrevista agendada', estado: 'En proceso' },
  { id: 'realizada', nombre: 'Entrevista realizada', estado: 'En proceso' },
  { id: 'enviado', nombre: 'Informe enviado', estado: 'Finalizada' },
];

// Familias de cargo tomadas del Excel de candidatos de AquaChile.
export const FAMILIAS_CARGO = [
  'Profesional A',
  'Profesional B C',
  'Supervisor B',
  'Jefatura',
  'Técnico A',
  'Técnico B C',
  'Operario Calificado',
];

export const UBICACIONES = [
  'Oficina Central',
  'Planta Magallanes',
  'Pargua PA',
  'AM Melinka',
  'Codihue',
  'Planta Calbuco',
  'Planta Cailín',
];

export const ORIGENES = ['Interno', 'Externo'];

// Categorías del evaluado usadas en el Excel real.
export const RESULTADOS = [
  'Recomendado',
  'Recomendado con observaciones',
  'No recomendado',
];

export const EVALUADORES = [
  { id: 'ev1', nombre: 'Camila Rojas' },
  { id: 'ev2', nombre: 'Diego Muñoz' },
  { id: 'ev3', nombre: 'Fernanda Soto' },
];

export const ANALISTAS = ['Paula Herrera', 'Rodrigo Lagos', 'Isidora Campos'];

export const candidatosIniciales = [
  { id: 'c1', nombre: 'Javiera Paredes Soto', email: 'javiera.paredes@correo.cl', telefono: '+56912345671', cargo: 'Líder Desarrollo Producción', familiaCargo: 'Profesional A', ubicacion: 'Oficina Central', origen: 'Externo', fechaRegistro: '2026-09-01', cvNombre: 'CV_Javiera_Paredes.pdf' },
  { id: 'c2', nombre: 'Matías Contreras Vidal', email: 'matias.contreras@correo.cl', telefono: '+56912345672', cargo: 'Analista de Sistemas', familiaCargo: 'Profesional B C', ubicacion: 'Planta Magallanes', origen: 'Interno', fechaRegistro: '2026-09-02', cvNombre: 'CV_Matias_Contreras.pdf' },
  { id: 'c3', nombre: 'Constanza Fuentes Leiva', email: 'constanza.fuentes@correo.cl', telefono: '+56912345673', cargo: 'Coordinadora Servicios Generales', familiaCargo: 'Profesional B C', ubicacion: 'Planta Magallanes', origen: 'Interno', fechaRegistro: '2026-09-03', cvNombre: 'CV_Constanza_Fuentes.pdf' },
  { id: 'c4', nombre: 'Benjamín Araya Núñez', email: 'benjamin.araya@correo.cl', telefono: '+56912345674', cargo: 'Operador Sala Control', familiaCargo: 'Técnico B C', ubicacion: 'Pargua PA', origen: 'Interno', fechaRegistro: '2026-09-05', cvNombre: 'CV_Benjamin_Araya.pdf' },
  { id: 'c5', nombre: 'Catalina Rivas Ortega', email: 'catalina.rivas@correo.cl', telefono: '+56912345675', cargo: 'Asistente Bodega Planta', familiaCargo: 'Técnico B C', ubicacion: 'Pargua PA', origen: 'Interno', fechaRegistro: '2026-09-08', cvNombre: 'CV_Catalina_Rivas.pdf' },
  { id: 'c6', nombre: 'Tomás Saavedra Pino', email: 'tomas.saavedra@correo.cl', telefono: '+56912345676', cargo: 'Técnico Mantención Senior', familiaCargo: 'Técnico A', ubicacion: 'AM Melinka', origen: 'Interno', fechaRegistro: '2026-09-08', cvNombre: 'CV_Tomas_Saavedra.pdf' },
  { id: 'c7', nombre: 'Valentina Méndez Cáceres', email: 'valentina.mendez@correo.cl', telefono: '+56912345677', cargo: 'Supervisora Planta', familiaCargo: 'Supervisor B', ubicacion: 'Planta Magallanes', origen: 'Interno', fechaRegistro: '2026-09-10', cvNombre: 'CV_Valentina_Mendez.pdf' },
  { id: 'c8', nombre: 'Ignacio Bravo Henríquez', email: 'ignacio.bravo@correo.cl', telefono: '+56912345678', cargo: 'Jefe Área Piscicultura', familiaCargo: 'Jefatura', ubicacion: 'Codihue', origen: 'Interno', fechaRegistro: '2026-09-15', cvNombre: 'CV_Ignacio_Bravo.pdf' },
  { id: 'c9', nombre: 'Antonia Gallardo Torres', email: 'antonia.gallardo@correo.cl', telefono: '+56912345679', cargo: 'Monitor Producción', familiaCargo: 'Técnico B C', ubicacion: 'Planta Calbuco', origen: 'Interno', fechaRegistro: '2026-09-16', cvNombre: 'CV_Antonia_Gallardo.pdf' },
  { id: 'c10', nombre: 'Felipe Oyarzún Mansilla', email: 'felipe.oyarzun@correo.cl', telefono: '+56912345680', cargo: 'Jefe de SSO', familiaCargo: 'Jefatura', ubicacion: 'Planta Cailín', origen: 'Externo', fechaRegistro: '2026-09-22', cvNombre: 'CV_Felipe_Oyarzun.pdf' },
  { id: 'c11', nombre: 'Martina Vera Alarcón', email: 'martina.vera@correo.cl', telefono: '+56912345681', cargo: 'Gruero', familiaCargo: 'Operario Calificado', ubicacion: 'Planta Calbuco', origen: 'Interno', fechaRegistro: '2026-09-23', cvNombre: 'CV_Martina_Vera.pdf' },
  { id: 'c12', nombre: 'Sebastián Navarro Riquelme', email: 'sebastian.navarro@correo.cl', telefono: '+56912345682', cargo: 'Líder Desarrollo Producción', familiaCargo: 'Profesional A', ubicacion: 'Oficina Central', origen: 'Externo', fechaRegistro: '2026-09-29', cvNombre: 'CV_Sebastian_Navarro.pdf' },
];

// Arma el historial de cambios de etapa hasta la etapa indicada.
function historial(etapaFinal, fechas) {
  const orden = ETAPAS.map((e) => e.id);
  const hasta = orden.indexOf(etapaFinal);
  return orden.slice(0, hasta + 1).map((etapa, i) => ({
    etapa,
    fecha: fechas[i],
    comentario: i === 0 ? 'Solicitud creada' : 'Cambio de etapa',
  }));
}

function solicitud(id, candidato, analista, responsableId, etapa, fechas, fechaEntrevista, observaciones = '') {
  return {
    id,
    candidatoId: candidato.id,
    cargo: candidato.cargo,
    familiaCargo: candidato.familiaCargo,
    ubicacion: candidato.ubicacion,
    analista,
    responsableId,
    etapa,
    fechaSolicitud: fechas[0],
    fechaEntrevista,
    observaciones,
    historial: historial(etapa, fechas),
  };
}

const c = Object.fromEntries(candidatosIniciales.map((x) => [x.id, x]));

export const solicitudesIniciales = [
  solicitud('s1', c.c1, 'Paula Herrera', 'ev1', 'enviado', ['2026-09-01', '2026-09-02', '2026-09-04', '2026-09-07'], '2026-09-04', 'Indagar en liderazgo de equipos.'),
  solicitud('s2', c.c2, 'Rodrigo Lagos', 'ev2', 'enviado', ['2026-09-02', '2026-09-03', '2026-09-08', '2026-09-10'], '2026-09-08'),
  solicitud('s3', c.c3, 'Rodrigo Lagos', 'ev1', 'enviado', ['2026-09-03', '2026-09-04', '2026-09-09', '2026-09-11'], '2026-09-09'),
  solicitud('s4', c.c4, 'Isidora Campos', 'ev3', 'realizada', ['2026-09-05', '2026-09-08', '2026-09-29'], '2026-09-29'),
  solicitud('s5', c.c5, 'Isidora Campos', 'ev2', 'agendada', ['2026-09-08', '2026-09-28'], '2026-10-05'),
  solicitud('s6', c.c6, 'Paula Herrera', 'ev1', 'enviado', ['2026-09-08', '2026-09-09', '2026-09-14', '2026-09-16'], '2026-09-14', 'Cargo con turnos 7x7.'),
  solicitud('s7', c.c7, 'Rodrigo Lagos', 'ev3', 'agendada', ['2026-09-10', '2026-09-30'], '2026-10-06'),
  solicitud('s8', c.c8, 'Paula Herrera', 'ev2', 'recibida', ['2026-09-15'], '', 'Énfasis en gestión de personas.'),
  solicitud('s9', c.c9, 'Isidora Campos', 'ev1', 'realizada', ['2026-09-16', '2026-09-21', '2026-10-01'], '2026-10-01'),
  solicitud('s10', c.c10, 'Paula Herrera', '', 'recibida', ['2026-09-22'], ''),
  solicitud('s11', c.c11, 'Rodrigo Lagos', 'ev3', 'enviado', ['2026-09-23', '2026-09-24', '2026-09-28', '2026-09-30'], '2026-09-28'),
  solicitud('s12', c.c12, 'Isidora Campos', '', 'recibida', ['2026-09-29'], ''),
];

export const evaluacionesIniciales = [
  { id: 'e1', solicitudId: 's1', fechaEvaluacion: '2026-09-04', resultado: 'Recomendado', observaciones: 'Muestra liderazgo participativo y buena tolerancia a la presión.', puntajeIA: 84, estado: 'Finalizada' },
  { id: 'e2', solicitudId: 's2', fechaEvaluacion: '2026-09-08', resultado: 'Recomendado con observaciones', observaciones: 'Buen perfil técnico; reforzar comunicación con usuarios.', puntajeIA: 71, estado: 'Finalizada' },
  { id: 'e3', solicitudId: 's3', fechaEvaluacion: '2026-09-09', resultado: 'Recomendado', observaciones: 'Organizada, con experiencia previa en coordinación de servicios.', puntajeIA: 80, estado: 'Finalizada' },
  { id: 'e4', solicitudId: 's4', fechaEvaluacion: '2026-09-29', resultado: 'Recomendado', observaciones: 'Informe en redacción. Buena adaptación a turnos.', puntajeIA: null, estado: 'En proceso' },
  { id: 'e6', solicitudId: 's6', fechaEvaluacion: '2026-09-14', resultado: 'No recomendado', observaciones: 'Baja disposición a trabajar en sistema de turnos en zona aislada.', puntajeIA: 48, estado: 'Finalizada' },
  { id: 'e9', solicitudId: 's9', fechaEvaluacion: '2026-10-01', resultado: 'Recomendado con observaciones', observaciones: 'Informe en redacción. Requiere inducción en normas de calidad.', puntajeIA: null, estado: 'En proceso' },
  { id: 'e11', solicitudId: 's11', fechaEvaluacion: '2026-09-28', resultado: 'Recomendado', observaciones: 'Cuenta con certificación vigente y foco en seguridad.', puntajeIA: 88, estado: 'Finalizada' },
];
