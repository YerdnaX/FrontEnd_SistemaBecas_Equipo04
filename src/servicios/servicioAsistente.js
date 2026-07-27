import { peticion } from './clienteHttp.js';

export const iniciarConversacionAsistente = () =>
  peticion('/asistente/conversaciones', { metodo: 'POST', conAutenticacion: false });

export const enviarMensajeAsistente = (idConversacion, mensaje) =>
  peticion(`/asistente/conversaciones/${idConversacion}/mensajes`, {
    metodo: 'POST',
    cuerpo: { mensaje },
    conAutenticacion: false
  });
