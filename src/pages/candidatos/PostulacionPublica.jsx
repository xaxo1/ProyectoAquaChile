import { Link } from 'react-router-dom';

// ARCHIVO TEMPORAL: lo reemplaza el Integrante 2 con el formulario público real.
export default function PostulacionPublica() {
  return (
    <main className="container py-5" style={{ maxWidth: 640 }}>
      <h1 className="h3">Formulario público de solicitud</h1>
      <p className="text-body-secondary">Esta vista la desarrolla el Integrante 2.</p>
      <Link to="/">Volver al panel</Link>
    </main>
  );
}
