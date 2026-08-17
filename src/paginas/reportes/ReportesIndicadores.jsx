import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import {
  listarBecasReporte,
  listarRenovacionesReporte,
  obtenerFiltrosReporte,
  obtenerIndicadores
} from '../../servicios/servicioSegmentoDos.js';

export default function ReportesIndicadores() {
  const [filtros, setFiltros] = useState({ periodo: '', facultad: '', estado: '', idTipoBeca: '' });
  const [indicadores, setIndicadores] = useState({});
  const [becas, setBecas] = useState([]);
  const [renovaciones, setRenovaciones] = useState([]);
  const [catalogos, setCatalogos] = useState({ periodos: [], carreras: [], estados: [], tiposBeca: [] });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    try {
      const [i, b, r] = await Promise.all([obtenerIndicadores(filtros), listarBecasReporte(filtros), listarRenovacionesReporte(filtros)]);
      setIndicadores(i.datos);
      setBecas(b.datos);
      setRenovaciones(r.datos);
    } catch (err) { setError(err.message); } finally { setCargando(false); }
  }
  useEffect(() => {
    cargar();
    obtenerFiltrosReporte()
      .then((respuesta) => setCatalogos(respuesta.datos))
      .catch((err) => setError(err.message));
  }, []);

  function exportarCsv() {
    const columnas = ['Carné', 'Estudiante', 'Carrera', 'Tipo de beca', 'Cobertura', 'Periodo', 'Estado'];
    const proteger = (valor) => {
      let texto = String(valor ?? '');
      if (/^[=+\-@]/.test(texto)) texto = `'${texto}`;
      return `"${texto.replaceAll('"', '""')}"`;
    };
    const filas = becas.map((fila) => [
      fila.NumeroEstudiante,
      fila.Estudiante,
      fila.Carrera,
      fila.TipoBeca,
      `${fila.Porcentaje}%`,
      fila.Periodo,
      fila.Estado
    ].map(proteger).join(','));
    const blob = new Blob([`\uFEFF${columnas.map(proteger).join(',')}\n${filas.join('\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'reporte-beneficiarios.csv';
    enlace.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Reportes e indicadores" descripcion="Datos agregados directamente desde SQL Server con filtros parametrizados." />
      {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
      <div className="flex flex-wrap items-end gap-3">
        <CampoSelect
          etiqueta="Periodo"
          etiquetaVacia="Todos los periodos"
          value={filtros.periodo}
          onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value })}
          opciones={catalogos.periodos.map((valor) => ({ valor, etiqueta: valor }))}
        />
        <CampoSelect
          etiqueta="Facultad o carrera"
          etiquetaVacia="Todas las carreras"
          value={filtros.facultad}
          onChange={(e) => setFiltros({ ...filtros, facultad: e.target.value })}
          opciones={catalogos.carreras.map((valor) => ({ valor, etiqueta: valor }))}
        />
        <CampoSelect
          etiqueta="Tipo de beca"
          etiquetaVacia="Todos los tipos"
          value={filtros.idTipoBeca}
          onChange={(e) => setFiltros({ ...filtros, idTipoBeca: e.target.value })}
          opciones={catalogos.tiposBeca.map((tipo) => ({ valor: tipo.IdTipoBeca, etiqueta: tipo.Nombre }))}
        />
        <CampoSelect
          etiqueta="Estado"
          etiquetaVacia="Todos los estados"
          value={filtros.estado}
          onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
          opciones={catalogos.estados.map((valor) => ({ valor, etiqueta: valor }))}
        />
        <Boton onClick={cargar}>Aplicar filtros</Boton>
        <Boton variante="secundario" deshabilitado={!becas.length} onClick={exportarCsv}>Exportar CSV</Boton>
      </div>
      {cargando ? <EstadoCarga /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Tarjeta><p className="text-label-md text-on-surface-variant">Solicitudes</p><p className="mt-2 text-headline-lg font-semibold text-on-surface">{indicadores.TotalSolicitudes || 0}</p></Tarjeta>
            <Tarjeta><p className="text-label-md text-on-surface-variant">Aprobadas</p><p className="mt-2 text-headline-lg font-semibold text-on-surface">{indicadores.SolicitudesAprobadas || 0}</p></Tarjeta>
            <Tarjeta><p className="text-label-md text-on-surface-variant">Becas activas</p><p className="mt-2 text-headline-lg font-semibold text-on-surface">{indicadores.BecasActivas || 0}</p></Tarjeta>
            <Tarjeta><p className="text-label-md text-on-surface-variant">% aprobación</p><p className="mt-2 text-headline-lg font-semibold text-on-surface">{indicadores.PorcentajeAprobacion || 0}%</p></Tarjeta>
          </div>
          <section>
            <h2 className="mb-3 text-headline-sm font-semibold text-on-surface">Beneficiarios</h2>
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
            <h2 className="mb-3 text-headline-sm font-semibold text-on-surface">Resultados de renovación</h2>
            <TablaDatos filas={renovaciones} clave={(fila) => `${fila.Periodo}-${fila.Estado}`} columnas={[
              { clave: 'Periodo', etiqueta: 'Periodo' },
              { clave: 'Estado', etiqueta: 'Resultado' },
              { clave: 'Total', etiqueta: 'Total' }
            ]} />
          </section>
        </>
      )}
    </div>
  );
}
