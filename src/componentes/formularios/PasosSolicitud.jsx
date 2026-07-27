import { Link, useParams } from 'react-router-dom';

const PASOS = [
  { clave: 'personal', etiqueta: 'Datos personales' },
  { clave: 'academicos', etiqueta: 'Datos académicos' },
  { clave: 'socioeconomicos', etiqueta: 'Datos socioeconómicos' },
  { clave: 'documentos', etiqueta: 'Documentos' },
  { clave: 'revision', etiqueta: 'Revisión y envío' }
];

function obtenerIndicePasoActual(pasoActual) {
  const indice = PASOS.findIndex((paso) => paso.clave === pasoActual);
  return indice >= 0 ? indice : 0;
}

const ESTADOS_SOLICITUD = {
  BORRADOR: { etiqueta: 'En borrador', clase: 'bg-surface-container text-on-surface-variant' },
  ENVIADA: { etiqueta: 'Enviada', clase: 'bg-primary-container text-on-primary' },
  EN_REVISION_DOCUMENTAL: { etiqueta: 'En revisión', clase: 'bg-primary-container text-on-primary' },
  PENDIENTE_SUBSANACION: { etiqueta: 'Subsanación', clase: 'bg-error-container text-on-error-container' },
  ELEGIBLE: { etiqueta: 'Validada', clase: 'bg-exito-container text-on-exito-container' },
  NO_ELEGIBLE: { etiqueta: 'Finalizada', clase: 'bg-surface-container text-on-surface-variant' },
  EN_EVALUACION: { etiqueta: 'En revisión', clase: 'bg-primary-container text-on-primary' },
  EVALUADA: { etiqueta: 'Validada', clase: 'bg-exito-container text-on-exito-container' },
  EN_COMITE: { etiqueta: 'En revisión', clase: 'bg-primary-container text-on-primary' },
  APROBADA: { etiqueta: 'Finalizada', clase: 'bg-exito-container text-on-exito-container' },
  CONDICIONADA: { etiqueta: 'Finalizada', clase: 'bg-exito-container text-on-exito-container' },
  LISTA_ESPERA: { etiqueta: 'Finalizada', clase: 'bg-surface-container text-on-surface-variant' },
  RECHAZADA: { etiqueta: 'Finalizada', clase: 'bg-surface-container text-on-surface-variant' }
};

function obtenerEstadoVisible(estadoSolicitud, pasoActual) {
  if (estadoSolicitud && ESTADOS_SOLICITUD[estadoSolicitud]) return ESTADOS_SOLICITUD[estadoSolicitud];
  const indice = obtenerIndicePasoActual(pasoActual);
  if (indice === 0) return ESTADOS_SOLICITUD.BORRADOR;
  if (indice === 1 || indice === 2) return ESTADOS_SOLICITUD.ENVIADA;
  if (indice === 3) return ESTADOS_SOLICITUD.EN_REVISION_DOCUMENTAL;
  return ESTADOS_SOLICITUD.EN_COMITE;
}

export default function PasosSolicitud({ pasoActual, estadoSolicitud }) {
  const { id } = useParams();
  const indiceActual = obtenerIndicePasoActual(pasoActual);
  const avance = PASOS.length > 1 ? (indiceActual / (PASOS.length - 1)) * 100 : 0;
  const estadoVisible = obtenerEstadoVisible(estadoSolicitud, pasoActual);

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-elevation-l2">
      <div className="grid gap-4 border-b border-outline-variant px-6 py-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-label-md font-semibold uppercase tracking-wide text-primary-container">Nueva solicitud</p>
          <h2 className="mt-1 text-headline-sm font-semibold text-primary">Estado de Solicitud</h2>
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
                <Link key={paso.clave} to={enlace} className="relative z-10 flex flex-col items-center text-center">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-label-sm font-bold transition ${
                      completado
                        ? 'border-primary-container bg-primary-container text-on-primary'
                        : activo
                          ? 'border-primary-container bg-primary-container text-on-primary shadow-elevation-l1'
                          : 'border-surface-container-high bg-surface-container-lowest text-on-surface-variant'
                    }`}
                    aria-hidden="true"
                  >
                    {completado ? '✓' : indice + 1}
                  </span>
                  <span className={`mt-3 text-label-md font-semibold ${activo ? 'text-primary' : 'text-on-surface-variant'}`}>
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
