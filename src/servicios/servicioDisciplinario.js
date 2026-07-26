import { peticion } from './clienteHttp.js';

export const abrirInvestigacion = (idBecaActiva, datos) =>
  peticion(`/disciplinario/becas/${idBecaActiva}`, { metodo: 'POST', cuerpo: datos });

export const listarInvestigaciones = (filtros = {}) => {
  const parametros = new URLSearchParams(filtros).toString();
  return peticion(`/disciplinario${parametros ? `?${parametros}` : ''}`);
};

export const obtenerInvestigacion = (id) => peticion(`/disciplinario/${id}`);

export const presentarDescargo = (id, datos) =>
  peticion(`/disciplinario/${id}/descargos`, { metodo: 'POST', cuerpo: datos });

export const pasarAAnalisis = (id) =>
  peticion(`/disciplinario/${id}/analisis`, { metodo: 'POST' });

export const resolverInvestigacion = (id, datos) =>
  peticion(`/disciplinario/${id}/resolver`, { metodo: 'POST', cuerpo: datos });
