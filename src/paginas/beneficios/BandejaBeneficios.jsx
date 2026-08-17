import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { listarBeneficios } from '../../servicios/servicioSegmentoDos.js';

const CONFIGURACION = {
  registro: {
    titulo: 'Validación académica',
    descripcion: 'Seleccione un beneficio para validar la información académica del expediente.'
  },
  finanzas: {
    titulo: 'Activación financiera',
    descripcion: 'Seleccione un beneficio validado para registrar y verificar su aplicación financiera.'
  },
  seguimiento: {
    titulo: 'Becarios y seguimiento',
    descripcion: 'Acceda a las visitas domiciliarias y al seguimiento académico de cada becado.'
  }
};

function EnlaceAccion({ ruta, children }) {
  return (
    <Link className="inline-flex items-center rounded-md px-2 py-1 text-label-sm font-semibold text-primary transition hover:bg-primary-container/15" to={ruta}>
      {children}
    </Link>
  );
}

export default function BandejaBeneficios({ area }) {
  const [beneficios, setBeneficios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const configuracion = CONFIGURACION[area];

  useEffect(() => {
    listarBeneficios()
      .then((respuesta) => setBeneficios(respuesta.datos))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <EstadoCarga />;

  const columnas = [
    { clave: 'NumeroEstudiante', etiqueta: 'Carné' },
    { clave: 'Estudiante', etiqueta: 'Estudiante' },
    { clave: 'Carrera', etiqueta: 'Carrera' },
    { clave: 'Periodo', etiqueta: 'Periodo' },
    { clave: 'EstadoAcademico', etiqueta: 'Académico' },
    { clave: 'EstadoFinanciero', etiqueta: 'Financiero' },
    { clave: 'Estado', etiqueta: 'Beneficio' },
    {
      clave: 'acciones',
      etiqueta: 'Acciones',
      render: (fila) => {
        if (area === 'registro') {
          return <EnlaceAccion ruta={`/registro-academico/expedientes/${fila.IdBecaActiva}`}>Validar</EnlaceAccion>;
        }
        if (area === 'finanzas') {
          return <EnlaceAccion ruta={`/finanzas/beneficios/${fila.IdBecaActiva}`}>Activar</EnlaceAccion>;
        }
        return (
          <div className="flex flex-wrap gap-3">
            <EnlaceAccion ruta={`/trabajo-social/expedientes/${fila.IdExpediente}/visita`}>Visitas</EnlaceAccion>
            <EnlaceAccion ruta={`/trabajo-social/becarios/${fila.IdBecaActiva}/seguimiento`}>Seguimiento</EnlaceAccion>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo={configuracion.titulo} descripcion={configuracion.descripcion} />
      {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
      <TablaDatos filas={beneficios} clave="IdBecaActiva" columnas={columnas} textoVacio="No hay beneficios registrados" />
    </div>
  );
}
