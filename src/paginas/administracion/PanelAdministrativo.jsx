import { Link } from 'react-router-dom';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import { useSesion } from '../../hooks/useSesion.js';

const ACCESOS = [
  {
    ruta: '/admin/tipos-beca',
    permiso: 'TIPO_BECA_VER',
    titulo: 'Tipos de beca',
    descripcion: 'Configure cobertura, rubros y criterios de elegibilidad para cada modalidad.',
    imagen: '/images/administracion.png'
  },
  {
    ruta: '/admin/convocatorias',
    permiso: 'CONVOCATORIA_VER',
    titulo: 'Convocatorias',
    descripcion: 'Cree, apruebe, publique y administre las etapas de cada convocatoria.',
    imagen: '/images/convocatoriasbecas.png'
  },
  {
    ruta: '/admin/noticias',
    permiso: 'NOTICIA_GESTIONAR',
    titulo: 'Noticias',
    descripcion: 'Publique avisos para el público, aspirantes y becados.',
    imagen: '/images/noticias.png'
  },
  {
    ruta: '/admin/usuarios',
    permiso: 'USUARIO_GESTIONAR',
    titulo: 'Usuarios',
    descripcion: 'Administre cuentas, estados y asignación de roles.',
    imagen: '/images/aspirante.png'
  },
  {
    ruta: '/admin/roles',
    permiso: 'ROL_GESTIONAR',
    titulo: 'Roles y permisos',
    descripcion: 'Configure la matriz de autorizaciones.',
    imagen: '/images/administracion.png'
  },
  {
    ruta: '/admin/empleados',
    permiso: 'EMPLEADO_GESTIONAR',
    titulo: 'Empleados',
    descripcion: 'Vincule cuentas con puestos y departamentos.',
    imagen: '/images/trabajosocial.png'
  },
  {
    ruta: '/admin/comite/miembros',
    permiso: 'COMITE_MIEMBRO_GESTIONAR',
    titulo: 'Miembros del comité',
    descripcion: 'Gestione cargos y vigencias.',
    imagen: '/images/comitebecas.png'
  },
  {
    ruta: '/reportes',
    permiso: 'REPORTE_VER',
    titulo: 'Reportes',
    descripcion: 'Consulte indicadores y beneficios activos.',
    imagen: '/images/noticias.png'
  },
  {
    ruta: '/admin/auditoria',
    permiso: 'AUDITORIA_VER',
    titulo: 'Auditoría y seguridad',
    descripcion: 'Revise eventos, sesiones activas y trazabilidad de acciones del sistema.',
    imagen: '/images/noticias.png'
  },
  {
    ruta: '/admin/configuracion',
    permiso: 'CONFIGURACION_GESTIONAR',
    titulo: 'Configuración del sistema',
    descripcion: 'Administre parámetros, plantillas y ajustes operativos globales.',
    imagen: '/images/logo.png'
  },
  {
    ruta: '/admin/chatbot',
    permiso: 'CHATBOT_GESTIONAR',
    titulo: 'Gestión de chatbot',
    descripcion: 'Mantenga preguntas y respuestas para asistencia a usuarios.',
    imagen: '/images/comitebecas.png'
  }
];

export default function PanelAdministrativo() {
  const { usuario, tienePermiso } = useSesion();
  const esAdministrador = usuario?.roles?.includes('ADMINISTRADOR');
  const accesosVisibles = ACCESOS.filter((acceso) => tienePermiso(acceso.permiso));

  return (
    <div className="flex flex-col gap-8">
      <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-gradient-to-br from-primary-container via-primary to-slate-950 px-6 py-8 text-on-primary shadow-elevation-l2 md:px-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-surface-container/20 blur-2xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-label-md font-semibold uppercase tracking-[0.2em] text-on-primary-container">Administración</p>
            <h1 className="mt-2 text-headline-lg font-semibold text-on-primary">Centro de control del sistema</h1>
            <p className="mt-2 max-w-2xl text-body-md text-on-primary-container">
              Gestione convocatorias, seguridad y configuraciones desde un único panel operativo.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <img src="/images/administracion.png" alt="Panel administrativo" className="h-16 w-16 object-contain" />
            <div>
              <p className="text-label-sm uppercase tracking-wide text-on-primary-container">Rol activo</p>
              <p className="text-body-md font-semibold text-on-primary">{esAdministrador ? 'Administrador' : 'Coordinación de becas'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {accesosVisibles.map((acceso) => (
          <Link key={acceso.ruta} to={acceso.ruta}>
            <Tarjeta className="h-full overflow-hidden border border-outline-variant p-0 transition duration-200 hover:-translate-y-0.5 hover:shadow-elevation-l2">
              <div className="flex items-center justify-between bg-surface-container-low px-5 py-4">
                <p className="text-label-md font-semibold uppercase tracking-wide text-primary-container">Módulo</p>
                <img src={acceso.imagen} alt={acceso.titulo} className="h-10 w-10 object-contain" />
              </div>
              <div className="px-5 py-5">
                <p className="text-headline-sm font-semibold text-on-surface">{acceso.titulo}</p>
                <p className="mt-2 text-body-sm text-on-surface-variant">{acceso.descripcion}</p>
                <p className="mt-4 text-body-sm font-semibold text-primary-container">Abrir módulo →</p>
              </div>
            </Tarjeta>
          </Link>
        ))}
      </div>
    </div>
  );
}
