import { Link } from 'react-router-dom';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';

const ACCESOS = [
  { ruta: '/admin/tipos-beca', titulo: 'Tipos de beca', descripcion: 'Configure cobertura, rubros y criterios de elegibilidad.' },
  { ruta: '/admin/convocatorias', titulo: 'Convocatorias', descripcion: 'Cree, apruebe, publique y administre las etapas de cada convocatoria.' }
];

export default function PanelAdministrativo() {
  return (
    <div>
      <h1 className="text-headline-lg font-semibold text-primary">Panel administrativo</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {ACCESOS.map((acceso) => (
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
