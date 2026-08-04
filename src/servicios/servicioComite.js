import { peticion } from './clienteHttp.js';

export const listarExpedientesDisponibles = (idConvocatoria) =>
  peticion(`/comite/expedientes${idConvocatoria ? `?idConvocatoria=${idConvocatoria}` : ''}`);
export const crearSesion = (datos) => peticion('/comite/sesiones', { metodo: 'POST', cuerpo: datos });
export const obtenerSesion = (id) => peticion(`/comite/sesiones/${id}`);
export const registrarVoto = (id, idExpediente, datos) =>
  peticion(`/comite/sesiones/${id}/casos/${idExpediente}/voto`, { metodo: 'POST', cuerpo: datos });
export const cerrarSesion = (id) => peticion(`/comite/sesiones/${id}/cerrar`, { metodo: 'POST' });
