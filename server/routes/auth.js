import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { crearToken, verificarToken } from '../middleware/auth.js';
import { tieneErrores, validarLogin } from '../../src/utils/validaciones.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const errores = validarLogin(req.body ?? {});
  if (tieneErrores(errores)) return res.status(400).json({ error: 'Datos incompletos.', errores });

  const email = req.body.email.trim().toLowerCase();
  const { rows } = await query('SELECT * FROM usuarios WHERE email = $1', [email]);
  const usuario = rows[0];

  // Mismo mensaje si falla el correo o la contraseña, para no dar pistas
  if (!usuario || !(await bcrypt.compare(req.body.password, usuario.password_hash))) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
  }

  const { password_hash, ...datos } = usuario;
  res.json({ token: crearToken(datos), usuario: datos });
});

// GET /api/auth/perfil: devuelve el usuario del token
router.get('/perfil', verificarToken, (req, res) => {
  const { id, nombre, email, rol } = req.usuario;
  res.json({ id, nombre, email, rol });
});

export default router;
