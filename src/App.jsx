import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LayoutPublico from './components/layout/LayoutPublico';
import RutaPrivada from './components/layout/RutaPrivada';
import NoEncontrado from './components/common/NoEncontrado';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import PostulacionPublica from './pages/candidatos/PostulacionPublica';
import CandidatosLista from './pages/candidatos/CandidatosLista';
import CandidatoFormPage from './pages/candidatos/CandidatoFormPage';
import CandidatoDetalle from './pages/candidatos/CandidatoDetalle';

import SolicitudesLista from './pages/solicitudes/SolicitudesLista';
import SolicitudNueva from './pages/solicitudes/SolicitudNueva';
import SolicitudDetalle from './pages/solicitudes/SolicitudDetalle';

export default function App() {
  return (
    <Routes>
      {/* Vistas públicas */}
      <Route element={<LayoutPublico />}>
        <Route path="login" element={<Login />} />
        <Route path="postular" element={<PostulacionPublica />} />
      </Route>

      {/* Vistas internas: requieren iniciar sesión */}
      <Route element={<RutaPrivada />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="candidatos" element={<CandidatosLista />} />
          <Route path="candidatos/nuevo" element={<CandidatoFormPage />} />
          <Route path="candidatos/:id" element={<CandidatoDetalle />} />
          <Route path="candidatos/:id/editar" element={<CandidatoFormPage />} />

          <Route path="solicitudes" element={<SolicitudesLista />} />
          <Route path="solicitudes/nueva" element={<SolicitudNueva />} />
          <Route path="solicitudes/:id" element={<SolicitudDetalle />} />

          <Route path="*" element={<NoEncontrado />} />
        </Route>
      </Route>
    </Routes>
  );
}
