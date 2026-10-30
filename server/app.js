import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { verificarToken } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import candidatosRoutes from './routes/candidatos.js';
import solicitudesRoutes from './routes/solicitudes.js';
import usuariosRoutes from './routes/usuarios.js';
import postulacionesRoutes from './routes/postulaciones.js';

const app = express();
app.use(express.json());

app.get('/api/salud', (req, res) => res.json({ ok: true }));

// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api/postulaciones', postulacionesRoutes);

// Rutas que requieren sesión
app.use('/api/candidatos', verificarToken, candidatosRoutes);
app.use('/api/solicitudes', verificarToken, solicitudesRoutes);
app.use('/api/usuarios', verificarToken, usuariosRoutes);

app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));

// En producción el mismo servidor entrega el frontend compilado (carpeta dist)
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('/{*ruta}', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// Manejo de errores: cualquier error no controlado responde 500
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Ocurrió un error en el servidor. Intenta nuevamente.' });
});

export default app;
