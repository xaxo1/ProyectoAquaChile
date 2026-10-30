import { useEffect, useState } from 'react';

/** Mensaje de confirmación después de guardar. Props: mensaje (string) */
export default function AvisoExito({ mensaje }) {
  const [visible, setVisible] = useState(Boolean(mensaje));

  useEffect(() => setVisible(Boolean(mensaje)), [mensaje]);

  if (!visible) return null;
  return (
    <div className="alert alert-success d-flex align-items-start" role="status">
      <i className="bi bi-check-circle me-2 mt-1" aria-hidden="true" />
      <span className="flex-grow-1">{mensaje}</span>
      <button type="button" className="btn-close" aria-label="Cerrar aviso" onClick={() => setVisible(false)} />
    </div>
  );
}
