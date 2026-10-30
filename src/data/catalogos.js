/**
 * Catálogos fijos del proceso. Los usa el frontend para los formularios
 * y el backend para validar lo que llega a la API.
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

export const ROLES = {
  analista: 'Analista de reclutamiento',
  evaluador: 'Profesional evaluador',
};
