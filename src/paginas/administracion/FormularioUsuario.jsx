import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoCedula from '../../componentes/formularios/CampoCedula.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { actualizarUsuario, asignarRolesUsuario, crearUsuario, listarRoles, obtenerUsuario } from '../../servicios/servicioSegmentoDos.js';

export default function FormularioUsuario() {
  const { id } = useParams();
  const navegar = useNavigate();
  const esNuevo = id === 'nuevo';
  const [formulario, setFormulario] = useState({ cedula: '', correo: '', nombre: '', primerApellido: '', segundoApellido: '', contrasena: '', idsRoles: [] });
  const [roles, setRoles] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    listarRoles().then((respuesta) => setRoles(respuesta.datos));
    if (!esNuevo) obtenerUsuario(id).then((respuesta) => setFormulario({
      cedula: respuesta.datos.Cedula || '',
      correo: respuesta.datos.Correo,
      nombre: respuesta.datos.Nombre,
      primerApellido: respuesta.datos.PrimerApellido,
      segundoApellido: respuesta.datos.SegundoApellido || '',
      contrasena: '',
      idsRoles: respuesta.datos.roles.map((rol) => rol.IdRol)
    })).catch((error) => setMensaje({ tipo: 'error', texto: error.message }));
  }, [id, esNuevo]);

  function alternarRol(idRol) {
    setFormulario((actual) => ({ ...actual, idsRoles: actual.idsRoles.includes(idRol) ? actual.idsRoles.filter((idActual) => idActual !== idRol) : [...actual.idsRoles, idRol] }));
  }

  async function guardar(evento) {
    evento.preventDefault();
    try {
      if (esNuevo) {
        const respuesta = await crearUsuario(formulario);
        navegar(`/admin/usuarios/${respuesta.datos.IdUsuario}`, { replace: true });
      } else {
        await actualizarUsuario(id, formulario);
        await asignarRolesUsuario(id, formulario.idsRoles);
      }
      setMensaje({ tipo: 'exito', texto: 'Usuario y roles guardados.' });
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo={esNuevo ? 'Nuevo usuario' : 'Editar usuario'} descripcion="Datos de cuenta y asignación explícita de uno o varios roles." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <Tarjeta>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={guardar}>
          <div className="sm:col-span-2">
            <CampoCedula
              cedula={formulario.cedula}
              requerido={esNuevo}
              onCedulaChange={(valor) => setFormulario({ ...formulario, cedula: valor })}
              onDatosEncontrados={(datos) => setFormulario((actual) => ({
                ...actual,
                nombre: datos.nombre || actual.nombre,
                primerApellido: datos.primerApellido || actual.primerApellido,
                segundoApellido: datos.segundoApellido || actual.segundoApellido
              }))}
            />
          </div>
          <CampoTexto etiqueta="Correo" type="email" value={formulario.correo} onChange={(e) => setFormulario({ ...formulario, correo: e.target.value })} required />
          <CampoTexto etiqueta="Nombre" value={formulario.nombre} onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })} required />
          <CampoTexto etiqueta="Primer apellido" value={formulario.primerApellido} onChange={(e) => setFormulario({ ...formulario, primerApellido: e.target.value })} required />
          <CampoTexto etiqueta="Segundo apellido" value={formulario.segundoApellido} onChange={(e) => setFormulario({ ...formulario, segundoApellido: e.target.value })} />
          {esNuevo && <CampoTexto etiqueta="Contraseña temporal" type="password" value={formulario.contrasena} onChange={(e) => setFormulario({ ...formulario, contrasena: e.target.value })} required />}
          <fieldset className="sm:col-span-2"><legend className="font-semibold text-on-surface">Roles</legend><div className="mt-2 flex flex-wrap gap-3">{roles.map((rol) => {
            const seleccionado = formulario.idsRoles.includes(rol.IdRol);
            return (
              <label key={rol.IdRol} className={`rounded-md border px-3 py-2 text-body-sm ${seleccionado ? 'border-primary-container bg-primary-container text-on-primary-container' : 'border-outline-variant bg-surface-container text-on-surface'}`}>
                <input className="mr-2" type="checkbox" checked={seleccionado} onChange={() => alternarRol(rol.IdRol)} />{rol.Nombre}
              </label>
            );
          })}</div></fieldset>
          <Boton type="submit">Guardar usuario</Boton>
        </form>
      </Tarjeta>
    </div>
  );
}

