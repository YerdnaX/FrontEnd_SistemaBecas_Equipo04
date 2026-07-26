import { useEffect, useState } from 'react';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import { listarNoticiasPublicas } from '../../servicios/servicioPublico.js';
import { formatearFecha } from '../../utilidades/formato.js';

export default function ListaNoticiasPublicas() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listarNoticiasPublicas()
      .then((respuesta) => setNoticias(respuesta.datos))
      .catch((err) => setError(err.mensaje || 'No fue posible cargar las noticias.'))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-container-max px-4 py-10 md:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-headline-lg font-semibold text-primary">Noticias</h1>
          <img src="/images/noticias.png" alt="Noticias del sistema" className="imagen-ui-seccion self-center sm:self-auto" />
        </div>

        {cargando && <EstadoCarga />}
        {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
        {!cargando && !error && noticias.length === 0 && <EstadoVacio titulo="No hay noticias publicadas" />}

        <div className="mt-6 flex flex-col gap-4">
          {noticias.map((noticia) => (
            <Tarjeta key={noticia.IdNoticia}>
              <p className="text-body-sm text-on-surface-variant">{formatearFecha(noticia.FechaPublicacion)}</p>
              <p className="mt-1 text-headline-sm font-semibold text-on-surface">{noticia.Titulo}</p>
              <p className="mt-2 text-body-md text-on-surface-variant">{noticia.Contenido}</p>
            </Tarjeta>
          ))}
        </div>
      </main>
      <PiePagina />
    </div>
  );
}
