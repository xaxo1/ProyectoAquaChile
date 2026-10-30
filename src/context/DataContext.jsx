import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

/**
 * ESTADO GLOBAL DE LOS DATOS
 * Al iniciar sesión se cargan candidatos, solicitudes, evaluaciones y evaluadores
 * desde la API. Cada acción llama al backend y, si responde bien, actualiza el
 * estado con lo que devolvió la base de datos.
 */

export const estadoInicial = {
  candidatos: [],
  solicitudes: [],
  evaluaciones: [],
  evaluadores: [],
  cargando: true,
  error: '',
};

// Reemplaza un elemento de la lista por id, o lo agrega al inicio si no existe
function guardarEnLista(lista, elemento) {
  return lista.some((x) => x.id === elemento.id)
    ? lista.map((x) => (x.id === elemento.id ? elemento : x))
    : [elemento, ...lista];
}

// Reducer puro: exportado para poder probarlo con Vitest.
export function dataReducer(state, action) {
  switch (action.type) {
    case 'CARGA_INICIADA':
      return { ...state, cargando: true, error: '' };

    case 'CARGA_EXITOSA':
      return { ...state, ...action.payload, cargando: false, error: '' };

    case 'CARGA_FALLIDA':
      return { ...state, cargando: false, error: action.payload };

    case 'GUARDAR_CANDIDATO':
      return { ...state, candidatos: guardarEnLista(state.candidatos, action.payload) };

    case 'GUARDAR_SOLICITUD':
      return { ...state, solicitudes: guardarEnLista(state.solicitudes, action.payload) };

    case 'GUARDAR_EVALUACION':
      return { ...state, evaluaciones: guardarEnLista(state.evaluaciones, action.payload) };

    case 'LIMPIAR':
      return estadoInicial;

    default:
      return state;
  }
}

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { autenticado } = useAuth();
  const [state, dispatch] = useReducer(dataReducer, estadoInicial);

  const cargarDatos = useCallback(async () => {
    dispatch({ type: 'CARGA_INICIADA' });
    try {
      const [candidatos, solicitudes, evaluaciones, evaluadores] = await Promise.all([
        api.listarCandidatos(),
        api.listarSolicitudes(),
        api.listarEvaluaciones(),
        api.listarEvaluadores(),
      ]);
      dispatch({ type: 'CARGA_EXITOSA', payload: { candidatos, solicitudes, evaluaciones, evaluadores } });
    } catch (err) {
      dispatch({ type: 'CARGA_FALLIDA', payload: err.message });
    }
  }, []);

  useEffect(() => {
    if (autenticado) cargarDatos();
    else dispatch({ type: 'LIMPIAR' });
  }, [autenticado, cargarDatos]);

  const valor = useMemo(() => {
    const obtenerCandidato = (id) => state.candidatos.find((c) => c.id === Number(id));
    const obtenerSolicitud = (id) => state.solicitudes.find((s) => s.id === Number(id));
    const obtenerEvaluacionPorSolicitud = (solicitudId) =>
      state.evaluaciones.find((e) => e.solicitudId === Number(solicitudId));
    const solicitudesDeCandidato = (candidatoId) =>
      state.solicitudes.filter((s) => s.candidatoId === Number(candidatoId));

    return {
      ...state,
      cargarDatos,
      obtenerCandidato,
      obtenerSolicitud,
      obtenerEvaluacionPorSolicitud,
      solicitudesDeCandidato,

      async agregarCandidato(datos) {
        const candidato = await api.crearCandidato(datos);
        dispatch({ type: 'GUARDAR_CANDIDATO', payload: candidato });
        return candidato;
      },

      async actualizarCandidato(id, datos) {
        const candidato = await api.actualizarCandidato(id, datos);
        dispatch({ type: 'GUARDAR_CANDIDATO', payload: candidato });
        return candidato;
      },

      async crearSolicitud(datos) {
        const solicitud = await api.crearSolicitud(datos);
        dispatch({ type: 'GUARDAR_SOLICITUD', payload: solicitud });
        return solicitud;
      },

      async actualizarSolicitud(id, cambios) {
        const solicitud = await api.actualizarSolicitud(id, cambios);
        dispatch({ type: 'GUARDAR_SOLICITUD', payload: solicitud });
        return solicitud;
      },

      async cambiarEtapa(id, etapa, comentario) {
        const { solicitud, evaluacion } = await api.cambiarEtapa(id, etapa, comentario);
        dispatch({ type: 'GUARDAR_SOLICITUD', payload: solicitud });
        if (evaluacion) dispatch({ type: 'GUARDAR_EVALUACION', payload: evaluacion });
        return solicitud;
      },

      async registrarEvaluacion(solicitudId, datos) {
        const evaluacion = await api.guardarEvaluacion(solicitudId, datos);
        dispatch({ type: 'GUARDAR_EVALUACION', payload: evaluacion });
        return evaluacion;
      },
    };
  }, [state, cargarDatos]);

  return <DataContext.Provider value={valor}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de <DataProvider>');
  return ctx;
}
