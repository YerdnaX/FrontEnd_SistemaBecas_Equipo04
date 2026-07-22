import { peticion } from './clienteHttp.js';

export const obtenerInicio = () => peticion('/publico/inicio', { conAutenticacion: false });
export const listarConvocatoriasPublicas = () => peticion('/publico/convocatorias', { conAutenticacion: false });
export const obtenerConvocatoriaPublica = (id) => peticion(`/publico/convocatorias/${id}`, { conAutenticacion: false });
export const listarNoticiasPublicas = () => peticion('/publico/noticias', { conAutenticacion: false });
