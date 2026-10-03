import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import NoEncontrado from './components/common/NoEncontrado';

// Integrante 1 (Nicolás): Dashboard
import Dashboard from './pages/Dashboard';

// Integrante 2: módulo de candidatos
import PostulacionPublica from './pages/candidatos/PostulacionPublica';
import CandidatosLista from './pages/candidatos/CandidatosLista';
import CandidatoFormPage from './pages/candidatos/CandidatoFormPage';
import CandidatoDetalle from './pages/candidatos/CandidatoDetalle';

// Integrante 3: módulo de solicitudes y evaluación
import SolicitudesLista from './pages/solicitudes/SolicitudesLista';
import SolicitudNueva from './pages/solicitudes/SolicitudNueva';
import SolicitudDetalle from './pages/solicitudes/SolicitudDetalle';

export default function App() {
  return (
    <Routes>
      {/* Formulario público: se muestra sin la barra interna */}
      <Route path="postular" element={<PostulacionPublica />} />

      {/* Vistas internas (analista y evaluador) */}
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
    </Routes>
  );
}
