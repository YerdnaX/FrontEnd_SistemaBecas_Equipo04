import { peticion } from './clienteHttp.js';

export const obtenerPanelAspirante = () => peticion('/aspirante/panel');
export const crearSolicitud = (idConvocatoria) => peticion('/solicitudes', { metodo: 'POST', cuerpo: { idConvocatoria } });
export const obtenerSolicitud = (id) => peticion(`/solicitudes/${id}`);
export const guardarDatosPersonales = (id, datos) =>
  peticion(`/solicitudes/${id}/datos-personales`, { metodo: 'PUT', cuerpo: datos });
export const guardarDatosAcademicos = (id, datos) =>
  peticion(`/solicitudes/${id}/datos-academicos`, { metodo: 'PUT', cuerpo: datos });
export const guardarDatosSocioeconomicos = (id, datos) =>
  peticion(`/solicitudes/${id}/datos-socioeconomicos`, { metodo: 'PUT', cuerpo: datos });
export const obtenerNotasSimuladas = (id) => peticion(`/solicitudes/${id}/notas-simuladas`);
export const guardarNotasSimuladas = (id, datos) =>
  peticion(`/solicitudes/${id}/notas-simuladas`, { metodo: 'PUT', cuerpo: datos });
export const listarDocumentos = (id) => peticion(`/solicitudes/${id}/documentos`);
export const cargarDocumento = (id, datos) => peticion(`/solicitudes/${id}/documentos`, { metodo: 'POST', cuerpo: datos });
export const eliminarDocumento = (id, idDocumento) =>
  peticion(`/solicitudes/${id}/documentos/${idDocumento}`, { metodo: 'DELETE' });
export const obtenerArchivoDocumento = (id, idDocumento) =>
  peticion(`/solicitudes/${id}/documentos/${idDocumento}/archivo`);
export const validarSolicitud = (id) => peticion(`/solicitudes/${id}/validacion`);
export const enviarSolicitud = (id) => peticion(`/solicitudes/${id}/enviar`, { metodo: 'POST' });
export const obtenerResultado = (id) => peticion(`/solicitudes/${id}/resultado`);
