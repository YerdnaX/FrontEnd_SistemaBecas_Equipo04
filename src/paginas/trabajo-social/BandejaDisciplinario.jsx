import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { listarInvestigaciones } from '../../servicios/servicioDisciplinario.js';

const ESTADOS = ['ABIERTA', 'EN_DESCARGOS', 'EN_ANALISIS', 'RESUELTA', 'CERRADA'];

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
    <div>
      <h1 className="text-headline-lg font-semibold text-primary">Procesos disciplinarios</h1>

      <div className="mt-4 max-w-xs">
        <CampoSelect
          etiqueta="Filtrar por estado"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          opciones={ESTADOS.map((estado) => ({ valor: estado, etiqueta: estado.replaceAll('_', ' ') }))}
        />
      </div>

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}
      {cargando && <EstadoCarga />}
      {!cargando && investigaciones.length === 0 && <EstadoVacio titulo="No hay procesos con este filtro" />}

      {!cargando && investigaciones.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg bg-surface-container-lowest shadow-elevation-l2">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Becado</th>
                <th className="px-4 py-3">Causal</th>
                <th className="px-4 py-3">Abierta</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {investigaciones.map((inv) => (
                <tr key={inv.IdInvestigacion} className="border-t border-outline-variant">
                  <td className="px-4 py-3">{inv.IdInvestigacion}</td>
                  <td className="px-4 py-3">{inv.NombreBecado} {inv.ApellidoBecado}</td>
                  <td className="px-4 py-3">{inv.Causal}</td>
                  <td className="px-4 py-3">{new Date(inv.FechaApertura).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><EtiquetaEstado estado={inv.Estado} /></td>
                  <td className="px-4 py-3">
                    <Link to={`/trabajo-social/disciplinario/${inv.IdInvestigacion}`} className="text-primary-container hover:underline">
                      Ver detalle →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
