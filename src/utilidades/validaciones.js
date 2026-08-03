export function contrasenaEsSegura(contrasena) {
  const valor = String(contrasena || '');
  return valor.length >= 8 && /[A-Z]/.test(valor) && /[0-9]/.test(valor) && /[^A-Za-z0-9]/.test(valor);
}

export function correoEsValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo || '').trim());
}

// Cédula física costarricense: exactamente 9 dígitos, sin guiones ni
// espacios (normalizados antes de validar).
export function cedulaEsValida(cedula) {
  return /^\d{9}$/.test(String(cedula || '').replace(/[\s-]/g, ''));
}
