import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import { listarExpedientesDisponibles, crearSesion } from '../../servicios/servicioComite.js';

export default function PanelComite() {
  const navegar = useNavigate();
  const [expedientes, setExpedientes] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [nombreSesion, setNombreSesion] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    listarExpedientesDisponibles()
      .then((respuesta) => setExpedientes(respuesta.datos))
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

  return (
    <div>
      <h1 className="text-headline-lg font-semibold text-primary">Revisión de expedientes priorizados</h1>
      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}

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
                  <th className="px-4 py-3">Puntaje</th>
                </tr>
              </thead>
              <tbody>
                {expedientes.map((expediente) => (
                  <tr key={expediente.IdExpediente} className="border-t border-outline-variant">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={seleccionados.includes(expediente.IdExpediente)}
                        onChange={() => alternarSeleccion(expediente.IdExpediente)} />
                    </td>
                    <td className="px-4 py-3">{expediente.Posicion ?? '—'}</td>
                    <td className="px-4 py-3">{expediente.CodigoExpediente}</td>
                    <td className="px-4 py-3">{expediente.NombreAspirante} {expediente.ApellidoAspirante}</td>
                    <td className="px-4 py-3">{expediente.NombreConvocatoria}</td>
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
