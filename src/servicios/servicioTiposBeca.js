import { peticion } from './clienteHttp.js';

export const listarTiposBeca = (soloActivos = false) =>
  peticion(`/tipos-beca${soloActivos ? '?activos=true' : ''}`);
export const obtenerTipoBeca = (id) => peticion(`/tipos-beca/${id}`);
export const crearTipoBeca = (datos) => peticion('/tipos-beca', { metodo: 'POST', cuerpo: datos });
export const actualizarTipoBeca = (id, datos) => peticion(`/tipos-beca/${id}`, { metodo: 'PUT', cuerpo: datos });
export const cambiarEstadoTipoBeca = (id, activo) =>
  peticion(`/tipos-beca/${id}/estado`, { metodo: 'PATCH', cuerpo: { activo } });
