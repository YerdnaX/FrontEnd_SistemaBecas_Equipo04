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
import { formatearFecha } from '../../utilidades/formato.js';

export default function PanelAspirante() {
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
      await cargar();
    } catch (err) {
      setErrorCreacion(err.mensaje || 'No fue posible crear la solicitud.');
    } finally {
      setCreando(false);
    }
  }

  if (cargando) return <EstadoCarga mensaje="Cargando su panel..." />;
  if (error) return <AlertaMensaje tipo="error">{error}</AlertaMensaje>;

  const convocatoriasDisponibles = convocatorias.filter(
    (c) => !panel.solicitudes.some((s) => s.IdConvocatoria === c.IdConvocatoria)
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-headline-lg font-semibold text-primary">Panel del aspirante</h1>
        <p className="text-body-md text-on-surface-variant">Gestione sus solicitudes de beca y consulte sus notificaciones.</p>
      </div>

      <Tarjeta>
        <h2 className="text-headline-sm font-semibold text-on-surface">Nueva solicitud</h2>
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

      <div>
        <h2 className="text-headline-sm font-semibold text-on-surface">Mis solicitudes</h2>
        {panel.solicitudes.length === 0 ? (
          <EstadoVacio titulo="Aún no tiene solicitudes" descripcion="Cree una solicitud a partir de una convocatoria vigente." />
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {panel.solicitudes.map((solicitud) => (
              <Tarjeta key={solicitud.IdSolicitud}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-primary">{solicitud.NombreConvocatoria}</p>
                  <EtiquetaEstado estado={solicitud.Estado} />
                </div>
                <p className="mt-2 text-body-sm text-on-surface-variant">Progreso: {solicitud.Progreso}%</p>
                <p className="text-body-sm text-on-surface-variant">Creada: {formatearFecha(solicitud.FechaCreacion)}</p>
                <Link
                  to={
                    solicitud.Estado === 'BORRADOR'
                      ? `/aspirante/solicitudes/${solicitud.IdSolicitud}/personal`
                      : `/aspirante/solicitudes/${solicitud.IdSolicitud}/resultado`
                  }
                  className="mt-3 inline-block text-body-sm font-semibold text-primary-container hover:underline"
                >
                  {solicitud.Estado === 'BORRADOR' ? 'Continuar solicitud →' : 'Ver estado →'}
                </Link>
              </Tarjeta>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-headline-sm font-semibold text-on-surface">Notificaciones</h2>
        {panel.notificaciones.length === 0 ? (
          <EstadoVacio titulo="Sin notificaciones" />
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {panel.notificaciones.map((notificacion) => (
              <li key={notificacion.IdNotificacion} className="rounded-md border border-outline-variant bg-surface-container-lowest p-3 text-body-sm">
                <p className="font-semibold text-on-surface">{notificacion.Titulo}</p>
                <p className="text-on-surface-variant">{notificacion.Mensaje}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
