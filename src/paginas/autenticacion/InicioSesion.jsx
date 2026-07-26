import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import { useSesion } from '../../hooks/useSesion.js';

export default function InicioSesion() {
  const navegar = useNavigate();
  const { iniciarSesion } = useSesion();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const usuario = await iniciarSesion(correo, contrasena);
      redirigirSegunRol(usuario);
    } catch (err) {
      setError(err.mensaje || 'No fue posible iniciar sesión.');
    } finally {
      setEnviando(false);
    }
  }

  function redirigirSegunRol(usuario) {
    if (usuario.roles.includes('ADMINISTRADOR') || usuario.roles.includes('COORDINADOR_BECAS')) return navegar('/admin');
    if (usuario.roles.includes('TRABAJADORA_SOCIAL')) return navegar('/trabajo-social/expedientes');
    if (usuario.roles.includes('COMITE_BECAS')) return navegar('/comite');
    return navegar('/aspirante');
  }

  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-md px-4 py-16 md:px-12">
        <Tarjeta>
          <h1 className="text-headline-md font-semibold text-primary">Iniciar sesión</h1>
          <form className="mt-6 flex flex-col gap-4" onSubmit={manejarEnvio}>
            {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
            <CampoTexto etiqueta="Correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
            <CampoTexto etiqueta="Contraseña" type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
            <Link to="/recuperar-contrasena" className="text-body-sm text-primary-container hover:underline">¿Olvidó su contraseña?</Link>
            <Boton type="submit" cargando={enviando}>Continuar</Boton>
            <p className="text-body-sm text-on-surface-variant">
              ¿No tiene cuenta? <Link to="/registro" className="font-semibold text-primary-container hover:underline">Regístrese</Link>
            </p>
          </form>
        </Tarjeta>
      </main>
      <PiePagina />
    </div>
  );
}
