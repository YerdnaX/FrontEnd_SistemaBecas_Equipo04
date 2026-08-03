const ZONA_HORARIA_CR = 'America/Costa_Rica';

export function formatearFecha(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: ZONA_HORARIA_CR });
}

// Fecha + hora, siempre en horario de Costa Rica (zona fija), para que la
// hora mostrada no cambie según la zona horaria del navegador de quien
// consulta.
export function formatearFechaHora(valor) {
  if (!valor) return '—';
  return new Intl.DateTimeFormat('es-CR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: ZONA_HORARIA_CR
  }).format(new Date(valor));
}

export function formatearMoneda(valor) {
  if (valor === null || valor === undefined) return '—';
  return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(Number(valor));
}

/**
 * Estado temporal de una convocatoria a partir de sus fechas de apertura y
 * cierre (DATETIME2 con hora incluida): próxima, abierta o cerrada.
 */
export function estadoTemporalConvocatoria(fechaInicio, fechaFin, ahora = new Date()) {
  if (!fechaInicio || !fechaFin) return 'PROXIMA';
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  if (ahora < inicio) return 'PROXIMA';
  if (ahora > fin) return 'CERRADA';
  return 'ABIERTA';
}

const TAMANOS = ['B', 'KB', 'MB', 'GB'];

/**
 * Formatea un tamaño en bytes a un texto legible, ej. "2.4 MB".
 */
export function formatearTamanoArchivo(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes === 0) return '0 B';
  const indice = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), TAMANOS.length - 1);
  const valor = bytes / 1024 ** indice;
  return `${indice === 0 ? valor : valor.toFixed(1)} ${TAMANOS[indice]}`;
}
