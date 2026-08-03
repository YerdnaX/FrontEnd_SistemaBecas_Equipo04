import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import { useSesion } from '../../hooks/useSesion.js';
import { cambiarContrasena, obtenerUsuarioActual } from '../../servicios/servicioUsuarios.js';
import { listarNotificaciones } from '../../servicios/servicioNotificaciones.js';

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
  const [datosActividad, setDatosActividad] = useState({ notificaciones: 0 });

  const [formContrasena, setFormContrasena] = useState({ actual: '', nueva: '', confirmacion: '' });
  const [enviandoContrasena, setEnviandoContrasena] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const respuestaUsuario = await obtenerUsuarioActual();
        const perfilActual = respuestaUsuario.datos;
        setPerfil(perfilActual);

        const respuestaNotificaciones = await listarNotificaciones().catch(() => ({ datos: [] }));
        const notificaciones = respuestaNotificaciones?.datos || [];
        const notificacionesSinLeer = notificaciones.filter((n) => !n.Leida).length;
        setDatosActividad({
          notificaciones: notificacionesSinLeer
        });
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
  const inicial = useMemo(() => avatarInicial(perfil?.nombre), [perfil]);
  const nombresCompletos = [perfil?.nombre, perfil?.primerApellido, perfil?.segundoApellido].filter(Boolean).join(' ');
  const totalRoles = perfil?.roles?.length || 0;

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

  if (cargando) return <EstadoCarga mensaje="Cargando su cuenta..." />;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="overflow-hidden rounded-2xl border border-outline-variant bg-gradient-to-br from-primary-container via-primary to-slate-950 text-on-primary shadow-elevation-l2">
        <div className="grid gap-6 p-6 md:grid-cols-[1.6fr_0.9fr] md:p-8">
          <div className="space-y-4">
            <p className="text-label-md font-semibold uppercase tracking-[0.2em] text-on-primary-container">Mi cuenta</p>
            <h1 className="text-headline-lg font-semibold text-on-primary">{perfil?.nombre || 'Usuario'}</h1>
            <p className="max-w-2xl text-body-md text-on-primary-container">Panel personal con sus datos del sistema, accesos y seguridad de la cuenta.</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-label-sm font-semibold text-on-primary">{tipoUsuario}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-label-sm text-on-primary">ID {perfil?.idUsuario}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-label-sm text-on-primary">{totalRoles} rol{totalRoles === 1 ? '' : 'es'}</span>
            </div>
          </div>
          <div className="flex items-center justify-start md:justify-end">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-4xl font-semibold text-on-primary backdrop-blur-sm">
              {inicial}
            </div>
          </div>
        </div>
      </div>

      {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
      {mensaje && <AlertaMensaje tipo="exito">{mensaje}</AlertaMensaje>}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Tarjeta className="border-l-4 border-primary-container">
          <p className="text-label-md font-semibold uppercase tracking-wide text-primary-container">Usuario</p>
          <p className="mt-2 text-headline-md font-semibold text-primary">{perfil?.idUsuario}</p>
          <p className="text-body-sm text-on-surface-variant">Identificador interno de la cuenta.</p>
        </Tarjeta>
        <Tarjeta className="border-l-4 border-primary-container">
          <p className="text-label-md font-semibold uppercase tracking-wide text-primary-container">Correo</p>
          <p className="mt-2 truncate text-headline-md font-semibold text-primary">{perfil?.correo}</p>
          <p className="text-body-sm text-on-surface-variant">Correo principal registrado.</p>
        </Tarjeta>
        <Tarjeta className="border-l-4 border-primary-container">
          <p className="text-label-md font-semibold uppercase tracking-wide text-primary-container">Roles</p>
          <p className="mt-2 text-headline-md font-semibold text-primary">{totalRoles}</p>
          <p className="text-body-sm text-on-surface-variant">Roles activos en el sistema.</p>
        </Tarjeta>
        <Tarjeta className="border-l-4 border-primary-container">
          <p className="text-label-md font-semibold uppercase tracking-wide text-primary-container">Notificaciones</p>
          <p className="mt-2 text-headline-md font-semibold text-primary">{datosActividad.notificaciones}</p>
          <p className="text-body-sm text-on-surface-variant">
            {datosActividad.notificaciones === 0 ? 'No tiene notificaciones sin leer.' : 'Notificaciones sin leer disponibles para revisar.'}
          </p>
        </Tarjeta>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Tarjeta className="lg:col-span-1">
          <h2 className="text-headline-sm font-semibold text-primary">Datos personales</h2>
          <div className="mt-4 rounded-2xl bg-surface-container-low p-4">
            <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">Nombre completo</p>
            <p className="mt-1 text-body-lg font-semibold text-on-surface">{nombresCompletos}</p>
            <p className="mt-4 text-label-sm uppercase tracking-wide text-on-surface-variant">Cédula</p>
            <p className="mt-1 text-body-md font-semibold text-on-surface">{perfil?.cedula || 'No registrada'}</p>
            <p className="mt-4 text-label-sm uppercase tracking-wide text-on-surface-variant">Tipo de usuario</p>
            <p className="mt-1 text-body-md font-semibold text-on-surface">{tipoUsuario}</p>
          </div>
        </Tarjeta>

        <div className="lg:col-span-2 grid gap-6">
          <Tarjeta>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-headline-sm font-semibold text-primary">Cambiar contraseña</h2>
                <p className="mt-1 text-body-sm text-on-surface-variant">Al actualizarla, la sesión se cerrará por seguridad.</p>
              </div>
            </div>
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
            <h2 className="text-headline-sm font-semibold text-primary">Seguridad de la cuenta</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link to="/mi-cuenta/sesiones" className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 transition hover:border-primary-container hover:bg-surface-container-low">
                <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">Sesiones activas</p>
                <p className="mt-1 text-headline-md font-semibold text-primary">Accesibles desde aquí</p>
              </Link>
              <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
                <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">Correo verificado</p>
                <p className="mt-1 text-headline-md font-semibold text-primary">Sí</p>
              </div>
            </div>
          </Tarjeta>
        </div>
      </div>
    </div>
  );
}