import { ETAPAS, EVALUADORES } from '../data/mockData';

export function generarId(prefijo) {
  return `${prefijo}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// Fecha de hoy en formato YYYY-MM-DD usando la hora local (no UTC).
export function hoyISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function formatearFecha(iso) {
  if (!iso) return '—';
  const [anio, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${anio}`;
}

export function diasEntre(desdeISO, hastaISO) {
  if (!desdeISO || !hastaISO) return 0;
  const ms = new Date(hastaISO) - new Date(desdeISO);
  return Math.max(0, Math.round(ms / 86400000));
}

export function obtenerEtapa(etapaId) {
  return ETAPAS.find((e) => e.id === etapaId) ?? ETAPAS[0];
}

export function estadoDeEtapa(etapaId) {
  return obtenerEtapa(etapaId).estado;
}

export function nombreEvaluador(evaluadorId) {
  return EVALUADORES.find((e) => e.id === evaluadorId)?.nombre ?? 'Sin asignar';
}

export function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}
