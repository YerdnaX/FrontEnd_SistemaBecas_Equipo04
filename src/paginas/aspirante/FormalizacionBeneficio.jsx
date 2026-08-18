import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import DialogoConfirmacion from '../../componentes/comunes/DialogoConfirmacion.jsx';
import { aceptarFormalizacion, obtenerArchivoConvenio, obtenerFormalizacion } from '../../servicios/servicioSegmentoDos.js';
import { descargarArchivo } from '../../utilidades/archivos.js';

export default function FormalizacionBeneficio() {
  const { id } = useParams();
  const [formalizacion, setFormalizacion] = useState(null);
  const [acepta, setAcepta] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await obtenerFormalizacion(id);
      setFormalizacion(respuesta.datos);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  async function aceptar() {
    setProcesando(true);
    try {
      await aceptarFormalizacion(id, { acepta });
      setMensaje({ tipo: 'exito', texto: 'Las condiciones y el convenio fueron aceptados correctamente.' });
      setConfirmar(false);
      cargar();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setProcesando(false);
    }
  }

  async function descargarConvenio() {
    try {
      const respuesta = await obtenerArchivoConvenio(id);
      descargarArchivo(respuesta.datos);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    }
  }

  if (cargando) return <EstadoCarga mensaje="Preparando condiciones de la beca..." />;
  return (
    <div className="space-y-6">
      <EncabezadoPagina
        titulo="Formalización del beneficio"
        descripcion="Revise las condiciones de su beca y registre una aceptación electrónica simple."
      />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      {formalizacion && (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Tarjeta>
            <p className="text-label-md uppercase tracking-wide text-on-surface-variant">Resolución</p>
            <h2 className="mt-1 text-headline-sm font-semibold">{formalizacion.NumeroResolucion}</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-body-sm text-on-surface-variant">Resultado</dt><dd className="font-semibold">{formalizacion.TipoResultado}</dd></div>
              <div><dt className="text-body-sm text-on-surface-variant">Cobertura</dt><dd className="font-semibold">{formalizacion.PorcentajeBeca}%</dd></div>
              <div><dt className="text-body-sm text-on-surface-variant">Convenio</dt><dd className="font-semibold">{formalizacion.NumeroConvenio}</dd></div>
              <div><dt className="text-body-sm text-on-surface-variant">Estado</dt><dd className="font-semibold">{formalizacion.Estado}</dd></div>
            </dl>
            <Boton variante="secundario" className="mt-5" onClick={descargarConvenio}>
              Descargar convenio PDF
            </Boton>
            <h3 className="mt-7 font-semibold text-on-surface">Condiciones versión {formalizacion.VersionCondiciones}</h3>
            <div className="mt-3 whitespace-pre-line rounded-lg bg-surface-container-low p-4 text-body-md">
              {formalizacion.Condiciones}
            </div>
          </Tarjeta>
          <Tarjeta className="h-fit">
            <h2 className="text-headline-sm font-semibold text-on-surface">Aceptación</h2>
            <p className="mt-3 text-body-sm text-on-surface-variant">
              Esta aceptación registra fecha, usuario, versión e IP. No sustituye una firma digital certificada.
            </p>
            <label className="mt-5 flex gap-3 text-body-sm">
              <input type="checkbox" checked={acepta} onChange={(evento) => setAcepta(evento.target.checked)} disabled={formalizacion.Estado === 'ACEPTADA'} />
              <span>He leído y acepto expresamente las condiciones y el convenio.</span>
            </label>
            <Boton className="mt-5 w-full" deshabilitado={!acepta || formalizacion.Estado === 'ACEPTADA'} onClick={() => setConfirmar(true)}>
              {formalizacion.Estado === 'ACEPTADA' ? 'Condiciones aceptadas' : 'Aceptar y formalizar'}
            </Boton>
          </Tarjeta>
        </div>
      )}
      <DialogoConfirmacion
        abierto={confirmar}
        titulo="Confirmar formalización"
        mensaje="La aceptación quedará registrada y no se duplicará si repite la operación."
        confirmar={aceptar}
        cancelar={() => setConfirmar(false)}
        cargando={procesando}
      />
    </div>
  );
}
