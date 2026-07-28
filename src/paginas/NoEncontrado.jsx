import { Link } from 'react-router-dom';
import EstadoVacio from '../componentes/comunes/EstadoVacio.jsx';
import Boton from '../componentes/comunes/Boton.jsx';

export default function NoEncontrado() {
  return (
    <div className="mx-auto max-w-container-max px-4 py-16">
      <EstadoVacio
        titulo="Página no encontrada"
        descripcion="La dirección a la que intentó acceder no existe o fue movida."
        accion={<Link to="/"><Boton>Volver al inicio</Boton></Link>}
      />
    </div>
  );
}
