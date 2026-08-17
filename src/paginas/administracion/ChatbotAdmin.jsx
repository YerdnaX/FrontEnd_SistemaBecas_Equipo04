import { useEffect, useState } from 'react';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import * as servicio from '../../servicios/servicioChatbot.js';

const ENTRADA_VACIA = { pregunta: '', respuesta: '', categoria: '', palabrasClave: '' };

export default function ChatbotAdmin() {
  const [entradas, setEntradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [seleccionada, setSeleccionada] = useState(null);
  const [nueva, setNueva] = useState(ENTRADA_VACIA);
  const [procesando, setProcesando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await servicio.listarEntradasChatbot();
      setEntradas(respuesta.datos);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function crear(evento) {
    evento.preventDefault();
    setProcesando(true);
    setError(null);
    try {
      await servicio.crearEntradaChatbot(nueva);
      setNueva(ENTRADA_VACIA);
      setMensaje('Entrada creada.');
      await cargar();
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setProcesando(false);
    }
  }

  async function guardarEdicion() {
    setProcesando(true);
    setError(null);
    try {
      await servicio.actualizarEntradaChatbot(seleccionada.IdPreguntaRespuesta, {
        pregunta: seleccionada.Pregunta,
        respuesta: seleccionada.Respuesta,
        categoria: seleccionada.Categoria,
        palabrasClave: seleccionada.PalabrasClave,
        activo: seleccionada.Activo
      });
      setMensaje('Entrada actualizada.');
      setSeleccionada(null);
      await cargar();
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setProcesando(false);
    }
  }

  async function eliminar(id) {
    setProcesando(true);
    setError(null);
    try {
      await servicio.eliminarEntradaChatbot(id);
      setMensaje('Entrada desactivada.');
      await cargar();
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setProcesando(false);
    }
  }

  return (
    <div>
      <h1 className="text-headline-lg font-semibold text-on-surface">Base de conocimiento del chatbot</h1>

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}
      {mensaje && <div className="mt-4"><AlertaMensaje tipo="exito">{mensaje}</AlertaMensaje></div>}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Tarjeta>
          <h2 className="text-headline-sm font-semibold text-on-surface">Preguntas registradas</h2>
          {cargando ? <EstadoCarga /> : entradas.length === 0 ? (
            <div className="mt-3"><EstadoVacio titulo="Sin preguntas registradas" /></div>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {entradas.map((e) => (
                <li key={e.IdPreguntaRespuesta} className="flex items-center justify-between gap-2 border-b border-outline-variant pb-2 text-body-sm">
                  <button onClick={() => setSeleccionada(e)} className="flex-1 text-left hover:underline">
                    {e.Pregunta} {!e.Activo && '(inactiva)'}
                  </button>
                  <Boton variante="texto" onClick={() => eliminar(e.IdPreguntaRespuesta)}>Desactivar</Boton>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta>
          <h2 className="text-headline-sm font-semibold text-on-surface">
            {seleccionada ? `Editar entrada #${seleccionada.IdPreguntaRespuesta}` : 'Nueva entrada'}
          </h2>

          <form onSubmit={seleccionada ? (e) => { e.preventDefault(); guardarEdicion(); } : crear} className="mt-3 flex flex-col gap-3">
            <CampoTexto
              etiqueta="Pregunta"
              required
              value={seleccionada ? seleccionada.Pregunta : nueva.pregunta}
              onChange={(e) => seleccionada
                ? setSeleccionada({ ...seleccionada, Pregunta: e.target.value })
                : setNueva({ ...nueva, pregunta: e.target.value })}
            />
            <CampoAreaTexto
              etiqueta="Respuesta"
              required
              rows={4}
              value={seleccionada ? seleccionada.Respuesta : nueva.respuesta}
              onChange={(e) => seleccionada
                ? setSeleccionada({ ...seleccionada, Respuesta: e.target.value })
                : setNueva({ ...nueva, respuesta: e.target.value })}
            />
            <CampoTexto
              etiqueta="Categoría"
              value={seleccionada ? seleccionada.Categoria || '' : nueva.categoria}
              onChange={(e) => seleccionada
                ? setSeleccionada({ ...seleccionada, Categoria: e.target.value })
                : setNueva({ ...nueva, categoria: e.target.value })}
            />
            <CampoTexto
              etiqueta="Palabras clave (separadas por coma)"
              value={seleccionada ? seleccionada.PalabrasClave || '' : nueva.palabrasClave}
              onChange={(e) => seleccionada
                ? setSeleccionada({ ...seleccionada, PalabrasClave: e.target.value })
                : setNueva({ ...nueva, palabrasClave: e.target.value })}
            />
            <div className="flex gap-3">
              <Boton type="submit" cargando={procesando}>{seleccionada ? 'Guardar cambios' : 'Crear entrada'}</Boton>
              {seleccionada && <Boton type="button" variante="secundario" onClick={() => setSeleccionada(null)}>Cancelar</Boton>}
            </div>
          </form>
        </Tarjeta>
      </div>
    </div>
  );
}
