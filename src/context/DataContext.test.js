import { describe, expect, it } from 'vitest';
import { dataReducer, estadoInicial } from './DataContext';

describe('dataReducer', () => {
  it('guarda los datos cargados desde la API', () => {
    const estado = dataReducer(estadoInicial, {
      type: 'CARGA_EXITOSA',
      payload: { candidatos: [{ id: 1 }], solicitudes: [], evaluaciones: [], evaluadores: [] },
    });
    expect(estado.cargando).toBe(false);
    expect(estado.candidatos).toHaveLength(1);
  });

  it('guarda el mensaje si la carga falla', () => {
    const estado = dataReducer(estadoInicial, { type: 'CARGA_FALLIDA', payload: 'Sin conexión' });
    expect(estado.error).toBe('Sin conexión');
    expect(estado.cargando).toBe(false);
  });

  it('agrega un candidato nuevo al inicio de la lista', () => {
    const previo = { ...estadoInicial, candidatos: [{ id: 1, nombre: 'Ana' }] };
    const estado = dataReducer(previo, { type: 'GUARDAR_CANDIDATO', payload: { id: 2, nombre: 'Luis' } });
    expect(estado.candidatos.map((c) => c.id)).toEqual([2, 1]);
  });

  it('reemplaza un candidato existente sin duplicarlo', () => {
    const previo = { ...estadoInicial, candidatos: [{ id: 1, nombre: 'Ana' }] };
    const estado = dataReducer(previo, { type: 'GUARDAR_CANDIDATO', payload: { id: 1, nombre: 'Ana María' } });
    expect(estado.candidatos).toEqual([{ id: 1, nombre: 'Ana María' }]);
  });

  it('actualiza la etapa de una solicitud', () => {
    const previo = { ...estadoInicial, solicitudes: [{ id: 5, etapa: 'recibida' }] };
    const estado = dataReducer(previo, { type: 'GUARDAR_SOLICITUD', payload: { id: 5, etapa: 'agendada' } });
    expect(estado.solicitudes[0].etapa).toBe('agendada');
  });

  it('no modifica el estado anterior (inmutabilidad)', () => {
    const previo = { ...estadoInicial, evaluaciones: [] };
    dataReducer(previo, { type: 'GUARDAR_EVALUACION', payload: { id: 1 } });
    expect(previo.evaluaciones).toEqual([]);
  });

  it('limpia los datos al cerrar sesión', () => {
    const previo = { ...estadoInicial, candidatos: [{ id: 1 }], cargando: false };
    expect(dataReducer(previo, { type: 'LIMPIAR' })).toEqual(estadoInicial);
  });
});
