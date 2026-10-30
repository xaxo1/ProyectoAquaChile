import { FAMILIAS_CARGO, ORIGENES, UBICACIONES } from '../../data/catalogos';

/**
 * Campos del candidato. Se reutiliza en el formulario interno y en el público.
 * Props: form, errores, mostrarError(fn), onCambiar(fn), onSalir(fn), prefijo (para los id)
 */
export default function CamposCandidato({ form, errores, mostrarError, onCambiar, onSalir, prefijo = 'cand' }) {
  const clase = (campo, base = 'form-control') => `${base} ${mostrarError(campo) ? 'is-invalid' : ''}`;

  return (
    <div className="row g-3">
      <div className="col-12">
        <label htmlFor={`${prefijo}-nombre`} className="form-label">Nombre completo</label>
        <input id={`${prefijo}-nombre`} name="nombre" className={clase('nombre')} value={form.nombre} onChange={onCambiar} onBlur={onSalir} />
        <div className="invalid-feedback">{errores.nombre}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor={`${prefijo}-email`} className="form-label">Correo electrónico</label>
        <input id={`${prefijo}-email`} name="email" type="email" className={clase('email')} value={form.email} onChange={onCambiar} onBlur={onSalir} />
        <div className="invalid-feedback">{errores.email}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor={`${prefijo}-telefono`} className="form-label">Teléfono</label>
        <input id={`${prefijo}-telefono`} name="telefono" type="tel" placeholder="+56912345678" className={clase('telefono')} value={form.telefono} onChange={onCambiar} onBlur={onSalir} />
        <div className="invalid-feedback">{errores.telefono}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor={`${prefijo}-cargo`} className="form-label">Cargo al que postula</label>
        <input id={`${prefijo}-cargo`} name="cargo" className={clase('cargo')} value={form.cargo} onChange={onCambiar} onBlur={onSalir} />
        <div className="invalid-feedback">{errores.cargo}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor={`${prefijo}-familia`} className="form-label">Familia de cargo</label>
        <select id={`${prefijo}-familia`} name="familiaCargo" className={clase('familiaCargo', 'form-select')} value={form.familiaCargo} onChange={onCambiar} onBlur={onSalir}>
          <option value="">Selecciona una familia</option>
          {FAMILIAS_CARGO.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <div className="invalid-feedback">{errores.familiaCargo}</div>
      </div>

      <div className="col-md-6">
        <label htmlFor={`${prefijo}-ubicacion`} className="form-label">Ubicación del cargo</label>
        <select id={`${prefijo}-ubicacion`} name="ubicacion" className="form-select" value={form.ubicacion} onChange={onCambiar}>
          <option value="">Sin definir</option>
          {UBICACIONES.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      <div className="col-md-6">
        <span className="form-label d-block">Origen del candidato</span>
        {ORIGENES.map((o) => (
          <div className="form-check form-check-inline" key={o}>
            <input className="form-check-input" type="radio" name="origen" id={`${prefijo}-origen-${o}`} value={o} checked={form.origen === o} onChange={onCambiar} />
            <label className="form-check-label" htmlFor={`${prefijo}-origen-${o}`}>{o}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
