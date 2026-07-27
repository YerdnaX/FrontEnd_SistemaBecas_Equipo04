import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { activarFinancieramente, obtenerBeneficio, verificarAplicacion } from '../../servicios/servicioSegmentoDos.js';

export default function ActivacionFinanciera() {
  const { id } = useParams();
  const [beneficio, setBeneficio] = useState(null);
  const [formulario, setFormulario] = useState({ periodo: '', porcentaje: '', monto: '', referencia: '', resultado: 'APLICADO' });
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await obtenerBeneficio(id);
      setBeneficio(respuesta.datos);
      setFormulario((actual) => ({ ...actual, periodo: respuesta.datos.Periodo, porcentaje: respuesta.datos.Porcentaje }));
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    } finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, [id]);

  async function aplicar(evento) {
    evento.preventDefault();
    setProcesando(true);
    try {
      await activarFinancieramente(id, formulario);
      setMensaje({ tipo: 'exito', texto: 'La aplicación financiera quedó registrada de forma idempotente.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setProcesando(false); }
  }

  async function verificar() {
    setProcesando(true);
    try {
      await verificarAplicacion(id);
      setMensaje({ tipo: 'exito', texto: 'Aplicación verificada. El beneficio está activo.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setProcesando(false); }
  }

  if (cargando) return <EstadoCarga />;
  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Activación financiera" descripcion="Aplicación manual sustituible por una integración institucional futura." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      {beneficio && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Tarjeta>
            <h2 className="font-semibold text-primary">Beneficio #{beneficio.IdBecaActiva}</h2>
            <dl className="mt-4 space-y-3 text-body-sm">
              <div><dt className="text-on-surface-variant">Tipo</dt><dd className="font-semibold">{beneficio.TipoBeca}</dd></div>
              <div><dt className="text-on-surface-variant">Expediente</dt><dd className="font-semibold">{beneficio.CodigoExpediente}</dd></div>
              <div><dt className="text-on-surface-variant">Validación académica</dt><dd className="font-semibold">{beneficio.EstadoAcademico || 'PENDIENTE'}</dd></div>
              <div><dt className="text-on-surface-variant">Estado financiero</dt><dd className="font-semibold">{beneficio.EstadoFinanciero || 'PENDIENTE'}</dd></div>
              <div><dt className="text-on-surface-variant">Beneficio</dt><dd className="font-semibold">{beneficio.Estado}</dd></div>
            </dl>
          </Tarjeta>
          <Tarjeta>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={aplicar}>
              <CampoTexto etiqueta="Periodo" value={formulario.periodo} onChange={(e) => setFormulario({ ...formulario, periodo: e.target.value })} required />
              <CampoTexto etiqueta="Porcentaje" type="number" min="1" max="100" value={formulario.porcentaje} onChange={(e) => setFormulario({ ...formulario, porcentaje: e.target.value })} required />
              <CampoTexto etiqueta="Monto aplicado" type="number" min="0" value={formulario.monto} onChange={(e) => setFormulario({ ...formulario, monto: e.target.value })} />
              <CampoTexto etiqueta="Referencia institucional" value={formulario.referencia} onChange={(e) => setFormulario({ ...formulario, referencia: e.target.value })} required />
              <CampoSelect etiqueta="Resultado" value={formulario.resultado} onChange={(e) => setFormulario({ ...formulario, resultado: e.target.value })} opciones={[{ valor: 'APLICADO', etiqueta: 'Aplicado' }, { valor: 'FALLIDO', etiqueta: 'Fallido' }]} />
              <div className="flex items-end gap-2">
                <Boton type="submit" cargando={procesando}>Registrar aplicación</Boton>
                <Boton type="button" variante="secundario" deshabilitado={beneficio.EstadoFinanciero !== 'PENDIENTE'} onClick={verificar}>Verificar</Boton>
              </div>
            </form>
          </Tarjeta>
        </div>
      )}
    </div>
  );
}
