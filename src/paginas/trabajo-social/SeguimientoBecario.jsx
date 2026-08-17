import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import DialogoConfirmacion from '../../componentes/comunes/DialogoConfirmacion.jsx';
import {
  cerrarAlerta,
  crearAlerta,
  crearSeguimiento,
  listarAlertas,
  listarSeguimientos,
  obtenerBeneficio,
  registrarRendimiento
} from '../../servicios/servicioSegmentoDos.js';
import { abrirInvestigacion, listarInvestigaciones } from '../../servicios/servicioDisciplinario.js';

export default function SeguimientoBecario() {
  const { id } = useParams();
  const [seguimientos, setSeguimientos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [formulario, setFormulario] = useState({ periodo: '', promedio: '', creditosMatriculados: '', creditosAprobados: '', cursosPerdidos: '', observaciones: '' });
  const [seguimiento, setSeguimiento] = useState({ periodo: '', estado: 'PENDIENTE', observaciones: '' });
  const [alerta, setAlerta] = useState({ tipo: '', nivel: 'ADVERTENCIA', descripcion: '' });
  const [investigacionActiva, setInvestigacionActiva] = useState(null);
  const [disciplinario, setDisciplinario] = useState({ causal: '', descripcion: '' });
  const [abriendoDisciplinario, setAbriendoDisciplinario] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [idAlertaCerrar, setIdAlertaCerrar] = useState(null);
  const [observacionCierre, setObservacionCierre] = useState('');
  const [cerrandoAlerta, setCerrandoAlerta] = useState(false);

  async function cargar() {
    try {
      const [s, a, b, inv] = await Promise.all([
        listarSeguimientos(id),
        listarAlertas(id),
        obtenerBeneficio(id),
        listarInvestigaciones({ estado: 'EN_REVISION' })
      ]);
      setSeguimientos(s.datos);
      setAlertas(a.datos);
      setFormulario((actual) => ({ ...actual, periodo: actual.periodo || b.datos.Periodo || '' }));
      setSeguimiento((actual) => ({ ...actual, periodo: actual.periodo || b.datos.Periodo || '' }));
      setInvestigacionActiva(inv.datos.find((i) => String(i.IdBecaActiva) === String(id)) || null);
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }
  useEffect(() => { cargar(); }, [id]);

  async function abrirProcesoDisciplinario(evento) {
    evento.preventDefault();
    setAbriendoDisciplinario(true);
    try {
      await abrirInvestigacion(id, disciplinario);
      setDisciplinario({ causal: '', descripcion: '' });
      setMensaje({ tipo: 'exito', texto: 'Proceso disciplinario abierto y becado notificado.' });
      cargar();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.mensaje || error.message });
    } finally {
      setAbriendoDisciplinario(false);
    }
  }

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

  function solicitarCierreAlerta(idAlerta) {
    setIdAlertaCerrar(idAlerta);
    setObservacionCierre('');
  }

  async function confirmarCierreAlerta() {
    setCerrandoAlerta(true);
    try {
      await cerrarAlerta(idAlertaCerrar, observacionCierre);
      setMensaje({ tipo: 'exito', texto: 'Alerta atendida.' });
      setIdAlertaCerrar(null);
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setCerrandoAlerta(false); }
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Seguimiento del becado" descripcion="Historial cronológico, rendimiento y alertas sin suspensión automática." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}

      <Tarjeta className={investigacionActiva ? 'border-l-4 border-advertencia' : ''}>
        <h2 className="font-semibold text-on-surface">Proceso disciplinario</h2>
        {investigacionActiva ? (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-body-sm text-on-surface-variant">
              Ya existe un proceso en trámite por: <strong>{investigacionActiva.Causal}</strong>
            </p>
            <Link
              to={`/trabajo-social/disciplinario/${investigacionActiva.IdInvestigacion}`}
              className="inline-flex items-center rounded-md px-2 py-1 text-body-md font-semibold text-primary transition hover:bg-primary-container/15"
            >
              Ver proceso →
            </Link>
          </div>
        ) : (
          <form className="mt-3 grid gap-4 md:grid-cols-2" onSubmit={abrirProcesoDisciplinario}>
            <CampoTexto
              etiqueta="Causal detectada"
              value={disciplinario.causal}
              onChange={(e) => setDisciplinario({ ...disciplinario, causal: e.target.value })}
              required
            />
            <CampoAreaTexto
              etiqueta="Descripción (opcional)"
              value={disciplinario.descripcion}
              onChange={(e) => setDisciplinario({ ...disciplinario, descripcion: e.target.value })}
            />
            <Boton type="submit" variante="peligro" cargando={abriendoDisciplinario}>Abrir proceso disciplinario</Boton>
          </form>
        )}
      </Tarjeta>

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
            <h2 className="font-semibold text-on-surface">Seguimiento manual</h2>
            <CampoTexto etiqueta="Periodo" value={seguimiento.periodo} onChange={(e) => setSeguimiento({ ...seguimiento, periodo: e.target.value })} required />
            <CampoTexto etiqueta="Estado" value={seguimiento.estado} onChange={(e) => setSeguimiento({ ...seguimiento, estado: e.target.value })} required />
            <CampoAreaTexto etiqueta="Observaciones" value={seguimiento.observaciones} onChange={(e) => setSeguimiento({ ...seguimiento, observaciones: e.target.value })} />
            <Boton type="submit">Registrar seguimiento</Boton>
          </form>
        </Tarjeta>
        <Tarjeta>
          <form className="space-y-4" onSubmit={guardarAlerta}>
            <h2 className="font-semibold text-on-surface">Crear alerta manual</h2>
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
          { clave: 'acciones', etiqueta: 'Acciones', render: (fila) => fila.Estado === 'ABIERTA' ? <Boton variante="texto" onClick={() => solicitarCierreAlerta(fila.IdAlerta)}>Marcar atendida</Boton> : '—' }
        ]} />
      </div>

      <DialogoConfirmacion
        abierto={idAlertaCerrar !== null}
        titulo="Atender alerta"
        mensaje="Registre la observación de cierre de esta alerta."
        textoConfirmar="Marcar atendida"
        cargando={cerrandoAlerta}
        confirmar={confirmarCierreAlerta}
        cancelar={() => setIdAlertaCerrar(null)}
      >
        <CampoAreaTexto etiqueta="Observación de cierre" value={observacionCierre} onChange={(e) => setObservacionCierre(e.target.value)} />
      </DialogoConfirmacion>
    </div>
  );
}
