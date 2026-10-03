import { Link } from 'react-router-dom';
import PageHeader from './PageHeader';

/**
 * Vista temporal para las rutas que aún no se integran.
 * Cada integrante reemplaza el archivo de su página por la versión real.
 */
export default function EnConstruccion({ titulo, responsable, descripcion }) {
  return (
    <>
      <PageHeader titulo={titulo} descripcion={descripcion} />
      <div className="aq-vacio">
        <i className="bi bi-cone-striped" aria-hidden="true" />
        <p>Esta vista la desarrolla {responsable}.</p>
        <Link className="btn btn-outline-primary btn-sm" to="/">Volver al panel</Link>
      </div>
    </>
  );
}
