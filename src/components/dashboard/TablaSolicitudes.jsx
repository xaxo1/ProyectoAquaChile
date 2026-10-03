import { Link } from 'react-router-dom';
import EtapaBadge from '../common/EtapaBadge';
import ResultadoBadge from '../common/ResultadoBadge';
import { formatearFecha } from '../../utils/formatters';

/**
 * Tabla con el seguimiento de cada solicitud.
 * Props: filas (resultado de construirFilas + filtrarFilas)
 */
export default function TablaSolicitudes({ filas }) {
  if (!filas.length) {
    return (
      <div className="aq-vacio aq-vacio--compacto">
        <i className="bi bi-funnel" aria-hidden="true" />
        <p>Ninguna solicitud coincide con los filtros. Prueba con otra etapa o limpia la búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table aq-tabla align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Candidato</th>
            <th scope="col" className="d-none d-lg-table-cell">Familia</th>
            <th scope="col" className="d-none d-md-table-cell">Responsable</th>
            <th scope="col">Etapa</th>
            <th scope="col" className="text-end d-none d-sm-table-cell">Días</th>
            <th scope="col" className="d-none d-xl-table-cell">Resultado</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.id}>
              <td>
                <Link to={`/solicitudes/${f.id}`} className="aq-tabla__nombre">{f.nombre}</Link>
                <span className="aq-tabla__sub">
                  {f.cargo}, {f.ubicacion}. Solicitada el {formatearFecha(f.fechaSolicitud)}
                </span>
              </td>
              <td className="d-none d-lg-table-cell">{f.familiaCargo}</td>
              <td className="d-none d-md-table-cell">
                {f.sinResponsable ? <span className="aq-alerta-texto">Sin asignar</span> : f.responsable}
              </td>
              <td><EtapaBadge etapaId={f.etapa} /></td>
              <td className="text-end d-none d-sm-table-cell aq-num">{f.dias}</td>
              <td className="d-none d-xl-table-cell"><ResultadoBadge resultado={f.resultado} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
