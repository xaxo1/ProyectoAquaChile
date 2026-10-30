import { useState } from 'react';
import { Link } from 'react-router-dom';
import CamposCandidato from '../../components/candidatos/CamposCandidato';
import { api } from '../../services/api';
import { CANDIDATO_VACIO } from '../../utils/candidatos';
import { tieneErrores, validarCandidato } from '../../utils/validaciones';

const VACIO = { ...CANDIDATO_VACIO, analista: '', observaciones: '' };

/**
 * Formulario público de solicitud de evaluación (reemplaza el Microsoft Forms).
 * No requiere sesión: crea el candidato y su solicitud en "Evaluación recibida".
 */
export default function PostulacionPublica() {
  const [form, setForm] = useState(VACIO);
  const [tocados, setTocados] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorApi, setErrorApi] = useState('');
  const [confirmacion, setConfirmacion] = useState(null);

  const errores = validarCandidato(form);
  if (!form.analista.trim()) errores.analista = 'Indica tu nombre como analista solicitante.';
  const mostrarError = (campo) => (enviado || tocados[campo]) && errores[campo];

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const marcar = (e) => setTocados({ ...tocados, [e.target.name]: true });

  const enviar = async (e) => {
    e.preventDefault();
    setEnviado(true);
    if (tieneErrores(errores)) return;

    setGuardando(true);
    setErrorApi('');
    try {
      const { candidato } = await api.enviarPostulacion(form);
      setConfirmacion(candidato.nombre);
      setForm(VACIO);
      setTocados({});
      setEnviado(false);
    } catch (err) {
      setErrorApi(err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (confirmacion) {
    return (
      <div className="aq-panel aq-formulario text-center py-5">
        <i className="bi bi-check-circle aq-icono-exito" aria-hidden="true" />
        <h1 className="h3 fw-bold mt-3">Solicitud enviada</h1>
        <p className="text-body-secondary mb-4">
          La evaluación de <strong>{confirmacion}</strong> quedó registrada y el equipo de evaluación ya puede verla en su panel.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => setConfirmacion(null)}>
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <div className="aq-formulario">
      <header className="mb-4">
        <h1 className="h2 fw-bold mb-1">Solicitud de evaluación psicolaboral</h1>
        <p className="text-body-secondary mb-0">
          Completa los datos del candidato. La solicitud llega directamente al equipo de evaluación.
        </p>
      </header>

      <form className="aq-panel" onSubmit={enviar} noValidate>
        {errorApi && <div className="alert alert-danger" role="alert">{errorApi}</div>}

        <h2 className="aq-panel__titulo">Datos del candidato</h2>
        <CamposCandidato form={form} errores={errores} mostrarError={mostrarError} onCambiar={cambiar} onSalir={marcar} prefijo="pub" />

        <h2 className="aq-panel__titulo mt-4">Datos de la solicitud</h2>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="pub-analista" className="form-label">Analista que solicita</label>
            <input
              id="pub-analista"
              name="analista"
              className={`form-control ${mostrarError('analista') ? 'is-invalid' : ''}`}
              value={form.analista}
              onChange={cambiar}
              onBlur={marcar}
            />
            <div className="invalid-feedback">{errores.analista}</div>
          </div>
          <div className="col-12">
            <label htmlFor="pub-observaciones" className="form-label">
              Observaciones <span className="text-body-secondary">(opcional)</span>
            </label>
            <textarea
              id="pub-observaciones"
              name="observaciones"
              rows="3"
              className="form-control"
              placeholder="Aspectos que el evaluador debería considerar"
              value={form.observaciones}
              onChange={cambiar}
            />
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-4">
          <Link to="/login" className="small">Soy del equipo, quiero iniciar sesión</Link>
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
}
