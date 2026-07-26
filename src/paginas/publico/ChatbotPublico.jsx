import { useState } from 'react';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { consultarChatbot } from '../../servicios/servicioChatbot.js';

export default function ChatbotPublico() {
  const [pregunta, setPregunta] = useState('');
  const [historial, setHistorial] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  async function enviar(evento) {
    evento.preventDefault();
    if (!pregunta.trim()) return;
    setEnviando(true);
    setError(null);
    const preguntaActual = pregunta;
    try {
      const respuesta = await consultarChatbot(preguntaActual);
      setHistorial((actual) => [...actual, { pregunta: preguntaActual, respuesta: respuesta.datos }]);
      setPregunta('');
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-headline-lg font-semibold text-primary">Asistente de preguntas frecuentes</h1>
      <p className="mt-1 text-body-sm text-on-surface-variant">
        Escriba su consulta sobre el proceso de becas. Si no encontramos una respuesta, contacte a la Oficina de Becas.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {historial.map((intercambio, indice) => (
          <Tarjeta key={indice}>
            <p className="font-semibold text-on-surface">{intercambio.pregunta}</p>
            {intercambio.respuesta.encontrado ? (
              <>
                <p className="mt-2 text-body-md">{intercambio.respuesta.respuestaPrincipal.Respuesta}</p>
                {intercambio.respuesta.sugerencias.length > 0 && (
                  <div className="mt-3 border-t border-outline-variant pt-2">
                    <p className="text-body-sm text-on-surface-variant">También le puede interesar:</p>
                    <ul className="list-inside list-disc text-body-sm">
                      {intercambio.respuesta.sugerencias.map((s) => <li key={s.IdPreguntaRespuesta}>{s.Pregunta}</li>)}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="mt-2 text-body-md text-on-surface-variant">{intercambio.respuesta.mensaje}</p>
            )}
          </Tarjeta>
        ))}
      </div>

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}

      <form onSubmit={enviar} className="mt-6 flex gap-3">
        <input
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Ej: ¿Cómo apelo una resolución?"
          className="flex-1 rounded-md border border-outline-variant px-3 py-2 text-body-md outline-none focus:border-primary-container"
        />
        <Boton type="submit" cargando={enviando}>Preguntar</Boton>
      </form>
    </div>
  );
}
