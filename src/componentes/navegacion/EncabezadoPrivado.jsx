import { Link, useNavigate } from 'react-router-dom';
import { useSesion } from '../../hooks/useSesion.js';
import Boton from '../comunes/Boton.jsx';

function avatarInicial(nombre) {
  return (nombre || '?').trim().charAt(0).toUpperCase() || '?';
}

function enlacesPorRol(roles = []) {
  const enlaces = [];
  if (roles.includes('ASPIRANTE')) enlaces.push({ ruta: '/aspirante', etiqueta: 'Mi panel' });
  if (roles.includes('BECADO')) enlaces.push({ ruta: '/apelaciones', etiqueta: 'Mis apelaciones' });
  if (roles.includes('ADMINISTRADOR') || roles.includes('COORDINADOR_BECAS')) {
    enlaces.push({ ruta: '/admin', etiqueta: 'Administración' });
    enlaces.push({ ruta: '/admin/auditoria', etiqueta: 'Auditoría' });
  }
  if (roles.includes('ADMINISTRADOR')) {
    enlaces.push({ ruta: '/admin/configuracion', etiqueta: 'Configuración' });
  }
  if (roles.includes('TRABAJADORA_SOCIAL')) {
    enlaces.push({ ruta: '/trabajo-social/expedientes', etiqueta: 'Expedientes' });
    enlaces.push({ ruta: '/trabajo-social/apelaciones', etiqueta: 'Apelaciones' });
    enlaces.push({ ruta: '/trabajo-social/disciplinario', etiqueta: 'Disciplinario' });
  }
  if (roles.includes('ADMINISTRADOR') || roles.includes('TRABAJADORA_SOCIAL')) {
    enlaces.push({ ruta: '/admin/chatbot', etiqueta: 'Chatbot' });
  }
  if (roles.includes('COMITE_BECAS')) enlaces.push({ ruta: '/comite', etiqueta: 'Comité' });
  enlaces.push({ ruta: '/mi-cuenta/sesiones', etiqueta: 'Mis sesiones' });
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
    <header className="sticky top-0 z-10 border-b border-outline-variant bg-primary-container text-on-primary">
      <div className="mx-auto flex max-w-container-max items-center justify-between px-4 py-3 md:px-12">
        <Link to="/" className="flex items-center gap-3 text-headline-sm font-bold">
          <img src="/images/logo.png" alt="Logo SGBE CUC" className="h-20 w-20 object-contain" />
          <span>SGBE · CUC</span>
        </Link>
        <nav className="flex items-center gap-4">
          {enlacesPorRol(usuario?.roles).map((enlace) => (
            <Link key={enlace.ruta} to={enlace.ruta} className="text-body-sm hover:underline">{enlace.etiqueta}</Link>
          ))}
          <Link to="/mi-cuenta" className="hidden items-center gap-2 md:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-lowest text-primary-container font-semibold">
              {avatarInicial(usuario?.nombre)}
            </span>
            <span className="text-body-sm font-medium">{usuario?.nombre}</span>
          </Link>
          <Link to="/mi-cuenta" className="flex items-center gap-2 md:hidden" aria-label="Abrir mi cuenta">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-lowest text-primary-container font-semibold">
              {avatarInicial(usuario?.nombre)}
            </span>
          </Link>
          <Boton variante="secundario" className="border-white text-white hover:bg-white/10" onClick={manejarCerrarSesion}>
            Cerrar sesión
          </Boton>
        </nav>
      </div>
    </header>
  );
}