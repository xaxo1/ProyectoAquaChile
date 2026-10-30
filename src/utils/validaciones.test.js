import { describe, expect, it } from 'vitest';
import {
  tieneErrores,
  validarCambioEtapa,
  validarCandidato,
  validarEvaluacion,
  validarLogin,
  validarSolicitud,
} from './validaciones';

const candidatoValido = {
  nombre: 'Javiera Paredes',
  email: 'javiera@correo.cl',
  telefono: '+56912345678',
  cargo: 'Analista',
  familiaCargo: 'Profesional A',
};

describe('validarLogin', () => {
  it('pide correo y contraseña', () => {
    const errores = validarLogin({ email: '', password: '' });
    expect(errores.email).toBeDefined();
    expect(errores.password).toBeDefined();
  });

  it('rechaza un correo sin formato válido', () => {
    expect(validarLogin({ email: 'paula@', password: '123' }).email).toMatch(/formato/);
  });

  it('acepta credenciales completas', () => {
    expect(validarLogin({ email: 'paula@demo.cl', password: 'x' })).toEqual({});
  });
});

describe('validarCandidato', () => {
  it('no devuelve errores con datos correctos', () => {
    expect(tieneErrores(validarCandidato(candidatoValido))).toBe(false);
  });

  it('marca todos los campos obligatorios vacíos', () => {
    const errores = validarCandidato({});
    expect(Object.keys(errores)).toEqual(['nombre', 'email', 'telefono', 'cargo', 'familiaCargo']);
  });

  it('rechaza nombres con números', () => {
    expect(validarCandidato({ ...candidatoValido, nombre: 'Juan 123' }).nombre).toBeDefined();
  });

  it('acepta nombres con tildes y ñ', () => {
    expect(validarCandidato({ ...candidatoValido, nombre: 'Rocío Ñancupil' }).nombre).toBeUndefined();
  });

  it.each(['912345678', '+56912345678', '56912345678', '+569 1234 5678'])('acepta el teléfono %s', (telefono) => {
    expect(validarCandidato({ ...candidatoValido, telefono }).telefono).toBeUndefined();
  });

  it.each(['812345678', '12345', '+5691234567'])('rechaza el teléfono %s', (telefono) => {
    expect(validarCandidato({ ...candidatoValido, telefono }).telefono).toBeDefined();
  });

  it('rechaza una familia de cargo que no existe', () => {
    expect(validarCandidato({ ...candidatoValido, familiaCargo: 'Gerente' }).familiaCargo).toBeDefined();
  });
});

describe('validarSolicitud', () => {
  it('exige candidato, cargo, familia y analista', () => {
    const errores = validarSolicitud({});
    expect(errores).toHaveProperty('candidatoId');
    expect(errores).toHaveProperty('cargo');
    expect(errores).toHaveProperty('familiaCargo');
    expect(errores).toHaveProperty('analista');
  });
});

describe('validarEvaluacion', () => {
  it('exige al menos 20 caracteres de observaciones', () => {
    const errores = validarEvaluacion({ fechaEvaluacion: '2026-10-01', resultado: 'Recomendado', observaciones: 'Muy corto' });
    expect(errores.observaciones).toBeDefined();
  });

  it('solo acepta los resultados definidos', () => {
    const errores = validarEvaluacion({ fechaEvaluacion: '2026-10-01', resultado: 'Excelente', observaciones: 'x'.repeat(25) });
    expect(errores.resultado).toBeDefined();
  });
});

describe('validarCambioEtapa', () => {
  const base = { etapa: 'recibida', responsableId: 3, fechaEntrevista: '2026-11-03' };

  it('permite avanzar a la etapa siguiente', () => {
    expect(validarCambioEtapa(base, 'agendada', null)).toBeNull();
  });

  it('no permite saltarse etapas', () => {
    expect(validarCambioEtapa(base, 'realizada', null)).toMatch(/una etapa a la vez/);
  });

  it('pide evaluador antes de agendar', () => {
    expect(validarCambioEtapa({ ...base, responsableId: null }, 'agendada', null)).toMatch(/evaluador/);
  });

  it('pide fecha de entrevista antes de agendar', () => {
    expect(validarCambioEtapa({ ...base, fechaEntrevista: null }, 'agendada', null)).toMatch(/fecha/);
  });

  it('no permite enviar el informe sin evaluación registrada', () => {
    expect(validarCambioEtapa({ ...base, etapa: 'realizada' }, 'enviado', null)).toMatch(/evaluación/);
    expect(validarCambioEtapa({ ...base, etapa: 'realizada' }, 'enviado', { id: 1 })).toBeNull();
  });

  it('permite retroceder una etapa', () => {
    expect(validarCambioEtapa({ ...base, etapa: 'agendada' }, 'recibida', null)).toBeNull();
  });

  it('rechaza etapas que no existen', () => {
    expect(validarCambioEtapa(base, 'cerrada', null)).toMatch(/no existe/);
  });
});
