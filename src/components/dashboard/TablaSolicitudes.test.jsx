import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TablaSolicitudes from './TablaSolicitudes';

// Router de prueba con las opciones de React Router v7 activadas
const Router = ({ children }) => (
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>
);

const fila = {
  id: 7,
  nombre: 'Ana Pérez',
  cargo: 'Operaria',
  familiaCargo: 'Técnico A',
  ubicacion: 'Pargua PA',
  responsable: 'Sin asignar',
  sinResponsable: true,
  etapa: 'recibida',
  fechaSolicitud: '2026-09-05',
  dias: 3,
  resultado: null,
};

describe('TablaSolicitudes', () => {
  it('muestra un mensaje cuando no hay resultados', () => {
    render(<TablaSolicitudes filas={[]} />, { wrapper: Router });
    expect(screen.getByText(/ninguna solicitud coincide/i)).toBeInTheDocument();
  });

  it('muestra una fila por solicitud con enlace al detalle', () => {
    render(<TablaSolicitudes filas={[fila, { ...fila, id: 8, nombre: 'Luis Soto' }]} />, { wrapper: Router });

    expect(screen.getAllByRole('row')).toHaveLength(3); // encabezado + 2 filas
    expect(screen.getByRole('link', { name: 'Ana Pérez' })).toHaveAttribute('href', '/solicitudes/7');
    expect(screen.getAllByText('Evaluación recibida')).toHaveLength(2);
  });
});
