/**
 * Cálculos del dashboard. Son funciones puras (reciben datos y devuelven
 * datos), así que se pueden probar fácilmente con Vitest.
 */
import { ETAPAS, RESULTADOS } from '../data/catalogos';
import { diasEntre, hoyISO, nombreEvaluador } from './formatters';

// Une cada solicitud con su candidato y su evaluación para la tabla.
export function construirFilas(solicitudes, candidatos, evaluaciones, evaluadores = [], hoy = hoyISO()) {
  return solicitudes
    .map((s) => {
      const candidato = candidatos.find((c) => c.id === s.candidatoId);
      const evaluacion = evaluaciones.find((e) => e.solicitudId === s.id);
      const cierre = s.etapa === 'enviado' ? s.historial?.at(-1)?.fecha : hoy;
      return {
        id: s.id,
        candidatoId: s.candidatoId,
        nombre: candidato?.nombre ?? 'Candidato eliminado',
        cargo: s.cargo,
        familiaCargo: s.familiaCargo,
        ubicacion: s.ubicacion || candidato?.ubicacion || '—',
        responsableId: s.responsableId,
        responsable: nombreEvaluador(s.responsableId, evaluadores),
        sinResponsable: !s.responsableId,
        etapa: s.etapa,
        fechaSolicitud: s.fechaSolicitud,
        dias: diasEntre(s.fechaSolicitud, cierre),
        resultado: evaluacion?.estado === 'Finalizada' ? evaluacion.resultado : null,
      };
    })
    .sort((a, b) => b.fechaSolicitud.localeCompare(a.fechaSolicitud));
}

export function contarPorEtapa(solicitudes) {
  const conteo = Object.fromEntries(ETAPAS.map((e) => [e.id, 0]));
  solicitudes.forEach((s) => {
    if (s.etapa in conteo) conteo[s.etapa] += 1;
  });
  return conteo;
}

// responsable: id del evaluador, 'sin' para las no asignadas o vacío para todas
export function filtrarFilas(filas, { etapa = null, busqueda = '', familia = '', responsable = '' } = {}) {
  const texto = busqueda.trim().toLowerCase();
  return filas.filter((f) => {
    if (etapa && f.etapa !== etapa) return false;
    if (familia && f.familiaCargo !== familia) return false;
    if (responsable === 'sin' && !f.sinResponsable) return false;
    if (responsable && responsable !== 'sin' && f.responsableId !== Number(responsable)) return false;
    if (texto && !`${f.nombre} ${f.cargo} ${f.responsable}`.toLowerCase().includes(texto)) return false;
    return true;
  });
}

// Solo cuenta evaluaciones cuyo informe ya fue enviado (estado Finalizada).
export function resumenResultados(evaluaciones) {
  const finalizadas = evaluaciones.filter((e) => e.estado === 'Finalizada');
  const conteo = Object.fromEntries(RESULTADOS.map((r) => [r, 0]));
  finalizadas.forEach((e) => {
    if (e.resultado in conteo) conteo[e.resultado] += 1;
  });
  return { total: finalizadas.length, conteo };
}

export function cargaPorEvaluador(solicitudes, evaluadores = []) {
  return evaluadores.map((ev) => {
    const propias = solicitudes.filter((s) => s.responsableId === ev.id);
    return {
      id: ev.id,
      nombre: ev.nombre,
      activas: propias.filter((s) => s.etapa !== 'enviado').length,
      total: propias.length,
    };
  });
}

export function promedioDiasCierre(solicitudes) {
  const cerradas = solicitudes.filter((s) => s.etapa === 'enviado' && s.historial?.length);
  if (!cerradas.length) return null;
  const suma = cerradas.reduce((acc, s) => acc + diasEntre(s.fechaSolicitud, s.historial.at(-1).fecha), 0);
  return Math.round((suma / cerradas.length) * 10) / 10;
}

export function porcentajeRecomendados(evaluaciones) {
  const { total, conteo } = resumenResultados(evaluaciones);
  if (!total) return null;
  const positivos = conteo['Recomendado'] + conteo['Recomendado con observaciones'];
  return Math.round((positivos / total) * 100);
}
