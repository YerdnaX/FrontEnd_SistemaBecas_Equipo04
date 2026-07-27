import { peticion } from './clienteHttp.js';

export const listarNotificaciones = () => peticion('/notificaciones');
export const marcarNotificacionLeida = (id) => peticion(`/notificaciones/${id}/leida`, { metodo: 'PATCH' });
export const marcarTodasLeidas = () => peticion('/notificaciones/leer-todas', { metodo: 'PATCH' });
