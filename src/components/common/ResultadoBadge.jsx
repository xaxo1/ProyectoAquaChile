const CLASES = {
  Recomendado: 'aq-resultado--ok',
  'Recomendado con observaciones': 'aq-resultado--obs',
  'No recomendado': 'aq-resultado--no',
};

/** Muestra la categoría del evaluado. Props: resultado (string | null). */
export default function ResultadoBadge({ resultado }) {
  if (!resultado) return <span className="text-body-secondary">Pendiente</span>;
  return <span className={`aq-resultado ${CLASES[resultado] ?? ''}`}>{resultado}</span>;
}
