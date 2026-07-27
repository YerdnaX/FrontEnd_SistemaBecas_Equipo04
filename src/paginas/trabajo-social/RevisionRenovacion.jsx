import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { evaluarRenovacion, obtenerRenovacion, resolverRenovacion } from '../../servicios/servicioSegmentoDos.js';

export default function RevisionRenovacion() {
  const { id } = useParams();
  const [renovacion, setRenovacion] = useState(null);
  const [evaluacion, setEvaluacion] = useState({ cumpleAcademico: true, cumpleSocioeconomico: true, observaciones: '' });
  const [resolucion, setResolucion] = useState({ resultado: 'RENOVADA', porcentajeNuevo: '', motivo: '' });
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    try {
      const respuesta = await obtenerRenovacion(id);
      setRenovacion(respuesta.datos);
      setResolucion((actual) => ({ ...actual, porcentajeNuevo: respuesta.datos.Porcentaje }));
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, [id]);

  async function evaluar(evento) {
    evento.preventDefault();
    try {
      setRenovacion((await evaluarRenovacion(id, evaluacion)).datos);
      setMensaje({ tipo: 'exito', texto: 'Evaluación registrada.' });
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  async function resolver(evento) {
    evento.preventDefault();
    try {
      setRenovacion((await resolverRenovacion(id, resolucion)).datos);
      setMensaje({ tipo: 'exito', texto: 'Renovación resuelta y estudiante notificado.' });
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  if (cargando) return <EstadoCarga />;
  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Revisión de renovación" descripcion="Reevaluación académica y socioeconómica con resolución idempotente." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <Tarjeta>
        <div className="grid gap-3 sm:grid-cols-4">
          <p>Carné<br /><strong>{renovacion?.NumeroEstudiante}</strong></p>
          <p>Carrera<br /><strong>{renovacion?.Carrera}</strong></p>
          <p>Promedio<br /><strong>{renovacion?.Promedio}</strong></p>
          <p>Estado<br /><strong>{renovacion?.Estado}</strong></p>
        </div>
      </Tarjeta>
      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta>
          <form className="space-y-4" onSubmit={evaluar}>
            <h2 className="font-semibold text-primary">Evaluación</h2>
            <label className="flex gap-2"><input type="checkbox" checked={evaluacion.cumpleAcademico} onChange={(e) => setEvaluacion({ ...evaluacion, cumpleAcademico: e.target.checked })} /> Cumple requisitos académicos</label>
            <label className="flex gap-2"><input type="checkbox" checked={evaluacion.cumpleSocioeconomico} onChange={(e) => setEvaluacion({ ...evaluacion, cumpleSocioeconomico: e.target.checked })} /> Cumple condición socioeconómica</label>
            <CampoAreaTexto etiqueta="Observaciones" value={evaluacion.observaciones} onChange={(e) => setEvaluacion({ ...evaluacion, observaciones: e.target.value })} />
            <Boton type="submit" deshabilitado={renovacion?.Estado !== 'EN_REEVALUACION'}>Guardar evaluación</Boton>
          </form>
        </Tarjeta>
        <Tarjeta>
          <form className="space-y-4" onSubmit={resolver}>
            <h2 className="font-semibold text-primary">Resolución</h2>
            <CampoSelect etiqueta="Resultado" value={resolucion.resultado} onChange={(e) => setResolucion({ ...resolucion, resultado: e.target.value })} opciones={['RENOVADA', 'REDUCIDA', 'SUSPENDIDA', 'DENEGADA'].map((valor) => ({ valor, etiqueta: valor }))} />
            <CampoTexto etiqueta="Nuevo porcentaje" type="number" min="1" max="100" value={resolucion.porcentajeNuevo} onChange={(e) => setResolucion({ ...resolucion, porcentajeNuevo: e.target.value })} />
            <CampoAreaTexto etiqueta="Motivo" value={resolucion.motivo} onChange={(e) => setResolucion({ ...resolucion, motivo: e.target.value })} />
            <Boton type="submit" deshabilitado={!renovacion?.CumpleAcademico && renovacion?.CumpleAcademico !== false}>Resolver renovación</Boton>
          </form>
        </Tarjeta>
      </div>
    </div>
  );
}

