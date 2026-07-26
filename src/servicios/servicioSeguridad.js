import { peticion } from './clienteHttp.js';

export const listarMisSesiones = () => peticion('/seguridad/mis-sesiones');
export const revocarMiSesion = (id) => peticion(`/seguridad/mis-sesiones/${id}`, { metodo: 'DELETE' });

export const listarAuditoria = (filtros = {}) => {
  const parametros = new URLSearchParams(filtros).toString();
  return peticion(`/seguridad/auditoria${parametros ? `?${parametros}` : ''}`);
};

export const listarEventosSeguridad = (filtros = {}) => {
  const parametros = new URLSearchParams(filtros).toString();
  return peticion(`/seguridad/eventos${parametros ? `?${parametros}` : ''}`);
};

export const listarSesionesActivas = () => peticion('/seguridad/sesiones');
export const revocarSesionAdmin = (id) => peticion(`/seguridad/sesiones/${id}`, { metodo: 'DELETE' });
