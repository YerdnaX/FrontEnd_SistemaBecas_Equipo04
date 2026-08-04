import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { obtenerSesion, registrarVoto, cerrarSesion } from '../../servicios/servicioComite.js';

const OPCIONES_DECISION = [
  { valor: 'APROBADA', etiqueta: 'Aprobada' },
  { valor: 'CONDICIONADA', etiqueta: 'Condicionada' },
  { valor: 'LISTA_ESPERA', etiqueta: 'Lista de espera' },
  { valor: 'RECHAZADA', etiqueta: 'Rechazada' }
];

export default function SesionComite() {
  const { id } = useParams();
  const [sesion, setSesion] = useState(null);
  const [votos, setVotos] = useState({});
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

  function actualizarVoto(caso, campo, valor) {
    setVotos((actual) => ({
      ...actual,
      [caso.IdExpediente]: {
        tipoDecision: caso.votoActual?.TipoDecision || '',
        motivo: caso.votoActual?.Motivo || '',
        ...actual[caso.IdExpediente],
        [campo]: valor
      }
    }));
  }

  async function manejarGuardarVoto(caso) {
    const voto = votos[caso.IdExpediente] || {
      tipoDecision: caso.votoActual?.TipoDecision,
      motivo: caso.votoActual?.Motivo
    };
    if (!voto.tipoDecision) return;
    setProcesandoId(caso.IdExpediente);
    setError(null);
    try {
      await registrarVoto(id, caso.IdExpediente, voto);
      await cargar();
    } catch (err) {
      setError(err.mensaje || 'No fue posible registrar el voto.');
    } finally {
      setProcesandoId(null);
    }
  }

  async function manejarCerrarSesion() {
    if (!window.confirm('¿Confirma cerrar la sesión y publicar la decisión mayoritaria?')) return;
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

  if (cargando && !sesion) return <EstadoCarga />;
  if (!sesion) return error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>;
  const todosVotaron = sesion.casos.every((caso) => caso.votos.length === sesion.miembros.length);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg font-semibold text-primary">{sesion.Nombre}</h1>
          <p className="text-body-sm text-on-surface-variant">{sesion.NombreConvocatoria} · {sesion.Periodo}</p>
        </div>
        <EtiquetaEstado estado={sesion.Estado} />
      </div>

      {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
      <Tarjeta>
        <h2 className="font-semibold">Integrantes de esta sesión ({sesion.miembros.length})</h2>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          {sesion.miembros.map((miembro) => `${miembro.NombreMiembro} (${miembro.Cargo || 'Miembro'})`).join(' · ')}
        </p>
        {!sesion.miembroActual && sesion.Estado === 'ABIERTA' && (
          <div className="mt-3"><AlertaMensaje tipo="advertencia">Puede consultar la sesión, pero no votar porque no integra su nómina.</AlertaMensaje></div>
        )}
      </Tarjeta>

      <div className="flex flex-col gap-4">
        {sesion.casos.map((caso) => {
          const votoFormulario = votos[caso.IdExpediente] || {};
          return (
            <Tarjeta key={caso.IdCasoSesion}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{caso.NombreAspirante} {caso.ApellidoAspirante} — {caso.CodigoExpediente}</p>
                <p className="text-body-sm">Puntaje {caso.PuntajeTotal ?? '—'} · Q{caso.Quintil ?? '—'} (INEC {caso.AnioReferencia ?? '—'}) · {caso.votos.length}/{sesion.miembros.length} votos</p>
              </div>
              <div className="mt-3 grid gap-3 rounded-md bg-surface-container-low p-3 sm:grid-cols-3">
                <p><strong>Cobertura definida:</strong> {caso.PorcentajeDefinido}%</p>
                <p><strong>Recomendación social:</strong> {caso.RecomendacionSocial || '—'}</p>
                <p><strong>Ingreso per cápita:</strong> {caso.IngresoPerCapita == null ? '—' : `₡${Number(caso.IngresoPerCapita).toLocaleString('es-CR')}`}</p>
                <p className="sm:col-span-3"><strong>Resumen social:</strong> {caso.ResumenSocial || '—'}</p>
                <p className="sm:col-span-3"><strong>Hallazgos:</strong> {caso.HallazgosSociales || '—'}</p>
              </div>

              {caso.IdDecision ? (
                <div className="mt-3">
                  <EtiquetaEstado estado={caso.TipoDecision} />
                  <p className="mt-1 text-body-sm">La cobertura la determina el tipo de beca: {caso.PorcentajeDefinido}%.</p>
                  {caso.Motivo && <p className="text-body-sm text-on-surface-variant">Acuerdo: {caso.Motivo}</p>}
                </div>
              ) : sesion.Estado === 'ABIERTA' && sesion.miembroActual ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-3 sm:items-end">
                  <CampoSelect etiqueta="Mi voto" opciones={OPCIONES_DECISION}
                    value={votoFormulario.tipoDecision ?? caso.votoActual?.TipoDecision ?? ''}
                    onChange={(e) => actualizarVoto(caso, 'tipoDecision', e.target.value)} />
                  <CampoTexto etiqueta="Motivo" value={votoFormulario.motivo ?? caso.votoActual?.Motivo ?? ''}
                    onChange={(e) => actualizarVoto(caso, 'motivo', e.target.value)} />
                  <Boton cargando={procesandoId === caso.IdExpediente} onClick={() => manejarGuardarVoto(caso)}>
                    {caso.votoActual ? 'Actualizar mi voto' : 'Registrar mi voto'}
                  </Boton>
                </div>
              ) : null}
            </Tarjeta>
          );
        })}
      </div>

      {sesion.Estado === 'ABIERTA' && sesion.miembroActual && (
        <Boton variante="peligro" deshabilitado={!todosVotaron} cargando={cerrando} onClick={manejarCerrarSesion}>
          Cerrar sesión por mayoría y publicar resultados
        </Boton>
      )}
    </div>
  );
}
