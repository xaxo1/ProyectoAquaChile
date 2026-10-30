import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from './Login';

const RUTAS_V7 = { v7_startTransition: true, v7_relativeSplatPath: true };

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']} future={RUTAS_V7}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<p>Panel principal</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

// Simula la respuesta del backend
function respuestaApi(status, cuerpo) {
  return vi.fn().mockResolvedValue({ ok: status < 400, status, json: async () => cuerpo });
}

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('Login', () => {
  it('muestra errores si se envía vacío y no llama a la API', async () => {
    const fetch = respuestaApi(200, {});
    vi.stubGlobal('fetch', fetch);
    renderLogin();

    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(screen.getByText('Ingresa tu correo.')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu contraseña.')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('muestra el mensaje del servidor cuando las credenciales son incorrectas', async () => {
    vi.stubGlobal('fetch', respuestaApi(401, { error: 'Correo o contraseña incorrectos.' }));
    renderLogin();

    await userEvent.type(screen.getByLabelText('Correo'), 'paula.herrera@demo.cl');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'mala');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.');
  });

  it('entra al panel y guarda la sesión cuando el login es correcto', async () => {
    const usuario = { id: 1, nombre: 'Paula Herrera', email: 'paula.herrera@demo.cl', rol: 'analista' };
    vi.stubGlobal('fetch', respuestaApi(200, { token: 'abc', usuario }));
    renderLogin();

    await userEvent.type(screen.getByLabelText('Correo'), 'paula.herrera@demo.cl');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Aqua2026');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByText('Panel principal')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('aquachile-sesion')).token).toBe('abc');
  });
});
