import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { obtenerSesion, registrarDecision, cerrarSesion } from '../../servicios/servicioComite.js';

const OPCIONES_DECISION = [
  { valor: 'APROBADA', etiqueta: 'Aprobada' },
  { valor: 'CONDICIONADA', etiqueta: 'Condicionada' },
  { valor: 'LISTA_ESPERA', etiqueta: 'Lista de espera' },
  { valor: 'RECHAZADA', etiqueta: 'Rechazada' }
];

export default function SesionComite() {
  const { id } = useParams();
  const [sesion, setSesion] = useState(null);
  const [decisiones, setDecisiones] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [procesandoId, setProcesandoId] = useState(null);
  const [cerrando, setCerrando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await obtenerSesion(id);
      setSesion(respuesta.datos);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  function actualizarDecision(idExpediente, campo, valor) {
    setDecisiones((actual) => ({ ...actual, [idExpediente]: { ...actual[idExpediente], [campo]: valor } }));
  }

  async function manejarGuardarDecision(idExpediente) {
    const decision = decisiones[idExpediente];
    if (!decision?.tipoDecision) return;
    setProcesandoId(idExpediente);
    setError(null);
    try {
      await registrarDecision(id, idExpediente, decision);
      await cargar();
    } catch (err) {
      setError(err.mensaje || 'No fue posible registrar la decisión.');
    } finally {
      setProcesandoId(null);
    }
  }

  async function manejarCerrarSesion() {
    if (!window.confirm('¿Confirma cerrar la sesión y publicar los resultados? Esta acción no se puede deshacer.')) return;
    setCerrando(true);
    setError(null);
    try {
      await cerrarSesion(id);
      await cargar();
    } catch (err) {
      setError(err.mensaje || 'No fue posible cerrar la sesión.');
    } finally {
      setCerrando(false);
    }
  }

  if (cargando) return <EstadoCarga />;

  const todosDecididos = sesion.casos.every((caso) => caso.IdDecision);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg font-semibold text-primary">{sesion.Nombre}</h1>
          <p className="text-body-sm text-on-surface-variant">{sesion.NombreConvocatoria}</p>
        </div>
        <EtiquetaEstado estado={sesion.Estado} />
      </div>

      {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}

      <div className="flex flex-col gap-4">
        {sesion.casos.map((caso) => (
          <Tarjeta key={caso.IdCasoSesion}>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-on-surface">{caso.NombreAspirante} {caso.ApellidoAspirante} — {caso.CodigoExpediente}</p>
              <p className="text-body-sm text-on-surface-variant">Puntaje: {caso.PuntajeTotal ?? '—'} (pos. {caso.Posicion ?? '—'})</p>
            </div>

            {caso.IdDecision ? (
              <div className="mt-3">
                <EtiquetaEstado estado={caso.TipoDecision} />
                {caso.PorcentajeBeca !== null && <p className="mt-1 text-body-sm">Porcentaje: {caso.PorcentajeBeca}%</p>}
                {caso.Motivo && <p className="text-body-sm text-on-surface-variant">Motivo: {caso.Motivo}</p>}
              </div>
            ) : sesion.Estado === 'ABIERTA' ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-4 sm:items-end">
                <CampoSelect etiqueta="Decisión" opciones={OPCIONES_DECISION}
                  value={decisiones[caso.IdExpediente]?.tipoDecision || ''}
                  onChange={(e) => actualizarDecision(caso.IdExpediente, 'tipoDecision', e.target.value)} />
                <CampoTexto etiqueta="Porcentaje beca" type="number" min="0" max="100"
                  value={decisiones[caso.IdExpediente]?.porcentajeBeca || ''}
                  onChange={(e) => actualizarDecision(caso.IdExpediente, 'porcentajeBeca', e.target.value)} />
                <CampoTexto etiqueta="Motivo" value={decisiones[caso.IdExpediente]?.motivo || ''}
                  onChange={(e) => actualizarDecision(caso.IdExpediente, 'motivo', e.target.value)} />
                <Boton cargando={procesandoId === caso.IdExpediente} onClick={() => manejarGuardarDecision(caso.IdExpediente)}>
                  Guardar decisión
                </Boton>
              </div>
            ) : null}
          </Tarjeta>
        ))}
      </div>

      {sesion.Estado === 'ABIERTA' && (
        <Boton variante="peligro" deshabilitado={!todosDecididos} cargando={cerrando} onClick={manejarCerrarSesion}>
          Cerrar sesión y publicar resultados
        </Boton>
      )}
    </div>
  );
}
