import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { crearConsulta, listarConsultas, obtenerConsulta, responderConsulta } from '../../servicios/servicioSegmentoDos.js';

export default function MisConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [nueva, setNueva] = useState({ asunto: '', mensaje: '' });
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    try {
      const resultado = await listarConsultas();
      setConsultas(resultado.datos);
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, []);

  async function abrir(id) {
    try {
      const resultado = await obtenerConsulta(id);
      setSeleccionada(resultado.datos);
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  async function enviarNueva(evento) {
    evento.preventDefault();
    setProcesando(true);
    try {
      await crearConsulta(nueva);
      setNueva({ asunto: '', mensaje: '' });
      setMensaje({ tipo: 'exito', texto: 'Consulta creada correctamente.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setProcesando(false); }
  }

  async function responder(evento) {
    evento.preventDefault();
    setProcesando(true);
    try {
      const resultado = await responderConsulta(seleccionada.IdConsulta, respuesta);
      setSeleccionada(resultado.datos);
      setRespuesta('');
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setProcesando(false); }
  }

  if (cargando) return <EstadoCarga />;
  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Mis consultas" descripcion="Converse con Bienestar Estudiantil y conserve el historial completo." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <div className="space-y-4">
          <Tarjeta>
            <form className="space-y-3" onSubmit={enviarNueva}>
              <h2 className="font-semibold text-on-surface">Nueva consulta</h2>
              <CampoTexto etiqueta="Asunto" value={nueva.asunto} onChange={(e) => setNueva({ ...nueva, asunto: e.target.value })} required />
              <CampoAreaTexto etiqueta="Mensaje" value={nueva.mensaje} onChange={(e) => setNueva({ ...nueva, mensaje: e.target.value })} required />
              <Boton type="submit" cargando={procesando}>Crear consulta</Boton>
            </form>
          </Tarjeta>
          <div className="space-y-2">
            {consultas.map((consulta) => (
              <button key={consulta.IdConsulta} type="button" onClick={() => abrir(consulta.IdConsulta)} className="w-full rounded-lg border border-outline-variant bg-surface-container p-4 text-left transition hover:border-outline hover:bg-surface-container-high">
                <strong>{consulta.Asunto}</strong>
                <span className="mt-1 block text-label-sm text-on-surface-variant">{consulta.Estado} · {new Date(consulta.FechaCreacion).toLocaleDateString('es-CR')}</span>
              </button>
            ))}
          </div>
        </div>
        <Tarjeta>
          {!seleccionada && <p className="text-center text-on-surface-variant">Seleccione una conversación.</p>}
          {seleccionada && (
            <>
              <div className="border-b border-outline-variant pb-4">
                <h2 className="text-headline-sm font-semibold">{seleccionada.Asunto}</h2>
                <p className="text-body-sm text-on-surface-variant">{seleccionada.Estado}</p>
              </div>
              <div className="my-5 space-y-3">
                {seleccionada.mensajes.map((item) => (
                  <div key={item.IdRespuesta} className={`max-w-[85%] rounded-lg p-3 ${item.IdUsuario === seleccionada.IdUsuario ? 'bg-surface-container' : 'ml-auto bg-primary-container/15'}`}>
                    <strong className="text-label-sm">{item.Autor}</strong>
                    <p className="mt-1 whitespace-pre-wrap text-body-sm">{item.Mensaje}</p>
                  </div>
                ))}
              </div>
              {seleccionada.Estado !== 'CERRADA' && (
                <form className="space-y-3" onSubmit={responder}>
                  <CampoAreaTexto etiqueta="Responder" value={respuesta} onChange={(e) => setRespuesta(e.target.value)} required />
                  <Boton type="submit" cargando={procesando}>Enviar mensaje</Boton>
                </form>
              )}
            </>
          )}
        </Tarjeta>
      </div>
    </div>
  );
}

