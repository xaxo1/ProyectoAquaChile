import { Link } from 'react-router-dom';

export default function NoEncontrado() {
  return (
    <div className="aq-vacio">
      <i className="bi bi-signpost-split" aria-hidden="true" />
      <p>La página que buscas no existe.</p>
      <Link className="btn btn-primary btn-sm" to="/">Ir al panel</Link>
    </div>
  );
}
