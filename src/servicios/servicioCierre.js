import { peticion } from './clienteHttp.js';

export const verificarCierre = (idExpediente) => peticion(`/expedientes/${idExpediente}/cierre`);

export const cerrarExpediente = (idExpediente, datos) =>
  peticion(`/expedientes/${idExpediente}/cierre`, { metodo: 'POST', cuerpo: datos });
