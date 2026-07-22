export function formatearFecha(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatearMoneda(valor) {
  if (valor === null || valor === undefined) return '—';
  return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(Number(valor));
}
