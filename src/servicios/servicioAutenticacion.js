import { peticion } from './clienteHttp.js';

export const consultarCedula = (cedula) =>
  peticion(`/autenticacion/consulta-cedula/${encodeURIComponent(cedula)}`, { conAutenticacion: false });

export const registrarUsuario = (datos) =>
  peticion('/autenticacion/registro', { metodo: 'POST', cuerpo: datos, conAutenticacion: false });

export const verificarRegistro = (correo, codigo) =>
  peticion('/autenticacion/verificar-registro', {
    metodo: 'POST',
    cuerpo: { correo, codigo },
    conAutenticacion: false
  });

export const iniciarSesion = (correo, contrasena) =>
  peticion('/autenticacion/iniciar-sesion', { metodo: 'POST', cuerpo: { correo, contrasena }, conAutenticacion: false });

export const verificarDosFactores = (retoId, correo, codigo) =>
  peticion('/autenticacion/verificar-dos-factores', {
    metodo: 'POST',
    cuerpo: { retoId, correo, codigo },
    conAutenticacion: false
  });

export const cerrarSesionApi = (refreshToken) =>
  peticion('/autenticacion/cerrar-sesion', { metodo: 'POST', cuerpo: { refreshToken }, conAutenticacion: false });

export const recuperarContrasena = (correo) =>
  peticion('/autenticacion/recuperar-contrasena', { metodo: 'POST', cuerpo: { correo }, conAutenticacion: false });

export const verificarCodigoRecuperacion = (correo, codigo) =>
  peticion('/autenticacion/verificar-codigo-recuperacion', {
    metodo: 'POST',
    cuerpo: { correo, codigo },
    conAutenticacion: false
  });

export const restablecerContrasena = (datos) =>
  peticion('/autenticacion/restablecer-contrasena', { metodo: 'POST', cuerpo: datos, conAutenticacion: false });

export const obtenerUsuarioActual = () => peticion('/usuarios/actual');
