import { peticion } from './clienteHttp.js';

export const obtenerUsuarioActual = () => peticion('/usuarios/actual');
export const cambiarContrasena = (datos) => peticion('/usuarios/actual/contrasena', { metodo: 'PUT', cuerpo: datos });
export const solicitarCambioCorreo = (datos) => peticion('/usuarios/actual/correo/solicitud', { metodo: 'POST', cuerpo: datos });
export const verificarCambioCorreo = (datos) => peticion('/usuarios/actual/correo/verificar', { metodo: 'POST', cuerpo: datos });