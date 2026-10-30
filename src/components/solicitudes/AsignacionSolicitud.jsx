import { useState } from 'react';

/**
 * Asignar evaluador responsable, fecha de entrevista y observaciones.
 * Props: solicitud, evaluadores, onGuardar(cambios) => Promise
 */
export default function AsignacionSolicitud({ solicitud, evaluadores, onGuardar }) {
  const [form, setForm] = useState({
    responsableId: solicitud.responsableId ?? '',
    fechaEntrevista: solicitud.fechaEntrevista ?? '',
    observaciones: solicitud.observaciones ?? '',
  });
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMensaje(null);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await onGuardar({
        responsableId: form.responsableId ? Number(form.responsableId) : null,
        fechaEntrevista: form.fechaEntrevista || null,
        observaciones: form.observaciones.trim(),
      });
      setMensaje({ tipo: 'success', texto: 'Cambios guardados.' });
    } catch (err) {
      setMensaje({ tipo: 'danger', texto: err.message });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="aq-panel" onSubmit={guardar}>
      <h2 className="aq-panel__titulo">Asignación y entrevista</h2>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="asig-responsable" className="form-label">Evaluador responsable</label>
          <select id="asig-responsable" name="responsableId" className="form-select" value={form.responsableId} onChange={cambiar}>
            <option value="">Sin asignar</option>
            {evaluadores.map((ev) => <option key={ev.id} value={ev.id}>{ev.nombre}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="asig-fecha" className="form-label">Fecha de entrevista</label>
          <input id="asig-fecha" name="fechaEntrevista" type="date" className="form-control" value={form.fechaEntrevista} onChange={cambiar} />
        </div>
        <div className="col-12">
          <label htmlFor="asig-obs" className="form-label">Observaciones de la solicitud</label>
          <textarea id="asig-obs" name="observaciones" rows="2" className="form-control" value={form.observaciones} onChange={cambiar} />
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-end gap-3 mt-3">
        {mensaje && <span className={`small text-${mensaje.tipo}`} role="status">{mensaje.texto}</span>}
        <button type="submit" className="btn btn-outline-primary" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
