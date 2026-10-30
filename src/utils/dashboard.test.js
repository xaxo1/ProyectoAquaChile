import { describe, expect, it } from 'vitest';
import {
  cargaPorEvaluador,
  construirFilas,
  contarPorEtapa,
  filtrarFilas,
  porcentajeRecomendados,
  promedioDiasCierre,
  resumenResultados,
} from './dashboard';

const evaluadores = [
  { id: 1, nombre: 'Camila Rojas' },
  { id: 2, nombre: 'Diego Muñoz' },
];

const candidatos = [
  { id: 10, nombre: 'Ana Pérez', ubicacion: 'Pargua PA' },
  { id: 11, nombre: 'Luis Soto', ubicacion: '' },
];

const solicitudes = [
  {
    id: 100, candidatoId: 10, cargo: 'Operario', familiaCargo: 'Técnico A', ubicacion: '', responsableId: 1,
    etapa: 'enviado', fechaSolicitud: '2026-09-01',
    historial: [{ etapa: 'recibida', fecha: '2026-09-01' }, { etapa: 'enviado', fecha: '2026-09-11' }],
  },
  {
    id: 101, candidatoId: 11, cargo: 'Jefe de turno', familiaCargo: 'Jefatura', ubicacion: 'Codihue', responsableId: null,
    etapa: 'recibida', fechaSolicitud: '2026-09-05', historial: [{ etapa: 'recibida', fecha: '2026-09-05' }],
  },
];

const evaluaciones = [
  { id: 1, solicitudId: 100, resultado: 'Recomendado', estado: 'Finalizada' },
  { id: 2, solicitudId: 999, resultado: 'No recomendado', estado: 'Finalizada' },
  { id: 3, solicitudId: 998, resultado: 'Recomendado', estado: 'En proceso' },
];

describe('construirFilas', () => {
  const filas = construirFilas(solicitudes, candidatos, evaluaciones, evaluadores, '2026-09-15');

  it('ordena de la solicitud más reciente a la más antigua', () => {
    expect(filas.map((f) => f.id)).toEqual([101, 100]);
  });

  it('une la solicitud con el nombre del candidato y del evaluador', () => {
    const fila = filas.find((f) => f.id === 100);
    expect(fila.nombre).toBe('Ana Pérez');
    expect(fila.responsable).toBe('Camila Rojas');
    expect(fila.ubicacion).toBe('Pargua PA');
  });

  it('marca las solicitudes sin responsable', () => {
    expect(filas.find((f) => f.id === 101).sinResponsable).toBe(true);
  });

  it('cuenta los días hasta el cierre o hasta hoy', () => {
    expect(filas.find((f) => f.id === 100).dias).toBe(10);
    expect(filas.find((f) => f.id === 101).dias).toBe(10);
  });

  it('solo muestra el resultado si la evaluación está finalizada', () => {
    expect(filas.find((f) => f.id === 100).resultado).toBe('Recomendado');
    expect(filas.find((f) => f.id === 101).resultado).toBeNull();
  });
});

describe('filtrarFilas', () => {
  const filas = construirFilas(solicitudes, candidatos, evaluaciones, evaluadores, '2026-09-15');

  it('filtra por etapa', () => {
    expect(filtrarFilas(filas, { etapa: 'recibida' })).toHaveLength(1);
  });

  it('busca sin importar mayúsculas', () => {
    expect(filtrarFilas(filas, { busqueda: 'ANA' })[0].id).toBe(100);
  });

  it('filtra por responsable y por solicitudes sin asignar', () => {
    expect(filtrarFilas(filas, { responsable: '1' }).map((f) => f.id)).toEqual([100]);
    expect(filtrarFilas(filas, { responsable: 'sin' }).map((f) => f.id)).toEqual([101]);
  });

  it('sin filtros devuelve todas las filas', () => {
    expect(filtrarFilas(filas)).toHaveLength(2);
  });
});

describe('indicadores del panel', () => {
  it('cuenta las solicitudes de cada etapa', () => {
    expect(contarPorEtapa(solicitudes)).toEqual({ recibida: 1, agendada: 0, realizada: 0, enviado: 1 });
  });

  it('resume solo las evaluaciones finalizadas', () => {
    const { total, conteo } = resumenResultados(evaluaciones);
    expect(total).toBe(2);
    expect(conteo.Recomendado).toBe(1);
    expect(conteo['No recomendado']).toBe(1);
  });

  it('calcula el porcentaje de recomendados', () => {
    expect(porcentajeRecomendados(evaluaciones)).toBe(50);
    expect(porcentajeRecomendados([])).toBeNull();
  });

  it('calcula el promedio de días hasta el informe', () => {
    expect(promedioDiasCierre(solicitudes)).toBe(10);
  });

  it('cuenta la carga activa de cada evaluador', () => {
    expect(cargaPorEvaluador(solicitudes, evaluadores)).toEqual([
      { id: 1, nombre: 'Camila Rojas', activas: 0, total: 1 },
      { id: 2, nombre: 'Diego Muñoz', activas: 0, total: 0 },
    ]);
  });
});
