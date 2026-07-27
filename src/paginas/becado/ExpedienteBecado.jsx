import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import { actualizarExpedienteBecado, listarHistorialExpediente, obtenerExpedienteBecado } from '../../servicios/servicioSegmentoDos.js';

const CAMPOS = ['Telefono', 'Direccion', 'ContactoEmergencia', 'TelefonoEmergencia', 'SituacionLaboral', 'Observaciones'];
const nombreEntrada = (campo) => campo.charAt(0).toLowerCase() + campo.slice(1);

export default function ExpedienteBecado() {
  const [expediente, setExpediente] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [formulario, setFormulario] = useState({});
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    try {
      const [respuesta, respuestaHistorial] = await Promise.all([obtenerExpedienteBecado(), listarHistorialExpediente()]);
      setExpediente(respuesta.datos);
      setHistorial(respuestaHistorial.datos);
      setFormulario(Object.fromEntries(CAMPOS.map((campo) => [nombreEntrada(campo), respuesta.datos[campo] || ''])));
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, []);

  async function guardar(evento) {
    evento.preventDefault();
    setProcesando(true);
    try {
      await actualizarExpedienteBecado(formulario);
      setMensaje({ tipo: 'exito', texto: 'Los datos fueron actualizados. Los cambios sensibles quedaron pendientes de revisión.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setProcesando(false); }
  }

  if (cargando) return <EstadoCarga />;
  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Expediente del estudiante becado" descripcion="Sus datos consolidados y el historial de cambios del beneficio." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      {expediente && (
        <>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
            <Tarjeta>
              <h2 className="font-semibold text-primary">Datos consolidados</h2>
              <dl className="mt-4 space-y-3 text-body-sm">
                <div><dt className="text-on-surface-variant">Nombre</dt><dd className="font-semibold">{expediente.Nombre} {expediente.PrimerApellido} {expediente.SegundoApellido}</dd></div>
                <div><dt className="text-on-surface-variant">Identificación</dt><dd className="font-semibold">{expediente.Identificacion}</dd></div>
                <div><dt className="text-on-surface-variant">Carné</dt><dd className="font-semibold">{expediente.NumeroEstudiante}</dd></div>
                <div><dt className="text-on-surface-variant">Carrera</dt><dd className="font-semibold">{expediente.Carrera}</dd></div>
                <div><dt className="text-on-surface-variant">Beneficio</dt><dd className="font-semibold">{expediente.Porcentaje}% · {expediente.Estado}</dd></div>
              </dl>
            </Tarjeta>
            <Tarjeta>
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={guardar}>
                <CampoTexto etiqueta="Teléfono" value={formulario.telefono || ''} onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })} />
                <CampoTexto etiqueta="Dirección (sensible)" value={formulario.direccion || ''} onChange={(e) => setFormulario({ ...formulario, direccion: e.target.value })} />
                <CampoTexto etiqueta="Contacto de emergencia" value={formulario.contactoEmergencia || ''} onChange={(e) => setFormulario({ ...formulario, contactoEmergencia: e.target.value })} />
                <CampoTexto etiqueta="Teléfono de emergencia" value={formulario.telefonoEmergencia || ''} onChange={(e) => setFormulario({ ...formulario, telefonoEmergencia: e.target.value })} />
                <CampoTexto etiqueta="Situación laboral (sensible)" value={formulario.situacionLaboral || ''} onChange={(e) => setFormulario({ ...formulario, situacionLaboral: e.target.value })} />
                <CampoAreaTexto etiqueta="Observaciones" value={formulario.observaciones || ''} onChange={(e) => setFormulario({ ...formulario, observaciones: e.target.value })} />
                <Boton type="submit" cargando={procesando}>Guardar cambios</Boton>
              </form>
            </Tarjeta>
          </div>
          <section>
            <h2 className="mb-3 text-headline-sm font-semibold text-primary">Historial de actualizaciones</h2>
            <TablaDatos
              filas={historial}
              clave="IdActualizacion"
              columnas={[
                { clave: 'Campo', etiqueta: 'Campo' },
                { clave: 'ValorAnterior', etiqueta: 'Valor anterior' },
                { clave: 'ValorNuevo', etiqueta: 'Valor nuevo' },
                { clave: 'RequiereRevision', etiqueta: 'Revisión', render: (fila) => fila.RequiereRevision ? 'Pendiente' : 'No requerida' },
                { clave: 'Fecha', etiqueta: 'Fecha', render: (fila) => new Date(fila.Fecha).toLocaleString('es-CR') }
              ]}
            />
          </section>
        </>
      )}
    </div>
  );
}

