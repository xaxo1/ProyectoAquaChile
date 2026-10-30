// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';

// Se reemplaza la base de datos por una función simulada,
// así las pruebas no dependen de tener Supabase conectado.
vi.mock('./db.js', () => ({ query: vi.fn(), pool: {} }));

const { query } = await import('./db.js');
const { default: app } = await import('./app.js');
const { crearToken } = await import('./middleware/auth.js');

const analista = { id: 1, nombre: 'Paula Herrera', email: 'paula.herrera@demo.cl', rol: 'analista' };
const tokenAnalista = crearToken(analista);

beforeEach(() => query.mockReset());

describe('POST /api/auth/login', () => {
  it('responde 400 si faltan datos', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.errores).toHaveProperty('email');
    expect(query).not.toHaveBeenCalled();
  });

  it('responde 401 con contraseña incorrecta', async () => {
    const hash = await bcrypt.hash('Aqua2026', 4);
    query.mockResolvedValue({ rows: [{ ...analista, password_hash: hash }] });

    const res = await request(app).post('/api/auth/login').send({ email: analista.email, password: 'otra' });
    expect(res.status).toBe(401);
  });

  it('entrega un token y no devuelve la contraseña', async () => {
    const hash = await bcrypt.hash('Aqua2026', 4);
    query.mockResolvedValue({ rows: [{ ...analista, password_hash: hash }] });

    const res = await request(app).post('/api/auth/login').send({ email: analista.email, password: 'Aqua2026' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.usuario).not.toHaveProperty('password_hash');
  });
});

describe('rutas protegidas', () => {
  it('rechazan peticiones sin token', async () => {
    const res = await request(app).get('/api/candidatos');
    expect(res.status).toBe(401);
  });

  it('rechazan un token falso', async () => {
    const res = await request(app).get('/api/candidatos').set('Authorization', 'Bearer token-falso');
    expect(res.status).toBe(401);
  });

  it('devuelven los candidatos con un token válido', async () => {
    query.mockResolvedValue({ rows: [{ id: 1, nombre: 'Ana Pérez' }] });
    const res = await request(app).get('/api/candidatos').set('Authorization', `Bearer ${tokenAnalista}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('validan los datos del candidato antes de guardar', async () => {
    const res = await request(app)
      .post('/api/candidatos')
      .set('Authorization', `Bearer ${tokenAnalista}`)
      .send({ nombre: 'Ana', email: 'no-es-correo' });
    expect(res.status).toBe(400);
    expect(res.body.errores.email).toBeDefined();
    expect(query).not.toHaveBeenCalled();
  });

  it('solo un evaluador puede registrar la evaluación', async () => {
    const res = await request(app)
      .put('/api/solicitudes/1/evaluacion')
      .set('Authorization', `Bearer ${tokenAnalista}`)
      .send({});
    expect(res.status).toBe(403);
  });
});

describe('formulario público', () => {
  it('no requiere sesión pero sí valida los datos', async () => {
    const res = await request(app).post('/api/postulaciones').send({ nombre: 'Ana Pérez' });
    expect(res.status).toBe(400);
    expect(res.body.errores).toHaveProperty('analista');
  });
});

it('responde 404 en rutas de la API que no existen', async () => {
  const res = await request(app).get('/api/no-existe');
  expect(res.status).toBe(404);
});
