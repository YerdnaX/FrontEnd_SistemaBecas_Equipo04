import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import { restablecerContrasena } from '../../servicios/servicioAutenticacion.js';
import { contrasenaEsSegura } from '../../utilidades/validaciones.js';

export default function RestablecimientoContrasena() {
  const [parametros] = useSearchParams();
  const token = parametros.get('token');
  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
    if (!contrasenaEsSegura(contrasena)) {
      setError('La contraseña debe tener 8+ caracteres, una mayúscula, un número y un carácter especial.');
      return;
    }
    if (contrasena !== confirmacion) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setEnviando(true);
    try {
      await restablecerContrasena({ token, contrasena, confirmacion });
      setExito(true);
    } catch (err) {
      setError(err.mensaje || 'El enlace no es válido o venció.');
    } finally {
      setEnviando(false);
    }
  }

  if (!token) {
    return (
      <div>
        <EncabezadoPublico />
        <main className="mx-auto max-w-md px-4 py-16 md:px-12">
          <AlertaMensaje tipo="error">El enlace de restablecimiento no es válido.</AlertaMensaje>
        </main>
        <PiePagina />
      </div>
    );
  }

  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-md px-4 py-16 md:px-12">
        <Tarjeta>
          <h1 className="text-headline-md font-semibold text-primary">Restablecer contraseña</h1>
          {exito ? (
            <AlertaMensaje tipo="exito" titulo="Contraseña actualizada">
              <Link to="/login" className="font-semibold underline">Ir a iniciar sesión</Link>
            </AlertaMensaje>
          ) : (
            <form className="mt-6 flex flex-col gap-4" onSubmit={manejarEnvio}>
              {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
              <CampoTexto etiqueta="Nueva contraseña" type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
              <CampoTexto etiqueta="Confirmar contraseña" type="password" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} required />
              <Boton type="submit" cargando={enviando}>Actualizar contraseña</Boton>
            </form>
          )}
        </Tarjeta>
      </main>
      <PiePagina />
    </div>
  );
}
