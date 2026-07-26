import { peticion } from './clienteHttp.js';

export const consultarChatbot = (pregunta) =>
  peticion('/chatbot/consultar', { metodo: 'POST', cuerpo: { pregunta }, conAutenticacion: false });

export const listarCategoriasChatbot = () => peticion('/chatbot/categorias', { conAutenticacion: false });

export const listarEntradasChatbot = (filtros = {}) => {
  const parametros = new URLSearchParams(filtros).toString();
  return peticion(`/chatbot/entradas${parametros ? `?${parametros}` : ''}`);
};

export const crearEntradaChatbot = (datos) => peticion('/chatbot/entradas', { metodo: 'POST', cuerpo: datos });
export const actualizarEntradaChatbot = (id, datos) =>
  peticion(`/chatbot/entradas/${id}`, { metodo: 'PUT', cuerpo: datos });
export const eliminarEntradaChatbot = (id) => peticion(`/chatbot/entradas/${id}`, { metodo: 'DELETE' });
