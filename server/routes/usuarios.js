import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/usuarios/evaluadores: lista para asignar responsables
router.get('/evaluadores', async (req, res) => {
  const { rows } = await query(
    "SELECT id, nombre, email FROM usuarios WHERE rol = 'evaluador' ORDER BY nombre"
  );
  res.json(rows);
});

export default router;
