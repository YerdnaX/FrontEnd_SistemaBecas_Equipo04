import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { asignarPermisosRol, crearRol, listarPermisos, listarRoles } from '../../servicios/servicioSegmentoDos.js';

export default function GestionRolesPermisos() {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [idsPermisos, setIdsPermisos] = useState([]);
  const [nuevo, setNuevo] = useState({ codigo: '', nombre: '', descripcion: '' });
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    const [r, p] = await Promise.all([listarRoles(), listarPermisos()]);
    setRoles(r.datos);
    setPermisos(p.datos);
  }
  useEffect(() => { cargar().catch((error) => setMensaje({ tipo: 'error', texto: error.message })); }, []);

  async function crear(evento) {
    evento.preventDefault();
    await crearRol(nuevo);
    setNuevo({ codigo: '', nombre: '', descripcion: '' });
    setMensaje({ tipo: 'exito', texto: 'Rol creado.' });
    cargar();
  }
  async function guardarMatriz() {
    await asignarPermisosRol(seleccionado.IdRol, idsPermisos);
    setMensaje({ tipo: 'exito', texto: 'Permisos del rol actualizados.' });
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Roles y permisos" descripcion="Matriz de permisos aplicada por la API y reflejada en la navegación." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <Tarjeta><form className="space-y-3" onSubmit={crear}><h2 className="font-semibold text-primary">Nuevo rol</h2><CampoTexto etiqueta="Código" value={nuevo.codigo} onChange={(e) => setNuevo({ ...nuevo, codigo: e.target.value })} required /><CampoTexto etiqueta="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} required /><Boton type="submit">Crear rol</Boton></form></Tarjeta>
          {roles.map((rol) => <button key={rol.IdRol} type="button" onClick={() => { setSeleccionado(rol); setIdsPermisos(rol.IdsPermisos || []); }} className="block w-full rounded-lg border bg-white p-4 text-left hover:bg-primary-fixed"><strong>{rol.Nombre}</strong><span className="block text-label-sm">{rol.CantidadPermisos} permisos</span></button>)}
        </div>
        <Tarjeta>
          <h2 className="font-semibold text-primary">{seleccionado ? `Permisos de ${seleccionado.Nombre}` : 'Seleccione un rol'}</h2>
          {seleccionado && <><div className="mt-4 grid max-h-[560px] gap-2 overflow-y-auto sm:grid-cols-2">{permisos.map((permiso) => <label key={permiso.IdPermiso} className="rounded-md border p-3 text-body-sm"><input className="mr-2" type="checkbox" checked={idsPermisos.includes(permiso.IdPermiso)} onChange={() => setIdsPermisos((actual) => actual.includes(permiso.IdPermiso) ? actual.filter((id) => id !== permiso.IdPermiso) : [...actual, permiso.IdPermiso])} />{permiso.Codigo}</label>)}</div><Boton className="mt-4" onClick={guardarMatriz}>Guardar matriz</Boton></>}
        </Tarjeta>
      </div>
    </div>
  );
}
