import { Navigate } from 'react-router-dom';
import { useSesion } from '../hooks/useSesion.js';
import EstadoCarga from '../componentes/comunes/EstadoCarga.jsx';
import AccesoDenegado from '../paginas/AccesoDenegado.jsx';
import EncabezadoPrivado from '../componentes/navegacion/EncabezadoPrivado.jsx';

export default function RutaProtegida({ rolesPermitidos, permisosRequeridos, children }) {
  const { usuario, cargando } = useSesion();

  if (cargando) return <EstadoCarga mensaje="Verificando sesión..." />;
  if (!usuario) return <Navigate to="/login" replace />;
  if (rolesPermitidos && !rolesPermitidos.some((rol) => usuario.roles.includes(rol))) {
    return (
      <>
        <EncabezadoPrivado />
        <AccesoDenegado />
      </>
    );
  }
  if (permisosRequeridos && !permisosRequeridos.every((permiso) => usuario.permisos.includes(permiso))) {
    return (
      <>
        <EncabezadoPrivado />
        <AccesoDenegado />
      </>
    );
  }

  return (
    <>
      <EncabezadoPrivado />
      <main className="mx-auto max-w-container-max px-4 py-8 md:px-12">{children}</main>
    </>
  );
}
