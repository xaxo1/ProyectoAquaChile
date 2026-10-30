import { useState } from 'react';
import { ETAPAS } from '../../data/catalogos';
import { validarCambioEtapa } from '../../utils/validaciones';

/**
 * Botones para avanzar o retroceder la solicitud una etapa.
 * Antes de llamar a la API revisa las mismas reglas que valida el backend.
 * Props: solicitud, evaluacion, onCambiar(etapa, comentario) => Promise
 */
export default function CambioEtapa({ solicitud, evaluacion, onCambiar }) {
  const [comentario, setComentario] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const indice = ETAPAS.findIndex((e) => e.id === solicitud.etapa);
  const anterior = ETAPAS[indice - 1];
  const siguiente = ETAPAS[indice + 1];
  const bloqueo = siguiente ? validarCambioEtapa(solicitud, siguiente.id, evaluacion) : null;

  const mover = async (etapa) => {
    setGuardando(true);
    setError('');
    try {
      await onCambiar(etapa.id, comentario);
      setComentario('');
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="aq-panel">
      <h2 className="aq-panel__titulo">Etapa del proceso</h2>

      <ol className="aq-pasos">
        {ETAPAS.map((e, i) => (
          <li key={e.id} className={i < indice ? 'is-hecho' : i === indice ? 'is-actual' : ''}>
            {e.nombre}
          </li>
        ))}
      </ol>

      {error && <div className="alert alert-danger py-2 mt-3" role="alert">{error}</div>}

      <label htmlFor="comentario-etapa" className="form-label mt-3">
        Comentario <span className="text-body-secondary">(opcional)</span>
      </label>
      <input
        id="comentario-etapa"
        className="form-control"
        placeholder="Ej: entrevista confirmada por correo"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />

      <div className="d-flex flex-wrap gap-2 mt-3">
        {anterior && (
          <button type="button" className="btn btn-outline-secondary" disabled={guardando} onClick={() => mover(anterior)}>
            <i className="bi bi-arrow-left me-1" aria-hidden="true" />
            Volver a {anterior.nombre.toLowerCase()}
          </button>
        )}
        {siguiente && (
          <button type="button" className="btn btn-primary" disabled={guardando || Boolean(bloqueo)} onClick={() => mover(siguiente)}>
            Pasar a {siguiente.nombre.toLowerCase()}
            <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
          </button>
        )}
      </div>
      {bloqueo && <p className="aq-alerta-texto mt-2 mb-0">{bloqueo}</p>}
      {!siguiente && <p className="text-body-secondary small mt-2 mb-0">El proceso de esta solicitud está finalizado.</p>}
    </section>
  );
}
