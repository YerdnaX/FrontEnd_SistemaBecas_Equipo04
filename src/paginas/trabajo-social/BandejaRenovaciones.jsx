import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { listarRenovacionesTrabajoSocial } from '../../servicios/servicioSegmentoDos.js';

export default function BandejaRenovaciones() {
  const [estado, setEstado] = useState('EN_REEVALUACION');
  const [renovaciones, setRenovaciones] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listarRenovacionesTrabajoSocial({ estado })
      .then((respuesta) => setRenovaciones(respuesta.datos))
      .catch((err) => setError(err.message));
  }, [estado]);

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Renovaciones de beca" descripcion="Evalúe los cambios académicos y socioeconómicos de cada renovación." />
      {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
      <CampoSelect
        className="max-w-xs"
        etiqueta="Estado"
        etiquetaVacia="Todos los estados"
        value={estado}
        onChange={(evento) => setEstado(evento.target.value)}
        opciones={['BORRADOR', 'EN_REEVALUACION', 'RENOVADA', 'REDUCIDA', 'SUSPENDIDA', 'DENEGADA'].map((valor) => ({
          valor,
          etiqueta: valor.replaceAll('_', ' ')
        }))}
      />
      <TablaDatos filas={renovaciones} clave="IdRenovacion" columnas={[
        { clave: 'NumeroEstudiante', etiqueta: 'Carné' },
        { clave: 'Estudiante', etiqueta: 'Estudiante' },
        { clave: 'Carrera', etiqueta: 'Carrera' },
        { clave: 'Periodo', etiqueta: 'Periodo' },
        { clave: 'Estado', etiqueta: 'Estado' },
        {
          clave: 'accion',
          etiqueta: 'Acción',
          render: (fila) => (
            <Link className="inline-flex items-center rounded-md px-2 py-1 text-label-sm font-semibold text-primary transition hover:bg-primary-container/15" to={`/trabajo-social/renovaciones/${fila.IdRenovacion}`}>
              Revisar
            </Link>
          )
        }
      ]} />
    </div>
  );
}
