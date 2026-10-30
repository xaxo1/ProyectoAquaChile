import 'dotenv/config';
import app from './app.js';

const PUERTO = process.env.PORT || 3001;

app.listen(PUERTO, () => {
  console.log(`API escuchando en http://localhost:${PUERTO}`);
});
