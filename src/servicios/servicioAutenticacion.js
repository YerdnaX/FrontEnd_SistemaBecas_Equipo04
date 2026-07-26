import { peticion } from './clienteHttp.js';

export const registrarUsuario = (datos) =>
  peticion('/autenticacion/registro', { metodo: 'POST', cuerpo: datos, conAutenticacion: false });

export const iniciarSesion = (correo, contrasena) =>
  peticion('/autenticacion/iniciar-sesion', { metodo: 'POST', cuerpo: { correo, contrasena }, conAutenticacion: false });

export const cerrarSesionApi = (refreshToken) =>
  peticion('/autenticacion/cerrar-sesion', { metodo: 'POST', cuerpo: { refreshToken }, conAutenticacion: false });

export const recuperarContrasena = (correo) =>
  peticion('/autenticacion/recuperar-contrasena', { metodo: 'POST', cuerpo: { correo }, conAutenticacion: false });

export const restablecerContrasena = (datos) =>
  peticion('/autenticacion/restablecer-contrasena', { metodo: 'POST', cuerpo: datos, conAutenticacion: false });

export const obtenerUsuarioActual = () => peticion('/usuarios/actual');
