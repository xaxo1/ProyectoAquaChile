import { useState } from 'react';
import ResultadoBadge from '../common/ResultadoBadge';
import { RESULTADOS } from '../../data/catalogos';
import { formatearFecha, hoyISO } from '../../utils/formatters';
import { tieneErrores, validarEvaluacion } from '../../utils/validaciones';

/**
 * Registro de la evaluación psicolaboral.
 * Solo el evaluador puede editarla y solo después de la entrevista;
 * los demás usuarios la ven en modo lectura.
 * Props: solicitud, evaluacion, puedeEditar (bool), onGuardar(datos) => Promise
 */
export default function FormEvaluacion({ solicitud, evaluacion, puedeEditar, onGuardar }) {
  const [form, setForm] = useState({
    fechaEvaluacion: evaluacion?.fechaEvaluacion ?? solicitud.fechaEntrevista ?? hoyISO(),
    resultado: evaluacion?.resultado ?? '',
    observaciones: evaluacion?.observaciones ?? '',
  });
  const [enviado, setEnviado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const entrevistaRealizada = ['realizada', 'enviado'].includes(solicitud.etapa);
  const errores = validarEvaluacion(form);
  const clase = (campo, base = 'form-control') => `${base} ${enviado && errores[campo] ? 'is-invalid' : ''}`;

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMensaje(null);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setEnviado(true);
    if (tieneErrores(errores)) return;
    setGuardando(true);
    try {
      await onGuardar({ ...form, observaciones: form.observaciones.trim() });
      setMensaje({ tipo: 'success', texto: 'Evaluación guardada.' });
    } catch (err) {
      setMensaje({ tipo: 'danger', texto: err.message });
    } finally {
      setGuardando(false);
    }
  };

  if (!entrevistaRealizada) {
    return (
      <section className="aq-panel">
        <h2 className="aq-panel__titulo">Evaluación</h2>
        <p className="text-body-secondary mb-0">
          La evaluación se registra cuando la solicitud llega a "Entrevista realizada".
        </p>
      </section>
    );
  }

  if (!puedeEditar) {
    return (
      <section className="aq-panel">
        <h2 className="aq-panel__titulo">Evaluación</h2>
        {evaluacion ? (
          <>
            <p className="mb-2"><ResultadoBadge resultado={evaluacion.resultado} /> <span className="small text-body-secondary ms-2">{evaluacion.estado}, {formatearFecha(evaluacion.fechaEvaluacion)}</span></p>
            <p className="mb-0">{evaluacion.observaciones}</p>
          </>
        ) : (
          <p className="text-body-secondary mb-0">El evaluador responsable aún no registra la evaluación.</p>
        )}
      </section>
    );
  }

  return (
    <form className="aq-panel" onSubmit={guardar} noValidate>
      <div className="d-flex justify-content-between align-items-baseline">
        <h2 className="aq-panel__titulo">Evaluación</h2>
        {evaluacion && <span className="small text-body-secondary">Estado: {evaluacion.estado}</span>}
      </div>
      <div className="row g-3">
        <div className="col-md-5">
          <label htmlFor="ev-fecha" className="form-label">Fecha de evaluación</label>
          <input id="ev-fecha" name="fechaEvaluacion" type="date" className={clase('fechaEvaluacion')} value={form.fechaEvaluacion} onChange={cambiar} />
          <div className="invalid-feedback">{errores.fechaEvaluacion}</div>
        </div>
        <div className="col-md-7">
          <label htmlFor="ev-resultado" className="form-label">Resultado</label>
          <select id="ev-resultado" name="resultado" className={clase('resultado', 'form-select')} value={form.resultado} onChange={cambiar}>
            <option value="">Selecciona un resultado</option>
            {RESULTADOS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="invalid-feedback">{errores.resultado}</div>
        </div>
        <div className="col-12">
          <label htmlFor="ev-obs" className="form-label">Observaciones de la entrevista</label>
          <textarea id="ev-obs" name="observaciones" rows="4" className={clase('observaciones')} value={form.observaciones} onChange={cambiar} />
          <div className="invalid-feedback">{errores.observaciones}</div>
          <div className="form-text">{form.observaciones.trim().length} caracteres (mínimo 20)</div>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-end gap-3 mt-3">
        {mensaje && <span className={`small text-${mensaje.tipo}`} role="status">{mensaje.texto}</span>}
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando ? 'Guardando...' : evaluacion ? 'Actualizar evaluación' : 'Guardar evaluación'}
        </button>
      </div>
    </form>
  );
}
