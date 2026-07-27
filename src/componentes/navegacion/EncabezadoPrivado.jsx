import { Link, useNavigate } from 'react-router-dom';
import { useSesion } from '../../hooks/useSesion.js';
import Boton from '../comunes/Boton.jsx';
import CampanaNotificaciones from './CampanaNotificaciones.jsx';

function avatarInicial(nombre) {
  return (nombre || '?').trim().charAt(0).toUpperCase() || '?';
}

function enlacesPorRol(roles = [], permisos = []) {
  const enlaces = [];
  if (roles.includes('ASPIRANTE')) enlaces.push({ ruta: '/aspirante', etiqueta: 'Mi panel' });
  if (roles.includes('BECADO')) {
    enlaces.push({ ruta: '/becado', etiqueta: 'Mi beneficio' });
    enlaces.push({ ruta: '/becado/expediente', etiqueta: 'Mi expediente' });
    enlaces.push({ ruta: '/becado/justificaciones', etiqueta: 'Justificaciones' });
    enlaces.push({ ruta: '/becado/renovaciones/nueva', etiqueta: 'Renovación' });
    enlaces.push({ ruta: '/apelaciones', etiqueta: 'Mis apelaciones' });
  }
  if (roles.includes('ASPIRANTE') || roles.includes('BECADO')) enlaces.push({ ruta: '/consultas', etiqueta: 'Consultas' });
  if (roles.includes('ADMINISTRADOR') || roles.includes('COORDINADOR_BECAS')) {
    enlaces.push({ ruta: '/admin', etiqueta: 'Administración' });
  }
  if (permisos.includes('VALIDACION_ACADEMICA_GESTIONAR')) {
    enlaces.push({ ruta: '/registro-academico', etiqueta: 'Validación académica' });
  }
  if (permisos.includes('ACTIVACION_FINANCIERA_GESTIONAR')) {
    enlaces.push({ ruta: '/finanzas', etiqueta: 'Activación financiera' });
  }
  if (permisos.includes('NOTICIA_GESTIONAR')) enlaces.push({ ruta: '/admin/noticias', etiqueta: 'Noticias' });
  if (permisos.includes('USUARIO_GESTIONAR')) enlaces.push({ ruta: '/admin/usuarios', etiqueta: 'Usuarios' });
  if (permisos.includes('ROL_GESTIONAR')) enlaces.push({ ruta: '/admin/roles', etiqueta: 'Roles y permisos' });
  if (permisos.includes('EMPLEADO_GESTIONAR')) enlaces.push({ ruta: '/admin/empleados', etiqueta: 'Empleados' });
  if (permisos.includes('COMITE_MIEMBRO_GESTIONAR')) enlaces.push({ ruta: '/admin/comite/miembros', etiqueta: 'Miembros de comité' });
  if (permisos.includes('AUDITORIA_VER')) enlaces.push({ ruta: '/admin/auditoria', etiqueta: 'Auditoría' });
  if (permisos.includes('CONFIGURACION_GESTIONAR')) enlaces.push({ ruta: '/admin/configuracion', etiqueta: 'Configuración' });
  if (permisos.includes('VISITA_GESTIONAR')) {
    enlaces.push({ ruta: '/trabajo-social/expedientes', etiqueta: 'Expedientes' });
  }
  if (permisos.includes('SEGUIMIENTO_GESTIONAR')) {
    enlaces.push({ ruta: '/trabajo-social/becarios', etiqueta: 'Becarios' });
  }
  if (permisos.includes('JUSTIFICACION_RESOLVER')) {
    enlaces.push({ ruta: '/trabajo-social/justificaciones', etiqueta: 'Justificaciones' });
  }
  if (permisos.includes('RENOVACION_RESOLVER')) {
    enlaces.push({ ruta: '/trabajo-social/renovaciones', etiqueta: 'Renovaciones' });
  }
  if (permisos.includes('CONSULTA_GESTIONAR')) {
    enlaces.push({ ruta: '/trabajo-social/consultas', etiqueta: 'Consultas' });
  }
  if (roles.includes('TRABAJADORA_SOCIAL') || roles.includes('ADMINISTRADOR')) {
    enlaces.push({ ruta: '/trabajo-social/apelaciones', etiqueta: 'Apelaciones' });
    enlaces.push({ ruta: '/trabajo-social/disciplinario', etiqueta: 'Disciplinario' });
  }
  if (permisos.includes('CHATBOT_GESTIONAR')) enlaces.push({ ruta: '/admin/chatbot', etiqueta: 'Chatbot' });
  if (roles.includes('COMITE_BECAS')) enlaces.push({ ruta: '/comite', etiqueta: 'Comité' });
  if (permisos.includes('ACTA_VER')) enlaces.push({ ruta: '/comite/informes', etiqueta: 'Actas' });
  if (permisos.includes('REPORTE_VER')) enlaces.push({ ruta: '/reportes', etiqueta: 'Reportes' });
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
    <header className="sticky top-0 z-20 border-b border-outline-variant bg-primary-container text-on-primary">
      <div className="mx-auto flex max-w-container-max items-center justify-between px-4 py-3 md:px-12">
        <Link to="/" className="flex items-center gap-3 text-headline-sm font-bold">
          <img src="/images/logo.png" alt="Logo SGBE CUC" className="h-14 w-14 object-contain md:h-16 md:w-16" />
          <span>SGBE · CUC</span>
        </Link>
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
          <Link to="/mi-cuenta" className="hidden items-center gap-2 rounded-full px-2 py-1 transition hover:bg-white/10 md:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-lowest text-primary-container font-semibold">
              {avatarInicial(usuario?.nombre)}
            </span>
            <span className="text-body-sm font-medium">{usuario?.nombre}</span>
          </Link>
          <Link to="/mi-cuenta" className="flex items-center gap-2 rounded-full p-1 transition hover:bg-white/10 md:hidden" aria-label="Abrir mi cuenta">
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
