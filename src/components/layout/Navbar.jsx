import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const ENLACES = [
  { to: '/', texto: 'Panel', icono: 'bi-speedometer2', end: true },
  { to: '/candidatos', texto: 'Candidatos', icono: 'bi-people' },
  { to: '/solicitudes', texto: 'Solicitudes', icono: 'bi-clipboard2-check' },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);

  return (
    <nav className="navbar navbar-expand-md aq-navbar" aria-label="Navegación principal">
      <div className="container-xl">
        <Link className="navbar-brand aq-brand" to="/" onClick={() => setAbierto(false)}>
          <img src="/favicon.svg" alt="" width="30" height="30" />
          <span>
            AquaChile
            <small>Evaluaciones psicolaborales</small>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="menu-principal"
          aria-expanded={abierto}
          aria-label="Abrir menú"
          onClick={() => setAbierto((v) => !v)}
        >
          <i className={`bi ${abierto ? 'bi-x-lg' : 'bi-list'}`} />
        </button>

        <div className={`collapse navbar-collapse ${abierto ? 'show' : ''}`} id="menu-principal">
          <ul className="navbar-nav ms-auto gap-md-1">
            {ENLACES.map((e) => (
              <li className="nav-item" key={e.to}>
                <NavLink className="nav-link" to={e.to} end={e.end} onClick={() => setAbierto(false)}>
                  <i className={`bi ${e.icono} me-2`} />
                  {e.texto}
                </NavLink>
              </li>
            ))}
            <li className="nav-item">
              <Link className="nav-link aq-nav-publico" to="/postular" onClick={() => setAbierto(false)}>
                <i className="bi bi-box-arrow-up-right me-2" />
                Formulario público
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
