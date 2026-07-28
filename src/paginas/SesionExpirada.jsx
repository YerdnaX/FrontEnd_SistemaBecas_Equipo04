import { Link } from 'react-router-dom';
import EstadoVacio from '../componentes/comunes/EstadoVacio.jsx';
import Boton from '../componentes/comunes/Boton.jsx';

export default function SesionExpirada() {
  return (
    <div className="mx-auto max-w-container-max px-4 py-16">
      <EstadoVacio
        titulo="Su sesión expiró"
        descripcion="Por seguridad, cerramos su sesión luego de un periodo de inactividad. Inicie sesión de nuevo para continuar."
        accion={<Link to="/login"><Boton>Iniciar sesión de nuevo</Boton></Link>}
      />
    </div>
  );
}
