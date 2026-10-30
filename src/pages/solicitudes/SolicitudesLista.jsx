import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import TablaSolicitudes from '../../components/dashboard/TablaSolicitudes';
import { Cargando, ErrorCarga } from '../../components/common/EstadoCarga';
import { ETAPAS, FAMILIAS_CARGO } from '../../data/catalogos';
import { construirFilas, filtrarFilas } from '../../utils/dashboard';

export default function SolicitudesLista() {
  const { candidatos, solicitudes, evaluaciones, evaluadores, cargando, error, cargarDatos } = useData();
  const { usuario, esEvaluador } = useAuth();

  const [busqueda, setBusqueda] = useState('');
  const [etapa, setEtapa] = useState('');
  const [familia, setFamilia] = useState('');
  // El evaluador parte viendo solo las solicitudes que tiene asignadas
  const [responsable, setResponsable] = useState(esEvaluador ? String(usuario.id) : '');

  const filas = useMemo(
    () => construirFilas(solicitudes, candidatos, evaluaciones, evaluadores),
    [solicitudes, candidatos, evaluaciones, evaluadores]
  );
  const filtradas = filtrarFilas(filas, { etapa, busqueda, familia, responsable });

  if (cargando) return <Cargando texto="Cargando solicitudes..." />;
  if (error) return <ErrorCarga mensaje={error} onReintentar={cargarDatos} />;

  const hayFiltros = Boolean(busqueda || etapa || familia || responsable);
  const limpiar = () => {
    setBusqueda('');
    setEtapa('');
    setFamilia('');
    setResponsable('');
  };

  return (
    <>
      <PageHeader titulo="Solicitudes" descripcion="Seguimiento de todas las solicitudes de evaluación psicolaboral.">
        <Link to="/solicitudes/nueva" className="btn btn-primary">
          <i className="bi bi-clipboard-plus me-2" aria-hidden="true" />
          Nueva solicitud
        </Link>
      </PageHeader>

      <section className="aq-panel">
        <div className="row g-2 mb-3">
          <div className="col-12 col-lg-4">
            <label htmlFor="buscar-solicitud" className="visually-hidden">Buscar</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-search" aria-hidden="true" /></span>
              <input
                id="buscar-solicitud"
                type="search"
                className="form-control"
                placeholder="Candidato, cargo o responsable"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <select className="form-select" aria-label="Etapa" value={etapa} onChange={(e) => setEtapa(e.target.value)}>
              <option value="">Todas las etapas</option>
              {ETAPAS.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>
          <div className="col-6 col-lg-2">
            <select className="form-select" aria-label="Familia de cargo" value={familia} onChange={(e) => setFamilia(e.target.value)}>
              <option value="">Todas las familias</option>
              {FAMILIAS_CARGO.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="col-8 col-lg-3">
            <select className="form-select" aria-label="Responsable" value={responsable} onChange={(e) => setResponsable(e.target.value)}>
              <option value="">Todos los responsables</option>
              <option value="sin">Sin asignar</option>
              {evaluadores.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.id === usuario.id ? `${ev.nombre} (yo)` : ev.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-4 col-lg-1 d-grid">
            <button type="button" className="btn btn-outline-secondary" onClick={limpiar} disabled={!hayFiltros}>
              Limpiar
            </button>
          </div>
        </div>

        <p className="text-body-secondary small mb-2">{filtradas.length} de {filas.length} solicitudes</p>
        <TablaSolicitudes filas={filtradas} />
      </section>
    </>
  );
}
