import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import SelectorArchivoBase64 from '../../componentes/formularios/SelectorArchivoBase64.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { crearJustificacion, listarJustificaciones } from '../../servicios/servicioSegmentoDos.js';

export default function JustificacionesCursos() {
  const [justificaciones, setJustificaciones] = useState([]);
  const [formulario, setFormulario] = useState({ periodo: '', curso: '', motivo: '' });
  const [mensaje, setMensaje] = useState(null);
  const [procesando, setProcesando] = useState(false);

  async function cargar() {
    try { setJustificaciones((await listarJustificaciones()).datos); }
    catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }
  useEffect(() => { cargar(); }, []);

  async function enviar(evento) {
    evento.preventDefault();
    setProcesando(true);
    try {
      await crearJustificacion(formulario);
      setFormulario({ periodo: '', curso: '', motivo: '' });
      setMensaje({ tipo: 'exito', texto: 'Justificación enviada a revisión.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setProcesando(false); }
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Justificación de cursos" descripcion="Informe cursos perdidos y adjunte evidencia verificable del periodo vigente." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Tarjeta>
          <form className="space-y-4" onSubmit={enviar}>
            <CampoTexto etiqueta="Periodo" value={formulario.periodo} onChange={(e) => setFormulario({ ...formulario, periodo: e.target.value })} required />
            <CampoTexto etiqueta="Curso" value={formulario.curso} onChange={(e) => setFormulario({ ...formulario, curso: e.target.value })} required />
            <CampoAreaTexto etiqueta="Exposición de motivos" value={formulario.motivo} onChange={(e) => setFormulario({ ...formulario, motivo: e.target.value })} maxLength="500" required />
            <SelectorArchivoBase64 onChange={(archivo) => setFormulario({ ...formulario, ...archivo })} />
            <Boton type="submit" cargando={procesando}>Enviar justificación</Boton>
          </form>
        </Tarjeta>
        <TablaDatos filas={justificaciones} clave="IdJustificacion" columnas={[
          { clave: 'Curso', etiqueta: 'Curso' },
          { clave: 'Periodo', etiqueta: 'Periodo' },
          { clave: 'Estado', etiqueta: 'Estado' },
          { clave: 'Resolucion', etiqueta: 'Resolución' },
          { clave: 'FechaSolicitud', etiqueta: 'Fecha', render: (fila) => new Date(fila.FechaSolicitud).toLocaleDateString('es-CR') }
        ]} />
      </div>
    </div>
  );
}

