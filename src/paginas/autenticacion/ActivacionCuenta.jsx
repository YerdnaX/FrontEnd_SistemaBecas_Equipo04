import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { activarCuenta } from '../../servicios/servicioAutenticacion.js';

export default function ActivacionCuenta() {
  const [parametros] = useSearchParams();
  const token = parametros.get('token');
  const [estado, setEstado] = useState('cargando');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!token) {
      setEstado('error');
      setMensaje('El enlace de activación no incluye un token válido.');
      return;
    }
    activarCuenta(token)
      .then(() => setEstado('exito'))
      .catch((error) => {
        setEstado('error');
        setMensaje(error.mensaje || 'El enlace de activación no es válido o venció.');
      });
  }, [token]);

  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-xl px-4 py-16 md:px-12">
        <Tarjeta>
          <h1 className="text-headline-md font-semibold text-primary">Activación de cuenta</h1>
          <div className="mt-4">
            {estado === 'cargando' && <EstadoCarga mensaje="Activando su cuenta..." />}
            {estado === 'exito' && (
              <AlertaMensaje tipo="exito" titulo="Cuenta activada">
                Ya puede iniciar sesión. <Link to="/login" className="font-semibold underline">Ir a iniciar sesión</Link>
              </AlertaMensaje>
            )}
            {estado === 'error' && <AlertaMensaje tipo="error" titulo="No fue posible activar la cuenta">{mensaje}</AlertaMensaje>}
          </div>
        </Tarjeta>
      </main>
      <PiePagina />
    </div>
  );
}
