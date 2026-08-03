import ListaConvocatoriasAdministrativas from '../administracion/ListaConvocatoriasAdministrativas.jsx';

/**
 * Vista de convocatorias y becas para Trabajo Social (tarea 21). Reutiliza
 * el mismo listado que Administración: los botones de crear/editar/aprobar
 * ya se ocultan automáticamente según los permisos de quien inicia sesión,
 * por lo que Trabajo Social ve la información en modo solo lectura salvo
 * que se le otorguen permisos adicionales de gestión.
 */
export default function ConvocatoriasBecas() {
  return <ListaConvocatoriasAdministrativas />;
}
