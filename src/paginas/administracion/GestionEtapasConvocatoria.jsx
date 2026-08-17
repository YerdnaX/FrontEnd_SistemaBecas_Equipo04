import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { obtenerConvocatoria, listarEtapas, actualizarEtapa } from '../../servicios/servicioConvocatorias.js';
import { useSesion } from '../../hooks/useSesion.js';

const OPCIONES_ESTADO = [
  { valor: 'PROGRAMADA', etiqueta: 'Programada' },
  { valor: 'ABIERTA', etiqueta: 'Abierta' },
  { valor: 'CERRADA', etiqueta: 'Cerrada' }
];

export default function GestionEtapasConvocatoria() {
  const { id } = useParams();
  const { tienePermiso } = useSesion();
  const puedeGestionar = tienePermiso('ETAPA_GESTIONAR');
  const [convocatoria, setConvocatoria] = useState(null);
  const [etapas, setEtapas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardandoId, setGuardandoId] = useState(null);

  async function cargar() {
    setCargando(true);
    try {
      const [respuestaConvocatoria, respuestaEtapas] = await Promise.all([obtenerConvocatoria(id), listarEtapas(id)]);
      setConvocatoria(respuestaConvocatoria.datos);
      setEtapas(respuestaEtapas.datos.map((e) => ({
        ...e, FechaInicio: e.FechaInicio.slice(0, 16), FechaFin: e.FechaFin.slice(0, 16)
      })));
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  function actualizarCampoEtapa(idEtapa, campo, valor) {
    setEtapas((actual) => actual.map((e) => (e.IdEtapa === idEtapa ? { ...e, [campo]: valor } : e)));
  }

  async function guardarEtapa(etapa) {
    setGuardandoId(etapa.IdEtapa);
    setError(null);
    try {
      await actualizarEtapa(id, etapa.IdEtapa, {
        fechaInicio: etapa.FechaInicio, fechaFin: etapa.FechaFin, estado: etapa.Estado
      });
      await cargar();
    } catch (err) {
      setError(err.mensaje || 'No fue posible actualizar la etapa.');
    } finally {
      setGuardandoId(null);
    }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <div>
      <h1 className="text-headline-lg font-semibold text-on-surface">Etapas de {convocatoria?.Nombre}</h1>
      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}

      <div className="mt-6 flex flex-col gap-4">
        {etapas.map((etapa) => (
          <Tarjeta key={etapa.IdEtapa}>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-on-surface">{etapa.TipoEtapa.replaceAll('_', ' ')}</p>
              <EtiquetaEstado estado={etapa.Estado} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <CampoTexto etiqueta="Fecha y hora inicio" type="datetime-local" value={etapa.FechaInicio} disabled={!puedeGestionar}
                onChange={(e) => actualizarCampoEtapa(etapa.IdEtapa, 'FechaInicio', e.target.value)} />
              <CampoTexto etiqueta="Fecha y hora fin" type="datetime-local" value={etapa.FechaFin} disabled={!puedeGestionar}
                onChange={(e) => actualizarCampoEtapa(etapa.IdEtapa, 'FechaFin', e.target.value)} />
              <CampoSelect etiqueta="Estado" value={etapa.Estado} opciones={OPCIONES_ESTADO} disabled={!puedeGestionar}
                onChange={(e) => actualizarCampoEtapa(etapa.IdEtapa, 'Estado', e.target.value)} />
            </div>
            {puedeGestionar ? (
              <div className="mt-3">
                <Boton cargando={guardandoId === etapa.IdEtapa} onClick={() => guardarEtapa(etapa)}>Guardar cambios</Boton>
              </div>
            ) : (
              <p className="mt-3 text-body-sm text-on-surface-variant">Solo lectura: no tiene permiso para gestionar etapas.</p>
            )}
          </Tarjeta>
        ))}
      </div>
    </div>
  );
}
