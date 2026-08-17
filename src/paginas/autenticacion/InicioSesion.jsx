import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import { useSesion } from '../../hooks/useSesion.js';
import { rutaPrincipalPorRol } from '../../utilidades/rutasPorRol.js';

export default function InicioSesion() {
  const navegar = useNavigate();
  const { iniciarSesion, verificarDosFactores } = useSesion();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [codigo, setCodigo] = useState('');
  const [retoId, setRetoId] = useState(null);
  const [correoMostrado, setCorreoMostrado] = useState('');
  const [expiraEnMinutos, setExpiraEnMinutos] = useState(null);
  const [requiereDosFactores, setRequiereDosFactores] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function manejarCredenciales(evento) {
    evento.preventDefault();
    setError(null);
    setMensaje(null);
    setEnviando(true);
    try {
      const resultado = await iniciarSesion(correo, contrasena);
      if (resultado.requiereDosFactores) {
        setRequiereDosFactores(true);
        setRetoId(resultado.retoId);
        setCorreoMostrado(resultado.correo);
        setExpiraEnMinutos(resultado.expiraEnMinutos);
        setMensaje('Se envió un código de verificación a su correo.');
        return;
      }

      navegar(rutaPrincipalPorRol(resultado.usuario.roles));
    } catch (err) {
      setError(err.mensaje || 'No fue posible iniciar sesión.');
    } finally {
      setEnviando(false);
    }
  }

  async function manejarCodigo(evento) {
    evento.preventDefault();
    setError(null);
    setMensaje(null);
    setEnviando(true);
    try {
      const usuario = await verificarDosFactores(retoId, correo, codigo);
      navegar(rutaPrincipalPorRol(usuario.roles));
    } catch (err) {
      setError(err.mensaje || 'No fue posible verificar el código.');
    } finally {
      setEnviando(false);
    }
  }

  function volverAlPrimerPaso() {
    setRequiereDosFactores(false);
    setCodigo('');
    setRetoId(null);
    setCorreoMostrado('');
    setExpiraEnMinutos(null);
    setMensaje(null);
    setError(null);
  }

  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-md px-4 py-16 md:px-12">
        <Tarjeta className="text-center">
          <img src="/images/logo.png" alt="Logo SGBE CUC" className="mx-auto mb-3 h-16 w-16 object-contain" />
          <h1 className="text-headline-md font-semibold text-on-surface">
            {requiereDosFactores ? 'Verificación de seguridad' : 'Iniciar sesión'}
          </h1>

          {requiereDosFactores ? (
            <form className="mt-6 flex flex-col items-center gap-4 text-center" onSubmit={manejarCodigo}>
              {mensaje && <AlertaMensaje tipo="info">{mensaje}</AlertaMensaje>}
              {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
              <p className="text-body-sm text-on-surface-variant">
                Ingrese el código de 6 dígitos enviado a {correoMostrado}.
                {expiraEnMinutos ? ` Vence en ${expiraEnMinutos} minutos.` : ''}
              </p>
              <div className="w-full">
                <CampoTexto
                  etiqueta="Código de verificación"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                />
              </div>
              <Boton type="submit" className="w-full" cargando={enviando}>Verificar e ingresar</Boton>
              <Boton type="button" variante="texto" tamano="sm" onClick={volverAlPrimerPaso}>
                Volver al inicio de sesión
              </Boton>
            </form>
          ) : (
            <form className="mt-6 flex flex-col items-center gap-4 text-center" onSubmit={manejarCredenciales}>
              {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
              <div className="w-full">
                <CampoTexto etiqueta="Correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              </div>
              <div className="w-full">
                <CampoTexto etiqueta="Contraseña" type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
              </div>
              <Link to="/recuperar-contrasena"><Boton variante="texto" tamano="sm">¿Olvidó su contraseña?</Boton></Link>
              <Boton type="submit" className="w-full" cargando={enviando}>Continuar</Boton>
              <p className="text-body-sm text-on-surface-variant">
                ¿No tiene cuenta? <Link to="/registro" className="font-semibold text-primary-container hover:underline">Regístrese</Link>
              </p>
            </form>
          )}
        </Tarjeta>
      </main>
      <PiePagina />
    </div>
  );
}
