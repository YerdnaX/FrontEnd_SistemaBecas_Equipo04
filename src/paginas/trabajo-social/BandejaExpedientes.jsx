import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { listarExpedientes, listarPeriodosExpedientes } from '../../servicios/servicioExpedientes.js';

const ESTADOS = [
  'EN_REVISION_DOCUMENTAL', 'PENDIENTE_SUBSANACION', 'ELEGIBLE', 'NO_ELEGIBLE',
  'EN_EVALUACION', 'EVALUADA', 'EN_COMITE', 'APROBADA', 'CONDICIONADA', 'LISTA_ESPERA', 'RECHAZADA'
];

function EnlaceAccion({ to, children }) {
  return (
    <Link to={to} className="inline-flex items-center rounded-md px-2 py-1 text-label-sm font-semibold text-primary transition hover:bg-primary-container/15">
      {children}
    </Link>
  );
}

export default function BandejaExpedientes() {
  const [expedientes, setExpedientes] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listarPeriodosExpedientes()
      .then((respuesta) => setPeriodos(respuesta.datos || []))
      .catch((err) => setError(err.mensaje));
  }, []);

  useEffect(() => {
    setCargando(true);
    setError(null);
    const filtros = {};
    if (filtroEstado) filtros.estado = filtroEstado;
    if (filtroPeriodo) filtros.periodo = filtroPeriodo;
    listarExpedientes(filtros)
      .then((respuesta) => setExpedientes(respuesta.datos))
      .catch((err) => setError(err.mensaje))
      .finally(() => setCargando(false));
  }, [filtroEstado, filtroPeriodo]);

  return (
    <div className="space-y-6">
      <EncabezadoPagina
        titulo="Bandeja de expedientes"
        acciones={<img src="/images/trabajosocial.png" alt="Bandeja de trabajo social" className="imagen-ui-seccion self-center sm:self-auto" />}
      />

      <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
        <CampoSelect
          etiqueta="Filtrar por periodo"
          value={filtroPeriodo}
          onChange={(e) => setFiltroPeriodo(e.target.value)}
          opciones={periodos.map((periodo) => ({ valor: periodo, etiqueta: periodo }))}
        />
        <CampoSelect
          etiqueta="Filtrar por estado"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          opciones={ESTADOS.map((estado) => ({ valor: estado, etiqueta: estado.replaceAll('_', ' ') }))}
        />
      </div>

      {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
      {cargando && <EstadoCarga />}
      {!cargando && (
        <TablaDatos
          filas={expedientes}
          clave="IdExpediente"
          textoVacio="No hay expedientes con estos filtros"
          columnas={[
            { clave: 'CodigoExpediente', etiqueta: 'Código' },
            { clave: 'Aspirante', etiqueta: 'Aspirante', render: (expediente) => `${expediente.NombreAspirante} ${expediente.ApellidoAspirante}` },
            { clave: 'Periodo', etiqueta: 'Periodo', render: (expediente) => expediente.Periodo || '—' },
            { clave: 'Quintil', etiqueta: 'Quintil', render: (expediente) => expediente.Quintil ? `Q${expediente.Quintil}` : 'Pendiente' },
            { clave: 'Estado', etiqueta: 'Estado', render: (expediente) => <EtiquetaEstado estado={expediente.Estado} /> },
            { clave: 'ResponsableAsignado', etiqueta: 'Responsable', render: (expediente) => expediente.ResponsableAsignado || 'Sin asignar' },
            {
              clave: 'acciones',
              etiqueta: '',
              render: (expediente) => (
                <EnlaceAccion to={`/trabajo-social/expedientes/${expediente.IdExpediente}`}>Ver detalle →</EnlaceAccion>
              )
            }
          ]}
        />
      )}
    </div>
  );
}
