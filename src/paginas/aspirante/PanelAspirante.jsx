import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import { obtenerPanelAspirante, crearSolicitud } from '../../servicios/servicioSolicitudes.js';
import { listarConvocatoriasPublicas } from '../../servicios/servicioPublico.js';
import { marcarNotificacionLeida } from '../../servicios/servicioNotificaciones.js';
import { formatearFecha } from '../../utilidades/formato.js';
import { useSesion } from '../../hooks/useSesion.js';

const ESTADOS_FINALES = ['RECHAZADA', 'NO_ELEGIBLE'];

function saludoPorHora() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Buenos días';
  if (hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function TarjetaResumen({ valor, etiqueta, destacar }) {
  return (
    <div className={`rounded-lg p-4 shadow-elevation-l2 ${destacar ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-lowest text-on-surface'}`}>
      <p className={`text-headline-md font-semibold ${destacar ? '' : 'text-on-surface'}`}>{valor}</p>
      <p className={`mt-1 text-label-md ${destacar ? 'opacity-90' : 'text-on-surface-variant'}`}>{etiqueta}</p>
    </div>
  );
}

function convocatoriaEstaVigente(convocatoria) {
  const ahora = Date.now();
  const inicio = convocatoria?.FechaInicio ? new Date(convocatoria.FechaInicio).getTime() : NaN;
  const fin = convocatoria?.FechaFin ? new Date(convocatoria.FechaFin).getTime() : NaN;
  if (!Number.isFinite(inicio) || !Number.isFinite(fin)) return false;
  return inicio <= ahora && ahora <= fin;
}

export default function PanelAspirante() {
  const { usuario } = useSesion();
  const [panel, setPanel] = useState(null);
  const [convocatorias, setConvocatorias] = useState([]);
  const [idConvocatoriaSeleccionada, setIdConvocatoriaSeleccionada] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [errorCreacion, setErrorCreacion] = useState(null);
  const [creando, setCreando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const [respuestaPanel, respuestaConvocatorias] = await Promise.all([
        obtenerPanelAspirante(),
        listarConvocatoriasPublicas()
      ]);
      setPanel(respuestaPanel.datos);
      setConvocatorias(respuestaConvocatorias.datos);
    } catch (err) {
      setError(err.mensaje || 'No fue posible cargar su panel.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function manejarCrearSolicitud() {
    if (!idConvocatoriaSeleccionada) return;
    setErrorCreacion(null);
    setCreando(true);
    try {
      await crearSolicitud(Number(idConvocatoriaSeleccionada));
      setIdConvocatoriaSeleccionada('');
      await cargar();
    } catch (err) {
      setErrorCreacion(err.mensaje || 'No fue posible crear la solicitud.');
    } finally {
      setCreando(false);
    }
  }

  function manejarClicNotificacion(notificacion) {
    if (notificacion.Leida) return;
    setPanel((actual) => ({
      ...actual,
      notificaciones: actual.notificaciones.map((n) =>
        n.IdNotificacion === notificacion.IdNotificacion ? { ...n, Leida: true } : n
      ),
      notificacionesSinLeer: Math.max(0, (actual.notificacionesSinLeer || 0) - 1)
    }));
    marcarNotificacionLeida(notificacion.IdNotificacion).catch(() => {});
  }

  if (cargando) return <EstadoCarga mensaje="Cargando su panel..." />;
  if (error) return <AlertaMensaje tipo="error">{error}</AlertaMensaje>;

  const convocatoriasDisponibles = convocatorias.filter(
    (c) => convocatoriaEstaVigente(c) && !panel.solicitudes.some((s) => s.IdConvocatoria === c.IdConvocatoria)
  );
  const solicitudesBorrador = panel.solicitudes.filter((s) => s.Estado === 'BORRADOR').length;
  const solicitudesEnProceso = panel.solicitudes.filter(
    (s) => s.Estado !== 'BORRADOR' && !ESTADOS_FINALES.includes(s.Estado)
  ).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-label-md font-semibold uppercase tracking-wide text-primary-container">{saludoPorHora()}</p>
          <h1 className="text-headline-lg font-semibold text-on-surface">{usuario?.nombre || 'Su panel'}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">Gestione sus solicitudes de beca y consulte sus notificaciones.</p>
        </div>
        <img src="/images/aspirante.png" alt="Panel de aspirante" className="imagen-ui-seccion self-center sm:self-auto" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <TarjetaResumen valor={panel.solicitudes.length} etiqueta="Solicitudes totales" />
        <TarjetaResumen valor={solicitudesBorrador} etiqueta="En borrador" />
        <TarjetaResumen valor={solicitudesEnProceso} etiqueta="En proceso" />
        <TarjetaResumen
          valor={panel.notificacionesSinLeer ?? 0}
          etiqueta="Sin leer"
          destacar={(panel.notificacionesSinLeer ?? 0) > 0}
        />
      </div>

      <Tarjeta className="border-l-4 border-primary-container">
        <p className="text-label-md font-semibold uppercase tracking-wide text-primary-container">Acción disponible</p>
        <h2 className="mt-1 text-headline-sm font-semibold text-on-surface">Nueva solicitud</h2>
        {convocatoriasDisponibles.length === 0 ? (
          <p className="mt-2 text-body-sm text-on-surface-variant">No hay convocatorias vigentes disponibles para postular en este momento.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <CampoSelect
              etiqueta="Convocatoria"
              className="sm:w-80"
              value={idConvocatoriaSeleccionada}
              onChange={(e) => setIdConvocatoriaSeleccionada(e.target.value)}
              opciones={convocatoriasDisponibles.map((c) => ({ valor: c.IdConvocatoria, etiqueta: c.Nombre }))}
            />
            <Boton onClick={manejarCrearSolicitud} cargando={creando} deshabilitado={!idConvocatoriaSeleccionada}>
              Crear solicitud
            </Boton>
          </div>
        )}
        {errorCreacion && <div className="mt-3"><AlertaMensaje tipo="error">{errorCreacion}</AlertaMensaje></div>}
      </Tarjeta>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-headline-sm font-semibold text-on-surface">Mis solicitudes</h2>
          {panel.solicitudes.length === 0 ? (
            <div className="mt-4">
              <EstadoVacio titulo="Aún no tiene solicitudes" descripcion="Cree una solicitud a partir de una convocatoria vigente." />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {panel.solicitudes.map((solicitud) => (
                <Tarjeta key={solicitud.IdSolicitud} className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-primary">{solicitud.NombreConvocatoria}</p>
                    <EtiquetaEstado estado={solicitud.Estado} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-label-sm text-on-surface-variant">
                      <span>Progreso</span>
                      <span>{solicitud.Progreso}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                      <div
                        className="h-full rounded-full bg-primary-container transition-all"
                        style={{ width: `${solicitud.Progreso}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">Creada: {formatearFecha(solicitud.FechaCreacion)}</p>
                  <Link
                    to={
                      solicitud.Estado === 'BORRADOR'
                        ? `/aspirante/solicitudes/${solicitud.IdSolicitud}/continuar`
                        : `/aspirante/solicitudes/${solicitud.IdSolicitud}/resultado`
                    }
                    className="mt-auto"
                  >
                    <Boton variante="texto" tamano="sm">
                      {solicitud.Estado === 'BORRADOR' ? 'Continuar solicitud →' : 'Ver estado →'}
                    </Boton>
                  </Link>
                </Tarjeta>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-headline-sm font-semibold text-on-surface">Notificaciones</h2>
          {panel.notificaciones.length === 0 ? (
            <div className="mt-4">
              <EstadoVacio titulo="Sin notificaciones" />
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-2">
              {panel.notificaciones.map((notificacion) => (
                <li key={notificacion.IdNotificacion}>
                  <button
                    type="button"
                    onClick={() => manejarClicNotificacion(notificacion)}
                    className={`w-full rounded-md border p-3 text-left text-body-sm transition ${
                      notificacion.Leida
                        ? 'border-outline-variant bg-surface-container-lowest'
                        : 'border-primary-container bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-on-surface">{notificacion.Titulo}</p>
                      {!notificacion.Leida && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-container" />}
                    </div>
                    <p className="text-on-surface-variant">{notificacion.Mensaje}</p>
                    {notificacion.FechaCreacion && (
                      <p className="mt-1 text-label-sm text-on-surface-variant">{formatearFecha(notificacion.FechaCreacion)}</p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
