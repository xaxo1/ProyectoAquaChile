import pg from 'pg';
import 'dotenv/config';

// Las columnas DATE se devuelven como texto 'YYYY-MM-DD' para evitar
// desfases de zona horaria al convertirlas a Date.
pg.types.setTypeParser(1082, (valor) => valor);

const url = process.env.DATABASE_URL;
if (!url) {
  console.warn('Falta DATABASE_URL en el archivo .env');
}

export const pool = new pg.Pool({
  connectionString: url,
  // Neon y Render exigen SSL; en una base local no se usa.
  ssl: url && !/localhost|127\.0\.0\.1/.test(url) ? { rejectUnauthorized: false } : false,
});

export const query = (texto, valores) => pool.query(texto, valores);
