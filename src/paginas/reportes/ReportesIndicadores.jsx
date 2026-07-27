import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { listarBecasReporte, listarRenovacionesReporte, obtenerIndicadores } from '../../servicios/servicioSegmentoDos.js';

export default function ReportesIndicadores() {
  const [filtros, setFiltros] = useState({ periodo: '', facultad: '' });
  const [indicadores, setIndicadores] = useState({});
  const [becas, setBecas] = useState([]);
  const [renovaciones, setRenovaciones] = useState([]);
  const [error, setError] = useState(null);

  async function cargar() {
    try {
      const [i, b, r] = await Promise.all([obtenerIndicadores(filtros), listarBecasReporte(filtros), listarRenovacionesReporte()]);
      setIndicadores(i.datos);
      setBecas(b.datos);
      setRenovaciones(r.datos);
    } catch (err) { setError(err.message); }
  }
  useEffect(() => { cargar(); }, []);

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Reportes e indicadores" descripcion="Datos agregados directamente desde SQL Server con filtros parametrizados." />
      {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
      <div className="flex flex-wrap items-end gap-3">
        <CampoTexto etiqueta="Periodo" value={filtros.periodo} onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value })} />
        <CampoTexto etiqueta="Facultad o carrera" value={filtros.facultad} onChange={(e) => setFiltros({ ...filtros, facultad: e.target.value })} />
        <Boton onClick={cargar}>Aplicar filtros</Boton>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tarjeta><p className="text-body-sm text-on-surface-variant">Solicitudes</p><p className="mt-2 text-headline-lg font-semibold">{indicadores.TotalSolicitudes || 0}</p></Tarjeta>
        <Tarjeta><p className="text-body-sm text-on-surface-variant">Aprobadas</p><p className="mt-2 text-headline-lg font-semibold">{indicadores.SolicitudesAprobadas || 0}</p></Tarjeta>
        <Tarjeta><p className="text-body-sm text-on-surface-variant">Becas activas</p><p className="mt-2 text-headline-lg font-semibold">{indicadores.BecasActivas || 0}</p></Tarjeta>
        <Tarjeta><p className="text-body-sm text-on-surface-variant">% aprobación</p><p className="mt-2 text-headline-lg font-semibold">{indicadores.PorcentajeAprobacion || 0}%</p></Tarjeta>
      </div>
      <section>
        <h2 className="mb-3 text-headline-sm font-semibold text-primary">Beneficiarios</h2>
        <TablaDatos filas={becas} clave="IdBecaActiva" columnas={[
          { clave: 'NumeroEstudiante', etiqueta: 'Carné' },
          { clave: 'Estudiante', etiqueta: 'Estudiante' },
          { clave: 'Carrera', etiqueta: 'Carrera' },
          { clave: 'TipoBeca', etiqueta: 'Tipo' },
          { clave: 'Porcentaje', etiqueta: 'Cobertura', render: (fila) => `${fila.Porcentaje}%` },
          { clave: 'Estado', etiqueta: 'Estado' }
        ]} />
      </section>
      <section>
        <h2 className="mb-3 text-headline-sm font-semibold text-primary">Resultados de renovación</h2>
        <TablaDatos filas={renovaciones} clave={(fila) => `${fila.Periodo}-${fila.Estado}`} columnas={[
          { clave: 'Periodo', etiqueta: 'Periodo' },
          { clave: 'Estado', etiqueta: 'Resultado' },
          { clave: 'Total', etiqueta: 'Total' }
        ]} />
      </section>
    </div>
  );
}

