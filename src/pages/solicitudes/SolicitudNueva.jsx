import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import { Cargando } from '../../components/common/EstadoCarga';
import { FAMILIAS_CARGO, UBICACIONES } from '../../data/catalogos';
import { tieneErrores, validarSolicitud } from '../../utils/validaciones';

export default function SolicitudNueva() {
  const { candidatos, evaluadores, obtenerCandidato, crearSolicitud, cargando } = useData();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Si se viene desde la ficha de un candidato, ya queda seleccionado
  const inicial = () => {
    const candidato = obtenerCandidato(params.get('candidato'));
    return {
      candidatoId: candidato ? String(candidato.id) : '',
      cargo: candidato?.cargo ?? '',
      familiaCargo: candidato?.familiaCargo ?? '',
      ubicacion: candidato?.ubicacion ?? '',
      analista: usuario.rol === 'analista' ? usuario.nombre : '',
      responsableId: '',
      observaciones: '',
    };
  };

  const [form, setForm] = useState(inicial);
  const [enviado, setEnviado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorApi, setErrorApi] = useState('');

  if (cargando) return <Cargando />;

  const errores = validarSolicitud(form);
  const clase = (campo, base = 'form-control') => `${base} ${enviado && errores[campo] ? 'is-invalid' : ''}`;

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Al elegir un candidato se copian su cargo, familia y ubicación
  const elegirCandidato = (e) => {
    const candidato = obtenerCandidato(e.target.value);
    setForm({
      ...form,
      candidatoId: e.target.value,
      cargo: candidato?.cargo ?? '',
      familiaCargo: candidato?.familiaCargo ?? '',
      ubicacion: candidato?.ubicacion ?? '',
    });
  };

  const guardar = async (e) => {
    e.preventDefault();
    setEnviado(true);
    if (tieneErrores(errores)) return;

    setGuardando(true);
    setErrorApi('');
    try {
      const solicitud = await crearSolicitud({
        ...form,
        candidatoId: Number(form.candidatoId),
        responsableId: form.responsableId ? Number(form.responsableId) : null,
      });
      navigate(`/solicitudes/${solicitud.id}`, { state: { aviso: 'Solicitud creada en la etapa "Evaluación recibida".' } });
    } catch (err) {
      setErrorApi(err.message);
      setGuardando(false);
    }
  };

  return (
    <>
      <PageHeader titulo="Nueva solicitud" descripcion="Solicita la evaluación psicolaboral de un candidato registrado." />

      <form className="aq-panel aq-formulario" onSubmit={guardar} noValidate>
        {errorApi && <div className="alert alert-danger" role="alert">{errorApi}</div>}

        <div className="row g-3">
          <div className="col-12">
            <label htmlFor="sol-candidato" className="form-label">Candidato</label>
            <select id="sol-candidato" name="candidatoId" className={clase('candidatoId', 'form-select')} value={form.candidatoId} onChange={elegirCandidato}>
              <option value="">Selecciona un candidato</option>
              {candidatos.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.email})</option>)}
            </select>
            <div className="invalid-feedback">{errores.candidatoId}</div>
            <div className="form-text">
              ¿No está en la lista? <Link to="/candidatos/nuevo">Registra primero al candidato</Link>.
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="sol-cargo" className="form-label">Cargo</label>
            <input id="sol-cargo" name="cargo" className={clase('cargo')} value={form.cargo} onChange={cambiar} />
            <div className="invalid-feedback">{errores.cargo}</div>
          </div>

          <div className="col-md-6">
            <label htmlFor="sol-familia" className="form-label">Familia de cargo</label>
            <select id="sol-familia" name="familiaCargo" className={clase('familiaCargo', 'form-select')} value={form.familiaCargo} onChange={cambiar}>
              <option value="">Selecciona una familia</option>
              {FAMILIAS_CARGO.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <div className="invalid-feedback">{errores.familiaCargo}</div>
          </div>

          <div className="col-md-6">
            <label htmlFor="sol-ubicacion" className="form-label">Ubicación</label>
            <select id="sol-ubicacion" name="ubicacion" className="form-select" value={form.ubicacion} onChange={cambiar}>
              <option value="">Sin definir</option>
              {UBICACIONES.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="sol-analista" className="form-label">Analista que solicita</label>
            <input id="sol-analista" name="analista" className={clase('analista')} value={form.analista} onChange={cambiar} />
            <div className="invalid-feedback">{errores.analista}</div>
          </div>

          <div className="col-md-6">
            <label htmlFor="sol-responsable" className="form-label">Evaluador responsable</label>
            <select id="sol-responsable" name="responsableId" className="form-select" value={form.responsableId} onChange={cambiar}>
              <option value="">Asignar después</option>
              {evaluadores.map((ev) => <option key={ev.id} value={ev.id}>{ev.nombre}</option>)}
            </select>
          </div>

          <div className="col-12">
            <label htmlFor="sol-observaciones" className="form-label">
              Observaciones <span className="text-body-secondary">(opcional)</span>
            </label>
            <textarea id="sol-observaciones" name="observaciones" rows="3" className="form-control" value={form.observaciones} onChange={cambiar} />
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
          <Link to="/solicitudes" className="btn btn-outline-secondary">Cancelar</Link>
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Crear solicitud'}
          </button>
        </div>
      </form>
    </>
  );
}
