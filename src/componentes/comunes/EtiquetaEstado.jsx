const COLORES_POR_ESTADO = {
  BORRADOR: 'bg-secondary-container text-on-secondary-container',
  PENDIENTE_APROBACION: 'bg-advertencia-container text-advertencia',
  APROBADA: 'bg-exito-container text-exito',
  PUBLICADA: 'bg-exito-container text-exito',
  CERRADA: 'bg-secondary-container text-on-secondary-container',
  CANCELADA: 'bg-error-container text-on-error-container',
  ENVIADA: 'bg-primary-container text-on-primary-container',
  EN_REVISION_DOCUMENTAL: 'bg-advertencia-container text-advertencia',
  PENDIENTE_SUBSANACION: 'bg-advertencia-container text-advertencia',
  ELEGIBLE: 'bg-exito-container text-exito',
  NO_ELEGIBLE: 'bg-error-container text-on-error-container',
  EN_EVALUACION: 'bg-advertencia-container text-advertencia',
  EVALUADA: 'bg-primary-container text-on-primary-container',
  EN_COMITE: 'bg-primary-container text-on-primary-container',
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

const CLASE_POR_DEFECTO = 'bg-secondary-container text-on-secondary-container';

/**
 * Fuente única de color por estado. La usa EtiquetaEstado directamente y
 * también componentes que necesitan agrupar varios estados crudos bajo una
 * etiqueta propia (p. ej. PasosSolicitud), para no mantener un segundo mapa
 * de colores que pueda desalinearse de este.
 */
export function obtenerClaseEstado(estado) {
  return COLORES_POR_ESTADO[estado] || CLASE_POR_DEFECTO;
}

export default function EtiquetaEstado({ estado }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-label-sm font-semibold ${obtenerClaseEstado(estado)}`}>
      {String(estado || '').replaceAll('_', ' ')}
    </span>
  );
}
