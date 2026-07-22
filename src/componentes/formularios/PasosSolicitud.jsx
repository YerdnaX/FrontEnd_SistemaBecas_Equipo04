import { Link, useParams } from 'react-router-dom';

const PASOS = [
  { clave: 'personal', etiqueta: 'Datos personales' },
  { clave: 'academicos', etiqueta: 'Datos académicos' },
  { clave: 'socioeconomicos', etiqueta: 'Datos socioeconómicos' },
  { clave: 'documentos', etiqueta: 'Documentos' },
  { clave: 'revision', etiqueta: 'Revisión y envío' }
];

export default function PasosSolicitud({ pasoActual }) {
  const { id } = useParams();
  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {PASOS.map((paso, indice) => (
        <Link
          key={paso.clave}
          to={`/aspirante/solicitudes/${id}/${paso.clave}`}
          className={`rounded-full px-4 py-2 text-label-sm font-semibold ${
            paso.clave === pasoActual ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          {indice + 1}. {paso.etiqueta}
        </Link>
      ))}
    </nav>
  );
}
