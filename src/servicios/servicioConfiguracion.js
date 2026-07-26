import { peticion } from './clienteHttp.js';

export const obtenerEstadoCorreo = () => peticion('/configuracion/correo');
export const actualizarNombreRemitente = (nombreRemitente) =>
  peticion('/configuracion/correo', { metodo: 'PUT', cuerpo: { nombreRemitente } });
export const reintentarCorreosFallidos = () =>
  peticion('/configuracion/correo/reintentar', { metodo: 'POST' });

export const listarPlantillas = () => peticion('/configuracion/plantillas');
export const crearPlantilla = (datos) => peticion('/configuracion/plantillas', { metodo: 'POST', cuerpo: datos });
export const actualizarPlantilla = (codigo, datos) =>
  peticion(`/configuracion/plantillas/${codigo}`, { metodo: 'PUT', cuerpo: datos });
export const previsualizarPlantilla = (codigo, variables) =>
  peticion(`/configuracion/plantillas/${codigo}/vista-previa`, { metodo: 'POST', cuerpo: { variables } });

export const listarParametros = () => peticion('/configuracion/parametros');
export const actualizarParametro = (clave, valor) =>
  peticion(`/configuracion/parametros/${clave}`, { metodo: 'PUT', cuerpo: { valor } });

export const listarTiposDocumento = () => peticion('/configuracion/catalogos/tipos-documento');
export const crearTipoDocumento = (datos) =>
  peticion('/configuracion/catalogos/tipos-documento', { metodo: 'POST', cuerpo: datos });
export const actualizarTipoDocumento = (id, datos) =>
  peticion(`/configuracion/catalogos/tipos-documento/${id}`, { metodo: 'PUT', cuerpo: datos });
