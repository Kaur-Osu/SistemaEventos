// Centraliza todas las transformaciones de datos para no repetirlas en cada componente

export const formatFecha = (iso) =>
  new Date(iso).toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

export const formatFechaCorta = (iso) =>
  new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

export const formatHora = (iso) =>
  new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });

export const formatMoneda = (cantidad) =>
  Number(cantidad).toLocaleString('es-MX', { minimumFractionDigits: 2 });

export const formatMonedaCompacto = (cantidad) =>
  `$${Number(cantidad).toLocaleString('es-MX')}`;