import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { listarConvocatorias, enviarAprobacion, aprobarConvocatoria, publicarConvocatoria } from '../../servicios/servicioConvocatorias.js';
import { formatearFecha } from '../../utilidades/formato.js';
import { useSesion } from '../../hooks/useSesion.js';

export default function ListaConvocatoriasAdministrativas() {
  const { tienePermiso } = useSesion();
  const [convocatorias, setConvocatorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState(null);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await listarConvocatorias();
      setConvocatorias(respuesta.datos);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function ejecutarAccion(accion, id) {
    setProcesando(id);
    setError(null);
    try {
      await accion(id);
      await cargar();
    } catch (err) {
      setError(err.mensaje || 'No fue posible completar la acción.');
    } finally {
      setProcesando(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg font-semibold text-primary">Convocatorias</h1>
        {tienePermiso('CONVOCATORIA_CREAR') && (
          <Link to="/admin/convocatorias/nueva"><Boton>Nueva convocatoria</Boton></Link>
        )}
      </div>

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}
      {cargando && <EstadoCarga />}
      {!cargando && convocatorias.length === 0 && <EstadoVacio titulo="No hay convocatorias registradas" />}

      {!cargando && convocatorias.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg bg-surface-container-lowest shadow-elevation-l2">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Tipo de beca</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Vigencia</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {convocatorias.map((convocatoria) => (
                <tr key={convocatoria.IdConvocatoria} className="border-t border-outline-variant">
                  <td className="px-4 py-3">{convocatoria.Nombre}</td>
                  <td className="px-4 py-3">{convocatoria.NombreTipoBeca}</td>
                  <td className="px-4 py-3"><EtiquetaEstado estado={convocatoria.Estado} /></td>
                  <td className="px-4 py-3">{formatearFecha(convocatoria.FechaInicio)} – {formatearFecha(convocatoria.FechaFin)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
                      {tienePermiso('CONVOCATORIA_EDITAR') && (
                        <Link to={`/admin/convocatorias/${convocatoria.IdConvocatoria}`} className="text-primary-container hover:underline">Editar</Link>
                      )}
                      {tienePermiso('CONVOCATORIA_VER') && (
                        <Link to={`/admin/convocatorias/${convocatoria.IdConvocatoria}/etapas`} className="text-primary-container hover:underline">Etapas</Link>
                      )}
                      {convocatoria.Estado === 'BORRADOR' && tienePermiso('CONVOCATORIA_EDITAR') && (
                        <button className="text-primary-container hover:underline" disabled={procesando === convocatoria.IdConvocatoria}
                          onClick={() => ejecutarAccion(enviarAprobacion, convocatoria.IdConvocatoria)}>
                          Enviar a aprobación
                        </button>
                      )}
                      {convocatoria.Estado === 'PENDIENTE_APROBACION' && tienePermiso('CONVOCATORIA_APROBAR') && (
                        <button className="text-primary-container hover:underline" disabled={procesando === convocatoria.IdConvocatoria}
                          onClick={() => ejecutarAccion(aprobarConvocatoria, convocatoria.IdConvocatoria)}>
                          Aprobar
                        </button>
                      )}
                      {convocatoria.Estado === 'APROBADA' && tienePermiso('CONVOCATORIA_PUBLICAR') && (
                        <button className="text-primary-container hover:underline" disabled={procesando === convocatoria.IdConvocatoria}
                          onClick={() => ejecutarAccion(publicarConvocatoria, convocatoria.IdConvocatoria)}>
                          Publicar
                        </button>
                      )}
                      {!tienePermiso('CONVOCATORIA_EDITAR') && !tienePermiso('CONVOCATORIA_APROBAR') && !tienePermiso('CONVOCATORIA_PUBLICAR') && (
                        <span className="text-on-surface-variant">Solo lectura</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
