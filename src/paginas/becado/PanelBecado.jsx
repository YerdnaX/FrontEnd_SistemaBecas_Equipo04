import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { listarNoticias, obtenerPanelBecado } from '../../servicios/servicioSegmentoDos.js';
import { listarInvestigaciones } from '../../servicios/servicioDisciplinario.js';

const ACCESOS = [
  { ruta: '/becado/expediente', titulo: 'Mi expediente', descripcion: 'Consulte y actualice sus datos permitidos.' },
  { ruta: '/becado/justificaciones', titulo: 'Justificaciones', descripcion: 'Presente respaldos de cursos perdidos.' },
  { ruta: '/becado/renovaciones/nueva', titulo: 'Renovación', descripcion: 'Compruebe disponibilidad e inicie el trámite.' },
  { ruta: '/consultas', titulo: 'Consultas', descripcion: 'Converse con Bienestar Estudiantil.' }
];

export default function PanelBecado() {
  const [panel, setPanel] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [investigacionActiva, setInvestigacionActiva] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([obtenerPanelBecado(), listarNoticias(), listarInvestigaciones({ estado: 'EN_REVISION' })])
      .then(([respuestaPanel, respuestaNoticias, respuestaInvestigaciones]) => {
        setPanel(respuestaPanel.datos);
        setNoticias(respuestaNoticias.datos.slice(0, 3));
        setInvestigacionActiva(respuestaInvestigaciones.datos[0] || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <EstadoCarga mensaje="Cargando su beneficio..." />;
  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Panel del estudiante becado" descripcion="Resumen del beneficio activo, alertas y gestiones disponibles." />
      {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
      {investigacionActiva && (
        <Link to={`/becado/descargos/${investigacionActiva.IdInvestigacion}`}>
          <Tarjeta className="border-l-4 border-error bg-error-container/40 hover:bg-error-container/60">
            <strong>Tiene un proceso de revisión de beca en trámite</strong>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Causal: {investigacionActiva.Causal}. Toque aquí para ver el detalle y presentar sus descargos.
            </p>
          </Tarjeta>
        </Link>
      )}
      {panel && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Tarjeta><p className="text-body-sm text-on-surface-variant">Beca actual</p><p className="mt-2 text-headline-sm font-semibold">{panel.TipoBeca}</p></Tarjeta>
            <Tarjeta><p className="text-body-sm text-on-surface-variant">Cobertura</p><p className="mt-2 text-headline-sm font-semibold">{panel.Porcentaje}%</p></Tarjeta>
            <Tarjeta><p className="text-body-sm text-on-surface-variant">Periodo</p><p className="mt-2 text-headline-sm font-semibold">{panel.Periodo}</p></Tarjeta>
            <Tarjeta><p className="text-body-sm text-on-surface-variant">Estado</p><p className="mt-2 text-headline-sm font-semibold">{panel.Estado}</p></Tarjeta>
            <Tarjeta><p className="text-body-sm text-on-surface-variant">Promedio</p><p className="mt-2 text-headline-sm font-semibold">{panel.Promedio ?? 'Sin registro'}</p></Tarjeta>
            <Tarjeta className={panel.AlertasAbiertas ? 'border-l-4 border-advertencia' : ''}><p className="text-body-sm text-on-surface-variant">Alertas abiertas</p><p className="mt-2 text-headline-sm font-semibold">{panel.AlertasAbiertas}</p></Tarjeta>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <section>
              <h2 className="mb-3 text-headline-sm font-semibold text-primary">Accesos rápidos</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {ACCESOS.map((acceso) => (
                  <Link key={acceso.ruta} to={acceso.ruta}>
                    <Tarjeta className="h-full hover:bg-surface-container-low">
                      <strong>{acceso.titulo}</strong>
                      <p className="mt-2 text-body-sm text-on-surface-variant">{acceso.descripcion}</p>
                    </Tarjeta>
                  </Link>
                ))}
              </div>
            </section>
            <section>
              <h2 className="mb-3 text-headline-sm font-semibold text-primary">Noticias para becados</h2>
              <Tarjeta className="space-y-4">
                {noticias.map((noticia) => (
                  <article key={noticia.IdNoticia} className="border-b border-outline-variant pb-3 last:border-0 last:pb-0">
                    <h3 className="font-semibold">{noticia.Titulo}</h3>
                    <p className="mt-1 line-clamp-2 text-body-sm text-on-surface-variant">{noticia.Contenido}</p>
                  </article>
                ))}
                {noticias.length === 0 && <p className="text-body-sm">No hay noticias publicadas.</p>}
              </Tarjeta>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
