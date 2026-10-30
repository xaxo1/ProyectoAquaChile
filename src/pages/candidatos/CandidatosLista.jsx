import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import PageHeader from '../../components/common/PageHeader';
import EtapaBadge from '../../components/common/EtapaBadge';
import { Cargando, ErrorCarga } from '../../components/common/EstadoCarga';
import { FAMILIAS_CARGO, ORIGENES } from '../../data/catalogos';
import { formatearFecha } from '../../utils/formatters';
import { filtrarCandidatos } from '../../utils/candidatos';

export default function CandidatosLista() {
  const { candidatos, solicitudes, cargando, error, cargarDatos } = useData();
  const [busqueda, setBusqueda] = useState('');
  const [familia, setFamilia] = useState('');
  const [origen, setOrigen] = useState('');

  const filtrados = useMemo(
    () => filtrarCandidatos(candidatos, { busqueda, familia, origen }),
    [candidatos, busqueda, familia, origen]
  );

  if (cargando) return <Cargando texto="Cargando candidatos..." />;
  if (error) return <ErrorCarga mensaje={error} onReintentar={cargarDatos} />;

  // Etapa de la solicitud más reciente de cada candidato
  const ultimaEtapa = (candidatoId) =>
    solicitudes.find((s) => s.candidatoId === candidatoId)?.etapa;

  return (
    <>
      <PageHeader titulo="Candidatos" descripcion="Personas registradas para una evaluación psicolaboral.">
        <Link to="/candidatos/nuevo" className="btn btn-primary">
          <i className="bi bi-person-plus me-2" aria-hidden="true" />
          Nuevo candidato
        </Link>
      </PageHeader>

      <section className="aq-panel">
        <div className="row g-2 mb-3">
          <div className="col-12 col-md-6">
            <label htmlFor="buscar-candidato" className="visually-hidden">Buscar candidato</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-search" aria-hidden="true" /></span>
              <input
                id="buscar-candidato"
                type="search"
                className="form-control"
                placeholder="Buscar por nombre, correo o cargo"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div className="col-6 col-md-3">
            <select className="form-select" aria-label="Familia de cargo" value={familia} onChange={(e) => setFamilia(e.target.value)}>
              <option value="">Todas las familias</option>
              {FAMILIAS_CARGO.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select className="form-select" aria-label="Origen" value={origen} onChange={(e) => setOrigen(e.target.value)}>
              <option value="">Interno y externo</option>
              {ORIGENES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <p className="text-body-secondary small mb-2">{filtrados.length} de {candidatos.length} candidatos</p>

        {filtrados.length === 0 ? (
          <div className="aq-vacio aq-vacio--compacto">
            <i className="bi bi-person-x" aria-hidden="true" />
            <p>No hay candidatos que coincidan con la búsqueda.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table aq-tabla align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Candidato</th>
                  <th scope="col" className="d-none d-md-table-cell">Familia</th>
                  <th scope="col" className="d-none d-lg-table-cell">Origen</th>
                  <th scope="col" className="d-none d-sm-table-cell">Registro</th>
                  <th scope="col">Última etapa</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link to={`/candidatos/${c.id}`} className="aq-tabla__nombre">{c.nombre}</Link>
                      <span className="aq-tabla__sub">{c.cargo} · {c.email}</span>
                    </td>
                    <td className="d-none d-md-table-cell">{c.familiaCargo}</td>
                    <td className="d-none d-lg-table-cell">{c.origen}</td>
                    <td className="d-none d-sm-table-cell aq-num">{formatearFecha(c.fechaRegistro)}</td>
                    <td>
                      {ultimaEtapa(c.id)
                        ? <EtapaBadge etapaId={ultimaEtapa(c.id)} />
                        : <span className="text-body-secondary small">Sin solicitud</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
