import { formatearFecha, obtenerEtapa } from '../../utils/formatters';

/** Historial de cambios de etapa, del más reciente al más antiguo. Props: historial */
export default function HistorialEtapas({ historial = [] }) {
  return (
    <section className="aq-panel">
      <h2 className="aq-panel__titulo">Historial</h2>
      <ul className="aq-historial">
        {[...historial].reverse().map((h, i) => (
          <li key={`${h.etapa}-${i}`}>
            <span className="fw-semibold">{obtenerEtapa(h.etapa).nombre}</span>
            <span className="aq-tabla__sub">
              {formatearFecha(h.fecha)}{h.usuario && ` · ${h.usuario}`}
            </span>
            {h.comentario && <span className="small">{h.comentario}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
