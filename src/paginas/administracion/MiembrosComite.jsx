import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import DialogoConfirmacion from '../../componentes/comunes/DialogoConfirmacion.jsx';
import { crearMiembroComite, eliminarMiembroComite, listarEmpleados, listarMiembrosComite, obtenerCatalogosPersonal } from '../../servicios/servicioSegmentoDos.js';

export default function MiembrosComite() {
  const [miembros, setMiembros] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [comites, setComites] = useState([]);
  const [formulario, setFormulario] = useState({ idComite: '', idEmpleado: '', cargo: '', fechaInicio: '', fechaFin: '' });
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [idAFinalizar, setIdAFinalizar] = useState(null);

  async function cargar() {
    try {
      const [m, e, c] = await Promise.all([listarMiembrosComite(), listarEmpleados(), obtenerCatalogosPersonal()]);
      setMiembros(m.datos);
      setEmpleados(e.datos.filter((item) => item.Activo));
      setComites(c.datos.comites);
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); } finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, []);

  async function agregar(evento) {
    evento.preventDefault();
    try {
      await crearMiembroComite(formulario);
      setMensaje({ tipo: 'exito', texto: 'Membresía registrada.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  async function confirmarFinalizar() {
    const id = idAFinalizar;
    setIdAFinalizar(null);
    await eliminarMiembroComite(id);
    cargar();
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Miembros del comité" descripcion="Asigne empleados al comité con cargo y vigencia." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Tarjeta>
          <form className="space-y-4" onSubmit={agregar}>
            <CampoSelect etiqueta="Comité" value={formulario.idComite} onChange={(e) => setFormulario({ ...formulario, idComite: e.target.value })} opciones={comites.map((item) => ({ valor: item.IdComite, etiqueta: item.Nombre }))} />
            <CampoSelect etiqueta="Empleado" value={formulario.idEmpleado} onChange={(e) => setFormulario({ ...formulario, idEmpleado: e.target.value })} opciones={empleados.map((item) => ({ valor: item.IdEmpleado, etiqueta: `${item.Nombre} ${item.PrimerApellido}` }))} />
            <CampoTexto etiqueta="Cargo" value={formulario.cargo} onChange={(e) => setFormulario({ ...formulario, cargo: e.target.value })} required />
            <CampoTexto etiqueta="Inicio" type="date" value={formulario.fechaInicio} onChange={(e) => setFormulario({ ...formulario, fechaInicio: e.target.value })} />
            <CampoTexto etiqueta="Fin (opcional)" type="date" value={formulario.fechaFin} onChange={(e) => setFormulario({ ...formulario, fechaFin: e.target.value })} />
            <Boton type="submit">Agregar miembro</Boton>
          </form>
        </Tarjeta>
        {cargando ? <EstadoCarga /> : (
          <TablaDatos filas={miembros} clave="IdMiembroComite" columnas={[
            { clave: 'Empleado', etiqueta: 'Empleado' },
            { clave: 'Comite', etiqueta: 'Comité' },
            { clave: 'Cargo', etiqueta: 'Cargo' },
            { clave: 'FechaInicio', etiqueta: 'Inicio', render: (fila) => new Date(fila.FechaInicio).toLocaleDateString('es-CR') },
            { clave: 'Activo', etiqueta: 'Estado', render: (fila) => fila.Activo ? 'Vigente' : 'Finalizado' },
            { clave: 'acciones', etiqueta: 'Acciones', render: (fila) => fila.Activo ? <Boton variante="texto" onClick={() => setIdAFinalizar(fila.IdMiembroComite)}>Finalizar</Boton> : '—' }
          ]} />
        )}
      </div>

      <DialogoConfirmacion
        abierto={Boolean(idAFinalizar)}
        titulo="Finalizar membresía"
        mensaje="¿Finalizar esta membresía?"
        varianteConfirmar="peligro"
        confirmar={confirmarFinalizar}
        cancelar={() => setIdAFinalizar(null)}
      />
    </div>
  );
}

