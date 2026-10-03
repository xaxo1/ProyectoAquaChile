/**
 * Encabezado estándar de cada vista.
 * Props: titulo, descripcion (opcional), children (botones de acción).
 */
export default function PageHeader({ titulo, descripcion, children }) {
  return (
    <header className="aq-page-header">
      <div>
        <h1>{titulo}</h1>
        {descripcion && <p>{descripcion}</p>}
      </div>
      {children && <div className="aq-page-header__acciones">{children}</div>}
    </header>
  );
}
