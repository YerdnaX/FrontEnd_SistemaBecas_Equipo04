import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { obtenerBeneficio, validarAcademicamente } from '../../servicios/servicioSegmentoDos.js';

export default function ValidacionAcademica() {
  const { id } = useParams();
  const [beneficio, setBeneficio] = useState(null);
  const [formulario, setFormulario] = useState({ periodo: '', estado: 'VALIDADO', detalle: '' });
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    try {
      const respuesta = await obtenerBeneficio(id);
      setBeneficio(respuesta.datos);
      setFormulario((actual) => ({ ...actual, periodo: respuesta.datos.Periodo, detalle: respuesta.datos.DetalleAcademico || '' }));
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, [id]);

  async function guardar(evento) {
    evento.preventDefault();
    setProcesando(true);
    try {
      await validarAcademicamente(id, formulario);
      setMensaje({ tipo: 'exito', texto: 'La validación académica fue registrada.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setProcesando(false); }
  }

  if (cargando) return <EstadoCarga />;
  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Validación académica" descripcion="Confirme que la información académica cumple los requisitos previos a la activación." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta>
          <h2 className="font-semibold text-primary">Expediente {beneficio?.CodigoExpediente}</h2>
          <p className="mt-4 text-body-sm">Tipo de beca: <strong>{beneficio?.TipoBeca}</strong></p>
          <p className="mt-2 text-body-sm">Cobertura: <strong>{beneficio?.Porcentaje}%</strong></p>
          <p className="mt-2 text-body-sm">Estado actual: <strong>{beneficio?.EstadoAcademico || 'PENDIENTE'}</strong></p>
        </Tarjeta>
        <Tarjeta>
          <form className="space-y-4" onSubmit={guardar}>
            <CampoTexto etiqueta="Periodo académico" value={formulario.periodo} onChange={(e) => setFormulario({ ...formulario, periodo: e.target.value })} required />
            <CampoSelect etiqueta="Resultado" value={formulario.estado} onChange={(e) => setFormulario({ ...formulario, estado: e.target.value })} opciones={[{ valor: 'VALIDADO', etiqueta: 'Validado' }, { valor: 'FALLIDO', etiqueta: 'Fallido' }]} />
            <CampoAreaTexto etiqueta="Detalle de validación" value={formulario.detalle} onChange={(e) => setFormulario({ ...formulario, detalle: e.target.value })} />
            <Boton type="submit" cargando={procesando}>Guardar validación</Boton>
          </form>
        </Tarjeta>
      </div>
    </div>
  );
}

