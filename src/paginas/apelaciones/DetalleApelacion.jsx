import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { useSesion } from '../../hooks/useSesion.js';
import { obtenerApelacion, asignarRevisorApelacion, resolverApelacion } from '../../servicios/servicioApelaciones.js';

export default function DetalleApelacion() {
  const { id } = useParams();
  const { usuario } = useSesion();
  const [apelacion, setApelacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [idRevisor, setIdRevisor] = useState('');
  const [nuevoPorcentaje, setNuevoPorcentaje] = useState('');
  const [motivoResolucion, setMotivoResolucion] = useState('');
  const [procesando, setProcesando] = useState(false);

  const permisos = usuario?.permisos || [];

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await obtenerApelacion(id);
      setApelacion(respuesta.datos);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  async function asignar() {
    setProcesando(true);
    setError(null);
    try {
      await asignarRevisorApelacion(id, Number(idRevisor));
      setMensaje('Revisor asignado correctamente.');
      await cargar();
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setProcesando(false);
    }
  }

  async function resolver(aFavor) {
    setProcesando(true);
    setError(null);
    try {
      await resolverApelacion(id, {
        aFavor,
        motivo: motivoResolucion,
        nuevoPorcentaje: aFavor && nuevoPorcentaje ? Number(nuevoPorcentaje) : undefined
      });
      setMensaje('Apelación resuelta correctamente.');
      await cargar();
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) return <EstadoCarga />;
  if (!apelacion) return error ? <AlertaMensaje tipo="error">{error}</AlertaMensaje> : null;

  const enTramite = ['PRESENTADA', 'EN_REVISION'].includes(apelacion.Estado);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg font-semibold text-primary">Apelación #{apelacion.IdApelacion}</h1>
        <EtiquetaEstado estado={apelacion.Estado} />
      </div>

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}
      {mensaje && <div className="mt-4"><AlertaMensaje tipo="exito">{mensaje}</AlertaMensaje></div>}

      <Tarjeta className="mt-6">
        <p className="text-body-sm text-on-surface-variant">Aspirante</p>
        <p className="text-body-md">{apelacion.NombreAspirante} {apelacion.ApellidoAspirante}</p>

        <p className="mt-4 text-body-sm text-on-surface-variant">Resolución apelada</p>
        <p className="text-body-md">{apelacion.NumeroResolucion || '—'} ({apelacion.TipoResultado || 'sin definir'})</p>

        <p className="mt-4 text-body-sm text-on-surface-variant">Motivo</p>
        <p className="whitespace-pre-wrap text-body-md">{apelacion.Motivo}</p>

        {apelacion.documentos?.length > 0 && (
          <>
            <p className="mt-4 text-body-sm text-on-surface-variant">Documentos adjuntos</p>
            <ul className="list-inside list-disc text-body-md">
              {apelacion.documentos.map((doc) => <li key={doc.IdDocumentoApelacion}>{doc.NombreOriginal}</li>)}
            </ul>
          </>
        )}
      </Tarjeta>

      {permisos.includes('APELACION_ASIGNAR') && enTramite && (
        <Tarjeta className="mt-6">
          <h2 className="text-headline-sm font-semibold text-on-surface">Asignar revisor</h2>
          <div className="mt-3 flex items-end gap-3">
            <CampoTexto
              etiqueta="ID de usuario revisor"
              type="number"
              value={idRevisor}
              onChange={(e) => setIdRevisor(e.target.value)}
              className="max-w-xs"
            />
            <Boton onClick={asignar} deshabilitado={!idRevisor} cargando={procesando}>Asignar</Boton>
          </div>
        </Tarjeta>
      )}

      {permisos.includes('APELACION_RESOLVER') && enTramite && (
        <Tarjeta className="mt-6">
          <h2 className="text-headline-sm font-semibold text-on-surface">Resolver apelación</h2>
          <div className="mt-3 flex flex-col gap-4">
            <CampoTexto
              etiqueta="Motivo de la resolución"
              value={motivoResolucion}
              onChange={(e) => setMotivoResolucion(e.target.value)}
            />
            <CampoTexto
              etiqueta="Nuevo porcentaje de beca (solo si resuelve a favor)"
              type="number"
              min="0"
              max="100"
              value={nuevoPorcentaje}
              onChange={(e) => setNuevoPorcentaje(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex gap-3">
              <Boton variante="primario" onClick={() => resolver(true)} cargando={procesando}>Resolver a favor</Boton>
              <Boton variante="peligro" onClick={() => resolver(false)} cargando={procesando}>Resolver en contra</Boton>
            </div>
          </div>
        </Tarjeta>
      )}
    </div>
  );
}
