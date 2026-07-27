import { peticion } from './clienteHttp.js';

const parametros = (filtros = {}) => {
  const cadena = new URLSearchParams(
    Object.entries(filtros).filter(([, valor]) => valor !== '' && valor !== undefined && valor !== null)
  ).toString();
  return cadena ? `?${cadena}` : '';
};

export const obtenerFormalizacion = (id) => peticion(`/solicitudes/${id}/formalizacion`);
export const aceptarFormalizacion = (id, datos) => peticion(`/solicitudes/${id}/formalizacion/aceptar`, { metodo: 'POST', cuerpo: datos });
export const obtenerConvenio = (id) => peticion(`/solicitudes/${id}/convenio`);
export const confirmarConvenio = (id) => peticion(`/solicitudes/${id}/convenio/confirmar`, { metodo: 'POST', cuerpo: {} });

export const obtenerBeneficio = (id) => peticion(`/beneficios/${id}`);
export const validarAcademicamente = (id, datos) => peticion(`/beneficios/${id}/validacion-academica`, { metodo: 'POST', cuerpo: datos });
export const activarFinancieramente = (id, datos) => peticion(`/beneficios/${id}/activacion-financiera`, { metodo: 'POST', cuerpo: datos });
export const verificarAplicacion = (id) => peticion(`/beneficios/${id}/verificar-aplicacion`, { metodo: 'POST' });

export const obtenerPanelBecado = () => peticion('/becado/panel');
export const obtenerExpedienteBecado = () => peticion('/becado/expediente');
export const actualizarExpedienteBecado = (datos) => peticion('/becado/expediente', { metodo: 'PUT', cuerpo: datos });
export const listarHistorialExpediente = () => peticion('/becado/expediente/historial');

export const listarVisitas = (idExpediente) => peticion(`/expedientes/${idExpediente}/visitas`);
export const programarVisita = (idExpediente, datos) => peticion(`/expedientes/${idExpediente}/visitas`, { metodo: 'POST', cuerpo: datos });
export const reprogramarVisita = (id, datos) => peticion(`/visitas/${id}`, { metodo: 'PUT', cuerpo: datos });
export const cancelarVisita = (id, datos) => peticion(`/visitas/${id}/cancelar`, { metodo: 'POST', cuerpo: datos });
export const registrarInformeVisita = (id, datos) => peticion(`/visitas/${id}/informe`, { metodo: 'POST', cuerpo: datos });

export const listarConsultas = () => peticion('/consultas');
export const crearConsulta = (datos) => peticion('/consultas', { metodo: 'POST', cuerpo: datos });
export const obtenerConsulta = (id) => peticion(`/consultas/${id}`);
export const responderConsulta = (id, mensaje) => peticion(`/consultas/${id}/mensajes`, { metodo: 'POST', cuerpo: { mensaje } });
export const listarBandejaConsultas = (filtros) => peticion(`/trabajo-social/consultas${parametros(filtros)}`);
export const asignarConsulta = (id) => peticion(`/trabajo-social/consultas/${id}/asignar`, { metodo: 'PUT' });
export const cambiarEstadoConsulta = (id, estado) => peticion(`/trabajo-social/consultas/${id}/estado`, { metodo: 'PUT', cuerpo: { estado } });

export const listarNoticias = () => peticion('/noticias');
export const crearNoticia = (datos) => peticion('/noticias', { metodo: 'POST', cuerpo: datos });
export const actualizarNoticia = (id, datos) => peticion(`/noticias/${id}`, { metodo: 'PUT', cuerpo: datos });
export const cambiarEstadoNoticia = (id, estado) => peticion(`/noticias/${id}/estado`, { metodo: 'PATCH', cuerpo: { estado } });

export const listarSeguimientos = (id) => peticion(`/becarios/${id}/seguimientos`);
export const crearSeguimiento = (id, datos) => peticion(`/becarios/${id}/seguimientos`, { metodo: 'POST', cuerpo: datos });
export const registrarRendimiento = (id, datos) => peticion(`/becarios/${id}/rendimientos`, { metodo: 'POST', cuerpo: datos });
export const listarAlertas = (id) => peticion(`/becarios/${id}/alertas`);
export const crearAlerta = (id, datos) => peticion(`/becarios/${id}/alertas`, { metodo: 'POST', cuerpo: datos });
export const cerrarAlerta = (id, observacion) => peticion(`/alertas/${id}/cerrar`, { metodo: 'PUT', cuerpo: { observacion } });

export const listarJustificaciones = () => peticion('/becado/justificaciones');
export const crearJustificacion = (datos) => peticion('/becado/justificaciones', { metodo: 'POST', cuerpo: datos });
export const obtenerJustificacion = (id) => peticion(`/justificaciones/${id}`);
export const resolverJustificacion = (id, datos) => peticion(`/justificaciones/${id}/resolver`, { metodo: 'PUT', cuerpo: datos });

export const disponibilidadRenovacion = () => peticion('/becado/renovaciones/disponibilidad');
export const obtenerRenovacion = (id) => peticion(`/becado/renovaciones/${id}`);
export const crearRenovacion = (datos) => peticion('/becado/renovaciones', { metodo: 'POST', cuerpo: datos });
export const actualizarRenovacion = (id, datos) => peticion(`/becado/renovaciones/${id}`, { metodo: 'PUT', cuerpo: datos });
export const agregarDocumentoRenovacion = (id, datos) => peticion(`/becado/renovaciones/${id}/documentos`, { metodo: 'POST', cuerpo: datos });
export const listarRenovacionesTrabajoSocial = (filtros) => peticion(`/trabajo-social/renovaciones${parametros(filtros)}`);
export const evaluarRenovacion = (id, datos) => peticion(`/trabajo-social/renovaciones/${id}/evaluar`, { metodo: 'PUT', cuerpo: datos });
export const resolverRenovacion = (id, datos) => peticion(`/trabajo-social/renovaciones/${id}/resolver`, { metodo: 'PUT', cuerpo: datos });

export const obtenerIndicadores = (filtros) => peticion(`/reportes/indicadores${parametros(filtros)}`);
export const listarBecasReporte = (filtros) => peticion(`/reportes/becas${parametros(filtros)}`);
export const listarRenovacionesReporte = () => peticion('/reportes/renovaciones');
export const listarActas = () => peticion('/comite/actas');
export const obtenerActa = (id) => peticion(`/comite/actas/${id}`);
export const generarDocumentoActa = (id) => peticion(`/comite/actas/${id}/generar-documento`, { metodo: 'POST' });

export const listarUsuarios = (filtros) => peticion(`/usuarios${parametros(filtros)}`);
export const obtenerUsuario = (id) => peticion(`/usuarios/${id}`);
export const crearUsuario = (datos) => peticion('/usuarios', { metodo: 'POST', cuerpo: datos });
export const actualizarUsuario = (id, datos) => peticion(`/usuarios/${id}`, { metodo: 'PUT', cuerpo: datos });
export const cambiarEstadoUsuario = (id, estado) => peticion(`/usuarios/${id}/estado`, { metodo: 'PATCH', cuerpo: { estado } });
export const asignarRolesUsuario = (id, idsRoles) => peticion(`/usuarios/${id}/roles`, { metodo: 'PUT', cuerpo: { idsRoles } });
export const listarRoles = () => peticion('/roles');
export const crearRol = (datos) => peticion('/roles', { metodo: 'POST', cuerpo: datos });
export const actualizarRol = (id, datos) => peticion(`/roles/${id}`, { metodo: 'PUT', cuerpo: datos });
export const listarPermisos = () => peticion('/permisos');
export const asignarPermisosRol = (id, idsPermisos) => peticion(`/roles/${id}/permisos`, { metodo: 'PUT', cuerpo: { idsPermisos } });
export const listarEmpleados = () => peticion('/empleados');
export const obtenerCatalogosPersonal = () => peticion('/empleados/catalogos');
export const crearEmpleado = (datos) => peticion('/empleados', { metodo: 'POST', cuerpo: datos });
export const actualizarEmpleado = (id, datos) => peticion(`/empleados/${id}`, { metodo: 'PUT', cuerpo: datos });
export const cambiarEstadoEmpleado = (id, activo) => peticion(`/empleados/${id}/estado`, { metodo: 'PATCH', cuerpo: { activo } });
export const listarMiembrosComite = () => peticion('/comite/miembros');
export const crearMiembroComite = (datos) => peticion('/comite/miembros', { metodo: 'POST', cuerpo: datos });
export const eliminarMiembroComite = (id) => peticion(`/comite/miembros/${id}`, { metodo: 'DELETE' });

