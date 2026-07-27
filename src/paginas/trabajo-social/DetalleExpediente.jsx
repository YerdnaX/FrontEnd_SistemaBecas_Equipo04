import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { obtenerExpediente, asignarExpediente, enviarComite } from '../../servicios/servicioExpedientes.js';
import { obtenerSolicitud } from '../../servicios/servicioSolicitudes.js';
import { formatearFecha } from '../../utilidades/formato.js';
import { useSesion } from '../../hooks/useSesion.js';

export default function DetalleExpediente() {
  const { id } = useParams();
  const { tienePermiso } = useSesion();
  const [expediente, setExpediente] = useState(null);
  const [solicitud, setSolicitud] = useState(null);
  const [idEmpleado, setIdEmpleado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await obtenerExpediente(id);
      setExpediente(respuesta.datos);
      const respuestaSolicitud = await obtenerSolicitud(respuesta.datos.IdSolicitud);
      setSolicitud(respuestaSolicitud.datos);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  async function manejarAsignar(evento) {
    evento.preventDefault();
    setProcesando(true);
    setError(null);
    try {
      await asignarExpediente(id, Number(idEmpleado));
      await cargar();
    } catch (err) {
      setError(err.mensaje || 'No fue posible asignar el expediente.');
    } finally {
      setProcesando(false);
    }
  }

  async function manejarEnviarComite() {
    setProcesando(true);
    setError(null);
    try {
      await enviarComite(id);
      await cargar();
    } catch (err) {
      setError(err.mensaje || 'No fue posible enviar el expediente al comité.');
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg font-semibold text-primary">Expediente {expediente.CodigoExpediente}</h1>
          <p className="text-body-sm text-on-surface-variant">{expediente.NombreAspirante} {expediente.ApellidoAspirante} — {expediente.NombreConvocatoria}</p>
        </div>
        <EtiquetaEstado estado={expediente.Estado} />
      </div>

      {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}

      <div className="grid gap-4 md:grid-cols-2">
        <Tarjeta>
          <h2 className="text-headline-sm font-semibold text-on-surface">Datos personales</h2>
          {solicitud?.datosPersonales ? (
            <ul className="mt-2 text-body-sm text-on-surface-variant">
              <li>Identificación: {solicitud.datosPersonales.Identificacion}</li>
              <li>Teléfono: {solicitud.datosPersonales.Telefono}</li>
              <li>Dirección: {solicitud.datosPersonales.Direccion}</li>
            </ul>
          ) : <p className="mt-2 text-body-sm text-on-surface-variant">Sin datos.</p>}
        </Tarjeta>
        <Tarjeta>
          <h2 className="text-headline-sm font-semibold text-on-surface">Datos académicos</h2>
          {solicitud?.datosAcademicos ? (
            <ul className="mt-2 text-body-sm text-on-surface-variant">
              <li>Carrera: {solicitud.datosAcademicos.Carrera}</li>
              <li>Promedio: {solicitud.datosAcademicos.Promedio}</li>
              <li>Nivel: {solicitud.datosAcademicos.NivelAcademico}</li>
            </ul>
          ) : <p className="mt-2 text-body-sm text-on-surface-variant">Sin datos.</p>}
        </Tarjeta>
        <Tarjeta>
          <h2 className="text-headline-sm font-semibold text-on-surface">Datos socioeconómicos</h2>
          {solicitud?.datosSocioeconomicos ? (
            <ul className="mt-2 text-body-sm text-on-surface-variant">
              <li>Ingreso mensual: ₡{solicitud.datosSocioeconomicos.IngresoMensual}</li>
              <li>Integrantes: {solicitud.datosSocioeconomicos.CantidadIntegrantes}</li>
              <li>Situación laboral: {solicitud.datosSocioeconomicos.SituacionLaboral}</li>
            </ul>
          ) : <p className="mt-2 text-body-sm text-on-surface-variant">Sin datos.</p>}
        </Tarjeta>

        <Tarjeta>
          <h2 className="text-headline-sm font-semibold text-on-surface">Asignación</h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">Responsable actual: {expediente.ResponsableAsignado || 'Sin asignar'}</p>
          {tienePermiso('EXPEDIENTE_ASIGNAR') && (
            <form className="mt-3 flex items-end gap-2" onSubmit={manejarAsignar}>
              <CampoTexto etiqueta="ID de empleado responsable" type="number" value={idEmpleado} required
                onChange={(e) => setIdEmpleado(e.target.value)} />
              <Boton type="submit" cargando={procesando}>Asignar</Boton>
            </form>
          )}
        </Tarjeta>
      </div>

      <div className="flex gap-4">
        <Link to={`/trabajo-social/expedientes/${id}/documentos`} className="text-body-md font-semibold text-primary-container hover:underline">
          Verificación documental →
        </Link>
        <Link to={`/trabajo-social/expedientes/${id}/evaluacion`} className="text-body-md font-semibold text-primary-container hover:underline">
          Evaluación integral →
        </Link>
        {tienePermiso('VISITA_GESTIONAR') && (
          <Link to={`/trabajo-social/expedientes/${id}/visita`} className="text-body-md font-semibold text-primary-container hover:underline">
            Visita domiciliaria →
          </Link>
        )}
        {expediente.Estado === 'EVALUADA' && (
          <Boton onClick={manejarEnviarComite} cargando={procesando}>Enviar al comité</Boton>
        )}
      </div>

      <Tarjeta>
        <h2 className="text-headline-sm font-semibold text-on-surface">Historial</h2>
        <ul className="mt-3 flex flex-col gap-2 text-body-sm">
          {expediente.historial.map((item) => (
            <li key={item.IdHistorialEstado} className="border-b border-outline-variant pb-2">
              <span className="font-semibold">{item.EstadoNuevo}</span> — {formatearFecha(item.Fecha)}
              {item.Observacion && <p className="text-on-surface-variant">{item.Observacion}</p>}
            </li>
          ))}
        </ul>
      </Tarjeta>
    </div>
  );
}
