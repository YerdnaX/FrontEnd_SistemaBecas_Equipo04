import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import {
  cerrarAlerta,
  crearAlerta,
  crearSeguimiento,
  listarAlertas,
  listarSeguimientos,
  obtenerBeneficio,
  registrarRendimiento
} from '../../servicios/servicioSegmentoDos.js';

export default function SeguimientoBecario() {
  const { id } = useParams();
  const [seguimientos, setSeguimientos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [formulario, setFormulario] = useState({ periodo: '', promedio: '', creditosMatriculados: '', creditosAprobados: '', cursosPerdidos: '', observaciones: '' });
  const [seguimiento, setSeguimiento] = useState({ periodo: '', estado: 'PENDIENTE', observaciones: '' });
  const [alerta, setAlerta] = useState({ tipo: '', nivel: 'ADVERTENCIA', descripcion: '' });
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    try {
      const [s, a, b] = await Promise.all([listarSeguimientos(id), listarAlertas(id), obtenerBeneficio(id)]);
      setSeguimientos(s.datos);
      setAlertas(a.datos);
      setFormulario((actual) => ({ ...actual, periodo: actual.periodo || b.datos.Periodo || '' }));
      setSeguimiento((actual) => ({ ...actual, periodo: actual.periodo || b.datos.Periodo || '' }));
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }
  useEffect(() => { cargar(); }, [id]);

  async function guardar(evento) {
    evento.preventDefault();
    try {
      const resultado = await registrarRendimiento(id, formulario);
      setMensaje({ tipo: resultado.datos.evaluacion.cumple ? 'exito' : 'advertencia', texto: resultado.datos.evaluacion.cumple ? 'Rendimiento registrado; cumple las reglas.' : 'Rendimiento registrado y alertas generadas para revisión.' });
      setFormulario({ periodo: '', promedio: '', creditosMatriculados: '', creditosAprobados: '', cursosPerdidos: '', observaciones: '' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  async function guardarSeguimiento(evento) {
    evento.preventDefault();
    try {
      await crearSeguimiento(id, seguimiento);
      setSeguimiento({ periodo: '', estado: 'PENDIENTE', observaciones: '' });
      setMensaje({ tipo: 'exito', texto: 'Seguimiento manual registrado.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  async function guardarAlerta(evento) {
    evento.preventDefault();
    try {
      await crearAlerta(id, alerta);
      setAlerta({ tipo: '', nivel: 'ADVERTENCIA', descripcion: '' });
      setMensaje({ tipo: 'exito', texto: 'Alerta registrada y estudiante notificado.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  async function atenderAlerta(idAlerta) {
    const observacion = window.prompt('Observación de cierre de la alerta:');
    if (observacion === null) return;
    try {
      await cerrarAlerta(idAlerta, observacion);
      setMensaje({ tipo: 'exito', texto: 'Alerta atendida.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Seguimiento del becado" descripcion="Historial cronológico, rendimiento y alertas sin suspensión automática." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <Tarjeta>
        <form className="grid gap-4 md:grid-cols-3" onSubmit={guardar}>
          <CampoTexto etiqueta="Periodo" value={formulario.periodo} onChange={(e) => setFormulario({ ...formulario, periodo: e.target.value })} required />
          <CampoTexto etiqueta="Promedio" type="number" min="0" max="100" value={formulario.promedio} onChange={(e) => setFormulario({ ...formulario, promedio: e.target.value })} required />
          <CampoTexto etiqueta="Créditos matriculados" type="number" min="0" value={formulario.creditosMatriculados} onChange={(e) => setFormulario({ ...formulario, creditosMatriculados: e.target.value })} />
          <CampoTexto etiqueta="Créditos aprobados" type="number" min="0" value={formulario.creditosAprobados} onChange={(e) => setFormulario({ ...formulario, creditosAprobados: e.target.value })} />
          <CampoTexto etiqueta="Cursos perdidos" type="number" min="0" value={formulario.cursosPerdidos} onChange={(e) => setFormulario({ ...formulario, cursosPerdidos: e.target.value })} />
          <CampoAreaTexto etiqueta="Observaciones" value={formulario.observaciones} onChange={(e) => setFormulario({ ...formulario, observaciones: e.target.value })} />
          <Boton type="submit">Registrar rendimiento</Boton>
        </form>
      </Tarjeta>
      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta>
          <form className="space-y-4" onSubmit={guardarSeguimiento}>
            <h2 className="font-semibold text-primary">Seguimiento manual</h2>
            <CampoTexto etiqueta="Periodo" value={seguimiento.periodo} onChange={(e) => setSeguimiento({ ...seguimiento, periodo: e.target.value })} required />
            <CampoTexto etiqueta="Estado" value={seguimiento.estado} onChange={(e) => setSeguimiento({ ...seguimiento, estado: e.target.value })} required />
            <CampoAreaTexto etiqueta="Observaciones" value={seguimiento.observaciones} onChange={(e) => setSeguimiento({ ...seguimiento, observaciones: e.target.value })} />
            <Boton type="submit">Registrar seguimiento</Boton>
          </form>
        </Tarjeta>
        <Tarjeta>
          <form className="space-y-4" onSubmit={guardarAlerta}>
            <h2 className="font-semibold text-primary">Crear alerta manual</h2>
            <CampoTexto etiqueta="Tipo" value={alerta.tipo} onChange={(e) => setAlerta({ ...alerta, tipo: e.target.value })} required />
            <CampoTexto etiqueta="Nivel" value={alerta.nivel} onChange={(e) => setAlerta({ ...alerta, nivel: e.target.value })} required />
            <CampoAreaTexto etiqueta="Descripción" value={alerta.descripcion} onChange={(e) => setAlerta({ ...alerta, descripcion: e.target.value })} required />
            <Boton type="submit">Crear alerta</Boton>
          </form>
        </Tarjeta>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <TablaDatos filas={seguimientos} clave="IdSeguimiento" columnas={[
          { clave: 'Periodo', etiqueta: 'Periodo' },
          { clave: 'Promedio', etiqueta: 'Promedio' },
          { clave: 'CreditosAprobados', etiqueta: 'Créditos aprobados' },
          { clave: 'Estado', etiqueta: 'Estado' },
          { clave: 'FechaRevision', etiqueta: 'Fecha', render: (fila) => fila.FechaRevision ? new Date(fila.FechaRevision).toLocaleDateString('es-CR') : '—' }
        ]} />
        <TablaDatos filas={alertas} clave="IdAlerta" columnas={[
          { clave: 'Tipo', etiqueta: 'Alerta' },
          { clave: 'Nivel', etiqueta: 'Nivel' },
          { clave: 'Estado', etiqueta: 'Estado' },
          { clave: 'acciones', etiqueta: 'Acciones', render: (fila) => fila.Estado === 'ABIERTA' ? <Boton variante="texto" onClick={() => atenderAlerta(fila.IdAlerta)}>Marcar atendida</Boton> : '—' }
        ]} />
      </div>
    </div>
  );
}
