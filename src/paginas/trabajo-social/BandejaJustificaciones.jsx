import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { listarJustificacionesTrabajoSocial } from '../../servicios/servicioSegmentoDos.js';

export default function BandejaJustificaciones() {
  const [estado, setEstado] = useState('PENDIENTE');
  const [justificaciones, setJustificaciones] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listarJustificacionesTrabajoSocial({ estado })
      .then((respuesta) => setJustificaciones(respuesta.datos))
      .catch((err) => setError(err.message));
  }, [estado]);

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Justificaciones de cursos" descripcion="Revise los motivos y respaldos enviados por los becados." />
      {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
      <CampoSelect
        className="max-w-xs"
        etiqueta="Estado"
        etiquetaVacia="Todos los estados"
        value={estado}
        onChange={(evento) => setEstado(evento.target.value)}
        opciones={['PENDIENTE', 'APROBADA', 'RECHAZADA'].map((valor) => ({ valor, etiqueta: valor }))}
      />
      <TablaDatos filas={justificaciones} clave="IdJustificacion" columnas={[
        { clave: 'NumeroEstudiante', etiqueta: 'Carné' },
        { clave: 'Estudiante', etiqueta: 'Estudiante' },
        { clave: 'Curso', etiqueta: 'Curso' },
        { clave: 'Periodo', etiqueta: 'Periodo' },
        { clave: 'Estado', etiqueta: 'Estado' },
        { clave: 'NombreOriginal', etiqueta: 'Respaldo' },
        {
          clave: 'accion',
          etiqueta: 'Acción',
          render: (fila) => (
            <Link className="font-semibold text-primary-container hover:underline" to={`/trabajo-social/justificaciones/${fila.IdJustificacion}`}>
              Revisar
            </Link>
          )
        }
      ]} />
    </div>
  );
}
