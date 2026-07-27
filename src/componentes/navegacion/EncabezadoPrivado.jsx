import { Link, useNavigate } from 'react-router-dom';
import { useSesion } from '../../hooks/useSesion.js';
import Boton from '../comunes/Boton.jsx';
import CampanaNotificaciones from './CampanaNotificaciones.jsx';

function enlacesPorRol(roles = [], permisos = []) {
  const enlaces = [];
  if (roles.includes('ASPIRANTE')) enlaces.push({ ruta: '/aspirante', etiqueta: 'Mi panel' });
  if (roles.includes('BECADO')) enlaces.push({ ruta: '/becado', etiqueta: 'Mi beneficio' });
  if (roles.includes('ASPIRANTE') || roles.includes('BECADO')) enlaces.push({ ruta: '/consultas', etiqueta: 'Consultas' });
  if (roles.includes('ADMINISTRADOR') || roles.includes('COORDINADOR_BECAS')) enlaces.push({ ruta: '/admin', etiqueta: 'Administración' });
  if (roles.includes('TRABAJADORA_SOCIAL')) enlaces.push({ ruta: '/trabajo-social/expedientes', etiqueta: 'Expedientes' });
  if (roles.includes('TRABAJADORA_SOCIAL')) enlaces.push({ ruta: '/trabajo-social/consultas', etiqueta: 'Consultas' });
  if (roles.includes('COMITE_BECAS')) enlaces.push({ ruta: '/comite', etiqueta: 'Comité' });
  if (permisos.includes('REPORTE_VER')) enlaces.push({ ruta: '/reportes', etiqueta: 'Reportes' });
  return enlaces;
}

export default function EncabezadoPrivado() {
  const { usuario, cerrarSesion } = useSesion();
  const navegar = useNavigate();

  async function manejarCerrarSesion() {
    await cerrarSesion();
    navegar('/login');
  }

  return (
    <header className="sticky top-0 z-20 border-b border-outline-variant bg-primary-container text-on-primary">
      <div className="mx-auto flex max-w-container-max items-center justify-between px-4 py-3 md:px-12">
        <Link to="/" className="text-headline-sm font-bold">SGBE · CUC</Link>
        <nav className="flex items-center gap-2 md:gap-4">
          <details className="relative lg:hidden">
            <summary className="cursor-pointer list-none rounded-md border border-white/60 px-3 py-2 text-body-sm">Menú</summary>
            <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg bg-white text-on-surface shadow-elevation-l3">
              {enlacesPorRol(usuario?.roles, usuario?.permisos).map((enlace) => (
                <Link key={enlace.ruta} to={enlace.ruta} className="block border-b px-4 py-3 text-body-sm hover:bg-surface-container">{enlace.etiqueta}</Link>
              ))}
            </div>
          </details>
          <div className="hidden items-center gap-4 lg:flex">
            {enlacesPorRol(usuario?.roles, usuario?.permisos).map((enlace) => (
              <Link key={enlace.ruta} to={enlace.ruta} className="text-body-sm hover:underline">{enlace.etiqueta}</Link>
            ))}
          </div>
          <CampanaNotificaciones />
          <span className="hidden text-body-sm md:inline">{usuario?.nombre}</span>
          <Boton variante="secundario" className="border-white text-white hover:bg-white/10" onClick={manejarCerrarSesion}>
            Cerrar sesión
          </Boton>
        </nav>
      </div>
    </header>
  );
}
