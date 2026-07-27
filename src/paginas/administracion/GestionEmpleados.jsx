import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { actualizarEmpleado, cambiarEstadoEmpleado, crearEmpleado, listarEmpleados, obtenerCatalogosPersonal } from '../../servicios/servicioSegmentoDos.js';

export default function GestionEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [catalogos, setCatalogos] = useState({ puestos: [], departamentos: [] });
  const [formulario, setFormulario] = useState({ idUsuario: '', numeroEmpleado: '', idPuesto: '', idDepartamento: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    try {
      const [e, c] = await Promise.all([listarEmpleados(), obtenerCatalogosPersonal()]);
      setEmpleados(e.datos);
      setCatalogos(c.datos);
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }
  useEffect(() => { cargar(); }, []);

  async function guardar(evento) {
    evento.preventDefault();
    try {
      if (editandoId) await actualizarEmpleado(editandoId, formulario);
      else await crearEmpleado(formulario);
      setFormulario({ idUsuario: '', numeroEmpleado: '', idPuesto: '', idDepartamento: '' });
      setMensaje({ tipo: 'exito', texto: editandoId ? 'Empleado actualizado.' : 'Empleado vinculado.' });
      setEditandoId(null);
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  function editar(empleado) {
    setEditandoId(empleado.IdEmpleado);
    setFormulario({
      idUsuario: empleado.IdUsuario,
      numeroEmpleado: empleado.NumeroEmpleado,
      idPuesto: empleado.IdPuesto || '',
      idDepartamento: empleado.IdDepartamento || ''
    });
  }

  async function alternar(empleado) {
    await cambiarEstadoEmpleado(empleado.IdEmpleado, !empleado.Activo);
    cargar();
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Gestión de empleados" descripcion="Vincule cuentas institucionales con puesto y departamento." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Tarjeta>
          <form className="space-y-4" onSubmit={guardar}>
            <h2 className="font-semibold text-primary">{editandoId ? 'Editar empleado' : 'Vincular empleado'}</h2>
            <CampoTexto etiqueta="ID de usuario" type="number" min="1" value={formulario.idUsuario} onChange={(e) => setFormulario({ ...formulario, idUsuario: e.target.value })} disabled={Boolean(editandoId)} required />
            <CampoTexto etiqueta="Número de empleado" value={formulario.numeroEmpleado} onChange={(e) => setFormulario({ ...formulario, numeroEmpleado: e.target.value })} required />
            <CampoSelect etiqueta="Puesto" value={formulario.idPuesto} onChange={(e) => setFormulario({ ...formulario, idPuesto: e.target.value })} opciones={catalogos.puestos.map((item) => ({ valor: item.IdPuesto, etiqueta: item.Nombre }))} />
            <CampoSelect etiqueta="Departamento" value={formulario.idDepartamento} onChange={(e) => setFormulario({ ...formulario, idDepartamento: e.target.value })} opciones={catalogos.departamentos.map((item) => ({ valor: item.IdDepartamento, etiqueta: item.Nombre }))} />
            <div className="flex gap-2">
              <Boton type="submit">{editandoId ? 'Guardar cambios' : 'Vincular empleado'}</Boton>
              {editandoId && <Boton type="button" variante="secundario" onClick={() => { setEditandoId(null); setFormulario({ idUsuario: '', numeroEmpleado: '', idPuesto: '', idDepartamento: '' }); }}>Cancelar</Boton>}
            </div>
          </form>
        </Tarjeta>
        <TablaDatos filas={empleados} clave="IdEmpleado" columnas={[
          { clave: 'empleado', etiqueta: 'Empleado', render: (fila) => <div><strong>{fila.Nombre} {fila.PrimerApellido}</strong><span className="block text-label-sm">{fila.Correo}</span></div> },
          { clave: 'NumeroEmpleado', etiqueta: 'Número' },
          { clave: 'Puesto', etiqueta: 'Puesto' },
          { clave: 'Departamento', etiqueta: 'Departamento' },
          { clave: 'Activo', etiqueta: 'Estado', render: (fila) => fila.Activo ? 'Activo' : 'Inactivo' },
          { clave: 'acciones', etiqueta: 'Acciones', render: (fila) => <div className="flex gap-2"><Boton variante="texto" onClick={() => editar(fila)}>Editar</Boton><Boton variante="texto" onClick={() => alternar(fila)}>{fila.Activo ? 'Desactivar' : 'Activar'}</Boton></div> }
        ]} />
      </div>
    </div>
  );
}
