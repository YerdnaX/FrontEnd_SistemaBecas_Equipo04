import { Link, useParams } from 'react-router-dom';
import { obtenerClaseEstado } from '../comunes/EtiquetaEstado.jsx';

const PASOS = [
  { clave: 'personal', etiqueta: 'Datos personales' },
  { clave: 'academicos', etiqueta: 'Datos académicos' },
  { clave: 'notas', etiqueta: 'Notas simuladas' },
  { clave: 'socioeconomicos', etiqueta: 'Datos socioeconómicos' },
  { clave: 'documentos', etiqueta: 'Documentos' },
  { clave: 'revision', etiqueta: 'Revisión y envío' }
];

function obtenerIndicePasoActual(pasoActual) {
  const indice = PASOS.findIndex((paso) => paso.clave === pasoActual);
  return indice >= 0 ? indice : 0;
}

/**
 * Solo agrupa varios estados crudos de la solicitud bajo una etiqueta corta
 * y amigable para este resumen. El color viene de EtiquetaEstado.obtenerClaseEstado
 * (misma fuente que usa el resto de la app) para no mantener un segundo mapa de colores.
 */
const ETIQUETAS_SOLICITUD = {
  BORRADOR: 'En borrador',
  ENVIADA: 'Enviada',
  EN_REVISION_DOCUMENTAL: 'En revisión',
  PENDIENTE_SUBSANACION: 'Subsanación',
  ELEGIBLE: 'Validada',
  NO_ELEGIBLE: 'Finalizada',
  EN_EVALUACION: 'En revisión',
  EVALUADA: 'Validada',
  EN_COMITE: 'En revisión',
  APROBADA: 'Finalizada',
  CONDICIONADA: 'Finalizada',
  LISTA_ESPERA: 'Finalizada',
  RECHAZADA: 'Finalizada'
};

const ESTADO_POR_PASO = ['BORRADOR', 'ENVIADA', 'ENVIADA', 'ENVIADA', 'EN_REVISION_DOCUMENTAL', 'EN_COMITE'];

function obtenerEstadoVisible(estadoSolicitud, pasoActual) {
  const clave = estadoSolicitud && ETIQUETAS_SOLICITUD[estadoSolicitud]
    ? estadoSolicitud
    : ESTADO_POR_PASO[obtenerIndicePasoActual(pasoActual)];
  return { etiqueta: ETIQUETAS_SOLICITUD[clave], clase: obtenerClaseEstado(clave) };
}

export default function PasosSolicitud({ pasoActual, estadoSolicitud }) {
  const { id } = useParams();
  const indiceActual = obtenerIndicePasoActual(pasoActual);
  const avance = PASOS.length > 1 ? (indiceActual / (PASOS.length - 1)) * 100 : 0;
  const estadoVisible = obtenerEstadoVisible(estadoSolicitud, pasoActual);

  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-outline-variant bg-surface-container shadow-elevation-l2">
      <div className="grid gap-4 border-b border-outline-variant px-6 py-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-label-md font-semibold uppercase tracking-wide text-primary-container">Nueva solicitud</p>
          <h2 className="mt-1 text-headline-sm font-semibold text-on-surface">Estado de Solicitud</h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">Complete cada sección para avanzar con su solicitud.</p>
        </div>

        <div className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-label-md font-semibold ${estadoVisible.clase}`}>
          <span className="h-2 w-2 rounded-full bg-current/80" />
          {estadoVisible.etiqueta}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="relative">
          <div className="absolute left-6 right-6 top-[1.125rem] h-1 rounded-full bg-surface-container-high" />
          <div
            className="absolute left-6 top-[1.125rem] h-1 rounded-full bg-primary-container transition-all"
            style={{ width: `${avance}%` }}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {PASOS.map((paso, indice) => {
              const completado = indice < indiceActual;
              const activo = indice === indiceActual;
              const enlace = `/aspirante/solicitudes/${id}/${paso.clave}`;

              return (
                <Link key={paso.clave} to={enlace} className="relative z-10 flex flex-col items-center rounded-md text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-label-sm font-bold transition ${
                      completado
                        ? 'border-primary-container bg-primary-container text-on-primary-container'
                        : activo
                          ? 'border-primary-container bg-primary-container text-on-primary-container shadow-elevation-l1'
                          : 'border-outline-variant bg-surface-container-low text-on-surface-variant'
                    }`}
                    aria-hidden="true"
                  >
                    {completado ? '✓' : indice + 1}
                  </span>
                  <span className={`mt-3 text-label-md font-semibold ${activo ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {paso.etiqueta}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
