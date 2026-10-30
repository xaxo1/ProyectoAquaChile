import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import PageHeader from '../../components/common/PageHeader';
import NoEncontrado from '../../components/common/NoEncontrado';
import { Cargando } from '../../components/common/EstadoCarga';
import CamposCandidato from '../../components/candidatos/CamposCandidato';
import { CANDIDATO_VACIO } from '../../utils/candidatos';
import { tieneErrores, validarCandidato } from '../../utils/validaciones';

// Se usa para registrar (/candidatos/nuevo) y para editar (/candidatos/:id/editar)
export default function CandidatoFormPage() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();
  const { obtenerCandidato, agregarCandidato, actualizarCandidato, cargando } = useData();
  const candidato = esEdicion ? obtenerCandidato(id) : null;

  const [form, setForm] = useState(CANDIDATO_VACIO);
  const [tocados, setTocados] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorApi, setErrorApi] = useState('');

  // Al editar, el formulario parte con los datos actuales del candidato
  useEffect(() => {
    if (candidato) {
      const { id: _id, fechaRegistro, ...datos } = candidato;
      setForm(datos);
    }
  }, [candidato]);

  if (cargando) return <Cargando />;
  if (esEdicion && !candidato) return <NoEncontrado />;

  const errores = validarCandidato(form);
  const mostrarError = (campo) => (enviado || tocados[campo]) && errores[campo];

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const marcar = (e) => setTocados({ ...tocados, [e.target.name]: true });

  const guardar = async (e) => {
    e.preventDefault();
    setEnviado(true);
    if (tieneErrores(errores)) return;

    setGuardando(true);
    setErrorApi('');
    try {
      const guardado = esEdicion ? await actualizarCandidato(id, form) : await agregarCandidato(form);
      navigate(`/candidatos/${guardado.id}`, {
        state: { aviso: esEdicion ? 'Los cambios se guardaron correctamente.' : 'Candidato registrado correctamente.' },
      });
    } catch (err) {
      setErrorApi(err.message);
      setGuardando(false);
    }
  };

  const volver = esEdicion ? `/candidatos/${id}` : '/candidatos';

  return (
    <>
      <PageHeader
        titulo={esEdicion ? 'Editar candidato' : 'Nuevo candidato'}
        descripcion={esEdicion ? candidato.nombre : 'Registra los datos principales del candidato.'}
      />

      <form className="aq-panel aq-formulario" onSubmit={guardar} noValidate>
        {errorApi && <div className="alert alert-danger" role="alert">{errorApi}</div>}

        <CamposCandidato form={form} errores={errores} mostrarError={mostrarError} onCambiar={cambiar} onSalir={marcar} />

        <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
          <Link to={volver} className="btn btn-outline-secondary">Cancelar</Link>
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Registrar candidato'}
          </button>
        </div>
      </form>
    </>
  );
}
