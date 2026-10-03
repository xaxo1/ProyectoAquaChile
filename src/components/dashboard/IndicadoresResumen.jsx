/**
 * Franja de indicadores generales del proceso.
 * Props: indicadores = [{ valor, etiqueta, detalle }]
 */
export default function IndicadoresResumen({ indicadores }) {
  return (
    <section className="aq-indicadores" aria-label="Indicadores generales">
      {indicadores.map((ind) => (
        <div className="aq-indicador" key={ind.etiqueta}>
          <span className="aq-indicador__valor">{ind.valor}</span>
          <span className="aq-indicador__etiqueta">{ind.etiqueta}</span>
          {ind.detalle && <span className="aq-indicador__detalle">{ind.detalle}</span>}
        </div>
      ))}
    </section>
  );
}
