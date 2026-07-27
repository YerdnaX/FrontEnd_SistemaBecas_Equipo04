import { Link } from 'react-router-dom';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import { useSesion } from '../../hooks/useSesion.js';

const ACCESOS = [
  { ruta: '/admin/tipos-beca', permiso: 'TIPO_BECA_VER', titulo: 'Tipos de beca', descripcion: 'Configure cobertura, rubros y criterios de elegibilidad.' },
  { ruta: '/admin/convocatorias', permiso: 'CONVOCATORIA_VER', titulo: 'Convocatorias', descripcion: 'Cree, apruebe, publique y administre las etapas de cada convocatoria.' },
  { ruta: '/admin/noticias', permiso: 'NOTICIA_GESTIONAR', titulo: 'Noticias', descripcion: 'Publique avisos para el público, aspirantes y becados.' },
  { ruta: '/admin/usuarios', permiso: 'USUARIO_GESTIONAR', titulo: 'Usuarios', descripcion: 'Administre cuentas, estados y asignación de roles.' },
  { ruta: '/admin/roles', permiso: 'ROL_GESTIONAR', titulo: 'Roles y permisos', descripcion: 'Configure la matriz de autorizaciones.' },
  { ruta: '/admin/empleados', permiso: 'EMPLEADO_GESTIONAR', titulo: 'Empleados', descripcion: 'Vincule cuentas con puestos y departamentos.' },
  { ruta: '/admin/comite/miembros', permiso: 'COMITE_MIEMBRO_GESTIONAR', titulo: 'Miembros del comité', descripcion: 'Gestione cargos y vigencias.' },
  { ruta: '/reportes', permiso: 'REPORTE_VER', titulo: 'Reportes', descripcion: 'Consulte indicadores y beneficios activos.' }
];

export default function PanelAdministrativo() {
  const { tienePermiso } = useSesion();
  const accesosVisibles = ACCESOS.filter((acceso) => tienePermiso(acceso.permiso));
  return (
    <div>
      <h1 className="text-headline-lg font-semibold text-primary">Panel administrativo</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {accesosVisibles.map((acceso) => (
          <Link key={acceso.ruta} to={acceso.ruta}>
            <Tarjeta className="h-full transition hover:shadow-none">
              <p className="text-headline-sm font-semibold text-on-surface">{acceso.titulo}</p>
              <p className="mt-2 text-body-sm text-on-surface-variant">{acceso.descripcion}</p>
            </Tarjeta>
          </Link>
        ))}
      </div>
    </div>
  );
}
