import { useEffect, useMemo, useState } from 'react';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EtiquetaCategoria, { obtenerCategoria, OPCIONES_CATEGORIA } from '../../componentes/comunes/EtiquetaCategoria.jsx';
import { listarNoticiasPublicas } from '../../servicios/servicioPublico.js';
import { formatearFecha } from '../../utilidades/formato.js';

export default function ListaNoticiasPublicas() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');

  useEffect(() => {
    listarNoticiasPublicas()
      .then((respuesta) => setNoticias(respuesta.datos))
      .catch((err) => setError(err.mensaje || 'No fue posible cargar las noticias.'))
      .finally(() => setCargando(false));
  }, []);

  const noticiasFiltradas = useMemo(
    () => (categoriaFiltro === 'TODAS' ? noticias : noticias.filter((n) => n.Categoria === categoriaFiltro)),
    [noticias, categoriaFiltro]
  );

  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-container-max px-4 py-10 md:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-headline-lg font-semibold text-on-surface">Noticias</h1>
          <img src="/images/noticias.png" alt="Noticias del sistema" className="imagen-ui-seccion self-center sm:self-auto" />
        </div>

        {!cargando && noticias.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setCategoriaFiltro('TODAS')}
              className={`rounded-full px-3 py-1 text-label-sm font-semibold transition ${categoriaFiltro === 'TODAS' ? 'bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container hover:opacity-80'}`}
            >
              Todas
            </button>
            {OPCIONES_CATEGORIA.map((opcion) => (
              <button
                key={opcion.valor}
                onClick={() => setCategoriaFiltro(opcion.valor)}
                className={`rounded-full px-3 py-1 text-label-sm font-semibold transition ${categoriaFiltro === opcion.valor ? obtenerCategoria(opcion.valor).barra + ' text-on-primary' : obtenerCategoria(opcion.valor).clase + ' hover:opacity-80'}`}
              >
                {opcion.etiqueta}
              </button>
            ))}
          </div>
        )}

        {cargando && <EstadoCarga />}
        {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
        {!cargando && !error && noticias.length === 0 && <EstadoVacio titulo="No hay noticias publicadas" />}
        {!cargando && !error && noticias.length > 0 && noticiasFiltradas.length === 0 && (
          <EstadoVacio titulo="No hay noticias en esta categoría" descripcion="Pruebe con otra categoría o revise Todas." />
        )}

        <div className="mt-6 flex flex-col gap-4">
          {noticiasFiltradas.map((noticia) => {
            const categoria = obtenerCategoria(noticia.Categoria);
            return (
              <Tarjeta key={noticia.IdNoticia} className={`border-l-4 ${categoria.borde}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <EtiquetaCategoria categoria={noticia.Categoria} />
                  <p className="text-body-sm text-on-surface-variant">{formatearFecha(noticia.FechaPublicacion)}</p>
                </div>
                <p className="mt-2 text-headline-sm font-semibold text-on-surface">{noticia.Titulo}</p>
                <p className="mt-2 text-body-md text-on-surface-variant">{noticia.Contenido}</p>
              </Tarjeta>
            );
          })}
        </div>
      </main>
      <PiePagina />
    </div>
  );
}
