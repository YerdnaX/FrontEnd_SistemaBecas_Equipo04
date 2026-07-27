import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { listarApelaciones } from '../../servicios/servicioApelaciones.js';

const ESTADOS = ['RECIBIDA', 'EN_REVISION', 'RESUELTA_A_FAVOR', 'RESUELTA_EN_CONTRA', 'RECHAZADA_POR_PLAZO'];

export default function BandejaApelaciones() {
  const [apelaciones, setApelaciones] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  async function cargar(estado) {
    setCargando(true);
    try {
      const respuesta = await listarApelaciones(estado ? { estado } : {});
      setApelaciones(respuesta.datos);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(filtroEstado); }, [filtroEstado]);

  return (
    <div>
      <h1 className="text-headline-lg font-semibold text-primary">Apelaciones</h1>

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
      {!cargando && apelaciones.length === 0 && <EstadoVacio titulo="No hay apelaciones con este filtro" />}

      {!cargando && apelaciones.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg bg-surface-container-lowest shadow-elevation-l2">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Aspirante</th>
                <th className="px-4 py-3">Resolución</th>
                <th className="px-4 py-3">Presentada</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {apelaciones.map((apelacion) => (
                <tr key={apelacion.IdApelacion} className="border-t border-outline-variant">
                  <td className="px-4 py-3">{apelacion.IdApelacion}</td>
                  <td className="px-4 py-3">{apelacion.NombreAspirante} {apelacion.ApellidoAspirante}</td>
                  <td className="px-4 py-3">{apelacion.NumeroResolucion || '—'}</td>
                  <td className="px-4 py-3">{new Date(apelacion.FechaPresentacion).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><EtiquetaEstado estado={apelacion.Estado} /></td>
                  <td className="px-4 py-3">
                    <Link to={`/apelaciones/${apelacion.IdApelacion}`} className="text-primary-container hover:underline">
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
