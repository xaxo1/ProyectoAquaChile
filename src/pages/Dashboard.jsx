import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageHeader from '../components/common/PageHeader';
import { Cargando, ErrorCarga } from '../components/common/EstadoCarga';
import IndicadoresResumen from '../components/dashboard/IndicadoresResumen';
import PipelineEtapas from '../components/dashboard/PipelineEtapas';
import FiltrosDashboard from '../components/dashboard/FiltrosDashboard';
import TablaSolicitudes from '../components/dashboard/TablaSolicitudes';
import DistribucionResultados from '../components/dashboard/DistribucionResultados';
import CargaEvaluadores from '../components/dashboard/CargaEvaluadores';
import ModalRegistroRapido from '../components/dashboard/ModalRegistroRapido';
import {
  cargaPorEvaluador,
  construirFilas,
  contarPorEtapa,
  filtrarFilas,
  porcentajeRecomendados,
  promedioDiasCierre,
  resumenResultados,
} from '../utils/dashboard';
import { obtenerEtapa } from '../utils/formatters';

export default function Dashboard() {
  const { candidatos, solicitudes, evaluaciones, evaluadores, cargando, error, cargarDatos } = useData();

  // Estado local del panel
  const [etapaActiva, setEtapaActiva] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [familia, setFamilia] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [aviso, setAviso] = useState('');

  // Datos derivados (se recalculan solo cuando cambian sus dependencias)
  const filas = useMemo(
    () => construirFilas(solicitudes, candidatos, evaluaciones, evaluadores),
    [solicitudes, candidatos, evaluaciones, evaluadores]
  );
  const filasFiltradas = useMemo(
    () => filtrarFilas(filas, { etapa: etapaActiva, busqueda, familia }),
    [filas, etapaActiva, busqueda, familia]
  );
  const conteos = useMemo(() => contarPorEtapa(solicitudes), [solicitudes]);
  const resumen = useMemo(() => resumenResultados(evaluaciones), [evaluaciones]);
  const carga = useMemo(() => cargaPorEvaluador(solicitudes, evaluadores), [solicitudes, evaluadores]);

  const promedio = promedioDiasCierre(solicitudes);
  const recomendados = porcentajeRecomendados(evaluaciones);
  const enCurso = solicitudes.length - conteos.enviado;
  const sinAsignar = solicitudes.filter((s) => !s.responsableId && s.etapa !== 'enviado').length;

  const indicadores = [
    { valor: candidatos.length, etiqueta: 'Candidatos registrados' },
    { valor: enCurso, etiqueta: 'Evaluaciones en curso', detalle: `${conteos.recibida} esperan agenda` },
    { valor: promedio ?? '—', etiqueta: 'Días promedio hasta el informe', detalle: `${conteos.enviado} informes enviados` },
    { valor: recomendados === null ? '—' : `${recomendados}%`, etiqueta: 'Candidatos recomendados', detalle: 'Incluye con observaciones' },
  ];

  const hayFiltros = Boolean(etapaActiva || busqueda || familia);
  const limpiarFiltros = () => {
    setEtapaActiva(null);
    setBusqueda('');
    setFamilia('');
  };

  const cerrarModal = useCallback(() => setModalAbierto(false), []);
  const alRegistrar = (mensaje) => {
    setModalAbierto(false);
    limpiarFiltros();
    setAviso(mensaje);
  };

  if (cargando) return <Cargando texto="Cargando el panel..." />;
  if (error) return <ErrorCarga mensaje={error} onReintentar={cargarDatos} />;

  return (
    <>
      <PageHeader
        titulo="Panel de evaluaciones"
        descripcion="Seguimiento de las evaluaciones psicolaborales solicitadas por los analistas de reclutamiento."
      >
        <Link to="/solicitudes/nueva" className="btn btn-outline-primary">
          <i className="bi bi-clipboard-plus me-2" aria-hidden="true" />
          Nueva solicitud
        </Link>
        <button type="button" className="btn btn-primary" onClick={() => setModalAbierto(true)}>
          <i className="bi bi-person-plus me-2" aria-hidden="true" />
          Registrar candidato
        </button>
      </PageHeader>

      {aviso && (
        <div className="alert alert-success d-flex align-items-start" role="status">
          <i className="bi bi-check-circle me-2 mt-1" aria-hidden="true" />
          <span className="flex-grow-1">{aviso}</span>
          <button type="button" className="btn-close" aria-label="Cerrar aviso" onClick={() => setAviso('')} />
        </div>
      )}

      <PipelineEtapas conteos={conteos} etapaActiva={etapaActiva} onSeleccionar={setEtapaActiva} />

      <IndicadoresResumen indicadores={indicadores} />

      <div className="row g-4 mt-1">
        <div className="col-12 col-xl-8">
          <section className="aq-panel">
            <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-3">
              <h2 className="aq-panel__titulo mb-0">
                {etapaActiva ? obtenerEtapa(etapaActiva).nombre : 'Todas las solicitudes'}
              </h2>
              <span className="text-body-secondary small">
                {filasFiltradas.length} de {filas.length} solicitudes
              </span>
            </div>
            <FiltrosDashboard
              busqueda={busqueda}
              familia={familia}
              onBusqueda={setBusqueda}
              onFamilia={setFamilia}
              onLimpiar={limpiarFiltros}
              hayFiltros={hayFiltros}
            />
            <TablaSolicitudes filas={filasFiltradas} />
          </section>
        </div>

        <div className="col-12 col-xl-4 d-flex flex-column gap-4">
          <DistribucionResultados resumen={resumen} />
          <CargaEvaluadores carga={carga} sinAsignar={sinAsignar} />
        </div>
      </div>

      <ModalRegistroRapido abierto={modalAbierto} onCerrar={cerrarModal} onRegistrado={alRegistrar} />
    </>
  );
}
