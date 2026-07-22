const COLORES_POR_ESTADO = {
  BORRADOR: 'bg-secondary-container text-on-secondary-container',
  PENDIENTE_APROBACION: 'bg-advertencia-container text-advertencia',
  APROBADA: 'bg-exito-container text-exito',
  PUBLICADA: 'bg-exito-container text-exito',
  CERRADA: 'bg-secondary-container text-on-secondary-container',
  CANCELADA: 'bg-error-container text-on-error-container',
  ENVIADA: 'bg-primary-container text-on-primary',
  EN_REVISION_DOCUMENTAL: 'bg-advertencia-container text-advertencia',
  PENDIENTE_SUBSANACION: 'bg-advertencia-container text-advertencia',
  ELEGIBLE: 'bg-exito-container text-exito',
  NO_ELEGIBLE: 'bg-error-container text-on-error-container',
  EN_EVALUACION: 'bg-advertencia-container text-advertencia',
  EVALUADA: 'bg-primary-container text-on-primary',
  EN_COMITE: 'bg-primary-container text-on-primary',
  CONDICIONADA: 'bg-advertencia-container text-advertencia',
  LISTA_ESPERA: 'bg-secondary-container text-on-secondary-container',
  RECHAZADA: 'bg-error-container text-on-error-container',
  VALIDO: 'bg-exito-container text-exito',
  RECHAZADO: 'bg-error-container text-on-error-container',
  REQUIERE_SUBSANACION: 'bg-advertencia-container text-advertencia',
  PENDIENTE: 'bg-secondary-container text-on-secondary-container',
  ACTIVO: 'bg-exito-container text-exito',
  ACTIVA: 'bg-exito-container text-exito',
  ABIERTA: 'bg-exito-container text-exito',
  PROGRAMADA: 'bg-secondary-container text-on-secondary-container'
};

export default function EtiquetaEstado({ estado }) {
  const clase = COLORES_POR_ESTADO[estado] || 'bg-secondary-container text-on-secondary-container';
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-label-sm font-semibold ${clase}`}>
      {String(estado || '').replaceAll('_', ' ')}
    </span>
  );
}
