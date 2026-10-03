import { FAMILIAS_CARGO } from '../../data/mockData';

/**
 * Búsqueda por texto y filtro por familia de cargo.
 * Componente controlado: el estado vive en el Dashboard.
 * Props: busqueda, familia, onBusqueda(fn), onFamilia(fn), onLimpiar(fn), hayFiltros(bool)
 */
export default function FiltrosDashboard({ busqueda, familia, onBusqueda, onFamilia, onLimpiar, hayFiltros }) {
  return (
    <div className="row g-2 align-items-center mb-3">
      <div className="col-12 col-md-6">
        <label htmlFor="buscar" className="visually-hidden">Buscar</label>
        <div className="input-group">
          <span className="input-group-text"><i className="bi bi-search" aria-hidden="true" /></span>
          <input
            id="buscar"
            type="search"
            className="form-control"
            placeholder="Buscar por candidato, cargo o responsable"
            value={busqueda}
            onChange={(e) => onBusqueda(e.target.value)}
          />
        </div>
      </div>
      <div className="col-8 col-md-4">
        <label htmlFor="familia" className="visually-hidden">Familia de cargo</label>
        <select id="familia" className="form-select" value={familia} onChange={(e) => onFamilia(e.target.value)}>
          <option value="">Todas las familias</option>
          {FAMILIAS_CARGO.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <div className="col-4 col-md-2 d-grid">
        <button type="button" className="btn btn-outline-secondary" onClick={onLimpiar} disabled={!hayFiltros}>
          Limpiar
        </button>
      </div>
    </div>
  );
}
