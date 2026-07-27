import { peticion } from './clienteHttp.js';

export const obtenerUsuarioActual = () => peticion('/usuarios/actual');
export const cambiarContrasena = (datos) => peticion('/usuarios/actual/contrasena', { metodo: 'PUT', cuerpo: datos });
