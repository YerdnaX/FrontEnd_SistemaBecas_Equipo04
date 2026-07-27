import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { validarSolicitud, obtenerSolicitud } from '../../servicios/servicioSolicitudes.js';

function obtenerDestinoSegunValidacion(validacion) {
  if (validacion?.estadoSolicitud && validacion.estadoSolicitud !== 'BORRADOR') {
    return 'resultado';
  }

  if (!validacion?.secciones?.datosPersonales) return 'personal';
  if (!validacion?.secciones?.datosAcademicos) return 'academicos';
  if (!validacion?.secciones?.datosSocioeconomicos) return 'socioeconomicos';
  if ((validacion?.documentosFaltantes || []).length > 0) return 'documentos';
  return 'revision';
}

export default function ContinuarSolicitud() {
  const { id } = useParams();
  const navegar = useNavigate();

  useEffect(() => {
    let activo = true;

    async function redirigir() {
      try {
        const solicitud = await obtenerSolicitud(id);
        const estado = solicitud.datos?.Estado || 'BORRADOR';
        if (estado !== 'BORRADOR') {
          if (activo) navegar(`/aspirante/solicitudes/${id}/resultado`, { replace: true });
          return;
        }

        const validacion = await validarSolicitud(id);
        const destino = obtenerDestinoSegunValidacion(validacion.datos);
        if (activo) navegar(`/aspirante/solicitudes/${id}/${destino}`, { replace: true });
      } catch {
        if (activo) navegar(`/aspirante`, { replace: true });
      }
    }

    redirigir();
    return () => {
      activo = false;
    };
  }, [id, navegar]);

  return <EstadoCarga mensaje="Reanudando su solicitud..." />;
}