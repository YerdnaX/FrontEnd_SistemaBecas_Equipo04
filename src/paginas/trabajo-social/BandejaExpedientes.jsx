import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { listarExpedientes } from '../../servicios/servicioExpedientes.js';

const ESTADOS = [
  'EN_REVISION_DOCUMENTAL', 'PENDIENTE_SUBSANACION', 'ELEGIBLE', 'NO_ELEGIBLE',
  'EN_EVALUACION', 'EVALUADA', 'EN_COMITE', 'APROBADA', 'CONDICIONADA', 'LISTA_ESPERA', 'RECHAZADA'
];

export default function BandejaExpedientes() {
  const [expedientes, setExpedientes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  async function cargar(estado) {
    setCargando(true);
    try {
      const respuesta = await listarExpedientes(estado ? { estado } : {});
      setExpedientes(respuesta.datos);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(filtroEstado); }, [filtroEstado]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-headline-lg font-semibold text-primary">Bandeja de expedientes</h1>
        <img src="/images/trabajosocial.png" alt="Bandeja de trabajo social" className="imagen-ui-seccion self-center sm:self-auto" />
      </div>

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
      {!cargando && expedientes.length === 0 && <EstadoVacio titulo="No hay expedientes con este filtro" />}

      {!cargando && expedientes.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg bg-surface-container-lowest shadow-elevation-l2">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Aspirante</th>
                <th className="px-4 py-3">Cédula</th>
                <th className="px-4 py-3">Convocatoria</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Responsable</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {expedientes.map((expediente) => (
                <tr key={expediente.IdExpediente} className="border-t border-outline-variant">
                  <td className="px-4 py-3">{expediente.CodigoExpediente}</td>
                  <td className="px-4 py-3">{expediente.NombreAspirante} {expediente.ApellidoAspirante}</td>
                  <td className="px-4 py-3">{expediente.CedulaAspirante || '—'}</td>
                  <td className="px-4 py-3">{expediente.NombreConvocatoria}</td>
                  <td className="px-4 py-3"><EtiquetaEstado estado={expediente.Estado} /></td>
                  <td className="px-4 py-3">{expediente.ResponsableAsignado || 'Sin asignar'}</td>
                  <td className="px-4 py-3">
                    <Link to={`/trabajo-social/expedientes/${expediente.IdExpediente}`} className="text-primary-container hover:underline">
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
