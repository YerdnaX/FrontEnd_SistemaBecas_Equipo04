import { peticion } from './clienteHttp.js';

export const listarExpedientes = (filtros = {}) => {
  const parametros = new URLSearchParams(filtros).toString();
  return peticion(`/expedientes${parametros ? `?${parametros}` : ''}`);
};
export const obtenerExpediente = (id) => peticion(`/expedientes/${id}`);
export const listarPeriodosExpedientes = () => peticion('/expedientes/periodos');
export const asignarExpediente = (id, idEmpleado) =>
  peticion(`/expedientes/${id}/asignar`, { metodo: 'POST', cuerpo: { idEmpleado } });
export const revisarDocumento = (id, idDocumento, datos) =>
  peticion(`/expedientes/${id}/documentos/${idDocumento}/revision`, { metodo: 'PUT', cuerpo: datos });
export const obtenerArchivoDocumentoExpediente = (id, idDocumento) =>
  peticion(`/expedientes/${id}/documentos/${idDocumento}/archivo`);
export const solicitarSubsanacion = (id, observacion) =>
  peticion(`/expedientes/${id}/solicitar-subsanacion`, { metodo: 'POST', cuerpo: { observacion } });
export const resolverElegibilidad = (id, datos) =>
  peticion(`/expedientes/${id}/elegibilidad`, { metodo: 'POST', cuerpo: datos });
export const obtenerEvaluacion = (id) => peticion(`/expedientes/${id}/evaluacion`);
export const guardarEvaluacionAutomatica = (id) =>
  peticion(`/expedientes/${id}/evaluacion/automatica`, { metodo: 'POST' });
export const obtenerInformeSocial = (id) => peticion(`/expedientes/${id}/informe-social`);
export const guardarInformeSocial = (id, datos) =>
  peticion(`/expedientes/${id}/informe-social`, { metodo: 'PUT', cuerpo: datos });
export const enviarComite = (id) => peticion(`/expedientes/${id}/enviar-comite`, { metodo: 'POST' });
