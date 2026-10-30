import { Link, useLocation, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import NoEncontrado from '../../components/common/NoEncontrado';
import EtapaBadge from '../../components/common/EtapaBadge';
import AvisoExito from '../../components/common/AvisoExito';
import { Cargando } from '../../components/common/EstadoCarga';
import AsignacionSolicitud from '../../components/solicitudes/AsignacionSolicitud';
import CambioEtapa from '../../components/solicitudes/CambioEtapa';
import HistorialEtapas from '../../components/solicitudes/HistorialEtapas';
import FormEvaluacion from '../../components/solicitudes/FormEvaluacion';
import { diasEntre, formatearFecha, hoyISO } from '../../utils/formatters';

export default function SolicitudDetalle() {
  const { id } = useParams();
  const location = useLocation();
  const { esEvaluador } = useAuth();
  const {
    obtenerSolicitud,
    obtenerCandidato,
    obtenerEvaluacionPorSolicitud,
    evaluadores,
    actualizarSolicitud,
    cambiarEtapa,
    registrarEvaluacion,
    cargando,
  } = useData();

  if (cargando) return <Cargando />;
  const solicitud = obtenerSolicitud(id);
  if (!solicitud) return <NoEncontrado />;

  const candidato = obtenerCandidato(solicitud.candidatoId);
  const evaluacion = obtenerEvaluacionPorSolicitud(solicitud.id);
  const cierre = solicitud.etapa === 'enviado' ? solicitud.historial.at(-1)?.fecha : hoyISO();

  const datos = [
    { etiqueta: 'Cargo', valor: solicitud.cargo },
    { etiqueta: 'Familia de cargo', valor: solicitud.familiaCargo },
    { etiqueta: 'Ubicación', valor: solicitud.ubicacion || 'Sin definir' },
    { etiqueta: 'Analista solicitante', valor: solicitud.analista },
    { etiqueta: 'Fecha de solicitud', valor: formatearFecha(solicitud.fechaSolicitud) },
    { etiqueta: 'Días en proceso', valor: diasEntre(solicitud.fechaSolicitud, cierre) },
  ];

  return (
    <>
      <PageHeader titulo={candidato?.nombre ?? 'Solicitud'} descripcion={`Solicitud de evaluación para ${solicitud.cargo}.`}>
        <EtapaBadge etapaId={solicitud.etapa} />
      </PageHeader>

      <AvisoExito mensaje={location.state?.aviso} />

      <div className="row g-4">
        <div className="col-12 col-lg-7 d-flex flex-column gap-4">
          <section className="aq-panel">
            <div className="d-flex justify-content-between align-items-baseline">
              <h2 className="aq-panel__titulo">Datos de la solicitud</h2>
              {candidato && <Link to={`/candidatos/${candidato.id}`} className="small">Ver ficha del candidato</Link>}
            </div>
            <dl className="aq-datos aq-datos--2col">
              {datos.map((d) => (
                <div key={d.etiqueta}>
                  <dt>{d.etiqueta}</dt>
                  <dd>{d.valor}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* key: si la solicitud cambia en el servidor, el formulario se reinicia con los datos nuevos */}
          <AsignacionSolicitud
            key={`${solicitud.id}-${solicitud.responsableId}-${solicitud.fechaEntrevista}`}
            solicitud={solicitud}
            evaluadores={evaluadores}
            onGuardar={(cambios) => actualizarSolicitud(solicitud.id, cambios)}
          />

          <FormEvaluacion
            key={`ev-${evaluacion?.id ?? 'nueva'}-${solicitud.etapa}`}
            solicitud={solicitud}
            evaluacion={evaluacion}
            puedeEditar={esEvaluador}
            onGuardar={(datos) => registrarEvaluacion(solicitud.id, datos)}
          />
        </div>

        <div className="col-12 col-lg-5 d-flex flex-column gap-4">
          <CambioEtapa
            solicitud={solicitud}
            evaluacion={evaluacion}
            onCambiar={(etapa, comentario) => cambiarEtapa(solicitud.id, etapa, comentario)}
          />
          <HistorialEtapas historial={solicitud.historial} />
        </div>
      </div>
    </>
  );
}
