/**
 * Datos de prueba que se cargan con `npm run db:init`.
 * Todos los nombres, correos y teléfonos son ficticios (requisito del caso).
 */

// Contraseña de todos los usuarios de prueba (se guarda encriptada con bcrypt).
export const PASSWORD_PRUEBA = 'Aqua2026';

export const usuarios = [
  { clave: 'paula', nombre: 'Paula Herrera', email: 'paula.herrera@demo.cl', rol: 'analista' },
  { clave: 'rodrigo', nombre: 'Rodrigo Lagos', email: 'rodrigo.lagos@demo.cl', rol: 'analista' },
  { clave: 'camila', nombre: 'Camila Rojas', email: 'camila.rojas@demo.cl', rol: 'evaluador' },
  { clave: 'diego', nombre: 'Diego Muñoz', email: 'diego.munoz@demo.cl', rol: 'evaluador' },
  { clave: 'fernanda', nombre: 'Fernanda Soto', email: 'fernanda.soto@demo.cl', rol: 'evaluador' },
];

export const candidatos = [
  { clave: 'c1', nombre: 'Javiera Paredes Soto', email: 'javiera.paredes@correo.cl', telefono: '+56912345671', cargo: 'Líder Desarrollo Producción', familiaCargo: 'Profesional A', ubicacion: 'Oficina Central', origen: 'Externo', fechaRegistro: '2026-09-01' },
  { clave: 'c2', nombre: 'Matías Contreras Vidal', email: 'matias.contreras@correo.cl', telefono: '+56912345672', cargo: 'Analista de Sistemas', familiaCargo: 'Profesional B C', ubicacion: 'Planta Magallanes', origen: 'Interno', fechaRegistro: '2026-09-02' },
  { clave: 'c3', nombre: 'Constanza Fuentes Leiva', email: 'constanza.fuentes@correo.cl', telefono: '+56912345673', cargo: 'Coordinadora Servicios Generales', familiaCargo: 'Profesional B C', ubicacion: 'Planta Magallanes', origen: 'Interno', fechaRegistro: '2026-09-03' },
  { clave: 'c4', nombre: 'Benjamín Araya Núñez', email: 'benjamin.araya@correo.cl', telefono: '+56912345674', cargo: 'Operador Sala Control', familiaCargo: 'Técnico B C', ubicacion: 'Pargua PA', origen: 'Interno', fechaRegistro: '2026-09-05' },
  { clave: 'c5', nombre: 'Catalina Rivas Ortega', email: 'catalina.rivas@correo.cl', telefono: '+56912345675', cargo: 'Asistente Bodega Planta', familiaCargo: 'Técnico B C', ubicacion: 'Pargua PA', origen: 'Interno', fechaRegistro: '2026-09-08' },
  { clave: 'c6', nombre: 'Tomás Saavedra Pino', email: 'tomas.saavedra@correo.cl', telefono: '+56912345676', cargo: 'Técnico Mantención Senior', familiaCargo: 'Técnico A', ubicacion: 'AM Melinka', origen: 'Interno', fechaRegistro: '2026-09-08' },
  { clave: 'c7', nombre: 'Valentina Méndez Cáceres', email: 'valentina.mendez@correo.cl', telefono: '+56912345677', cargo: 'Supervisora Planta', familiaCargo: 'Supervisor B', ubicacion: 'Planta Magallanes', origen: 'Interno', fechaRegistro: '2026-09-10' },
  { clave: 'c8', nombre: 'Ignacio Bravo Henríquez', email: 'ignacio.bravo@correo.cl', telefono: '+56912345678', cargo: 'Jefe Área Piscicultura', familiaCargo: 'Jefatura', ubicacion: 'Codihue', origen: 'Interno', fechaRegistro: '2026-09-15' },
  { clave: 'c9', nombre: 'Antonia Gallardo Torres', email: 'antonia.gallardo@correo.cl', telefono: '+56912345679', cargo: 'Monitor Producción', familiaCargo: 'Técnico B C', ubicacion: 'Planta Calbuco', origen: 'Interno', fechaRegistro: '2026-09-16' },
  { clave: 'c10', nombre: 'Felipe Oyarzún Mansilla', email: 'felipe.oyarzun@correo.cl', telefono: '+56912345680', cargo: 'Jefe de SSO', familiaCargo: 'Jefatura', ubicacion: 'Planta Cailín', origen: 'Externo', fechaRegistro: '2026-09-22' },
  { clave: 'c11', nombre: 'Martina Vera Alarcón', email: 'martina.vera@correo.cl', telefono: '+56912345681', cargo: 'Gruero', familiaCargo: 'Operario Calificado', ubicacion: 'Planta Calbuco', origen: 'Interno', fechaRegistro: '2026-09-23' },
  { clave: 'c12', nombre: 'Sebastián Navarro Riquelme', email: 'sebastian.navarro@correo.cl', telefono: '+56912345682', cargo: 'Líder Desarrollo Producción', familiaCargo: 'Profesional A', ubicacion: 'Oficina Central', origen: 'Externo', fechaRegistro: '2026-09-29' },
];

// fechas = fecha en que la solicitud llegó a cada etapa (la primera es la fecha de solicitud)
export const solicitudes = [
  { candidato: 'c1', analista: 'Paula Herrera', responsable: 'camila', etapa: 'enviado', fechas: ['2026-09-01', '2026-09-02', '2026-09-04', '2026-09-07'], fechaEntrevista: '2026-09-04', observaciones: 'Indagar en liderazgo de equipos.' },
  { candidato: 'c2', analista: 'Rodrigo Lagos', responsable: 'diego', etapa: 'enviado', fechas: ['2026-09-02', '2026-09-03', '2026-09-08', '2026-09-10'], fechaEntrevista: '2026-09-08' },
  { candidato: 'c3', analista: 'Rodrigo Lagos', responsable: 'camila', etapa: 'enviado', fechas: ['2026-09-03', '2026-09-04', '2026-09-09', '2026-09-11'], fechaEntrevista: '2026-09-09' },
  { candidato: 'c4', analista: 'Paula Herrera', responsable: 'fernanda', etapa: 'realizada', fechas: ['2026-09-05', '2026-09-08', '2026-09-29'], fechaEntrevista: '2026-09-29' },
  { candidato: 'c5', analista: 'Paula Herrera', responsable: 'diego', etapa: 'agendada', fechas: ['2026-09-08', '2026-09-28'], fechaEntrevista: '2026-11-04' },
  { candidato: 'c6', analista: 'Paula Herrera', responsable: 'camila', etapa: 'enviado', fechas: ['2026-09-08', '2026-09-09', '2026-09-14', '2026-09-16'], fechaEntrevista: '2026-09-14', observaciones: 'Cargo con turnos 7x7.' },
  { candidato: 'c7', analista: 'Rodrigo Lagos', responsable: 'fernanda', etapa: 'agendada', fechas: ['2026-09-10', '2026-09-30'], fechaEntrevista: '2026-11-05' },
  { candidato: 'c8', analista: 'Paula Herrera', responsable: 'diego', etapa: 'recibida', fechas: ['2026-09-15'], observaciones: 'Énfasis en gestión de personas.' },
  { candidato: 'c9', analista: 'Rodrigo Lagos', responsable: 'camila', etapa: 'realizada', fechas: ['2026-09-16', '2026-09-21', '2026-10-01'], fechaEntrevista: '2026-10-01' },
  { candidato: 'c10', analista: 'Paula Herrera', responsable: null, etapa: 'recibida', fechas: ['2026-09-22'] },
  { candidato: 'c11', analista: 'Rodrigo Lagos', responsable: 'fernanda', etapa: 'enviado', fechas: ['2026-09-23', '2026-09-24', '2026-09-28', '2026-09-30'], fechaEntrevista: '2026-09-28' },
  { candidato: 'c12', analista: 'Rodrigo Lagos', responsable: null, etapa: 'recibida', fechas: ['2026-09-29'] },
];

export const evaluaciones = [
  { candidato: 'c1', fechaEvaluacion: '2026-09-04', resultado: 'Recomendado', observaciones: 'Muestra liderazgo participativo y buena tolerancia a la presión.' },
  { candidato: 'c2', fechaEvaluacion: '2026-09-08', resultado: 'Recomendado con observaciones', observaciones: 'Buen perfil técnico; reforzar comunicación con usuarios.' },
  { candidato: 'c3', fechaEvaluacion: '2026-09-09', resultado: 'Recomendado', observaciones: 'Organizada, con experiencia previa en coordinación de servicios.' },
  { candidato: 'c4', fechaEvaluacion: '2026-09-29', resultado: 'Recomendado', observaciones: 'Informe en redacción. Buena adaptación a turnos.' },
  { candidato: 'c6', fechaEvaluacion: '2026-09-14', resultado: 'No recomendado', observaciones: 'Baja disposición a trabajar en sistema de turnos en zona aislada.' },
  { candidato: 'c9', fechaEvaluacion: '2026-10-01', resultado: 'Recomendado con observaciones', observaciones: 'Informe en redacción. Requiere inducción en normas de calidad.' },
  { candidato: 'c11', fechaEvaluacion: '2026-09-28', resultado: 'Recomendado', observaciones: 'Cuenta con certificación vigente y foco en seguridad.' },
];
