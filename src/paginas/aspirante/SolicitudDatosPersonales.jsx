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

export default function SolicitudDatosPersonales() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerSolicitud(id).then((respuesta) => {
      const datos = respuesta.datos.datosPersonales;
      if (datos) {
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
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
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
      <PasosSolicitud pasoActual="personal" />
      <Tarjeta>
        <h1 className="text-headline-sm font-semibold text-primary">Información personal</h1>
        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={manejarEnvio}>
          {error && <div className="sm:col-span-2"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}
          <CampoTexto etiqueta="Identificación" value={formulario.identificacion} required
            onChange={(e) => actualizarCampo('identificacion', e.target.value)} />
          <CampoTexto etiqueta="Fecha de nacimiento" type="date" value={formulario.fechaNacimiento} required
            onChange={(e) => actualizarCampo('fechaNacimiento', e.target.value)} />
          <CampoTexto etiqueta="Teléfono" value={formulario.telefono} required
            onChange={(e) => actualizarCampo('telefono', e.target.value)} />
          <CampoTexto etiqueta="Dirección" value={formulario.direccion} required
            onChange={(e) => actualizarCampo('direccion', e.target.value)} />
          <CampoTexto etiqueta="Contacto de emergencia" value={formulario.contactoEmergencia}
            onChange={(e) => actualizarCampo('contactoEmergencia', e.target.value)} />
          <CampoTexto etiqueta="Teléfono de emergencia" value={formulario.telefonoEmergencia}
            onChange={(e) => actualizarCampo('telefonoEmergencia', e.target.value)} />
          <div className="sm:col-span-2">
            <Boton type="submit" cargando={guardando}>Guardar y continuar</Boton>
          </div>
        </form>
      </Tarjeta>
    </div>
  );
}
