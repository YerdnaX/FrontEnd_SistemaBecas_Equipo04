import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import {
  obtenerExpediente,
  revisarDocumento,
  solicitarSubsanacion,
  resolverElegibilidad,
  obtenerArchivoDocumentoExpediente
} from '../../servicios/servicioExpedientes.js';
import { obtenerArchivoDocumento } from '../../servicios/servicioSolicitudes.js';
import { abrirArchivo, descargarArchivo } from '../../utilidades/archivos.js';

export default function VerificacionDocumental() {
  const { id } = useParams();
  const [expediente, setExpediente] = useState(null);
  const [observaciones, setObservaciones] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [procesandoId, setProcesandoId] = useState(null);
  const [procesandoArchivoId, setProcesandoArchivoId] = useState(null);
  const [motivoSubsanacion, setMotivoSubsanacion] = useState('');
  const [motivoElegibilidad, setMotivoElegibilidad] = useState('');

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await obtenerExpediente(id);
      setExpediente(respuesta.datos);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  async function manejarRevision(idDocumento, estado) {
    const observacion = observaciones[idDocumento] || '';
    if (['RECHAZADO', 'REQUIERE_SUBSANACION'].includes(estado) && !observacion.trim()) {
      setError('Debe indicar una observación al rechazar un documento o solicitar su subsanación.');
      return;
    }
    setProcesandoId(idDocumento);
    setError(null);
    try {
      await revisarDocumento(id, idDocumento, { estado, observacion });
      await cargar();
    } catch (err) {
      setError(err.mensaje || 'No fue posible registrar la revisión.');
    } finally {
      setProcesandoId(null);
    }
  }

  async function manejarSubsanacion() {
    setError(null);
    try {
      await solicitarSubsanacion(id, motivoSubsanacion);
      await cargar();
    } catch (err) {
      setError(err.mensaje || 'No fue posible solicitar la subsanación.');
    }
  }

  async function manejarElegibilidad(esElegible) {
    setError(null);
    try {
      await resolverElegibilidad(id, { esElegible, motivo: motivoElegibilidad });
      await cargar();
    } catch (err) {
      setError(err.mensaje || 'No fue posible resolver la elegibilidad.');
    }
  }

  async function manejarArchivo(idDocumento, accion) {
    const ventana = accion === 'abrir' ? window.open('', '_blank') : null;
    setProcesandoArchivoId(idDocumento);
    setError(null);
    try {
      let respuesta;
      try {
        respuesta = await obtenerArchivoDocumentoExpediente(id, idDocumento);
      } catch {
        respuesta = await obtenerArchivoDocumento(expediente.IdSolicitud, idDocumento);
      }
      if (accion === 'abrir') abrirArchivo(respuesta.datos, ventana);
      else descargarArchivo(respuesta.datos);
    } catch (err) {
      ventana?.close();
      setError(err.mensaje || 'No fue posible obtener el archivo del documento.');
    } finally {
      setProcesandoArchivoId(null);
    }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg font-semibold text-primary">Verificación de documentos — {expediente.CodigoExpediente}</h1>
      {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}

      <div className="flex flex-col gap-4">
        {expediente.documentos.map((documento) => (
          <Tarjeta key={documento.IdDocumentoSolicitud}>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-on-surface">{documento.NombreRequisito || 'Documento'}</p>
              <EtiquetaEstado estado={documento.Estado} />
            </div>
            <p className="mt-2 text-body-sm text-on-surface-variant">
              Archivo: {documento.NombreOriginal || `Documento #${documento.IdDocumentoSolicitud}`}
            </p>
            <div className="mt-3 flex gap-2">
              <Boton
                variante="secundario"
                cargando={procesandoArchivoId === documento.IdDocumentoSolicitud}
                onClick={() => manejarArchivo(documento.IdDocumentoSolicitud, 'abrir')}
              >
                Ver archivo
              </Boton>
              <Boton
                variante="secundario"
                cargando={procesandoArchivoId === documento.IdDocumentoSolicitud}
                onClick={() => manejarArchivo(documento.IdDocumentoSolicitud, 'descargar')}
              >
                Descargar
              </Boton>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
              <CampoTexto className="flex-1" etiqueta="Observación (obligatoria para rechazar o solicitar subsanación)" value={observaciones[documento.IdDocumentoSolicitud] || ''}
                onChange={(e) => setObservaciones((actual) => ({ ...actual, [documento.IdDocumentoSolicitud]: e.target.value }))} />
              <div className="flex gap-2">
                <Boton variante="secundario" cargando={procesandoId === documento.IdDocumentoSolicitud}
                  onClick={() => manejarRevision(documento.IdDocumentoSolicitud, 'VALIDO')}>Validar</Boton>
                <Boton variante="secundario" cargando={procesandoId === documento.IdDocumentoSolicitud}
                  onClick={() => manejarRevision(documento.IdDocumentoSolicitud, 'REQUIERE_SUBSANACION')}>Subsanación</Boton>
                <Boton variante="peligro" cargando={procesandoId === documento.IdDocumentoSolicitud}
                  onClick={() => manejarRevision(documento.IdDocumentoSolicitud, 'RECHAZADO')}>Rechazar</Boton>
              </div>
            </div>
          </Tarjeta>
        ))}
      </div>

      <Tarjeta>
        <h2 className="text-headline-sm font-semibold text-on-surface">Solicitar subsanación general</h2>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
          <CampoTexto className="flex-1" etiqueta="Observación para el aspirante" value={motivoSubsanacion}
            onChange={(e) => setMotivoSubsanacion(e.target.value)} />
          <Boton onClick={manejarSubsanacion}>Solicitar subsanación</Boton>
        </div>
      </Tarjeta>

      <Tarjeta>
        <h2 className="text-headline-sm font-semibold text-on-surface">Resolver elegibilidad</h2>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          No se puede declarar elegible mientras existan documentos obligatorios pendientes o rechazados.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
          <CampoTexto className="flex-1" etiqueta="Motivo (obligatorio si no es elegible)" value={motivoElegibilidad}
            onChange={(e) => setMotivoElegibilidad(e.target.value)} />
          <div className="flex gap-2">
            <Boton onClick={() => manejarElegibilidad(true)}>Declarar elegible</Boton>
            <Boton variante="peligro" onClick={() => manejarElegibilidad(false)}>Declarar no elegible</Boton>
          </div>
        </div>
      </Tarjeta>
    </div>
  );
}
