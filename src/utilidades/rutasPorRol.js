export function rutaPrincipalPorRol(roles = []) {
  if (roles.includes('ADMINISTRADOR') || roles.includes('COORDINADOR_BECAS')) return '/admin';
  if (roles.includes('TRABAJADORA_SOCIAL')) return '/trabajo-social/expedientes';
  if (roles.includes('COMITE_BECAS')) return '/comite';
  return '/aspirante';
}
