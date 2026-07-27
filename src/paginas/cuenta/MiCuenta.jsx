import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import { useSesion } from '../../hooks/useSesion.js';
import { cambiarContrasena, solicitarCambioCorreo, verificarCambioCorreo, obtenerUsuarioActual } from '../../servicios/servicioUsuarios.js';

function avatarInicial(nombre) {
  return (nombre || '?').trim().charAt(0).toUpperCase() || '?';
}

function etiquetaRol(codigo) {
  const mapa = {
    ADMINISTRADOR: 'Administrador',
    COORDINADOR_BECAS: 'Coordinador de becas',
    TRABAJADORA_SOCIAL: 'Trabajadora social',
    COMITE_BECAS: 'Comité de becas',
    BECADO: 'Becado',
    ASPIRANTE: 'Aspirante'
  };
  return mapa[codigo] || codigo;
}

export default function MiCuenta() {
  const navegar = useNavigate();
  const { usuario, cerrarSesion, refrescarUsuario } = useSesion();
  const [perfil, setPerfil] = useState(usuario);
  const [cargando, setCargando] = useState(!usuario);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const [formContrasena, setFormContrasena] = useState({ actual: '', nueva: '', confirmacion: '' });
  const [enviandoContrasena, setEnviandoContrasena] = useState(false);

  const [formCorreo, setFormCorreo] = useState({ correoNuevo: '', contrasenaActual: '', codigo: '' });
  const [solicitandoCorreo, setSolicitandoCorreo] = useState(false);
  const [verificandoCorreo, setVerificandoCorreo] = useState(false);
  const [correoEnviado, setCorreoEnviado] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await obtenerUsuarioActual();
        setPerfil(respuesta.datos);
      } catch (err) {
        setError(err.mensaje || 'No fue posible cargar su información.');
      } finally {
        setCargando(false);
      }
    }
    if (!usuario) {
      navegar('/login');
      return;
    }
    if (!usuario.nombre || !usuario.correo) {
      cargar();
    } else {
      setPerfil(usuario);
      setCargando(false);
    }
  }, [usuario, navegar]);

  const tipoUsuario = useMemo(() => etiquetaRol(perfil?.tipoUsuario || perfil?.roles?.[0]), [perfil]);

  async function cambiarClave(evento) {
    evento.preventDefault();
    setError(null);
    setMensaje(null);
    setEnviandoContrasena(true);
    try {
      await cambiarContrasena({
        contrasenaActual: formContrasena.actual,
        contrasenaNueva: formContrasena.nueva,
        confirmacion: formContrasena.confirmacion
      });
      await cerrarSesion();
      navegar('/login');
    } catch (err) {
      setError(err.mensaje || 'No fue posible cambiar la contraseña.');
    } finally {
      setEnviandoContrasena(false);
    }
  }

  async function solicitarCodigoCorreo(evento) {
    evento.preventDefault();
    setError(null);
    setMensaje(null);
    setSolicitandoCorreo(true);
    try {
      await solicitarCambioCorreo({
        correoNuevo: formCorreo.correoNuevo,
        contrasenaActual: formCorreo.contrasenaActual
      });
      setCorreoEnviado(true);
      setMensaje('Se envió un código al nuevo correo.');
    } catch (err) {
      setError(err.mensaje || 'No fue posible enviar el código.');
    } finally {
      setSolicitandoCorreo(false);
    }
  }

  async function verificarCorreo(evento) {
    evento.preventDefault();
    setError(null);
    setMensaje(null);
    setVerificandoCorreo(true);
    try {
      await verificarCambioCorreo({
        correoNuevo: formCorreo.correoNuevo,
        codigo: formCorreo.codigo
      });
      await refrescarUsuario();
      const recarga = await obtenerUsuarioActual();
      setPerfil(recarga.datos);
      setMensaje('Correo actualizado correctamente.');
      setCorreoEnviado(false);
      setFormCorreo({ correoNuevo: '', contrasenaActual: '', codigo: '' });
    } catch (err) {
      setError(err.mensaje || 'No fue posible verificar el correo.');
    } finally {
      setVerificandoCorreo(false);
    }
  }

  if (cargando) return <EstadoCarga mensaje="Cargando su cuenta..." />;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-label-md font-semibold uppercase tracking-wide text-primary-container">Mi cuenta</p>
          <h1 className="text-headline-lg font-semibold text-primary">{perfil?.nombre || 'Usuario'}</h1>
          <p className="text-body-sm text-on-surface-variant">Información personal, seguridad y datos del sistema.</p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-body-lg font-semibold text-on-primary">
            {avatarInicial(perfil?.nombre)}
          </div>
          <div>
            <p className="text-body-sm font-semibold text-on-surface">{perfil?.nombre}</p>
            <p className="text-label-sm text-on-surface-variant">{tipoUsuario}</p>
          </div>
        </div>
      </div>

      {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
      {mensaje && <AlertaMensaje tipo="exito">{mensaje}</AlertaMensaje>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Tarjeta className="lg:col-span-1">
          <h2 className="text-headline-sm font-semibold text-primary">Datos personales</h2>
          <dl className="mt-4 space-y-3 text-body-sm">
            <div>
              <dt className="text-on-surface-variant">Nombre completo</dt>
              <dd className="font-semibold text-on-surface">{[perfil?.nombre, perfil?.primerApellido, perfil?.segundoApellido].filter(Boolean).join(' ')}</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Correo</dt>
              <dd className="font-semibold text-on-surface">{perfil?.correo}</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Tipo de usuario</dt>
              <dd className="font-semibold text-on-surface">{tipoUsuario}</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Roles</dt>
              <dd className="font-semibold text-on-surface">{perfil?.roles?.map(etiquetaRol).join(', ') || '—'}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <Link to="/mi-cuenta/sesiones" className="text-body-sm font-semibold text-primary-container hover:underline">
              Ver mis sesiones activas
            </Link>
          </div>
        </Tarjeta>

        <div className="lg:col-span-2 grid gap-6">
          <Tarjeta>
            <h2 className="text-headline-sm font-semibold text-primary">Cambiar contraseña</h2>
            <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={cambiarClave}>
              <CampoTexto etiqueta="Contraseña actual" type="password" value={formContrasena.actual}
                onChange={(e) => setFormContrasena((actual) => ({ ...actual, actual: e.target.value }))} required />
              <CampoTexto etiqueta="Nueva contraseña" type="password" value={formContrasena.nueva}
                onChange={(e) => setFormContrasena((actual) => ({ ...actual, nueva: e.target.value }))} required />
              <CampoTexto etiqueta="Confirmar nueva contraseña" type="password" value={formContrasena.confirmacion}
                className="sm:col-span-2"
                onChange={(e) => setFormContrasena((actual) => ({ ...actual, confirmacion: e.target.value }))} required />
              <div className="sm:col-span-2">
                <Boton type="submit" cargando={enviandoContrasena}>Actualizar contraseña</Boton>
              </div>
            </form>
          </Tarjeta>

          <Tarjeta>
            <h2 className="text-headline-sm font-semibold text-primary">Cambiar correo</h2>
            <p className="mt-1 text-body-sm text-on-surface-variant">Se enviará un código al nuevo correo antes de actualizarlo.</p>
            <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={correoEnviado ? verificarCorreo : solicitarCodigoCorreo}>
              <CampoTexto etiqueta="Nuevo correo" type="email" value={formCorreo.correoNuevo}
                onChange={(e) => setFormCorreo((actual) => ({ ...actual, correoNuevo: e.target.value }))} required />
              <CampoTexto etiqueta="Contraseña actual" type="password" value={formCorreo.contrasenaActual}
                onChange={(e) => setFormCorreo((actual) => ({ ...actual, contrasenaActual: e.target.value }))} required />
              {correoEnviado && (
                <CampoTexto etiqueta="Código recibido" value={formCorreo.codigo}
                  className="sm:col-span-2"
                  onChange={(e) => setFormCorreo((actual) => ({ ...actual, codigo: e.target.value }))} required />
              )}
              <div className="sm:col-span-2 flex flex-wrap gap-3">
                <Boton type="submit" cargando={correoEnviado ? verificandoCorreo : solicitandoCorreo}>
                  {correoEnviado ? 'Verificar correo' : 'Enviar código'}
                </Boton>
                {correoEnviado && (
                  <Boton type="button" variante="secundario" onClick={() => setCorreoEnviado(false)}>
                    Cambiar correo
                  </Boton>
                )}
              </div>
            </form>
          </Tarjeta>
        </div>
      </div>
    </div>
  );
}