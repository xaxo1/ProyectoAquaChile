/** Mensajes mientras se cargan los datos desde la API o si la carga falla. */
export function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="aq-vacio" role="status">
      <div className="spinner-border text-primary" aria-hidden="true" />
      <p>{texto}</p>
    </div>
  );
}

export function ErrorCarga({ mensaje, onReintentar }) {
  return (
    <div className="aq-vacio" role="alert">
      <i className="bi bi-wifi-off" aria-hidden="true" />
      <p>{mensaje}</p>
      {onReintentar && (
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}
