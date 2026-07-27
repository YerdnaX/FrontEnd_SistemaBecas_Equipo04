import { peticion } from './clienteHttp.js';

export const presentarApelacion = (idResolucion, datos) =>
  peticion(`/apelaciones/resoluciones/${idResolucion}`, { metodo: 'POST', cuerpo: datos });

export const listarApelaciones = (filtros = {}) => {
  const parametros = new URLSearchParams(filtros).toString();
  return peticion(`/apelaciones${parametros ? `?${parametros}` : ''}`);
};

export const obtenerApelacion = (id) => peticion(`/apelaciones/${id}`);

export const asignarRevisorApelacion = (id, idRevisor) =>
  peticion(`/apelaciones/${id}/asignar`, { metodo: 'POST', cuerpo: { idRevisor } });

export const resolverApelacion = (id, datos) =>
  peticion(`/apelaciones/${id}/resolver`, { metodo: 'POST', cuerpo: datos });
