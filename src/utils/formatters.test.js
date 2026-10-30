import { describe, expect, it } from 'vitest';
import { diasEntre, formatearFecha, iniciales, nombreEvaluador, obtenerEtapa } from './formatters';
import { filtrarCandidatos } from './candidatos';

describe('formatters', () => {
  it('muestra la fecha en formato chileno', () => {
    expect(formatearFecha('2026-10-05')).toBe('05/10/2026');
    expect(formatearFecha('')).toBe('—');
  });

  it('calcula los días entre dos fechas', () => {
    expect(diasEntre('2026-09-01', '2026-09-11')).toBe(10);
    expect(diasEntre('2026-09-11', '2026-09-01')).toBe(0);
  });

  it('devuelve la primera etapa si el id no existe', () => {
    expect(obtenerEtapa('agendada').estado).toBe('En proceso');
    expect(obtenerEtapa('otra').id).toBe('recibida');
  });

  it('busca el nombre del evaluador', () => {
    expect(nombreEvaluador(2, [{ id: 2, nombre: 'Diego' }])).toBe('Diego');
    expect(nombreEvaluador(null, [])).toBe('Sin asignar');
  });

  it('obtiene las iniciales', () => {
    expect(iniciales('Camila Rojas Pérez')).toBe('CR');
  });
});

describe('filtrarCandidatos', () => {
  const candidatos = [
    { nombre: 'Ana Pérez', email: 'ana@correo.cl', cargo: 'Operaria', familiaCargo: 'Técnico A', origen: 'Interno' },
    { nombre: 'Luis Soto', email: 'luis@correo.cl', cargo: 'Jefe', familiaCargo: 'Jefatura', origen: 'Externo' },
  ];

  it('busca por nombre, correo o cargo', () => {
    expect(filtrarCandidatos(candidatos, { busqueda: 'luis@' })).toHaveLength(1);
    expect(filtrarCandidatos(candidatos, { busqueda: 'operaria' })[0].nombre).toBe('Ana Pérez');
  });

  it('combina filtros de familia y origen', () => {
    expect(filtrarCandidatos(candidatos, { familia: 'Jefatura', origen: 'Interno' })).toHaveLength(0);
    expect(filtrarCandidatos(candidatos, { origen: 'Externo' })).toHaveLength(1);
  });
});
