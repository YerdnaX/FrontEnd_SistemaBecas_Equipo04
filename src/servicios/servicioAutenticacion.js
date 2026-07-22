import { peticion } from './clienteHttp.js';

export const registrarUsuario = (datos) =>
  peticion('/autenticacion/registro', { metodo: 'POST', cuerpo: datos, conAutenticacion: false });

export const activarCuenta = (token) =>
  peticion('/autenticacion/activar', { metodo: 'POST', cuerpo: { token }, conAutenticacion: false });

export const reenviarActivacion = (correo) =>
  peticion('/autenticacion/reenviar-activacion', { metodo: 'POST', cuerpo: { correo }, conAutenticacion: false });

export const iniciarSesion = (correo, contrasena) =>
  peticion('/autenticacion/iniciar-sesion', { metodo: 'POST', cuerpo: { correo, contrasena }, conAutenticacion: false });

export const verificarDosFactores = (correo, codigo) =>
  peticion('/autenticacion/verificar-2fa', { metodo: 'POST', cuerpo: { correo, codigo }, conAutenticacion: false });

export const reenviarDosFactores = (correo) =>
  peticion('/autenticacion/reenviar-2fa', { metodo: 'POST', cuerpo: { correo }, conAutenticacion: false });

export const cerrarSesionApi = (refreshToken) =>
  peticion('/autenticacion/cerrar-sesion', { metodo: 'POST', cuerpo: { refreshToken }, conAutenticacion: false });

export const recuperarContrasena = (correo) =>
  peticion('/autenticacion/recuperar-contrasena', { metodo: 'POST', cuerpo: { correo }, conAutenticacion: false });

export const restablecerContrasena = (datos) =>
  peticion('/autenticacion/restablecer-contrasena', { metodo: 'POST', cuerpo: datos, conAutenticacion: false });

export const obtenerUsuarioActual = () => peticion('/usuarios/actual');
