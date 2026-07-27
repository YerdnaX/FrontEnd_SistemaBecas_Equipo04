import { Link } from 'react-router-dom';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';

export default function RestablecimientoContrasena() {
  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-md px-4 py-16 md:px-12">
        <Tarjeta>
          <h1 className="text-headline-md font-semibold text-primary">Restablecer contraseña</h1>
          <AlertaMensaje tipo="info" titulo="Flujo actualizado">
            La recuperación de contraseña ahora se realiza con código de verificación.
          </AlertaMensaje>
          <div className="mt-4">
            <Link to="/recuperar-contrasena" className="font-semibold text-primary-container underline">
              Ir a recuperar contraseña con código
            </Link>
          </div>
        </Tarjeta>
      </main>
      <PiePagina />
    </div>
  );
}
