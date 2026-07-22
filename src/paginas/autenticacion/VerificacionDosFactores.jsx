import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import { useSesion } from '../../hooks/useSesion.js';
import { reenviarDosFactores } from '../../servicios/servicioAutenticacion.js';

export default function VerificacionDosFactores() {
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const { verificarDosFactores } = useSesion();
  const correo = ubicacion.state?.correo;
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);

  if (!correo) return <Navigate to="/login" replace />;

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const usuario = await verificarDosFactores(correo, codigo);
      redirigirSegunRol(usuario);
    } catch (err) {
      setError(err.mensaje || 'El código ingresado no es válido.');
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

  async function manejarReenvio() {
    setMensaje(null);
    await reenviarDosFactores(correo);
    setMensaje('Se envió un nuevo código a su correo.');
  }

  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-md px-4 py-16 md:px-12">
        <Tarjeta>
          <h1 className="text-headline-md font-semibold text-primary">Verificación en dos pasos</h1>
          <p className="mt-2 text-body-sm text-on-surface-variant">Ingresamos un código a {correo}. Tiene una vigencia limitada.</p>
          <form className="mt-6 flex flex-col gap-4" onSubmit={manejarEnvio}>
            {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
            {mensaje && <AlertaMensaje tipo="exito">{mensaje}</AlertaMensaje>}
            <CampoTexto etiqueta="Código de verificación" inputMode="numeric" maxLength={6} value={codigo}
              onChange={(e) => setCodigo(e.target.value)} required />
            <Boton type="submit" cargando={enviando}>Verificar</Boton>
            <button type="button" onClick={manejarReenvio} className="text-body-sm text-primary-container hover:underline">
              Reenviar código
            </button>
          </form>
        </Tarjeta>
      </main>
      <PiePagina />
    </div>
  );
}
