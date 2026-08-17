import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { verificarCierre, cerrarExpediente } from '../../servicios/servicioCierre.js';

export default function CierreExpediente() {
  const { id } = useParams();
  const [verificacion, setVerificacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [resumen, setResumen] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [cerrado, setCerrado] = useState(false);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await verificarCierre(id);
      setVerificacion(respuesta.datos);
      setCerrado(Boolean(respuesta.datos.expediente.SoloLectura));
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  async function confirmarCierre(evento) {
    evento.preventDefault();
    setProcesando(true);
    setError(null);
    try {
      await cerrarExpediente(id, { motivo, resumen });
      setMensaje('El expediente fue cerrado correctamente.');
      setCerrado(true);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) return <EstadoCarga />;
  if (!verificacion) return error ? <AlertaMensaje tipo="error">{error}</AlertaMensaje> : null;

  const { expediente, bloqueadores } = verificacion;

  return (
    <div className="mx-auto max-w-2xl">
      <EncabezadoPagina titulo={`Cierre de expediente ${expediente.CodigoExpediente}`} />

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}
      {mensaje && <div className="mt-4"><AlertaMensaje tipo="exito">{mensaje}</AlertaMensaje></div>}

      {cerrado ? (
        <Tarjeta className="mt-6">
          <AlertaMensaje tipo="info" titulo="Expediente cerrado">
            Este expediente ya se encuentra en solo lectura. No admite más cambios.
          </AlertaMensaje>
        </Tarjeta>
      ) : bloqueadores.length > 0 ? (
        <Tarjeta className="mt-6">
          <AlertaMensaje tipo="advertencia" titulo="No se puede cerrar todavía">
            <ul className="list-inside list-disc">
              {bloqueadores.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </AlertaMensaje>
        </Tarjeta>
      ) : (
        <Tarjeta className="mt-6">
          <p className="text-body-sm text-on-surface-variant">
            No hay procesos pendientes. Puede cerrar este expediente de forma definitiva.
          </p>
          <form onSubmit={confirmarCierre} className="mt-4 flex flex-col gap-4">
            <CampoTexto etiqueta="Motivo del cierre" required value={motivo} onChange={(e) => setMotivo(e.target.value)} />
            <CampoAreaTexto etiqueta="Resumen (opcional)" rows={4} value={resumen} onChange={(e) => setResumen(e.target.value)} />
            <Boton type="submit" variante="peligro" cargando={procesando}>Cerrar expediente</Boton>
          </form>
        </Tarjeta>
      )}
    </div>
  );
}
