import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
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
        <h1 className="text-headline-lg font-semibold text-on-surface">Convocatorias</h1>
        {tienePermiso('CONVOCATORIA_CREAR') && (
          <Link to="/admin/convocatorias/nueva"><Boton>Nueva convocatoria</Boton></Link>
        )}
      </div>

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}

      {cargando ? <EstadoCarga /> : (
        <div className="mt-6">
          <TablaDatos
            clave="IdConvocatoria"
            textoVacio="No hay convocatorias registradas"
            filas={convocatorias}
            columnas={[
              { clave: 'Nombre', etiqueta: 'Nombre' },
              { clave: 'NombreTipoBeca', etiqueta: 'Tipo de beca' },
              { clave: 'Estado', etiqueta: 'Estado', render: (c) => <EtiquetaEstado estado={c.Estado} /> },
              { clave: 'vigencia', etiqueta: 'Vigencia', render: (c) => <>{formatearFecha(c.FechaInicio)} – {formatearFecha(c.FechaFin)}</> },
              {
                clave: 'acciones',
                etiqueta: 'Acciones',
                render: (convocatoria) => (
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
                )
              }
            ]}
          />
        </div>
      )}
    </div>
  );
}
