import { peticion } from './clienteHttp.js';

export const listarExpedientes = (filtros = {}) => {
  const parametros = new URLSearchParams(filtros).toString();
  return peticion(`/expedientes${parametros ? `?${parametros}` : ''}`);
};
export const obtenerExpediente = (id) => peticion(`/expedientes/${id}`);
export const asignarExpediente = (id, idEmpleado) =>
  peticion(`/expedientes/${id}/asignar`, { metodo: 'POST', cuerpo: { idEmpleado } });
export const revisarDocumento = (id, idDocumento, datos) =>
  peticion(`/expedientes/${id}/documentos/${idDocumento}/revision`, { metodo: 'PUT', cuerpo: datos });
export const solicitarSubsanacion = (id, observacion) =>
  peticion(`/expedientes/${id}/solicitar-subsanacion`, { metodo: 'POST', cuerpo: { observacion } });
export const resolverElegibilidad = (id, datos) =>
  peticion(`/expedientes/${id}/elegibilidad`, { metodo: 'POST', cuerpo: datos });
export const obtenerEvaluacion = (id) => peticion(`/expedientes/${id}/evaluacion`);
export const guardarEvaluacion = (id, puntajes) =>
  peticion(`/expedientes/${id}/evaluacion`, { metodo: 'POST', cuerpo: { puntajes } });
export const enviarComite = (id) => peticion(`/expedientes/${id}/enviar-comite`, { metodo: 'POST' });
