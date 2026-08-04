import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
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
        <h1 className="text-headline-lg font-semibold text-primary">Revisión de expedientes priorizados</h1>
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

        {sesiones.length === 0 ? (
          <div className="mt-4">
            <EstadoVacio titulo="No hay sesiones registradas" descripcion="Cuando un integrante cree una sesión, aparecerá aquí para los demás miembros." />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-outline-variant">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-4 py-3">Sesión</th>
                  <th className="px-4 py-3">Periodo</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Casos</th>
                  <th className="px-4 py-3">Mi participación</th>
                  <th className="px-4 py-3">Creada por</th>
                  <th className="px-4 py-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {sesiones.map((sesion) => (
                  <tr key={sesion.IdSesionComite} className="border-t border-outline-variant">
                    <td className="px-4 py-3">
                      <span className="font-semibold">{sesion.Nombre}</span>
                      <span className="block text-label-sm text-on-surface-variant">{sesion.NombreConvocatoria}</span>
                    </td>
                    <td className="px-4 py-3">{sesion.Periodo || '—'}</td>
                    <td className="px-4 py-3"><EtiquetaEstado estado={sesion.Estado} /></td>
                    <td className="px-4 py-3">{sesion.TotalCasos}</td>
                    <td className="px-4 py-3">
                      {sesion.MisVotos}/{sesion.TotalCasos} voto(s)
                      {sesion.Estado === 'ABIERTA' && sesion.MisVotosPendientes > 0 && (
                        <span className="block text-label-sm font-semibold text-advertencia">
                          {sesion.MisVotosPendientes} pendiente(s)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {sesion.NombreCreador}
                      <span className="block text-label-sm text-on-surface-variant">{formatearFechaHora(sesion.FechaCreacion)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Boton variante="texto" onClick={() => navegar(`/comite/sesiones/${sesion.IdSesionComite}`)}>
                        {sesion.Estado === 'ABIERTA' ? 'Abrir y votar' : 'Consultar'}
                      </Boton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Tarjeta>

      <h2 className="mt-8 text-headline-sm font-semibold text-primary">Expedientes pendientes de crear sesión</h2>

      <div className="mt-4 max-w-xs">
        <CampoSelect etiqueta="Filtrar por periodo" value={periodo}
          onChange={(e) => { setPeriodo(e.target.value); setSeleccionados([]); }}
          opciones={periodos.map((item) => ({ valor: item, etiqueta: item }))} />
      </div>

      {expedientes.length === 0 ? (
        <EstadoVacio titulo="No hay expedientes listos para el comité" descripcion="Los expedientes aparecen aquí cuando trabajo social los envía al comité." />
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-lg bg-surface-container-lowest shadow-elevation-l2">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3">Posición</th>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Aspirante</th>
                  <th className="px-4 py-3">Convocatoria</th>
                  <th className="px-4 py-3">Periodo</th>
                  <th className="px-4 py-3">Quintil</th>
                  <th className="px-4 py-3">Cobertura</th>
                  <th className="px-4 py-3">Puntaje</th>
                </tr>
              </thead>
              <tbody>
                {expedientesVisibles.map((expediente) => (
                  <tr key={expediente.IdExpediente} className="border-t border-outline-variant">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={seleccionados.includes(expediente.IdExpediente)}
                        disabled={convocatoriaSeleccionada && convocatoriaSeleccionada !== expediente.IdConvocatoria}
                        onChange={() => alternarSeleccion(expediente.IdExpediente)} />
                    </td>
                    <td className="px-4 py-3">{expediente.Posicion ?? '—'}</td>
                    <td className="px-4 py-3">{expediente.CodigoExpediente}</td>
                    <td className="px-4 py-3">{expediente.NombreAspirante} {expediente.ApellidoAspirante}</td>
                    <td className="px-4 py-3">{expediente.NombreConvocatoria}</td>
                    <td className="px-4 py-3">{expediente.Periodo || '—'}</td>
                    <td className="px-4 py-3">Q{expediente.Quintil} <span className="block text-label-sm text-on-surface-variant">INEC {expediente.AnioReferencia}</span></td>
                    <td className="px-4 py-3">{expediente.PorcentajeDefinido}%</td>
                    <td className="px-4 py-3">{expediente.PuntajeTotal ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
