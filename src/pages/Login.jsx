import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tieneErrores, validarLogin } from '../utils/validaciones';

export default function Login() {
  const { autenticado, iniciarSesion, aviso } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [enviado, setEnviado] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorApi, setErrorApi] = useState('');

  if (autenticado) return <Navigate to="/" replace />;

  const errores = validarLogin(form);
  const mostrarError = (campo) => enviado && errores[campo];

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const ingresar = async (e) => {
    e.preventDefault();
    setEnviado(true);
    if (tieneErrores(errores)) return;

    setCargando(true);
    setErrorApi('');
    try {
      await iniciarSesion(form.email.trim(), form.password);
      navigate(location.state?.desde ?? '/', { replace: true });
    } catch (err) {
      setErrorApi(err.message);
      setCargando(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
        <div className="aq-panel aq-login">
          <h1 className="h3 fw-bold mb-1">Iniciar sesión</h1>
          <p className="text-body-secondary mb-4">
            Ingresa con tu cuenta de analista o evaluador.
          </p>

          {aviso && <div className="alert alert-warning py-2">{aviso}</div>}
          {errorApi && <div className="alert alert-danger py-2" role="alert">{errorApi}</div>}

          <form onSubmit={ingresar} noValidate>
            <div className="mb-3">
              <label htmlFor="login-email" className="form-label">Correo</label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="username"
                className={`form-control ${mostrarError('email') ? 'is-invalid' : ''}`}
                value={form.email}
                onChange={cambiar}
              />
              <div className="invalid-feedback">{errores.email}</div>
            </div>

            <div className="mb-4">
              <label htmlFor="login-password" className="form-label">Contraseña</label>
              <div className="input-group has-validation">
                <input
                  id="login-password"
                  name="password"
                  type={verPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`form-control ${mostrarError('password') ? 'is-invalid' : ''}`}
                  value={form.password}
                  onChange={cambiar}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setVerPassword((v) => !v)}
                >
                  <i className={`bi ${verPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
                <div className="invalid-feedback">{errores.password}</div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="text-center mt-3 small">
          ¿Necesitas solicitar una evaluación? <Link to="/postular">Ir al formulario público</Link>
        </p>
      </div>
    </div>
  );
}
