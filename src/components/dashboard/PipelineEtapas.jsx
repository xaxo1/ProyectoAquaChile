import { ETAPAS } from '../../data/catalogos';

/**
 * Recorrido de las solicitudes por etapa (reemplaza el tablero de Planner).
 * Al hacer clic en una etapa se filtra la tabla; un segundo clic quita el filtro.
 * Props: conteos ({ etapaId: número }), etapaActiva (string|null), onSeleccionar(fn)
 */
export default function PipelineEtapas({ conteos, etapaActiva, onSeleccionar }) {
  const total = Object.values(conteos).reduce((a, b) => a + b, 0);

  return (
    <section className="aq-pipeline" aria-label="Solicitudes por etapa">
      {ETAPAS.map((etapa) => {
        const cantidad = conteos[etapa.id] ?? 0;
        const activa = etapaActiva === etapa.id;
        const proporcion = total ? Math.round((cantidad / total) * 100) : 0;
        return (
          <button
            key={etapa.id}
            type="button"
            className={`aq-pipeline__paso aq-pipeline__paso--${etapa.id} ${activa ? 'is-activa' : ''}`}
            aria-pressed={activa}
            onClick={() => onSeleccionar(activa ? null : etapa.id)}
          >
            <span className="aq-pipeline__cantidad">{cantidad}</span>
            <span className="aq-pipeline__nombre">{etapa.nombre}</span>
            <span className="aq-pipeline__meta">
              {etapa.estado}, {proporcion}% del total
            </span>
          </button>
        );
      })}
    </section>
  );
}
