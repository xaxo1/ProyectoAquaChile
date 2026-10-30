import { createContext, useContext, useEffect, useState } from 'react';
import { api, guardarSesion, obtenerSesion, onSesionExpirada } from '../services/api';

/**
 * Sesión del usuario. El backend entrega un token (JWT) al iniciar sesión
 * y se guarda en localStorage para no perder la sesión al recargar.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(obtenerSesion);
  const [aviso, setAviso] = useState('');

  const cerrarSesion = (mensaje = '') => {
    guardarSesion(null);
    setSesion(null);
    setAviso(mensaje);
  };

  useEffect(() => {
    onSesionExpirada(() => cerrarSesion('Tu sesión expiró. Vuelve a ingresar.'));
  }, []);

  const iniciarSesion = async (email, password) => {
    const datos = await api.login({ email, password });
    guardarSesion(datos);
    setSesion(datos);
    setAviso('');
    return datos.usuario;
  };

  const valor = {
    usuario: sesion?.usuario ?? null,
    autenticado: Boolean(sesion?.token),
    esEvaluador: sesion?.usuario?.rol === 'evaluador',
    aviso,
    iniciarSesion,
    cerrarSesion,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
