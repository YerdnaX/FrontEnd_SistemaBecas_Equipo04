import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { actualizarRol, asignarPermisosRol, crearRol, listarPermisos, listarRoles } from '../../servicios/servicioSegmentoDos.js';

export default function GestionRolesPermisos() {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [idsPermisos, setIdsPermisos] = useState([]);
  const [nuevo, setNuevo] = useState({ codigo: '', nombre: '', descripcion: '' });
  const [edicion, setEdicion] = useState({ nombre: '', descripcion: '', activo: true });
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    const [r, p] = await Promise.all([listarRoles(), listarPermisos()]);
    setRoles(r.datos);
    setPermisos(p.datos);
  }
  useEffect(() => {
    cargar().catch((error) => setMensaje({ tipo: 'error', texto: error.message })).finally(() => setCargando(false));
  }, []);

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

  async function guardarRol(evento) {
    evento.preventDefault();
    await actualizarRol(seleccionado.IdRol, edicion);
    setMensaje({ tipo: 'exito', texto: 'Datos del rol actualizados.' });
    await cargar();
  }

  function seleccionarRol(rol) {
    setSeleccionado(rol);
    setIdsPermisos(rol.IdsPermisos || []);
    setEdicion({ nombre: rol.Nombre, descripcion: rol.Descripcion || '', activo: rol.Activo !== false });
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Roles y permisos" descripcion="Matriz de permisos aplicada por la API y reflejada en la navegación." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <Tarjeta><form className="space-y-3" onSubmit={crear}><h2 className="font-semibold text-on-surface">Nuevo rol</h2><CampoTexto etiqueta="Código" value={nuevo.codigo} onChange={(e) => setNuevo({ ...nuevo, codigo: e.target.value })} required /><CampoTexto etiqueta="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} required /><Boton type="submit">Crear rol</Boton></form></Tarjeta>
          {cargando ? <EstadoCarga /> : roles.map((rol) => {
            const activo = seleccionado?.IdRol === rol.IdRol;
            return (
              <button
                key={rol.IdRol}
                type="button"
                onClick={() => seleccionarRol(rol)}
                className={`block w-full rounded-lg border p-4 text-left transition ${activo ? 'border-primary-container bg-primary-container/15' : 'border-outline-variant bg-surface-container hover:bg-surface-container-high'}`}
              >
                <strong className="text-on-surface">{rol.Nombre}</strong><span className="block text-label-sm text-on-surface-variant">{rol.CantidadPermisos} permisos</span>
              </button>
            );
          })}
        </div>
        <Tarjeta>
          <h2 className="font-semibold text-on-surface">{seleccionado ? `Permisos de ${seleccionado.Nombre}` : 'Seleccione un rol'}</h2>
          {seleccionado && <>
            <form className="mt-4 grid gap-3 border-b border-outline-variant pb-5 sm:grid-cols-2" onSubmit={guardarRol}>
              <CampoTexto etiqueta="Nombre del rol" value={edicion.nombre} onChange={(e) => setEdicion({ ...edicion, nombre: e.target.value })} required />
              <CampoTexto etiqueta="Descripción" value={edicion.descripcion} onChange={(e) => setEdicion({ ...edicion, descripcion: e.target.value })} />
              <label className="flex items-center gap-2 text-body-sm text-on-surface"><input type="checkbox" checked={edicion.activo} onChange={(e) => setEdicion({ ...edicion, activo: e.target.checked })} /> Rol activo</label>
              <Boton type="submit">Guardar datos del rol</Boton>
            </form>
            <div className="mt-4 grid max-h-[560px] gap-2 overflow-y-auto sm:grid-cols-2">{permisos.map((permiso) => {
              const marcado = idsPermisos.includes(permiso.IdPermiso);
              return (
                <label key={permiso.IdPermiso} className={`rounded-md border p-3 text-body-sm ${marcado ? 'border-primary-container bg-primary-container text-on-primary-container' : 'border-outline-variant bg-surface-container text-on-surface'}`}>
                  <input className="mr-2" type="checkbox" checked={marcado} onChange={() => setIdsPermisos((actual) => actual.includes(permiso.IdPermiso) ? actual.filter((id) => id !== permiso.IdPermiso) : [...actual, permiso.IdPermiso])} />{permiso.Codigo}
                </label>
              );
            })}</div><Boton className="mt-4" onClick={guardarMatriz}>Guardar matriz</Boton>
          </>}
        </Tarjeta>
      </div>
    </div>
  );
}
