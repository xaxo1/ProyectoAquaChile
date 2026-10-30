import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CambioEtapa from './CambioEtapa';

describe('CambioEtapa', () => {
  it('bloquea el avance y explica el motivo si falta el evaluador', () => {
    const solicitud = { etapa: 'recibida', responsableId: null, fechaEntrevista: null };
    render(<CambioEtapa solicitud={solicitud} evaluacion={null} onCambiar={vi.fn()} />);

    expect(screen.getByRole('button', { name: /pasar a entrevista agendada/i })).toBeDisabled();
    expect(screen.getByText(/asigna un evaluador/i)).toBeInTheDocument();
  });

  it('avanza a la etapa siguiente con el comentario escrito', async () => {
    const onCambiar = vi.fn().mockResolvedValue();
    const solicitud = { etapa: 'recibida', responsableId: 3, fechaEntrevista: '2026-11-03' };
    render(<CambioEtapa solicitud={solicitud} evaluacion={null} onCambiar={onCambiar} />);

    await userEvent.type(screen.getByLabelText(/comentario/i), 'Confirmada por correo');
    await userEvent.click(screen.getByRole('button', { name: /pasar a entrevista agendada/i }));

    expect(onCambiar).toHaveBeenCalledWith('agendada', 'Confirmada por correo');
  });

  it('muestra el error que devuelve el servidor', async () => {
    const onCambiar = vi.fn().mockRejectedValue(new Error('No tienes permiso para realizar esta acción.'));
    const solicitud = { etapa: 'agendada', responsableId: 3, fechaEntrevista: '2026-11-03' };
    render(<CambioEtapa solicitud={solicitud} evaluacion={null} onCambiar={onCambiar} />);

    await userEvent.click(screen.getByRole('button', { name: /volver a evaluación recibida/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No tienes permiso');
  });

  it('indica cuando el proceso ya terminó', () => {
    render(<CambioEtapa solicitud={{ etapa: 'enviado' }} evaluacion={{ id: 1 }} onCambiar={vi.fn()} />);
    expect(screen.getByText(/proceso de esta solicitud está finalizado/i)).toBeInTheDocument();
  });
});
