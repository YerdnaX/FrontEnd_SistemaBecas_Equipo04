import { Link } from 'react-router-dom';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';

export default function RestablecimientoContrasena() {
  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-md px-4 py-16 md:px-12">
        <Tarjeta>
          <h1 className="text-headline-md font-semibold text-on-surface">Restablecer contraseña</h1>
          <AlertaMensaje tipo="info" titulo="Flujo actualizado">
            La recuperación de contraseña ahora se realiza con código de verificación.
          </AlertaMensaje>
          <div className="mt-4">
            <Link to="/recuperar-contrasena">
              <Boton variante="texto" tamano="sm">Ir a recuperar contraseña con código</Boton>
            </Link>
          </div>
        </Tarjeta>
      </main>
      <PiePagina />
    </div>
  );
}
