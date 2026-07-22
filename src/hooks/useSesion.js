import { useContext } from 'react';
import { ContextoSesion } from '../contextos/ContextoSesion.jsx';

export function useSesion() {
  const contexto = useContext(ContextoSesion);
  if (!contexto) throw new Error('useSesion debe usarse dentro de ProveedorSesion.');
  return contexto;
}
