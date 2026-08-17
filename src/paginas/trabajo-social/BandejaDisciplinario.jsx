import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { listarInvestigaciones } from '../../servicios/servicioDisciplinario.js';

const ESTADOS = ['EN_REVISION', 'CERRADA'];

function EnlaceAccion({ to, children }) {
  return (
    <Link to={to} className="inline-flex items-center rounded-md px-2 py-1 text-label-sm font-semibold text-primary transition hover:bg-primary-container/15">
      {children}
    </Link>
  );
}

export default function BandejaDisciplinario() {
  const [investigaciones, setInvestigaciones] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  async function cargar(estado) {
    setCargando(true);
    try {
      const respuesta = await listarInvestigaciones(estado ? { estado } : {});
      setInvestigaciones(respuesta.datos);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(filtroEstado); }, [filtroEstado]);

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Procesos disciplinarios" />

      <div className="max-w-xs">
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
          filas={investigaciones}
          clave="IdInvestigacion"
          textoVacio="No hay procesos con este filtro"
          columnas={[
            { clave: 'IdInvestigacion', etiqueta: '#' },
            { clave: 'Becado', etiqueta: 'Becado', render: (inv) => `${inv.NombreBecado} ${inv.ApellidoBecado}` },
            { clave: 'Causal', etiqueta: 'Causal' },
            { clave: 'FechaApertura', etiqueta: 'Abierta', render: (inv) => new Date(inv.FechaApertura).toLocaleDateString() },
            { clave: 'Estado', etiqueta: 'Estado', render: (inv) => <EtiquetaEstado estado={inv.Estado} /> },
            {
              clave: 'acciones',
              etiqueta: '',
              render: (inv) => (
                <EnlaceAccion to={`/trabajo-social/disciplinario/${inv.IdInvestigacion}`}>Ver detalle →</EnlaceAccion>
              )
            }
          ]}
        />
      )}
    </div>
  );
}
