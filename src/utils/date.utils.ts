export const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
  }).format(new Date(fecha));
};

export const formatearFechaHora = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha));
};

export const formatearHora = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    timeStyle: 'short',
  }).format(new Date(fecha));
};
