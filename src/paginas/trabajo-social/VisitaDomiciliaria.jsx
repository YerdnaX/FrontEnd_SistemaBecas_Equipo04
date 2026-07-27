import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { cancelarVisita, listarVisitas, programarVisita, registrarInformeVisita } from '../../servicios/servicioSegmentoDos.js';

export default function VisitaDomiciliaria() {
  const { id } = useParams();
  const [visitas, setVisitas] = useState([]);
  const [formulario, setFormulario] = useState({ fechaProgramada: '', direccion: '', observaciones: '' });
  const [informe, setInforme] = useState({ idVisita: '', resultado: '', observaciones: '' });
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    try { setVisitas((await listarVisitas(id)).datos); }
    catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }
  useEffect(() => { cargar(); }, [id]);

  async function programar(evento) {
    evento.preventDefault();
    setProcesando(true);
    try {
      await programarVisita(id, formulario);
      setFormulario({ fechaProgramada: '', direccion: '', observaciones: '' });
      setMensaje({ tipo: 'exito', texto: 'Visita programada y estudiante notificado.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
    finally { setProcesando(false); }
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

  async function cancelar(idVisita) {
    if (!window.confirm('¿Desea cancelar esta visita?')) return;
    await cancelarVisita(idVisita, { observacion: 'Cancelada desde la gestión de visitas.' });
    cargar();
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Visitas domiciliarias" descripcion={`Programación e informes asociados al expediente #${id}.`} />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta>
          <form className="space-y-4" onSubmit={programar}>
            <h2 className="font-semibold text-primary">Programar nueva visita</h2>
            <CampoTexto etiqueta="Fecha y hora" type="datetime-local" value={formulario.fechaProgramada} onChange={(e) => setFormulario({ ...formulario, fechaProgramada: e.target.value })} required />
            <CampoTexto etiqueta="Dirección" value={formulario.direccion} onChange={(e) => setFormulario({ ...formulario, direccion: e.target.value })} required />
            <CampoAreaTexto etiqueta="Observaciones" value={formulario.observaciones} onChange={(e) => setFormulario({ ...formulario, observaciones: e.target.value })} />
            <Boton type="submit" cargando={procesando}>Programar visita</Boton>
          </form>
        </Tarjeta>
        <Tarjeta>
          <form className="space-y-4" onSubmit={completar}>
            <h2 className="font-semibold text-primary">Registrar informe</h2>
            <label className="flex flex-col gap-1 text-body-sm"><span className="font-medium">Visita</span><select className="rounded-md border p-2" value={informe.idVisita} onChange={(e) => setInforme({ ...informe, idVisita: e.target.value })} required><option value="">Seleccione...</option>{visitas.filter((visita) => visita.Estado === 'PROGRAMADA').map((visita) => <option key={visita.IdVisita} value={visita.IdVisita}>{new Date(visita.FechaProgramada).toLocaleString('es-CR')} · {visita.Direccion}</option>)}</select></label>
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
        { clave: 'acciones', etiqueta: 'Acciones', render: (fila) => fila.Estado === 'PROGRAMADA' ? <Boton variante="texto" onClick={() => cancelar(fila.IdVisita)}>Cancelar</Boton> : '—' }
      ]} />
    </div>
  );
}

