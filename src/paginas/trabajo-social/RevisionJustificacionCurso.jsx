import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { obtenerArchivoJustificacion, obtenerJustificacion, resolverJustificacion } from '../../servicios/servicioSegmentoDos.js';
import { abrirArchivo, descargarArchivo } from '../../utilidades/archivos.js';

export default function RevisionJustificacionCurso() {
  const { id } = useParams();
  const [justificacion, setJustificacion] = useState(null);
  const [formulario, setFormulario] = useState({ estado: 'APROBADA', resolucion: '' });
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    try { setJustificacion((await obtenerJustificacion(id)).datos); }
    catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, [id]);

  async function resolver(evento) {
    evento.preventDefault();
    try {
      setJustificacion((await resolverJustificacion(id, formulario)).datos);
      setMensaje({ tipo: 'exito', texto: 'Resolución registrada y estudiante notificado.' });
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  async function manejarArchivo(accion) {
    const ventana = accion === 'abrir' ? window.open('', '_blank') : null;
    try {
      const respuesta = await obtenerArchivoJustificacion(id);
      if (accion === 'abrir') abrirArchivo(respuesta.datos, ventana);
      else descargarArchivo(respuesta.datos);
    } catch (error) {
      ventana?.close();
      setMensaje({ tipo: 'error', texto: error.message });
    }
  }
  if (cargando) return <EstadoCarga />;
  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Revisión de justificación" descripcion="Valide el motivo, respaldo y pertenencia al periodo del estudiante." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta>
          <h2 className="font-semibold text-primary">{justificacion?.Curso}</h2>
          <p className="mt-2 text-body-sm">Periodo: <strong>{justificacion?.Periodo}</strong></p>
          <p className="mt-4 whitespace-pre-wrap">{justificacion?.Motivo}</p>
          <p className="mt-4 text-body-sm text-on-surface-variant">Respaldo: {justificacion?.NombreOriginal || 'Sin archivo'}</p>
          {justificacion?.NombreOriginal && (
            <div className="mt-4 flex gap-2">
              <Boton variante="secundario" onClick={() => manejarArchivo('abrir')}>Ver respaldo</Boton>
              <Boton variante="secundario" onClick={() => manejarArchivo('descargar')}>Descargar</Boton>
            </div>
          )}
        </Tarjeta>
        <Tarjeta>
          <form className="space-y-4" onSubmit={resolver}>
            <CampoSelect etiqueta="Resultado" value={formulario.estado} onChange={(e) => setFormulario({ ...formulario, estado: e.target.value })} opciones={[{ valor: 'APROBADA', etiqueta: 'Aprobar' }, { valor: 'RECHAZADA', etiqueta: 'Rechazar' }]} />
            <CampoAreaTexto etiqueta="Observación y resolución" value={formulario.resolucion} onChange={(e) => setFormulario({ ...formulario, resolucion: e.target.value })} required />
            <Boton type="submit" deshabilitado={justificacion?.Estado !== 'PENDIENTE'}>Registrar resolución</Boton>
          </form>
        </Tarjeta>
      </div>
    </div>
  );
}
