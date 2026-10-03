import { useEffect, useRef, useState } from 'react';
import { useData } from '../../context/DataContext';
import { ANALISTAS, EVALUADORES, FAMILIAS_CARGO, ORIGENES, UBICACIONES } from '../../data/mockData';
import { tieneErrores, validarCandidato } from '../../utils/validaciones';

const VACIO = {
  nombre: '',
  email: '',
  telefono: '',
  cargo: '',
  familiaCargo: '',
  ubicacion: '',
  origen: 'Interno',
  crearSolicitud: true,
  analista: ANALISTAS[0],
  responsableId: '',
};

/**
 * Registro rápido de un candidato desde el panel (acuerdo de clase, punto 3).
 * Opcionalmente crea su solicitud de evaluación en la etapa "Evaluación recibida".
 * Props: abierto (bool), onCerrar(fn), onRegistrado(fn(mensaje))
 */
export default function ModalRegistroRapido({ abierto, onCerrar, onRegistrado }) {
  const { agregarCandidato, crearSolicitud } = useData();
  const [form, setForm] = useState(VACIO);
  const [tocados, setTocados] = useState({});
  const [enviado, setEnviado] = useState(false);
  const primerCampo = useRef(null);

  const errores = validarCandidato(form);
  const mostrarError = (campo) => (enviado || tocados[campo]) && errores[campo];

  // Al abrir: limpia el formulario y enfoca el primer campo. Escape cierra.
  useEffect(() => {
    if (!abierto) return undefined;
    setForm(VACIO);
    setTocados({});
    setEnviado(false);
    primerCampo.current?.focus();
    const alPresionar = (e) => e.key === 'Escape' && onCerrar();
    document.addEventListener('keydown', alPresionar);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', alPresionar);
      document.body.classList.remove('modal-open');
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  const marcar = (e) => setTocados((t) => ({ ...t, [e.target.name]: true }));

  const guardar = (e) => {
    e.preventDefault();
    setEnviado(true);
    if (tieneErrores(errores)) return;

    const { crearSolicitud: conSolicitud, analista, responsableId, ...datosCandidato } = form;
    const candidato = agregarCandidato({
      ...datosCandidato,
      nombre: datosCandidato.nombre.trim(),
      email: datosCandidato.email.trim().toLowerCase(),
      telefono: datosCandidato.telefono.replace(/\s/g, ''),
    });

    if (conSolicitud) {
      crearSolicitud({
        candidatoId: candidato.id,
        cargo: candidato.cargo,
        familiaCargo: candidato.familiaCargo,
        ubicacion: candidato.ubicacion,
        analista,
        responsableId,
      });
    }

    onRegistrado(
      conSolicitud
        ? `${candidato.nombre} quedó registrado con su solicitud en "Evaluación recibida".`
        : `${candidato.nombre} quedó registrado.`
    );
  };

  const clase = (campo) => `form-control ${mostrarError(campo) ? 'is-invalid' : ''}`;
  const claseSelect = (campo) => `form-select ${mostrarError(campo) ? 'is-invalid' : ''}`;

  return (
    <>
      <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="titulo-registro" onClick={onCerrar}>
        <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down" onClick={(e) => e.stopPropagation()}>
          <form className="modal-content" onSubmit={guardar} noValidate>
            <div className="modal-header">
              <h2 className="modal-title h5" id="titulo-registro">Registrar candidato</h2>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar} />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="rr-nombre" className="form-label">Nombre completo</label>
                  <input ref={primerCampo} id="rr-nombre" name="nombre" className={clase('nombre')} value={form.nombre} onChange={cambiar} onBlur={marcar} />
                  <div className="invalid-feedback">{errores.nombre}</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="rr-email" className="form-label">Correo electrónico</label>
                  <input id="rr-email" name="email" type="email" className={clase('email')} value={form.email} onChange={cambiar} onBlur={marcar} />
                  <div className="invalid-feedback">{errores.email}</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="rr-telefono" className="form-label">Teléfono</label>
                  <input id="rr-telefono" name="telefono" type="tel" placeholder="+56912345678" className={clase('telefono')} value={form.telefono} onChange={cambiar} onBlur={marcar} />
                  <div className="invalid-feedback">{errores.telefono}</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="rr-cargo" className="form-label">Cargo al que postula</label>
                  <input id="rr-cargo" name="cargo" className={clase('cargo')} value={form.cargo} onChange={cambiar} onBlur={marcar} />
                  <div className="invalid-feedback">{errores.cargo}</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="rr-familia" className="form-label">Familia de cargo</label>
                  <select id="rr-familia" name="familiaCargo" className={claseSelect('familiaCargo')} value={form.familiaCargo} onChange={cambiar} onBlur={marcar}>
                    <option value="">Selecciona una familia</option>
                    {FAMILIAS_CARGO.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <div className="invalid-feedback">{errores.familiaCargo}</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="rr-ubicacion" className="form-label">Ubicación del cargo</label>
                  <select id="rr-ubicacion" name="ubicacion" className="form-select" value={form.ubicacion} onChange={cambiar}>
                    <option value="">Sin definir</option>
                    {UBICACIONES.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                <div className="col-md-6">
                  <span className="form-label d-block">Origen del candidato</span>
                  {ORIGENES.map((o) => (
                    <div className="form-check form-check-inline" key={o}>
                      <input className="form-check-input" type="radio" name="origen" id={`rr-origen-${o}`} value={o} checked={form.origen === o} onChange={cambiar} />
                      <label className="form-check-label" htmlFor={`rr-origen-${o}`}>{o}</label>
                    </div>
                  ))}
                </div>

                <div className="col-12">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="rr-solicitud" name="crearSolicitud" checked={form.crearSolicitud} onChange={cambiar} />
                    <label className="form-check-label" htmlFor="rr-solicitud">Crear también la solicitud de evaluación psicolaboral</label>
                  </div>
                </div>

                {form.crearSolicitud && (
                  <>
                    <div className="col-md-6">
                      <label htmlFor="rr-analista" className="form-label">Analista que solicita</label>
                      <select id="rr-analista" name="analista" className="form-select" value={form.analista} onChange={cambiar}>
                        {ANALISTAS.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="rr-responsable" className="form-label">Evaluador responsable</label>
                      <select id="rr-responsable" name="responsableId" className="form-select" value={form.responsableId} onChange={cambiar}>
                        <option value="">Asignar después</option>
                        {EVALUADORES.map((ev) => <option key={ev.id} value={ev.id}>{ev.nombre}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Registrar candidato</button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}
