import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import { obtenerInicio } from '../../servicios/servicioPublico.js';
import { formatearFecha } from '../../utilidades/formato.js';

const ROLES = [
  { titulo: 'Aspirante', descripcion: 'Postule a convocatorias de beca y dé seguimiento a su solicitud.' },
  { titulo: 'Trabajo Social', descripcion: 'Revise documentos, resuelva elegibilidad y evalúe expedientes.' },
  { titulo: 'Comité de Becas', descripcion: 'Analice el ranking y resuelva los casos en sesión.' },
  { titulo: 'Administración', descripcion: 'Configure tipos de beca y gestione convocatorias.' }
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
        <section className="bg-primary-container px-4 py-16 text-on-primary md:px-12">
          <div className="mx-auto max-w-container-max">
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold leading-tight">
              Sistema de Gestión de Becas Estudiantiles
            </h1>
            <p className="mt-4 max-w-xl text-body-lg">
              Consulte convocatorias vigentes, postule y dé seguimiento a su beca en un solo lugar.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/convocatorias"><Boton>Ver convocatorias</Boton></Link>
              <Link to="/registro"><Boton variante="secundario" className="border-white text-white hover:bg-white/10">Registrarme</Boton></Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-container-max px-4 py-12 md:px-12">
          <h2 className="text-headline-md font-semibold text-primary">Un sistema para cada rol</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((rol) => (
              <Tarjeta key={rol.titulo}>
                <p className="text-headline-sm font-semibold text-primary">{rol.titulo}</p>
                <p className="mt-2 text-body-sm text-on-surface-variant">{rol.descripcion}</p>
              </Tarjeta>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-container-max px-4 pb-16 md:px-12">
          <h2 className="text-headline-md font-semibold text-primary">Convocatorias y noticias</h2>

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
                      <Tarjeta key={convocatoria.IdConvocatoria}>
                        <p className="font-semibold text-primary">{convocatoria.Nombre}</p>
                        <p className="text-body-sm text-on-surface-variant">Cierra: {formatearFecha(convocatoria.FechaFin)}</p>
                        <Link to={`/convocatorias/${convocatoria.IdConvocatoria}`} className="text-body-sm text-primary-container hover:underline">
                          Ver detalle
                        </Link>
                      </Tarjeta>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="mb-3 text-headline-sm font-semibold text-on-surface">Noticias recientes</h3>
                {datos.noticiasRecientes.length === 0 ? (
                  <EstadoVacio titulo="Sin noticias publicadas" />
                ) : (
                  <ul className="flex flex-col gap-3">
                    {datos.noticiasRecientes.map((noticia) => (
                      <Tarjeta key={noticia.IdNoticia}>
                        <p className="font-semibold text-primary">{noticia.Titulo}</p>
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
