import { useEffect, useRef, useState } from 'react';
import { iniciarConversacionAsistente, enviarMensajeAsistente } from '../../servicios/servicioAsistente.js';
import Boton from '../comunes/Boton.jsx';

const MENSAJE_BIENVENIDA = '¡Hola! Soy el asistente virtual del SGBE. ¿En qué puedo ayudarle?';
const MENSAJE_NO_CONFIGURADO = 'El asistente virtual no está disponible en este momento. Intente más tarde o contacte a la Oficina de Becas.';

export default function BotonChatAsistente() {
  const [abierto, setAbierto] = useState(false);
  const [idConversacion, setIdConversacion] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [iniciando, setIniciando] = useState(false);
  const [error, setError] = useState(null);
  const finalRef = useRef(null);

  useEffect(() => {
    finalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, abierto]);

  async function abrir() {
    setAbierto(true);
    if (idConversacion || iniciando) return;
    setIniciando(true);
    setError(null);
    try {
      const respuesta = await iniciarConversacionAsistente();
      setIdConversacion(respuesta.datos.idConversacion);
      setMensajes([{ autor: 'asistente', texto: MENSAJE_BIENVENIDA }]);
    } catch (err) {
      setError(err.codigo === 'ASISTENTE_NO_CONFIGURADO' ? MENSAJE_NO_CONFIGURADO : err.mensaje);
    } finally {
      setIniciando(false);
    }
  }

  async function enviar(evento) {
    evento.preventDefault();
    const mensajeActual = texto.trim();
    if (!mensajeActual || enviando) return;

    setMensajes((actual) => [...actual, { autor: 'usuario', texto: mensajeActual }]);
    setTexto('');
    setEnviando(true);
    setError(null);

    try {
      let idActivo = idConversacion;
      if (!idActivo) {
        const inicio = await iniciarConversacionAsistente();
        idActivo = inicio.datos.idConversacion;
        setIdConversacion(idActivo);
      }

      let respuesta;
      try {
        respuesta = await enviarMensajeAsistente(idActivo, mensajeActual);
      } catch (err) {
        if (err.estadoHttp === 404) {
          // La conversación expiró en el servidor: se inicia una nueva y se reintenta una vez.
          const reinicio = await iniciarConversacionAsistente();
          idActivo = reinicio.datos.idConversacion;
          setIdConversacion(idActivo);
          respuesta = await enviarMensajeAsistente(idActivo, mensajeActual);
        } else {
          throw err;
        }
      }

      setMensajes((actual) => [
        ...actual,
        ...respuesta.datos.respuestas.map((textoRespuesta) => ({ autor: 'asistente', texto: textoRespuesta }))
      ]);
    } catch (err) {
      setError(err.codigo === 'ASISTENTE_NO_CONFIGURADO' ? MENSAJE_NO_CONFIGURADO : err.mensaje || 'No fue posible enviar el mensaje.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {abierto && (
        <div className="anim-pop flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container-high text-on-surface shadow-elevation-l3">
          <div className="flex items-center justify-between bg-primary-container px-4 py-3 text-on-primary-container">
            <span className="text-body-md font-semibold">Asistente virtual</span>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar chat" className="rounded-full px-2 py-0.5 transition hover:bg-black/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-primary-container">✕</button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {iniciando && <p className="text-center text-body-sm text-on-surface-variant">Conectando con el asistente…</p>}
            {mensajes.map((mensaje, indice) => (
              <div key={indice} className={`flex ${mensaje.autor === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-body-sm ${
                    mensaje.autor === 'usuario'
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container text-on-surface'
                  }`}
                >
                  {mensaje.texto}
                </p>
              </div>
            ))}
            {enviando && (
              <div className="flex justify-start">
                <p className="max-w-[85%] rounded-lg bg-surface-container px-3 py-2 text-body-sm text-on-surface-variant">Escribiendo…</p>
              </div>
            )}
            <div ref={finalRef} />
          </div>

          {error && <p className="border-t border-outline-variant px-3 py-2 text-label-sm text-error">{error}</p>}

          <form onSubmit={enviar} className="flex gap-2 border-t border-outline-variant p-2">
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escriba su mensaje…"
              disabled={enviando || iniciando}
              maxLength={1000}
              className="flex-1 rounded-md border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary-container disabled:opacity-50"
            />
            <Boton type="submit" tamano="sm" disabled={enviando || iniciando || !texto.trim()} aria-label="Enviar mensaje">
              Enviar
            </Boton>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        aria-label={abierto ? 'Cerrar asistente virtual' : 'Abrir asistente virtual'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-2xl text-on-primary-container shadow-elevation-l3 transition hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span aria-hidden="true">{abierto ? '✕' : '💬'}</span>
      </button>
    </div>
  );
}
