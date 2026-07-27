import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PasosSolicitud from '../../componentes/formularios/PasosSolicitud.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { obtenerSolicitud, guardarDatosPersonales } from '../../servicios/servicioSolicitudes.js';

const FORMULARIO_INICIAL = {
  identificacion: '', fechaNacimiento: '', telefono: '', direccion: '', contactoEmergencia: '', telefonoEmergencia: ''
};

function obtenerEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null;
  const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
  if (Number.isNaN(nacimiento.getTime())) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  const dia = hoy.getDate() - nacimiento.getDate();
  if (mes < 0 || (mes === 0 && dia < 0)) edad -= 1;
  return edad;
}

function esIdentificacionValida(valor) {
  return /^\d{9}$/.test(String(valor || ''));
}

function esTelefonoValido(valor) {
  return /^\d{8}$/.test(String(valor || ''));
}

export default function SolicitudDatosPersonales() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [estadoSolicitud, setEstadoSolicitud] = useState('BORRADOR');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [erroresCampos, setErroresCampos] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerSolicitud(id).then((respuesta) => {
      const datos = respuesta.datos.datosPersonales;
      if (datos) {
        setEstadoSolicitud(respuesta.datos.Estado || 'BORRADOR');
        setFormulario({
          identificacion: datos.Identificacion || '',
          fechaNacimiento: datos.FechaNacimiento ? datos.FechaNacimiento.slice(0, 10) : '',
          telefono: datos.Telefono || '',
          direccion: datos.Direccion || '',
          contactoEmergencia: datos.ContactoEmergencia || '',
          telefonoEmergencia: datos.TelefonoEmergencia || ''
        });
      }
    }).catch((err) => setError(err.mensaje)).finally(() => setCargando(false));
  }, [id]);

  function actualizarCampo(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
    setErroresCampos((actual) => {
      if (!actual[campo]) return actual;
      const siguiente = { ...actual };
      delete siguiente[campo];
      return siguiente;
    });
  }

  const identificacionValida = esIdentificacionValida(formulario.identificacion);
  const edad = obtenerEdad(formulario.fechaNacimiento);
  const fechaNacimientoValida = edad !== null && edad > 18;
  const telefonoValido = esTelefonoValido(formulario.telefono);
  const telefonoEmergenciaValido = esTelefonoValido(formulario.telefonoEmergencia);
  const contactoEmergenciaValido = !formulario.contactoEmergencia.trim() || formulario.contactoEmergencia.trim().length >= 3;

  function validarFormulario() {
    const nuevosErrores = {};
    if (!identificacionValida) nuevosErrores.identificacion = 'La identificación debe contener exactamente 9 dígitos numéricos.';
    if (!formulario.fechaNacimiento) nuevosErrores.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    else if (!fechaNacimientoValida) nuevosErrores.fechaNacimiento = 'Debe ser mayor de 18 años.';
    if (!telefonoValido) nuevosErrores.telefono = 'El teléfono debe contener exactamente 8 dígitos numéricos.';
    if (!formulario.direccion.trim()) nuevosErrores.direccion = 'La dirección es obligatoria.';
    if (formulario.contactoEmergencia.trim() && !contactoEmergenciaValido) {
      nuevosErrores.contactoEmergencia = 'El contacto de emergencia debe tener al menos 3 caracteres.';
    }
    if (formulario.telefonoEmergencia && !telefonoEmergenciaValido) {
      nuevosErrores.telefonoEmergencia = 'El teléfono de emergencia debe contener exactamente 8 dígitos numéricos.';
    }
    return nuevosErrores;
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
    const nuevosErrores = validarFormulario();
    setErroresCampos(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      setError('Revise los campos marcados antes de continuar.');
      return;
    }
    setGuardando(true);
    try {
      await guardarDatosPersonales(id, formulario);
      navegar(`/aspirante/solicitudes/${id}/academicos`);
    } catch (err) {
      setError(err.mensaje || 'No fue posible guardar los datos personales.');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <div>
      <PasosSolicitud pasoActual="personal" estadoSolicitud={estadoSolicitud} />
      <Tarjeta>
        <h1 className="text-headline-sm font-semibold text-primary">Información personal</h1>
        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={manejarEnvio}>
          {error && <div className="sm:col-span-2"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}
          <CampoTexto etiqueta="Identificación" value={formulario.identificacion} required inputMode="numeric" maxLength={9}
            error={erroresCampos.identificacion}
            success={identificacionValida}
            onChange={(e) => actualizarCampo('identificacion', e.target.value)} />
          <CampoTexto etiqueta="Fecha de nacimiento" type="date" value={formulario.fechaNacimiento} required
            error={erroresCampos.fechaNacimiento}
            success={fechaNacimientoValida}
            onChange={(e) => actualizarCampo('fechaNacimiento', e.target.value)} />
          <CampoTexto etiqueta="Teléfono" value={formulario.telefono} required inputMode="numeric" maxLength={8}
            error={erroresCampos.telefono}
            success={telefonoValido}
            onChange={(e) => actualizarCampo('telefono', e.target.value)} />
          <CampoTexto etiqueta="Dirección" value={formulario.direccion} required
            error={erroresCampos.direccion}
            onChange={(e) => actualizarCampo('direccion', e.target.value)} />
          <CampoTexto etiqueta="Contacto de emergencia" value={formulario.contactoEmergencia}
            error={erroresCampos.contactoEmergencia}
            success={contactoEmergenciaValido && Boolean(formulario.contactoEmergencia.trim())}
            onChange={(e) => actualizarCampo('contactoEmergencia', e.target.value)} />
          <CampoTexto etiqueta="Teléfono de emergencia" value={formulario.telefonoEmergencia} inputMode="numeric" maxLength={8}
            error={erroresCampos.telefonoEmergencia}
            success={telefonoEmergenciaValido}
            onChange={(e) => actualizarCampo('telefonoEmergencia', e.target.value)} />
          <div className="sm:col-span-2">
            <Boton type="submit" cargando={guardando}>Guardar y continuar</Boton>
          </div>
        </form>
      </Tarjeta>
    </div>
  );
}
