import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import SelectorArchivoBase64 from '../../componentes/formularios/SelectorArchivoBase64.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { agregarDocumentoRenovacion, actualizarRenovacion, crearRenovacion, disponibilidadRenovacion, obtenerRenovacion } from '../../servicios/servicioSegmentoDos.js';

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
    peticion.then((respuesta) => id === 'nueva' ? setDisponibilidad(respuesta.datos) : setRenovacion(respuesta.datos))
      .catch((error) => setMensaje({ tipo: 'error', texto: error.message }))
      .finally(() => setCargando(false));
  }, [id]);

  async function iniciar() {
    try {
      const respuesta = await crearRenovacion({ datosActualizados: datos });
      navegar(`/becado/renovaciones/${respuesta.datos.IdRenovacion}`, { replace: true });
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  async function guardar(enviar) {
    try {
      if (archivo) await agregarDocumentoRenovacion(id, archivo);
      const respuesta = await actualizarRenovacion(id, { datosActualizados: datos, enviar });
      setRenovacion(respuesta.datos);
      setMensaje({ tipo: 'exito', texto: enviar ? 'Renovación enviada a reevaluación.' : 'Borrador guardado.' });
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  if (cargando) return <EstadoCarga />;
  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Renovación de beca" descripcion="Revise la información precargada, actualice cambios y entregue los respaldos del periodo." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      {id === 'nueva' && (
        <Tarjeta>
          <h2 className="text-headline-sm font-semibold text-primary">{disponibilidad?.disponible ? 'Periodo de renovación abierto' : 'Renovación no disponible'}</h2>
          <p className="mt-3">{disponibilidad?.periodo?.Periodo || 'No hay un periodo activo.'}</p>
          <Boton className="mt-5" deshabilitado={!disponibilidad?.disponible} onClick={iniciar}>Iniciar renovación</Boton>
        </Tarjeta>
      )}
      {renovacion && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Tarjeta>
            <h2 className="font-semibold text-primary">Información del expediente</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <p>Carné: <strong>{renovacion.NumeroEstudiante}</strong></p>
              <p>Carrera: <strong>{renovacion.Carrera}</strong></p>
              <p>Promedio: <strong>{renovacion.Promedio}</strong></p>
              <p>Cobertura actual: <strong>{renovacion.Porcentaje}%</strong></p>
            </div>
            <div className="mt-6 space-y-4">
              <CampoAreaTexto etiqueta="Actualización socioeconómica" value={datos.actualizacionSocioeconomica} onChange={(e) => setDatos({ ...datos, actualizacionSocioeconomica: e.target.value })} />
              <SelectorArchivoBase64 etiqueta="Comprobante actualizado" onChange={setArchivo} />
              <label className="flex gap-2 text-body-sm"><input type="checkbox" checked={datos.declaracion} onChange={(e) => setDatos({ ...datos, declaracion: e.target.checked })} /> Declaro que la información es veraz y vigente.</label>
              <div className="flex gap-2"><Boton variante="secundario" onClick={() => guardar(false)}>Guardar borrador</Boton><Boton deshabilitado={!datos.declaracion} onClick={() => guardar(true)}>Enviar renovación</Boton></div>
            </div>
          </Tarjeta>
          <Tarjeta className="h-fit">
            <p className="text-label-md uppercase text-on-surface-variant">Estado del trámite</p>
            <p className="mt-2 text-headline-sm font-semibold text-primary">{renovacion.Estado}</p>
            <p className="mt-4 text-body-sm">Periodo: {renovacion.Periodo}</p>
            <p className="mt-2 text-body-sm">Documentos: {renovacion.documentos?.length || 0}</p>
            {renovacion.Resultado && <AlertaMensaje tipo="info" titulo="Resolución"><p>{renovacion.Resultado}</p><p>{renovacion.Motivo}</p></AlertaMensaje>}
          </Tarjeta>
        </div>
      )}
    </div>
  );
}

