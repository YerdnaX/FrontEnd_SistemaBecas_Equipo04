import { peticion } from './clienteHttp.js';

export const listarConvocatorias = (filtros = {}) => {
  const parametros = new URLSearchParams(filtros).toString();
  return peticion(`/convocatorias${parametros ? `?${parametros}` : ''}`);
};
export const obtenerConvocatoria = (id) => peticion(`/convocatorias/${id}`);
export const crearConvocatoria = (datos) => peticion('/convocatorias', { metodo: 'POST', cuerpo: datos });
export const actualizarConvocatoria = (id, datos) => peticion(`/convocatorias/${id}`, { metodo: 'PUT', cuerpo: datos });
export const enviarAprobacion = (id) => peticion(`/convocatorias/${id}/enviar-aprobacion`, { metodo: 'POST' });
export const aprobarConvocatoria = (id) => peticion(`/convocatorias/${id}/aprobar`, { metodo: 'POST' });
export const publicarConvocatoria = (id) => peticion(`/convocatorias/${id}/publicar`, { metodo: 'POST' });
export const listarEtapas = (id) => peticion(`/convocatorias/${id}/etapas`);
export const actualizarEtapa = (id, idEtapa, datos) =>
  peticion(`/convocatorias/${id}/etapas/${idEtapa}`, { metodo: 'PUT', cuerpo: datos });
