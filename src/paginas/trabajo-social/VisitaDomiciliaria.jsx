import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import DialogoConfirmacion from '../../componentes/comunes/DialogoConfirmacion.jsx';
import {
  cancelarVisita,
  listarVisitas,
  programarVisita,
  registrarInformeVisita,
  reprogramarVisita
} from '../../servicios/servicioSegmentoDos.js';

export default function VisitaDomiciliaria() {
  const { id } = useParams();
  const [visitas, setVisitas] = useState([]);
  const [formulario, setFormulario] = useState({ fechaProgramada: '', direccion: '', observaciones: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [informe, setInforme] = useState({ idVisita: '', resultado: '', observaciones: '' });
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [idVisitaCancelar, setIdVisitaCancelar] = useState(null);
  const [cancelando, setCancelando] = useState(false);

  async function cargar() {
    try { setVisitas((await listarVisitas(id)).datos); }
    catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }
  useEffect(() => { cargar(); }, [id]);

  async function programar(evento) {
    evento.preventDefault();
    setProcesando(true);
    try {
      if (editandoId) await reprogramarVisita(editandoId, formulario);
      else await programarVisita(id, formulario);
      setFormulario({ fechaProgramada: '', direccion: '', observaciones: '' });
      setMensaje({ tipo: 'exito', texto: editandoId ? 'Visita reprogramada y estudiante notificado.' : 'Visita programada y estudiante notificado.' });
      setEditandoId(null);
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setProcesando(false); }
  }

  function editar(visita) {
    const fechaLocal = new Date(visita.FechaProgramada);
    fechaLocal.setMinutes(fechaLocal.getMinutes() - fechaLocal.getTimezoneOffset());
    setEditandoId(visita.IdVisita);
    setFormulario({
      fechaProgramada: fechaLocal.toISOString().slice(0, 16),
      direccion: visita.Direccion,
      observaciones: visita.Observaciones || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function completar(evento) {
    evento.preventDefault();
    setProcesando(true);
    try {
      await registrarInformeVisita(informe.idVisita, informe);
      setInforme({ idVisita: '', resultado: '', observaciones: '' });
      setMensaje({ tipo: 'exito', texto: 'Informe registrado y visita completada.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setProcesando(false); }
  }

  async function confirmarCancelacion() {
    setCancelando(true);
    await cancelarVisita(idVisitaCancelar, { observacion: 'Cancelada desde la gestión de visitas.' });
    setCancelando(false);
    setIdVisitaCancelar(null);
    cargar();
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Visitas domiciliarias" descripcion={`Programación e informes asociados al expediente #${id}.`} />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta>
          <form className="space-y-4" onSubmit={programar}>
            <h2 className="font-semibold text-on-surface">{editandoId ? 'Reprogramar visita' : 'Programar nueva visita'}</h2>
            <CampoTexto etiqueta="Fecha y hora" type="datetime-local" value={formulario.fechaProgramada} onChange={(e) => setFormulario({ ...formulario, fechaProgramada: e.target.value })} required />
            <CampoTexto etiqueta="Dirección" value={formulario.direccion} onChange={(e) => setFormulario({ ...formulario, direccion: e.target.value })} required />
            <CampoAreaTexto etiqueta="Observaciones" value={formulario.observaciones} onChange={(e) => setFormulario({ ...formulario, observaciones: e.target.value })} />
            <div className="flex gap-2">
              <Boton type="submit" cargando={procesando}>{editandoId ? 'Guardar reprogramación' : 'Programar visita'}</Boton>
              {editandoId && <Boton type="button" variante="secundario" onClick={() => { setEditandoId(null); setFormulario({ fechaProgramada: '', direccion: '', observaciones: '' }); }}>Cancelar edición</Boton>}
            </div>
          </form>
        </Tarjeta>
        <Tarjeta>
          <form className="space-y-4" onSubmit={completar}>
            <h2 className="font-semibold text-on-surface">Registrar informe</h2>
            <CampoSelect
              etiqueta="Visita"
              value={informe.idVisita}
              onChange={(e) => setInforme({ ...informe, idVisita: e.target.value })}
              required
              opciones={visitas.filter((visita) => visita.Estado === 'PROGRAMADA').map((visita) => ({
                valor: visita.IdVisita,
                etiqueta: `${new Date(visita.FechaProgramada).toLocaleString('es-CR')} · ${visita.Direccion}`
              }))}
            />
            <CampoTexto etiqueta="Resultado" value={informe.resultado} onChange={(e) => setInforme({ ...informe, resultado: e.target.value })} required />
            <CampoAreaTexto etiqueta="Observaciones del entorno" value={informe.observaciones} onChange={(e) => setInforme({ ...informe, observaciones: e.target.value })} />
            <Boton type="submit" cargando={procesando}>Finalizar visita</Boton>
          </form>
        </Tarjeta>
      </div>
      <TablaDatos filas={visitas} clave="IdVisita" columnas={[
        { clave: 'FechaProgramada', etiqueta: 'Fecha', render: (fila) => new Date(fila.FechaProgramada).toLocaleString('es-CR') },
        { clave: 'Direccion', etiqueta: 'Ubicación' },
        { clave: 'Responsable', etiqueta: 'Responsable' },
        { clave: 'Estado', etiqueta: 'Estado' },
        { clave: 'acciones', etiqueta: 'Acciones', render: (fila) => fila.Estado === 'PROGRAMADA' ? <div className="flex gap-2"><Boton variante="texto" onClick={() => editar(fila)}>Reprogramar</Boton><Boton variante="texto" onClick={() => setIdVisitaCancelar(fila.IdVisita)}>Cancelar</Boton></div> : '—' }
      ]} />

      <DialogoConfirmacion
        abierto={idVisitaCancelar !== null}
        titulo="Cancelar visita"
        mensaje="¿Desea cancelar esta visita?"
        varianteConfirmar="peligro"
        textoConfirmar="Cancelar visita"
        cargando={cancelando}
        confirmar={confirmarCancelacion}
        cancelar={() => setIdVisitaCancelar(null)}
      />
    </div>
  );
}
