import { Link, useNavigate } from 'react-router-dom';
import { useSesion } from '../../hooks/useSesion.js';
import Boton from '../comunes/Boton.jsx';
import CampanaNotificaciones from './CampanaNotificaciones.jsx';
import MenuDesplegable from './MenuDesplegable.jsx';

function avatarInicial(nombre) {
  return (nombre || '?').trim().charAt(0).toUpperCase() || '?';
}

function enlace(ruta, etiqueta) {
  return { tipo: 'enlace', ruta, etiqueta };
}

function agregarGrupo(items, etiqueta, enlaces) {
  if (enlaces.length === 1) {
    items.push(enlaces[0]);
  } else if (enlaces.length > 1) {
    items.push({ tipo: 'grupo', etiqueta, enlaces });
  }
}

/**
 * Estructura la navegación por rol/permiso en enlaces directos y submenús
 * agrupados por dominio, para que la barra superior no crezca sin límite
 * a medida que un usuario acumula permisos (p. ej. ADMINISTRADOR).
 */
function estructuraMenu(roles = [], permisos = []) {
  const items = [];

  if (roles.includes('ASPIRANTE')) items.push(enlace('/aspirante', 'Mi panel'));

  if (roles.includes('BECADO')) {
    agregarGrupo(items, 'Mi beca', [
      enlace('/becado', 'Mi beneficio'),
      enlace('/becado/expediente', 'Mi expediente'),
      enlace('/becado/justificaciones', 'Justificaciones'),
      enlace('/becado/renovaciones/nueva', 'Renovación'),
    ]);
  }

  if (roles.includes('ASPIRANTE') || roles.includes('BECADO')) {
    items.push(enlace('/consultas', 'Consultas'));
    items.push(enlace('/apelaciones', 'Mis apelaciones'));
  }

  if (roles.includes('ADMINISTRADOR') || roles.includes('COORDINADOR_BECAS')) {
    items.push(enlace('/admin', 'Administración'));
  }

  agregarGrupo(items, 'Beneficios', [
    ...(permisos.includes('VALIDACION_ACADEMICA_GESTIONAR') ? [enlace('/registro-academico', 'Validación académica')] : []),
    ...(permisos.includes('ACTIVACION_FINANCIERA_GESTIONAR') ? [enlace('/finanzas', 'Activación financiera')] : []),
  ]);

  agregarGrupo(items, 'Personas', [
    ...(permisos.includes('USUARIO_GESTIONAR') ? [enlace('/admin/usuarios', 'Usuarios')] : []),
    ...(permisos.includes('ROL_GESTIONAR') ? [enlace('/admin/roles', 'Roles y permisos')] : []),
    ...(permisos.includes('EMPLEADO_GESTIONAR') ? [enlace('/admin/empleados', 'Empleados')] : []),
    ...(permisos.includes('COMITE_MIEMBRO_GESTIONAR') ? [enlace('/admin/comite/miembros', 'Miembros de comité')] : []),
  ]);

  agregarGrupo(items, 'Trabajo social', [
    ...(permisos.includes('VISITA_GESTIONAR') ? [enlace('/trabajo-social/expedientes', 'Expedientes')] : []),
    ...(permisos.includes('SEGUIMIENTO_GESTIONAR') ? [enlace('/trabajo-social/becarios', 'Becarios')] : []),
    ...(permisos.includes('JUSTIFICACION_RESOLVER') ? [enlace('/trabajo-social/justificaciones', 'Justificaciones')] : []),
    ...(permisos.includes('RENOVACION_RESOLVER') ? [enlace('/trabajo-social/renovaciones', 'Renovaciones')] : []),
    ...(permisos.includes('CONSULTA_GESTIONAR') ? [enlace('/trabajo-social/consultas', 'Consultas')] : []),
    ...(roles.includes('TRABAJADORA_SOCIAL') || roles.includes('ADMINISTRADOR')
      ? [enlace('/trabajo-social/apelaciones', 'Apelaciones'), enlace('/trabajo-social/disciplinario', 'Disciplinario')]
      : []),
  ]);

  if (roles.includes('COMITE_BECAS')) items.push(enlace('/comite', 'Comité'));

  agregarGrupo(items, 'Sistema', [
    ...(permisos.includes('NOTICIA_GESTIONAR') ? [enlace('/admin/noticias', 'Noticias')] : []),
    ...(permisos.includes('CHATBOT_GESTIONAR') ? [enlace('/admin/chatbot', 'Chatbot')] : []),
    ...(permisos.includes('AUDITORIA_VER') ? [enlace('/admin/auditoria', 'Auditoría')] : []),
    ...(permisos.includes('CONFIGURACION_GESTIONAR') ? [enlace('/admin/configuracion', 'Configuración')] : []),
  ]);

  agregarGrupo(items, 'Reportes', [
    ...(permisos.includes('ACTA_VER') ? [enlace('/comite/informes', 'Actas')] : []),
    ...(permisos.includes('REPORTE_VER') ? [enlace('/reportes', 'Reportes')] : []),
  ]);

  return items;
}

function aplanarParaMovil(estructura) {
  const filas = [];
  estructura.forEach((item) => {
    if (item.tipo === 'grupo') {
      filas.push({ tipo: 'titulo', etiqueta: item.etiqueta });
      item.enlaces.forEach((subenlace) => filas.push(subenlace));
    } else {
      filas.push(item);
    }
  });
  filas.push(enlace('/mi-cuenta/sesiones', 'Mis sesiones'));
  return filas;
}

export default function EncabezadoPrivado() {
  const { usuario, cerrarSesion } = useSesion();
  const navegar = useNavigate();
  const menu = estructuraMenu(usuario?.roles, usuario?.permisos);

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
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg bg-white text-on-surface shadow-elevation-l3">
              {aplanarParaMovil(menu).map((fila, indice) => (
                fila.tipo === 'titulo'
                  ? <p key={`titulo-${fila.etiqueta}-${indice}`} className="border-b bg-surface-container-low px-4 py-2 text-label-sm font-semibold uppercase text-on-surface-variant">{fila.etiqueta}</p>
                  : <Link key={fila.ruta} to={fila.ruta} className="block border-b px-4 py-3 text-body-sm hover:bg-surface-container">{fila.etiqueta}</Link>
              ))}
            </div>
          </details>
          <div className="hidden items-center gap-4 lg:flex">
            {menu.map((item) => (
              item.tipo === 'grupo'
                ? <MenuDesplegable key={item.etiqueta} etiqueta={item.etiqueta} enlaces={item.enlaces} />
                : <Link key={item.ruta} to={item.ruta} className="text-body-sm hover:underline">{item.etiqueta}</Link>
            ))}
          </div>
          <CampanaNotificaciones />
          <MenuDesplegable
            alinear="derecha"
            botonClassName="hidden items-center gap-2 rounded-full px-2 py-1 transition hover:bg-white/10 md:flex"
            enlaces={[enlace('/mi-cuenta', 'Mi cuenta'), enlace('/mi-cuenta/sesiones', 'Mis sesiones')]}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-lowest text-primary-container font-semibold">
              {avatarInicial(usuario?.nombre)}
            </span>
            <span className="text-body-sm font-medium">{usuario?.nombre}</span>
          </MenuDesplegable>
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
