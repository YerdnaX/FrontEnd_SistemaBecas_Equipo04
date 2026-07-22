import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { obtenerResultado } from '../../servicios/servicioSolicitudes.js';
import { formatearFecha } from '../../utilidades/formato.js';

export default function ResultadoSolicitud() {
  const { id } = useParams();
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerResultado(id)
      .then((respuesta) => setResultado(respuesta.datos))
      .catch((err) => setError(err.mensaje || 'No fue posible consultar el resultado.'))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <EstadoCarga />;
  if (error) return <AlertaMensaje tipo="error">{error}</AlertaMensaje>;

  return (
    <Tarjeta>
      <h1 className="text-headline-sm font-semibold text-primary">Estado de su solicitud</h1>
      <div className="mt-4">
        <EtiquetaEstado estado={resultado.estadoSolicitud} />
      </div>

      {!resultado.disponible && (
        <AlertaMensaje tipo="info" titulo="Resultado pendiente" className="mt-4">
          Su solicitud aún está en proceso. El resultado se publicará cuando el comité de becas resuelva su caso.
        </AlertaMensaje>
      )}

      {resultado.disponible && resultado.resolucion && (
        <div className="mt-6 rounded-md border border-outline-variant p-4">
          <p className="text-headline-sm font-semibold text-on-surface">Resolución final</p>
          <p className="mt-2 text-body-sm text-on-surface-variant">Número: {resultado.resolucion.numeroResolucion}</p>
          <p className="text-body-sm text-on-surface-variant">Fecha: {formatearFecha(resultado.resolucion.fechaEmision)}</p>
          {resultado.resolucion.porcentajeBeca !== null && (
            <p className="mt-2 font-semibold text-primary">Porcentaje de beca asignado: {resultado.resolucion.porcentajeBeca}%</p>
          )}
          {resultado.resolucion.motivo && <p className="mt-2 text-body-sm text-on-surface-variant">Motivo: {resultado.resolucion.motivo}</p>}
        </div>
      )}
    </Tarjeta>
  );
}
