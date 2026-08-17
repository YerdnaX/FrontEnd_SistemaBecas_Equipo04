import { useState } from 'react';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import { Link } from 'react-router-dom';
import { recuperarContrasena, verificarCodigoRecuperacion, restablecerContrasena } from '../../servicios/servicioAutenticacion.js';
import { contrasenaEsSegura } from '../../utilidades/validaciones.js';

export default function RecuperacionContrasena() {
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [paso, setPaso] = useState('SOLICITAR');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function manejarSolicitudCodigo(evento) {
    evento.preventDefault();
    setError(null);
    setMensaje(null);
    setEnviando(true);
    try {
      await recuperarContrasena(correo);
      setPaso('VALIDAR');
      setMensaje('Si el correo está registrado, se envió un código de recuperación.');
    } catch {
      setPaso('VALIDAR');
      setMensaje('Si el correo está registrado, se envió un código de recuperación.');
    } finally {
      setEnviando(false);
    }
  }

  async function manejarValidacionCodigo(evento) {
    evento.preventDefault();
    setError(null);
    setMensaje(null);
    setEnviando(true);
    try {
      await verificarCodigoRecuperacion(correo, codigo);
      setPaso('CAMBIAR');
      setMensaje('Código verificado correctamente. Ahora puede definir una nueva contraseña.');
    } catch (err) {
      setError(err.mensaje || 'No fue posible validar el código.');
    } finally {
      setEnviando(false);
    }
  }

  async function manejarCambioContrasena(evento) {
    evento.preventDefault();
    setError(null);
    setMensaje(null);

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
      await restablecerContrasena({ correo, codigo, contrasena, confirmacion });
      setExito(true);
    } catch (err) {
      setError(err.mensaje || 'No fue posible actualizar la contraseña.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-md px-4 py-16 md:px-12">
        <Tarjeta>
          <img src="/images/logo.png" alt="Logo SGBE CUC" className="mx-auto mb-3 h-16 w-16 object-contain" />
          <h1 className="text-headline-md font-semibold text-on-surface">Recuperar contraseña</h1>

          {exito ? (
            <AlertaMensaje tipo="exito" titulo="Contraseña actualizada">
              Ya puede iniciar sesión con su nueva contraseña.
              <Link to="/login" className="mt-2 block font-semibold underline">Ir a iniciar sesión</Link>
            </AlertaMensaje>
          ) : paso === 'SOLICITAR' ? (
            <form className="mt-6 flex flex-col gap-4" onSubmit={manejarSolicitudCodigo}>
              {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
              <CampoTexto etiqueta="Correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              <Boton type="submit" cargando={enviando}>Enviar código</Boton>
            </form>
          ) : paso === 'VALIDAR' ? (
            <form className="mt-6 flex flex-col gap-4" onSubmit={manejarValidacionCodigo}>
              {mensaje && <AlertaMensaje tipo="info">{mensaje}</AlertaMensaje>}
              {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
              <p className="text-body-sm text-on-surface-variant">
                Ingrese el código de 6 dígitos enviado al correo registrado.
              </p>
              <CampoTexto
                etiqueta="Código de recuperación"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
              <Boton type="submit" cargando={enviando}>Validar código</Boton>
              <Boton type="button" variante="texto" tamano="sm" onClick={() => setPaso('SOLICITAR')}>
                Volver a enviar código
              </Boton>
            </form>
          ) : (
            <form className="mt-6 flex flex-col gap-4" onSubmit={manejarCambioContrasena}>
              {mensaje && <AlertaMensaje tipo="info">{mensaje}</AlertaMensaje>}
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
