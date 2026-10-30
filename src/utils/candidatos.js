// Filtros del listado de candidatos (función pura para poder probarla)
export function filtrarCandidatos(candidatos, { busqueda = '', familia = '', origen = '' } = {}) {
  const texto = busqueda.trim().toLowerCase();
  return candidatos.filter((c) => {
    if (familia && c.familiaCargo !== familia) return false;
    if (origen && c.origen !== origen) return false;
    if (texto && !`${c.nombre} ${c.email} ${c.cargo}`.toLowerCase().includes(texto)) return false;
    return true;
  });
}

export const CANDIDATO_VACIO = {
  nombre: '',
  email: '',
  telefono: '',
  cargo: '',
  familiaCargo: '',
  ubicacion: '',
  origen: 'Interno',
};
