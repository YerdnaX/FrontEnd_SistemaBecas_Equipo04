import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import { listarConvocatoriasPublicas } from '../../servicios/servicioPublico.js';
import { formatearFecha } from '../../utilidades/formato.js';

export default function ListaConvocatoriasPublicas() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listarConvocatoriasPublicas()
      .then((respuesta) => setConvocatorias(respuesta.datos))
      .catch((err) => setError(err.mensaje || 'No fue posible cargar las convocatorias.'))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-container-max px-4 py-10 md:px-12">
        <h1 className="text-headline-lg font-semibold text-primary">Convocatorias vigentes</h1>

        {cargando && <EstadoCarga />}
        {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
        {!cargando && !error && convocatorias.length === 0 && (
          <EstadoVacio titulo="No hay convocatorias publicadas por ahora" descripcion="Vuelva a consultar más adelante." />
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {convocatorias.map((convocatoria) => (
            <Tarjeta key={convocatoria.IdConvocatoria}>
              <p className="text-label-sm font-semibold uppercase text-primary-container">{convocatoria.NombreTipoBeca}</p>
              <p className="mt-1 text-headline-sm font-semibold text-on-surface">{convocatoria.Nombre}</p>
              <p className="mt-2 text-body-sm text-on-surface-variant">{convocatoria.Descripcion}</p>
              <p className="mt-3 text-body-sm text-on-surface-variant">Cupos: {convocatoria.Cupos}</p>
              <p className="text-body-sm text-on-surface-variant">Cierra: {formatearFecha(convocatoria.FechaFin)}</p>
              <Link to={`/convocatorias/${convocatoria.IdConvocatoria}`} className="mt-3 inline-block text-body-sm font-semibold text-primary-container hover:underline">
                Ver detalle →
              </Link>
            </Tarjeta>
          ))}
        </div>
      </main>
      <PiePagina />
    </div>
  );
}
