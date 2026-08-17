import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { formatearFechaHora } from '../../utilidades/formato.js';
import { listarExpedientesDisponibles, listarSesiones, crearSesion } from '../../servicios/servicioComite.js';

export default function PanelComite() {
  const navegar = useNavigate();
  const [expedientes, setExpedientes] = useState([]);
  const [sesiones, setSesiones] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [nombreSesion, setNombreSesion] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    Promise.all([listarExpedientesDisponibles(), listarSesiones()])
      .then(([respuestaExpedientes, respuestaSesiones]) => {
        setExpedientes(respuestaExpedientes.datos);
        setSesiones(respuestaSesiones.datos);
      })
      .catch((err) => setError(err.mensaje))
      .finally(() => setCargando(false));
  }, []);

  function alternarSeleccion(idExpediente) {
    setSeleccionados((actual) =>
      actual.includes(idExpediente) ? actual.filter((id) => id !== idExpediente) : [...actual, idExpediente]
    );
  }

  async function manejarCrearSesion() {
    if (seleccionados.length === 0 || !nombreSesion.trim()) return;
    setCreando(true);
    setError(null);
    try {
      const idConvocatoria = expedientes.find((e) => e.IdExpediente === seleccionados[0])?.IdConvocatoria;
      const respuesta = await crearSesion({ idConvocatoria, nombre: nombreSesion, idsExpedientes: seleccionados });
      navegar(`/comite/sesiones/${respuesta.datos.IdSesionComite}`);
    } catch (err) {
      setError(err.mensaje || 'No fue posible crear la sesión.');
    } finally {
      setCreando(false);
    }
  }

  if (cargando) return <EstadoCarga />;

  const periodos = [...new Set(expedientes.map((item) => item.Periodo).filter(Boolean))].sort().reverse();
  const expedientesVisibles = periodo ? expedientes.filter((item) => item.Periodo === periodo) : expedientes;
  const convocatoriaSeleccionada = expedientes.find((item) => item.IdExpediente === seleccionados[0])?.IdConvocatoria;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-headline-lg font-semibold text-on-surface">Revisión de expedientes priorizados</h1>
        <img src="/images/comitebecas.png" alt="Panel de comité de becas" className="imagen-ui-seccion self-center sm:self-auto" />
      </div>
      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}

      <Tarjeta className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-headline-sm font-semibold text-on-surface">Sesiones compartidas del comité</h2>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Las sesiones creadas por cualquier integrante permanecen disponibles para toda su nómina.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <TablaDatos
            clave="IdSesionComite"
            textoVacio="No hay sesiones registradas"
            filas={sesiones}
            columnas={[
              {
                clave: 'sesion',
                etiqueta: 'Sesión',
                render: (sesion) => <><span className="font-semibold">{sesion.Nombre}</span><span className="block text-label-sm text-on-surface-variant">{sesion.NombreConvocatoria}</span></>
              },
              { clave: 'Periodo', etiqueta: 'Periodo', render: (sesion) => sesion.Periodo || '—' },
              { clave: 'Estado', etiqueta: 'Estado', render: (sesion) => <EtiquetaEstado estado={sesion.Estado} /> },
              { clave: 'TotalCasos', etiqueta: 'Casos' },
              {
                clave: 'participacion',
                etiqueta: 'Mi participación',
                render: (sesion) => (
                  <>
                    {sesion.MisVotos}/{sesion.TotalCasos} voto(s)
                    {sesion.Estado === 'ABIERTA' && sesion.MisVotosPendientes > 0 && (
                      <span className="block text-label-sm font-semibold text-advertencia">
                        {sesion.MisVotosPendientes} pendiente(s)
                      </span>
                    )}
                  </>
                )
              },
              {
                clave: 'creador',
                etiqueta: 'Creada por',
                render: (sesion) => <>{sesion.NombreCreador}<span className="block text-label-sm text-on-surface-variant">{formatearFechaHora(sesion.FechaCreacion)}</span></>
              },
              {
                clave: 'accion',
                etiqueta: 'Acción',
                render: (sesion) => (
                  <Boton variante="texto" onClick={() => navegar(`/comite/sesiones/${sesion.IdSesionComite}`)}>
                    {sesion.Estado === 'ABIERTA' ? 'Abrir y votar' : 'Consultar'}
                  </Boton>
                )
              }
            ]}
          />
        </div>
      </Tarjeta>

      <h2 className="mt-8 text-headline-sm font-semibold text-on-surface">Expedientes pendientes de crear sesión</h2>

      <div className="mt-4 max-w-xs">
        <CampoSelect etiqueta="Filtrar por periodo" value={periodo}
          onChange={(e) => { setPeriodo(e.target.value); setSeleccionados([]); }}
          opciones={periodos.map((item) => ({ valor: item, etiqueta: item }))} />
      </div>

      {expedientes.length === 0 ? (
        <EstadoVacio titulo="No hay expedientes listos para el comité" descripcion="Los expedientes aparecen aquí cuando trabajo social los envía al comité." />
      ) : (
        <>
          <div className="mt-6">
            <TablaDatos
              clave="IdExpediente"
              filas={expedientesVisibles}
              columnas={[
                {
                  clave: 'seleccion',
                  etiqueta: '',
                  render: (expediente) => (
                    <input type="checkbox" checked={seleccionados.includes(expediente.IdExpediente)}
                      disabled={convocatoriaSeleccionada && convocatoriaSeleccionada !== expediente.IdConvocatoria}
                      onChange={() => alternarSeleccion(expediente.IdExpediente)} />
                  )
                },
                { clave: 'Posicion', etiqueta: 'Posición', render: (e) => e.Posicion ?? '—' },
                { clave: 'CodigoExpediente', etiqueta: 'Código' },
                { clave: 'aspirante', etiqueta: 'Aspirante', render: (e) => <>{e.NombreAspirante} {e.ApellidoAspirante}</> },
                { clave: 'NombreConvocatoria', etiqueta: 'Convocatoria' },
                { clave: 'Periodo', etiqueta: 'Periodo', render: (e) => e.Periodo || '—' },
                { clave: 'Quintil', etiqueta: 'Quintil', render: (e) => <>Q{e.Quintil} <span className="block text-label-sm text-on-surface-variant">INEC {e.AnioReferencia}</span></> },
                { clave: 'PorcentajeDefinido', etiqueta: 'Cobertura', render: (e) => `${e.PorcentajeDefinido}%` },
                { clave: 'PuntajeTotal', etiqueta: 'Puntaje', render: (e) => e.PuntajeTotal ?? '—' }
              ]}
            />
          </div>

          <Tarjeta className="mt-6">
            <h2 className="text-headline-sm font-semibold text-on-surface">Crear sesión de comité</h2>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
              <CampoTexto className="flex-1" etiqueta="Nombre de la sesión" value={nombreSesion} onChange={(e) => setNombreSesion(e.target.value)} />
              <Boton onClick={manejarCrearSesion} cargando={creando} deshabilitado={seleccionados.length === 0 || !nombreSesion.trim()}>
                Crear sesión con {seleccionados.length} caso(s)
              </Boton>
            </div>
          </Tarjeta>
        </>
      )}
    </div>
  );
}
