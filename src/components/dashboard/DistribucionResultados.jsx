import { RESULTADOS } from '../../data/catalogos';

const COLORES = {
  Recomendado: 'var(--aq-kelp)',
  'Recomendado con observaciones': 'var(--aq-amber)',
  'No recomendado': 'var(--aq-coral)',
};

/**
 * Barra apilada con la categoría de los evaluados (informes enviados).
 * Props: resumen = { total, conteo: { resultado: número } }
 */
export default function DistribucionResultados({ resumen }) {
  const { total, conteo } = resumen;

  return (
    <section className="aq-panel">
      <h2 className="aq-panel__titulo">Resultado de los informes enviados</h2>
      {total === 0 ? (
        <p className="text-body-secondary mb-0">Aún no hay informes enviados.</p>
      ) : (
        <>
          <div className="aq-barra" role="img" aria-label={RESULTADOS.map((r) => `${r}: ${conteo[r]}`).join(', ')}>
            {RESULTADOS.map((r) =>
              conteo[r] ? (
                <span key={r} style={{ width: `${(conteo[r] / total) * 100}%`, background: COLORES[r] }} />
              ) : null
            )}
          </div>
          <ul className="aq-leyenda">
            {RESULTADOS.map((r) => (
              <li key={r}>
                <span className="aq-leyenda__punto" style={{ background: COLORES[r] }} />
                <span className="flex-grow-1">{r}</span>
                <strong className="aq-num">{conteo[r]}</strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
