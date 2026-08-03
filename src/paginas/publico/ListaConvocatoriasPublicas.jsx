import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { listarConvocatoriasPublicas } from '../../servicios/servicioPublico.js';
import { formatearFechaHora, estadoTemporalConvocatoria } from '../../utilidades/formato.js';

function diasRestantes(fechaFin) {
  const diferenciaMs = new Date(fechaFin) - new Date();
  return Math.max(0, Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24)));
}

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-headline-lg font-semibold text-primary">Convocatorias vigentes</h1>
          <img src="/images/convocatoriasbecas.png" alt="Convocatorias de becas" className="imagen-ui-seccion self-center sm:self-auto" />
        </div>

        {cargando && <EstadoCarga />}
        {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
        {!cargando && !error && convocatorias.length === 0 && (
          <EstadoVacio titulo="No hay convocatorias publicadas por ahora" descripcion="Vuelva a consultar más adelante." />
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {convocatorias.map((convocatoria) => {
            const restantes = diasRestantes(convocatoria.FechaFin);
            const cierraPronto = restantes <= 7;
            const estadoTemporal = estadoTemporalConvocatoria(convocatoria.FechaInicio, convocatoria.FechaFin);
            return (
              <div key={convocatoria.IdConvocatoria}
                className={`rounded-lg border-2 p-6 shadow-elevation-l2 ${cierraPronto ? 'border-categoria-urgente bg-categoria-urgente-container' : 'border-convocatoria-destacada bg-convocatoria-destacada-container'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-label-sm font-semibold uppercase text-primary-container">{convocatoria.NombreTipoBeca}</span>
                  <EtiquetaEstado estado={estadoTemporal} />
                </div>
                <p className="mt-2 text-headline-sm font-bold text-primary">{convocatoria.Nombre}</p>
                <p className="mt-2 text-body-sm text-on-surface-variant">{convocatoria.Descripcion}</p>
                <p className="mt-3 text-body-sm font-semibold text-on-surface-variant">Cupos disponibles: {convocatoria.Cupos}</p>
                <p className="text-body-sm text-on-surface-variant">Abre: {formatearFechaHora(convocatoria.FechaInicio)}</p>
                <p className="text-body-sm text-on-surface-variant">Cierra: {formatearFechaHora(convocatoria.FechaFin)}</p>
                {cierraPronto && estadoTemporal === 'ABIERTA' && (
                  <p className="mt-1 text-label-sm font-bold text-categoria-urgente">¡Cierra en {restantes} día(s)!</p>
                )}
                <Link to={`/convocatorias/${convocatoria.IdConvocatoria}`} className="mt-3 inline-block text-body-sm font-semibold text-primary-container hover:underline">
                  Ver detalle →
                </Link>
              </div>
            );
          })}
        </div>
      </main>
      <PiePagina />
    </div>
  );
}
