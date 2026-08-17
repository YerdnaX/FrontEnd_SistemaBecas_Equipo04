import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import SelectorArchivoBase64 from '../../componentes/formularios/SelectorArchivoBase64.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import {
  crearJustificacion,
  listarJustificaciones,
  obtenerArchivoJustificacion,
  obtenerPanelBecado
} from '../../servicios/servicioSegmentoDos.js';
import { abrirArchivo, descargarArchivo } from '../../utilidades/archivos.js';

export default function JustificacionesCursos() {
  const [justificaciones, setJustificaciones] = useState([]);
  const [formulario, setFormulario] = useState({ periodo: '', curso: '', motivo: '' });
  const [mensaje, setMensaje] = useState(null);
  const [procesando, setProcesando] = useState(false);

  async function cargar() {
    try {
      const [lista, panel] = await Promise.all([listarJustificaciones(), obtenerPanelBecado()]);
      setJustificaciones(lista.datos);
      setFormulario((actual) => ({ ...actual, periodo: panel.datos.Periodo || '' }));
    }
    catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }
  useEffect(() => { cargar(); }, []);

  async function enviar(evento) {
    evento.preventDefault();
    setProcesando(true);
    try {
      await crearJustificacion(formulario);
      setFormulario((actual) => ({ periodo: actual.periodo, curso: '', motivo: '' }));
      setMensaje({ tipo: 'exito', texto: 'Justificación enviada a revisión.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setProcesando(false); }
  }

  async function manejarArchivo(id, accion) {
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

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Justificación de cursos" descripcion="Informe cursos perdidos y adjunte evidencia verificable del periodo vigente." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Tarjeta>
          <form className="space-y-4" onSubmit={enviar}>
            <CampoTexto etiqueta="Periodo" value={formulario.periodo} readOnly helperText="Periodo vigente del beneficio." required />
            <CampoTexto etiqueta="Curso" value={formulario.curso} onChange={(e) => setFormulario({ ...formulario, curso: e.target.value })} helperText="Digite el nombre o código del curso perdido." required />
            <CampoAreaTexto etiqueta="Exposición de motivos" value={formulario.motivo} onChange={(e) => setFormulario({ ...formulario, motivo: e.target.value })} maxLength="500" required />
            <SelectorArchivoBase64 etiqueta="Documento de respaldo obligatorio" onChange={(archivo) => setFormulario({ ...formulario, ...archivo })} />
            <Boton type="submit" cargando={procesando} deshabilitado={!formulario.contenidoBase64}>Enviar justificación</Boton>
          </form>
        </Tarjeta>
        <TablaDatos filas={justificaciones} clave="IdJustificacion" columnas={[
          { clave: 'Curso', etiqueta: 'Curso' },
          { clave: 'Periodo', etiqueta: 'Periodo' },
          { clave: 'Estado', etiqueta: 'Estado' },
          { clave: 'Resolucion', etiqueta: 'Resolución' },
          { clave: 'FechaSolicitud', etiqueta: 'Fecha', render: (fila) => new Date(fila.FechaSolicitud).toLocaleDateString('es-CR') },
          {
            clave: 'archivo',
            etiqueta: 'Respaldo',
            render: (fila) => fila.NombreOriginal ? (
              <div className="flex gap-3">
                <Boton type="button" variante="texto" onClick={() => manejarArchivo(fila.IdJustificacion, 'abrir')}>Ver</Boton>
                <Boton type="button" variante="texto" onClick={() => manejarArchivo(fila.IdJustificacion, 'descargar')}>Descargar</Boton>
              </div>
            ) : 'Sin archivo'
          }
        ]} />
      </div>
    </div>
  );
}
