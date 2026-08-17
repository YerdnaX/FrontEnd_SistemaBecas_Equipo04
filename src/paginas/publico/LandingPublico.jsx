import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import EtiquetaCategoria, { obtenerCategoria } from '../../componentes/comunes/EtiquetaCategoria.jsx';
import { obtenerInicio } from '../../servicios/servicioPublico.js';
import { formatearFecha } from '../../utilidades/formato.js';

function diasRestantes(fechaFin) {
  const diferenciaMs = new Date(fechaFin) - new Date();
  return Math.max(0, Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24)));
}

const ROLES = [
  { titulo: 'Aspirante', descripcion: 'Postule a convocatorias de beca y dé seguimiento a su solicitud.', imagen: '/images/aspirante.png' },
  { titulo: 'Trabajo Social', descripcion: 'Revise documentos, resuelva elegibilidad y evalúe expedientes.', imagen: '/images/trabajosocial.png' },
  { titulo: 'Comité de Becas', descripcion: 'Analice el ranking y resuelva los casos en sesión.', imagen: '/images/comitebecas.png' },
  { titulo: 'Administración', descripcion: 'Configure tipos de beca y gestione convocatorias.', imagen: '/images/administracion.png' }
];

export default function LandingPublico() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerInicio()
      .then((respuesta) => setDatos(respuesta.datos))
      .catch((err) => setError(err.mensaje || 'No fue posible cargar la información.'))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <EncabezadoPublico />
      <main>
        <section className="bg-secondary-container px-4 py-16 text-on-secondary-container md:px-12">
          <div className="mx-auto max-w-container-max">
            <h1 className="text-headline-md md:text-headline-lg font-bold leading-tight">
              Sistema de Gestión de Becas Estudiantiles
            </h1>
            <p className="mt-4 max-w-xl text-body-lg">
              Consulte convocatorias vigentes, postule y dé seguimiento a su beca en un solo lugar.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/convocatorias"><Boton>Ver convocatorias</Boton></Link>
              <Link to="/registro"><Boton variante="secundario" className="!border-on-secondary-container !text-on-secondary-container hover:!bg-on-secondary-container/10">Registrarme</Boton></Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-container-max px-4 py-12 md:px-12">
          <h2 className="text-headline-md font-semibold text-on-surface">Un sistema para cada rol</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((rol) => (
              <Tarjeta key={rol.titulo}>
                <img src={rol.imagen} alt={rol.titulo} className="imagen-ui-seccion mb-3" />
                <p className="text-headline-sm font-semibold text-on-surface">{rol.titulo}</p>
                <p className="mt-2 text-body-sm text-on-surface-variant">{rol.descripcion}</p>
              </Tarjeta>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-container-max px-4 pb-16 md:px-12">
          <h2 className="text-headline-md font-semibold text-on-surface">Convocatorias y noticias</h2>

          {cargando && <EstadoCarga />}
          {error && <AlertaMensaje tipo="error" titulo="No fue posible cargar la información">{error}</AlertaMensaje>}

          {datos && (
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-headline-sm font-semibold text-on-surface">Convocatorias destacadas</h3>
                {datos.convocatoriasDestacadas.length === 0 ? (
                  <EstadoVacio titulo="Sin convocatorias vigentes" descripcion="Vuelva a consultar más adelante." />
                ) : (
                  <ul className="flex flex-col gap-3">
                    {datos.convocatoriasDestacadas.map((convocatoria) => (
                      <li key={convocatoria.IdConvocatoria}
                        className="rounded-lg border-2 border-convocatoria-destacada bg-convocatoria-destacada-container p-5 shadow-elevation-l2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-block rounded-full bg-convocatoria-destacada-container px-3 py-1 text-label-sm font-bold uppercase text-convocatoria-destacada">
                            ¡Convocatoria abierta!
                          </span>
                          <span className="text-label-sm font-semibold text-primary">
                            {diasRestantes(convocatoria.FechaFin)} día(s) para cerrar
                          </span>
                        </div>
                        <p className="mt-3 text-headline-sm font-bold text-on-surface">{convocatoria.Nombre}</p>
                        <p className="text-body-sm text-on-surface-variant">Cierra: {formatearFecha(convocatoria.FechaFin)}</p>
                        <Link to={`/convocatorias/${convocatoria.IdConvocatoria}`} className="mt-2 inline-block">
                          <Boton variante="texto" tamano="sm">Ver detalle →</Boton>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-headline-sm font-semibold text-on-surface">Noticias recientes</h3>
                  {datos.cuatrimestreActual && (
                    <span className="rounded-full bg-secondary-container px-3 py-1 text-label-sm font-semibold text-on-secondary-container">
                      Cuatrimestre {datos.cuatrimestreActual.Periodo}
                    </span>
                  )}
                </div>
                {datos.noticiasRecientes.length === 0 ? (
                  <EstadoVacio titulo="Sin noticias publicadas" />
                ) : (
                  <ul className="flex flex-col gap-3">
                    {datos.noticiasRecientes.map((noticia) => (
                      <Tarjeta key={noticia.IdNoticia} className={`border-l-4 ${obtenerCategoria(noticia.Categoria).borde}`}>
                        <EtiquetaCategoria categoria={noticia.Categoria} />
                        <p className="mt-2 font-semibold text-primary">{noticia.Titulo}</p>
                        <p className="mt-1 line-clamp-2 text-body-sm text-on-surface-variant">{noticia.Contenido}</p>
                      </Tarjeta>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
      <PiePagina />
    </div>
  );
}
