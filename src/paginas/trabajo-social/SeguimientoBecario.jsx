import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { listarAlertas, listarSeguimientos, registrarRendimiento } from '../../servicios/servicioSegmentoDos.js';

export default function SeguimientoBecario() {
  const { id } = useParams();
  const [seguimientos, setSeguimientos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [formulario, setFormulario] = useState({ periodo: '', promedio: '', creditosMatriculados: '', creditosAprobados: '', cursosPerdidos: '', observaciones: '' });
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    try {
      const [s, a] = await Promise.all([listarSeguimientos(id), listarAlertas(id)]);
      setSeguimientos(s.datos);
      setAlertas(a.datos);
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
          { clave: 'Estado', etiqueta: 'Estado' }
        ]} />
      </div>
    </div>
  );
}

