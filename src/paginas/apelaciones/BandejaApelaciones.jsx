import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { listarApelaciones } from '../../servicios/servicioApelaciones.js';

const ESTADOS = ['PRESENTADA', 'EN_REVISION', 'RESUELTA'];

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
      <h1 className="text-headline-lg font-semibold text-on-surface">Apelaciones</h1>

      <div className="mt-4 max-w-xs">
        <CampoSelect
          etiqueta="Filtrar por estado"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          opciones={ESTADOS.map((estado) => ({ valor: estado, etiqueta: estado.replaceAll('_', ' ') }))}
        />
      </div>

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}

      {cargando ? <EstadoCarga /> : (
        <div className="mt-6">
          <TablaDatos
            clave="IdApelacion"
            textoVacio="No hay apelaciones con este filtro"
            filas={apelaciones}
            columnas={[
              { clave: 'IdApelacion', etiqueta: '#' },
              { clave: 'aspirante', etiqueta: 'Aspirante', render: (a) => <>{a.NombreAspirante} {a.ApellidoAspirante}</> },
              { clave: 'NumeroResolucion', etiqueta: 'Resolución', render: (a) => a.NumeroResolucion || '—' },
              { clave: 'FechaPresentacion', etiqueta: 'Presentada', render: (a) => new Date(a.FechaPresentacion).toLocaleDateString() },
              { clave: 'Estado', etiqueta: 'Estado', render: (a) => <EtiquetaEstado estado={a.Estado} /> },
              {
                clave: 'acciones',
                etiqueta: '',
                render: (a) => (
                  <Link to={`/apelaciones/${a.IdApelacion}`} className="text-primary-container hover:underline">
                    Ver detalle →
                  </Link>
                )
              }
            ]}
          />
        </div>
      )}
    </div>
  );
}
