import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  candidatosIniciales,
  solicitudesIniciales,
  evaluacionesIniciales,
} from '../data/mockData';
import { generarId, hoyISO } from '../utils/formatters';

/**
 * ESTADO GLOBAL DEL MVP (etapa 1: datos simulados)
 * Todos los módulos leen y escriben datos SOLO a través de este contexto.
 * Por ahora se guarda en localStorage para que los cambios no se pierdan al
 * recargar. En la etapa 2 se reemplaza el interior de cada acción por un
 * fetch() a la API REST, sin tocar los componentes.
 */

const STORAGE_KEY = 'aquachile-mvp-v1';

export const estadoBase = {
  candidatos: candidatosIniciales,
  solicitudes: solicitudesIniciales,
  evaluaciones: evaluacionesIniciales,
};

function cargarEstado() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : estadoBase;
  } catch {
    return estadoBase;
  }
}

// Reducer puro: exportado para poder probarlo con pruebas unitarias.
export function dataReducer(state, action) {
  switch (action.type) {
    case 'AGREGAR_CANDIDATO':
      return { ...state, candidatos: [action.payload, ...state.candidatos] };

    case 'ACTUALIZAR_CANDIDATO':
      return {
        ...state,
        candidatos: state.candidatos.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload.cambios } : c
        ),
      };

    case 'CREAR_SOLICITUD':
      return { ...state, solicitudes: [action.payload, ...state.solicitudes] };

    case 'ACTUALIZAR_SOLICITUD':
      return {
        ...state,
        solicitudes: state.solicitudes.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload.cambios } : s
        ),
      };

    case 'CAMBIAR_ETAPA': {
      const { id, etapa, fecha, comentario } = action.payload;
      return {
        ...state,
        solicitudes: state.solicitudes.map((s) =>
          s.id === id
            ? { ...s, etapa, historial: [...(s.historial ?? []), { etapa, fecha, comentario }] }
            : s
        ),
      };
    }

    case 'GUARDAR_EVALUACION': {
      const ev = action.payload;
      const existe = state.evaluaciones.some((e) => e.solicitudId === ev.solicitudId);
      return {
        ...state,
        evaluaciones: existe
          ? state.evaluaciones.map((e) => (e.solicitudId === ev.solicitudId ? { ...e, ...ev } : e))
          : [ev, ...state.evaluaciones],
      };
    }

    case 'RESTABLECER':
      return estadoBase;

    default:
      return state;
  }
}

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, undefined, cargarEstado);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* si el navegador bloquea el almacenamiento, la app sigue en memoria */
    }
  }, [state]);

  const valor = useMemo(() => {
    const obtenerCandidato = (id) => state.candidatos.find((c) => c.id === id);
    const obtenerSolicitud = (id) => state.solicitudes.find((s) => s.id === id);
    const obtenerEvaluacionPorSolicitud = (solicitudId) =>
      state.evaluaciones.find((e) => e.solicitudId === solicitudId);
    const solicitudesDeCandidato = (candidatoId) =>
      state.solicitudes.filter((s) => s.candidatoId === candidatoId);

    return {
      ...state,
      obtenerCandidato,
      obtenerSolicitud,
      obtenerEvaluacionPorSolicitud,
      solicitudesDeCandidato,

      agregarCandidato(datos) {
        const nuevo = { origen: 'Interno', ubicacion: '', cvNombre: '', ...datos, id: generarId('c'), fechaRegistro: hoyISO() };
        dispatch({ type: 'AGREGAR_CANDIDATO', payload: nuevo });
        return nuevo;
      },

      actualizarCandidato(id, cambios) {
        dispatch({ type: 'ACTUALIZAR_CANDIDATO', payload: { id, cambios } });
      },

      crearSolicitud(datos) {
        const hoy = hoyISO();
        const nueva = {
          responsableId: '',
          ubicacion: '',
          fechaEntrevista: '',
          observaciones: '',
          ...datos,
          id: generarId('s'),
          etapa: 'recibida',
          fechaSolicitud: hoy,
          historial: [{ etapa: 'recibida', fecha: hoy, comentario: 'Solicitud creada' }],
        };
        dispatch({ type: 'CREAR_SOLICITUD', payload: nueva });
        return nueva;
      },

      actualizarSolicitud(id, cambios) {
        dispatch({ type: 'ACTUALIZAR_SOLICITUD', payload: { id, cambios } });
      },

      cambiarEtapa(id, etapa, comentario = 'Cambio de etapa') {
        dispatch({ type: 'CAMBIAR_ETAPA', payload: { id, etapa, fecha: hoyISO(), comentario } });
      },

      registrarEvaluacion(datos) {
        const existente = obtenerEvaluacionPorSolicitud(datos.solicitudId);
        const evaluacion = { estado: 'En proceso', puntajeIA: null, ...existente, ...datos, id: existente?.id ?? generarId('e') };
        dispatch({ type: 'GUARDAR_EVALUACION', payload: evaluacion });
        return evaluacion;
      },

      restablecerDatos() {
        dispatch({ type: 'RESTABLECER' });
      },
    };
  }, [state]);

  return <DataContext.Provider value={valor}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de <DataProvider>');
  return ctx;
}
