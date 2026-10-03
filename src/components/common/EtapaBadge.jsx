import { obtenerEtapa } from '../../utils/formatters';

/** Muestra la etapa de una solicitud con su color. Props: etapaId (string). */
export default function EtapaBadge({ etapaId }) {
  const etapa = obtenerEtapa(etapaId);
  return (
    <span className={`aq-etapa aq-etapa--${etapa.id}`} title={`Estado: ${etapa.estado}`}>
      {etapa.nombre}
    </span>
  );
}
