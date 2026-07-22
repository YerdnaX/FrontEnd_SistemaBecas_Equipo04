import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { obtenerEvaluacion, guardarEvaluacion } from '../../servicios/servicioExpedientes.js';

export default function EvaluacionIntegral() {
  const { id } = useParams();
  const [componentes, setComponentes] = useState([]);
  const [evaluacionVigente, setEvaluacionVigente] = useState(null);
  const [puntajes, setPuntajes] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await obtenerEvaluacion(id);
      setComponentes(respuesta.datos.componentes);
      setEvaluacionVigente(respuesta.datos.evaluacion);
      if (respuesta.datos.evaluacion) {
        const iniciales = {};
        respuesta.datos.evaluacion.puntajes.forEach((p) => { iniciales[p.IdComponente] = p.Puntaje; });
        setPuntajes(iniciales);
      }
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const listaPuntajes = componentes.map((componente) => ({
        idComponente: componente.IdComponente,
        puntaje: Number(puntajes[componente.IdComponente])
      }));
      await guardarEvaluacion(id, listaPuntajes);
      await cargar();
    } catch (err) {
      setError(err.mensaje || 'No fue posible guardar la evaluación.');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <Tarjeta>
      <h1 className="text-headline-sm font-semibold text-primary">Evaluación integral</h1>
      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}

      {evaluacionVigente?.Estado === 'COMPLETA' && (
        <div className="mt-4">
          <AlertaMensaje tipo="exito" titulo={`Puntaje total: ${evaluacionVigente.PuntajeTotal}`}>
            Esta evaluación ya fue registrada. Puede volver a guardarla para actualizar el puntaje.
          </AlertaMensaje>
        </div>
      )}

      <form className="mt-6 flex flex-col gap-4" onSubmit={manejarEnvio}>
        {componentes.map((componente) => (
          <CampoTexto
            key={componente.IdComponente}
            etiqueta={`${componente.Nombre} (peso ${componente.Porcentaje}%, máximo ${componente.PuntajeMaximo})`}
            type="number" min="0" max={componente.PuntajeMaximo} required
            value={puntajes[componente.IdComponente] ?? ''}
            onChange={(e) => setPuntajes((actual) => ({ ...actual, [componente.IdComponente]: e.target.value }))}
          />
        ))}
        <Boton type="submit" cargando={guardando}>Guardar evaluación</Boton>
      </form>
    </Tarjeta>
  );
}
