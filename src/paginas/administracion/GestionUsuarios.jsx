import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { cambiarEstadoUsuario, listarUsuarios } from '../../servicios/servicioSegmentoDos.js';

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    try {
      const respuesta = await listarUsuarios({ buscar, pagina, limite: 20 });
      setUsuarios(respuesta.datos.items);
      setTotal(respuesta.datos.total);
    }
    catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }
  useEffect(() => { cargar(); }, [pagina]);

  async function cambiar(id, estado) {
    await cambiarEstadoUsuario(id, estado);
    setMensaje({ tipo: 'exito', texto: `Usuario actualizado a ${estado}.` });
    cargar();
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Gestión de usuarios" descripcion="Administre acceso, bloqueo y roles sin eliminar referencias históricas." acciones={<Link to="/admin/usuarios/nuevo"><Boton>Nuevo usuario</Boton></Link>} />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="flex max-w-lg items-end gap-2"><CampoTexto etiqueta="Buscar por nombre, correo o cédula" value={buscar} onChange={(e) => setBuscar(e.target.value)} /><Boton onClick={() => pagina === 1 ? cargar() : setPagina(1)}>Buscar</Boton></div>
      <TablaDatos filas={usuarios} clave="IdUsuario" columnas={[
        { clave: 'usuario', etiqueta: 'Usuario', render: (fila) => <div><strong>{fila.Nombre} {fila.PrimerApellido}</strong><span className="block text-label-sm text-on-surface-variant">{fila.Correo}</span></div> },
        { clave: 'Cedula', etiqueta: 'Cédula', render: (fila) => fila.Cedula || '—' },
        { clave: 'Roles', etiqueta: 'Roles', render: (fila) => fila.Roles.join(', ') || 'Sin rol' },
        { clave: 'Estado', etiqueta: 'Estado' },
        { clave: 'FechaCreacion', etiqueta: 'Creación', render: (fila) => new Date(fila.FechaCreacion).toLocaleDateString('es-CR') },
        { clave: 'acciones', etiqueta: 'Acciones', render: (fila) => <div className="flex flex-wrap gap-1"><Link to={`/admin/usuarios/${fila.IdUsuario}`} className="text-primary-container hover:underline">Editar</Link>{fila.Estado === 'ACTIVO' ? <Boton variante="texto" onClick={() => cambiar(fila.IdUsuario, 'BLOQUEADO')}>Bloquear</Boton> : <Boton variante="texto" onClick={() => cambiar(fila.IdUsuario, 'ACTIVO')}>Activar</Boton>}</div> }
      ]} />
      <div className="flex items-center justify-between">
        <span className="text-body-sm text-on-surface-variant">Página {pagina} · {total} usuarios</span>
        <div className="flex gap-2">
          <Boton variante="secundario" deshabilitado={pagina <= 1} onClick={() => setPagina((valor) => valor - 1)}>Anterior</Boton>
          <Boton variante="secundario" deshabilitado={pagina * 20 >= total} onClick={() => setPagina((valor) => valor + 1)}>Siguiente</Boton>
        </div>
      </div>
    </div>
  );
}
