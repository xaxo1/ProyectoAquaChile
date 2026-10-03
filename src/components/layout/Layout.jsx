import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="aq-app">
      <Navbar />
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
