const CLAVE_REFRESH = 'sgbe_refresh_token';

let tokenAcceso = null;

export function obtenerTokenAcceso() {
  return tokenAcceso;
}

export function establecerTokenAcceso(token) {
  tokenAcceso = token;
}

export function obtenerRefreshToken() {
  return localStorage.getItem(CLAVE_REFRESH);
}

export function establecerRefreshToken(token) {
  if (token) localStorage.setItem(CLAVE_REFRESH, token);
}

export function limpiarSesion() {
  tokenAcceso = null;
  localStorage.removeItem(CLAVE_REFRESH);
}
