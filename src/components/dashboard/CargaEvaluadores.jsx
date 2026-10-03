/**
 * Solicitudes activas por profesional evaluador.
 * Props: carga = [{ id, nombre, activas, total }], sinAsignar (número)
 */
export default function CargaEvaluadores({ carga, sinAsignar }) {
  const maximo = Math.max(1, ...carga.map((c) => c.activas));

  return (
    <section className="aq-panel">
      <h2 className="aq-panel__titulo">Carga de evaluadores</h2>
      <ul className="aq-carga">
        {carga.map((c) => (
          <li key={c.id}>
            <div className="d-flex justify-content-between">
              <span>{c.nombre}</span>
              <span className="aq-num">{c.activas} activas de {c.total}</span>
            </div>
            <div className="aq-carga__pista">
              <span style={{ width: `${(c.activas / maximo) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
      {sinAsignar > 0 && (
        <p className="aq-alerta-texto mb-0 mt-3">
          <i className="bi bi-exclamation-circle me-1" aria-hidden="true" />
          {sinAsignar === 1 ? '1 solicitud no tiene' : `${sinAsignar} solicitudes no tienen`} evaluador asignado.
        </p>
      )}
    </section>
  );
}
