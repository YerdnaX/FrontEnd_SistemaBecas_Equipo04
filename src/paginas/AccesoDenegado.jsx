import { Link } from 'react-router-dom';
import EstadoVacio from '../componentes/comunes/EstadoVacio.jsx';
import Boton from '../componentes/comunes/Boton.jsx';

export default function AccesoDenegado() {
  return (
    <div className="mx-auto max-w-container-max px-4 py-16">
      <EstadoVacio
        titulo="Acceso denegado"
        descripcion="No tiene permiso para ver esta página con su cuenta actual."
        accion={<Link to="/"><Boton>Volver al inicio</Boton></Link>}
      />
    </div>
  );
}
