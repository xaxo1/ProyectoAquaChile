import { Link, useLocation, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import PageHeader from '../../components/common/PageHeader';
import NoEncontrado from '../../components/common/NoEncontrado';
import EtapaBadge from '../../components/common/EtapaBadge';
import ResultadoBadge from '../../components/common/ResultadoBadge';
import AvisoExito from '../../components/common/AvisoExito';
import { Cargando } from '../../components/common/EstadoCarga';
import { formatearFecha, nombreEvaluador } from '../../utils/formatters';

export default function CandidatoDetalle() {
  const { id } = useParams();
  const location = useLocation();
  const { obtenerCandidato, solicitudesDeCandidato, obtenerEvaluacionPorSolicitud, evaluadores, cargando } = useData();

  if (cargando) return <Cargando />;
  const candidato = obtenerCandidato(id);
  if (!candidato) return <NoEncontrado />;

  const solicitudes = solicitudesDeCandidato(candidato.id);

  const datos = [
    { etiqueta: 'Correo', valor: candidato.email },
    { etiqueta: 'Teléfono', valor: candidato.telefono },
    { etiqueta: 'Cargo al que postula', valor: candidato.cargo },
    { etiqueta: 'Familia de cargo', valor: candidato.familiaCargo },
    { etiqueta: 'Ubicación', valor: candidato.ubicacion || 'Sin definir' },
    { etiqueta: 'Origen', valor: candidato.origen },
    { etiqueta: 'Fecha de registro', valor: formatearFecha(candidato.fechaRegistro) },
  ];

  return (
    <>
      <PageHeader titulo={candidato.nombre} descripcion="Ficha del candidato y sus solicitudes de evaluación.">
        <Link to={`/candidatos/${candidato.id}/editar`} className="btn btn-outline-primary">
          <i className="bi bi-pencil me-2" aria-hidden="true" />
          Editar
        </Link>
        <Link to={`/solicitudes/nueva?candidato=${candidato.id}`} className="btn btn-primary">
          <i className="bi bi-clipboard-plus me-2" aria-hidden="true" />
          Nueva solicitud
        </Link>
      </PageHeader>

      <AvisoExito mensaje={location.state?.aviso} />

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <section className="aq-panel">
            <h2 className="aq-panel__titulo">Datos del candidato</h2>
            <dl className="aq-datos">
              {datos.map((d) => (
                <div key={d.etiqueta}>
                  <dt>{d.etiqueta}</dt>
                  <dd>{d.valor}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="col-12 col-lg-7">
          <section className="aq-panel">
            <h2 className="aq-panel__titulo">Solicitudes de evaluación</h2>
            {solicitudes.length === 0 ? (
              <div className="aq-vacio aq-vacio--compacto">
                <i className="bi bi-clipboard" aria-hidden="true" />
                <p>Este candidato aún no tiene solicitudes.</p>
                <Link to={`/solicitudes/nueva?candidato=${candidato.id}`} className="btn btn-outline-primary btn-sm">
                  Crear solicitud
                </Link>
              </div>
            ) : (
              <ul className="list-group list-group-flush">
                {solicitudes.map((s) => (
                  <li key={s.id} className="list-group-item px-0 d-flex flex-wrap justify-content-between gap-2">
                    <div>
                      <Link to={`/solicitudes/${s.id}`} className="fw-semibold">{s.cargo}</Link>
                      <span className="aq-tabla__sub">
                        Solicitada el {formatearFecha(s.fechaSolicitud)} · {nombreEvaluador(s.responsableId, evaluadores)}
                      </span>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <EtapaBadge etapaId={s.etapa} />
                      {s.etapa === 'enviado' && (
                        <ResultadoBadge resultado={obtenerEvaluacionPorSolicitud(s.id)?.resultado} />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
