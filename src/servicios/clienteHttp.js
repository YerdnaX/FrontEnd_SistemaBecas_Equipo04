import { obtenerTokenAcceso, establecerTokenAcceso, obtenerRefreshToken, establecerRefreshToken, limpiarSesion } from './almacenSesion.js';

const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export class ErrorApi extends Error {
  constructor({ codigo, mensaje, errores, estadoHttp }) {
    super(mensaje);
    this.codigo = codigo;
    this.errores = errores || [];
    this.estadoHttp = estadoHttp;
  }
}

function notificarSesionExpirada() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('sgbe:sesion-expirada'));
  }
}

async function intentarRenovarSesion() {
  const refreshToken = obtenerRefreshToken();
  if (!refreshToken) return false;

  const respuesta = await fetch(`${URL_BASE}/autenticacion/renovar-sesion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok || !cuerpo?.exito) {
    limpiarSesion();
    notificarSesionExpirada();
    return false;
  }

  establecerTokenAcceso(cuerpo.datos.tokenAcceso);
  establecerRefreshToken(cuerpo.datos.refreshToken);
  return true;
}

export async function peticion(ruta, { metodo = 'GET', cuerpo, conAutenticacion = true, reintentar = true } = {}) {
  const encabezados = { 'Content-Type': 'application/json' };
  if (conAutenticacion && obtenerTokenAcceso()) {
    encabezados.Authorization = `Bearer ${obtenerTokenAcceso()}`;
  }

  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    method: metodo,
    headers: encabezados,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  });

  if (respuesta.status === 401 && conAutenticacion && reintentar) {
    const renovada = await intentarRenovarSesion();
    if (renovada) {
      return peticion(ruta, { metodo, cuerpo, conAutenticacion, reintentar: false });
    }
  }

  const datosRespuesta = await respuesta.json().catch(() => null);

  if (!respuesta.ok || !datosRespuesta?.exito) {
    throw new ErrorApi({
      codigo: datosRespuesta?.codigo || 'ERROR_DESCONOCIDO',
      mensaje: datosRespuesta?.mensaje || 'Ocurrió un error de comunicación con el servidor.',
      errores: datosRespuesta?.errores,
      estadoHttp: respuesta.status
    });
  }

  return datosRespuesta;
}
