import { Link, Outlet } from 'react-router-dom';

// Layout de las vistas que no requieren sesión: login y formulario público
export default function LayoutPublico() {
  return (
    <div className="aq-app aq-app--publica">
      <div className="aq-publica__fondo" aria-hidden="true">
        <video
          className="aq-publica__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/video/acuicultura.mp4" type="video/mp4" />
        </video>
      </div>
      <header className="aq-publica__header">
        <div className="container-xl">
          <Link className="aq-brand" to="/login">
            <img src="/logo-aquachile.png" alt="Logo AquaChile" className="aq-brand__logo" />
            <span>
              AquaChile
              <small>Reclutamiento y Selección</small>
            </span>
          </Link>
        </div>
      </header>
      <main className="container-xl py-4 py-md-5">
        <Outlet />
      </main>
      <footer className="aq-footer">
        <div className="container-xl">
          MVP académico DSY1104 Full Stack II, Duoc UC. Datos ficticios.
        </div>
      </footer>
    </div>
  );
}
