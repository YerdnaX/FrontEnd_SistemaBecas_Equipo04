import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import SelectorArchivoBase64 from '../../componentes/formularios/SelectorArchivoBase64.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import {
  agregarDocumentoRenovacion,
  actualizarRenovacion,
  crearRenovacion,
  disponibilidadRenovacion,
  obtenerArchivoRenovacion,
  obtenerRenovacion
} from '../../servicios/servicioSegmentoDos.js';
import { abrirArchivo } from '../../utilidades/archivos.js';

export default function RenovacionBeca() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [renovacion, setRenovacion] = useState(null);
  const [datos, setDatos] = useState({ actualizacionSocioeconomica: '', declaracion: false });
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const peticion = id === 'nueva' ? disponibilidadRenovacion() : obtenerRenovacion(id);
    peticion.then((respuesta) => {
      if (id === 'nueva') {
        setDisponibilidad(respuesta.datos);
      } else {
        setRenovacion(respuesta.datos);
        setDatos({
          actualizacionSocioeconomica: respuesta.datos.datosActualizados?.actualizacionSocioeconomica || '',
          declaracion: respuesta.datos.datosActualizados?.declaracion === true
        });
      }
    })
      .catch((error) => setMensaje({ tipo: 'error', texto: error.message }))
      .finally(() => setCargando(false));
  }, [id]);

  async function iniciar() {
    try {
      if (disponibilidad?.renovacionExistente) {
        navegar(`/becado/renovaciones/${disponibilidad.renovacionExistente.IdRenovacion}`, { replace: true });
        return;
      }
      const respuesta = await crearRenovacion({ datosActualizados: datos });
      navegar(`/becado/renovaciones/${respuesta.datos.IdRenovacion}`, { replace: true });
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  async function guardar(enviar) {
    try {
      if (archivo) await agregarDocumentoRenovacion(id, archivo);
      const respuesta = await actualizarRenovacion(id, { datosActualizados: datos, enviar });
      setRenovacion(respuesta.datos);
      setArchivo(null);
      setMensaje({ tipo: 'exito', texto: enviar ? 'Renovación enviada a reevaluación.' : 'Borrador guardado.' });
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  async function abrirDocumento(idDocumento) {
    const ventana = window.open('', '_blank');
    try {
      const respuesta = await obtenerArchivoRenovacion(id, idDocumento);
      abrirArchivo(respuesta.datos, ventana);
    } catch (error) {
      ventana?.close();
      setMensaje({ tipo: 'error', texto: error.message });
    }
  }

  if (cargando) return <EstadoCarga />;
  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Renovación de beca" descripcion="Revise la información precargada, actualice cambios y entregue los respaldos del periodo." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      {id === 'nueva' && (
        <Tarjeta>
          <h2 className="text-headline-sm font-semibold text-on-surface">{disponibilidad?.renovacionExistente ? 'Renovación del periodo ya iniciada' : disponibilidad?.disponible ? 'Periodo de renovación abierto' : 'Renovación no disponible'}</h2>
          <p className="mt-3">{disponibilidad?.periodo?.Periodo || 'No hay un periodo activo.'}</p>
          <Boton className="mt-5" deshabilitado={!disponibilidad?.disponible && !disponibilidad?.renovacionExistente} onClick={iniciar}>{disponibilidad?.renovacionExistente ? 'Ver renovación existente' : 'Iniciar renovación'}</Boton>
        </Tarjeta>
      )}
      {renovacion && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Tarjeta>
            <h2 className="font-semibold text-on-surface">Información del expediente</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <p>Carné: <strong>{renovacion.NumeroEstudiante}</strong></p>
              <p>Carrera: <strong>{renovacion.Carrera}</strong></p>
              <p>Promedio: <strong>{renovacion.Promedio}</strong></p>
              <p>Cobertura actual: <strong>{renovacion.Porcentaje}%</strong></p>
            </div>
            <div className="mt-6 space-y-4">
              <CampoAreaTexto etiqueta="Actualización socioeconómica" value={datos.actualizacionSocioeconomica} onChange={(e) => setDatos({ ...datos, actualizacionSocioeconomica: e.target.value })} disabled={renovacion.Estado !== 'BORRADOR'} />
              {renovacion.Estado === 'BORRADOR' && <SelectorArchivoBase64 etiqueta="Comprobante actualizado" onChange={setArchivo} />}
              <label className="flex items-center gap-2 text-body-sm">
                <input type="checkbox" className="h-4 w-4 rounded-sm border-outline-variant bg-surface-container-low text-primary-container focus-visible:ring-2 focus-visible:ring-primary accent-primary-container" checked={datos.declaracion} onChange={(e) => setDatos({ ...datos, declaracion: e.target.checked })} disabled={renovacion.Estado !== 'BORRADOR'} />
                Declaro que la información es veraz y vigente.
              </label>
              {renovacion.Estado === 'BORRADOR' && <div className="flex gap-2"><Boton variante="secundario" onClick={() => guardar(false)}>Guardar borrador</Boton><Boton deshabilitado={!datos.declaracion || (!archivo && !renovacion.documentos?.length)} onClick={() => guardar(true)}>Enviar renovación</Boton></div>}
            </div>
          </Tarjeta>
          <Tarjeta className="h-fit">
            <p className="text-label-md uppercase text-on-surface-variant">Estado del trámite</p>
            <p className="mt-2 text-headline-sm font-semibold text-on-surface">{renovacion.Estado}</p>
            <p className="mt-4 text-body-sm">Periodo: {renovacion.Periodo}</p>
            <p className="mt-2 text-body-sm">Documentos: {renovacion.documentos?.length || 0}</p>
            <div className="mt-2 space-y-1">
              {renovacion.documentos?.map((documento) => (
                <Boton key={documento.IdDocumentoRenovacion} variante="texto" className="block" onClick={() => abrirDocumento(documento.IdDocumentoRenovacion)}>
                  Ver {documento.NombreOriginal}
                </Boton>
              ))}
            </div>
            {renovacion.Resultado && <AlertaMensaje tipo="info" titulo="Resolución"><p>{renovacion.Resultado}</p><p>{renovacion.Motivo}</p></AlertaMensaje>}
          </Tarjeta>
        </div>
      )}
    </div>
  );
}
