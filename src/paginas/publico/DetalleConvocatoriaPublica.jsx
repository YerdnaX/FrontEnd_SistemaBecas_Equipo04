import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { obtenerConvocatoriaPublica } from '../../servicios/servicioPublico.js';
import { formatearFechaHora, estadoTemporalConvocatoria } from '../../utilidades/formato.js';
import { useSesion } from '../../hooks/useSesion.js';

export default function DetalleConvocatoriaPublica() {
  const { id } = useParams();
  const { usuario } = useSesion();
  const [convocatoria, setConvocatoria] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerConvocatoriaPublica(id)
      .then((respuesta) => setConvocatoria(respuesta.datos))
      .catch((err) => setError(err.mensaje || 'La convocatoria no existe o no está disponible.'))
      .finally(() => setCargando(false));
  }, [id]);

  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-container-max px-4 py-10 md:px-12">
        {cargando && <EstadoCarga />}
        {error && <AlertaMensaje tipo="error" titulo="No disponible">{error}</AlertaMensaje>}

        {convocatoria && (
          <Tarjeta>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-label-sm font-semibold uppercase text-primary-container">{convocatoria.NombreTipoBeca}</p>
              <EtiquetaEstado estado={estadoTemporalConvocatoria(convocatoria.FechaInicio, convocatoria.FechaFin)} />
            </div>
            <h1 className="mt-1 text-headline-lg font-semibold text-on-surface">{convocatoria.Nombre}</h1>
            <p className="mt-4 text-body-md text-on-surface-variant">{convocatoria.Descripcion}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <p><span className="font-semibold">Cupos:</span> {convocatoria.Cupos}</p>
              <p><span className="font-semibold">Cobertura:</span> {convocatoria.PorcentajeCobertura}%</p>
              <p><span className="font-semibold">Apertura:</span> {formatearFechaHora(convocatoria.FechaInicio)}</p>
              <p><span className="font-semibold">Cierre:</span> {formatearFechaHora(convocatoria.FechaFin)}</p>
            </div>

            <h2 className="mt-6 text-headline-sm font-semibold text-primary">Requisitos</h2>
            <ul className="mt-2 list-disc pl-6 text-body-sm text-on-surface-variant">
              {convocatoria.requisitos.map((requisito) => (
                <li key={requisito.Nombre}>
                  {requisito.Nombre} {requisito.Obligatorio ? '(obligatorio)' : '(opcional)'}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {usuario ? (
                <Link to="/aspirante"><Boton>Ir a mi panel para postular</Boton></Link>
              ) : (
                <Link to="/registro"><Boton>Crear cuenta para postular</Boton></Link>
              )}
            </div>
          </Tarjeta>
        )}
      </main>
      <PiePagina />
    </div>
  );
}
