import { useEffect, useMemo, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { actualizarNoticia, cambiarEstadoNoticia, crearNoticia, listarNoticias } from '../../servicios/servicioSegmentoDos.js';
import EtiquetaCategoria, { OPCIONES_CATEGORIA } from '../../componentes/comunes/EtiquetaCategoria.jsx';

export default function GestionNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [formulario, setFormulario] = useState({ titulo: '', contenido: '', publicoDestino: 'GENERAL', categoria: 'GENERAL' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const filtradas = useMemo(() => noticias.filter((n) => n.Titulo.toLowerCase().includes(buscar.toLowerCase())), [noticias, buscar]);

  async function cargar() {
    try { setNoticias((await listarNoticias()).datos); }
    catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }
  useEffect(() => { cargar(); }, []);

  async function guardar(evento) {
    evento.preventDefault();
    try {
      if (editandoId) await actualizarNoticia(editandoId, formulario);
      else await crearNoticia(formulario);
      setFormulario({ titulo: '', contenido: '', publicoDestino: 'GENERAL', categoria: 'GENERAL' });
      setMensaje({ tipo: 'exito', texto: editandoId ? 'Noticia actualizada.' : 'Noticia creada como borrador.' });
      setEditandoId(null);
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  function editar(noticia) {
    setEditandoId(noticia.IdNoticia);
    setFormulario({
      titulo: noticia.Titulo,
      contenido: noticia.Contenido,
      publicoDestino: noticia.PublicoDestino,
      categoria: noticia.Categoria || 'GENERAL'
    });
  }

  async function estado(id, valor) {
    await cambiarEstadoNoticia(id, valor);
    cargar();
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Gestión de noticias" descripcion="Cree y publique comunicación institucional para públicos específicos." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Tarjeta>
          <form className="space-y-4" onSubmit={guardar}>
            <h2 className="font-semibold text-on-surface">{editandoId ? 'Editar noticia' : 'Nueva noticia'}</h2>
            <CampoTexto etiqueta="Título" value={formulario.titulo} onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })} required />
            <CampoAreaTexto etiqueta="Contenido" value={formulario.contenido} onChange={(e) => setFormulario({ ...formulario, contenido: e.target.value })} required />
            <CampoSelect etiqueta="Público" value={formulario.publicoDestino} onChange={(e) => setFormulario({ ...formulario, publicoDestino: e.target.value })} opciones={[{ valor: 'GENERAL', etiqueta: 'Público general y todos' }, { valor: 'ASPIRANTE', etiqueta: 'Aspirantes' }, { valor: 'BECADO', etiqueta: 'Becados' }]} />
            <CampoSelect etiqueta="Categoría" value={formulario.categoria} onChange={(e) => setFormulario({ ...formulario, categoria: e.target.value })} opciones={OPCIONES_CATEGORIA} />
            <div className="flex gap-2">
              <Boton type="submit">{editandoId ? 'Guardar cambios' : 'Guardar borrador'}</Boton>
              {editandoId && <Boton type="button" variante="secundario" onClick={() => { setEditandoId(null); setFormulario({ titulo: '', contenido: '', publicoDestino: 'GENERAL', categoria: 'GENERAL' }); }}>Cancelar</Boton>}
            </div>
          </form>
        </Tarjeta>
        <div>
          <CampoTexto etiqueta="Buscar por título" value={buscar} onChange={(e) => setBuscar(e.target.value)} className="mb-4 max-w-sm" />
          <TablaDatos filas={filtradas} clave="IdNoticia" columnas={[
            { clave: 'Titulo', etiqueta: 'Noticia' },
            { clave: 'Categoria', etiqueta: 'Categoría', render: (fila) => <EtiquetaCategoria categoria={fila.Categoria} /> },
            { clave: 'PublicoDestino', etiqueta: 'Público' },
            { clave: 'Estado', etiqueta: 'Estado' },
            { clave: 'FechaPublicacion', etiqueta: 'Fecha', render: (fila) => fila.FechaPublicacion ? new Date(fila.FechaPublicacion).toLocaleDateString('es-CR') : 'Sin publicar' },
            { clave: 'acciones', etiqueta: 'Acciones', render: (fila) => <div className="flex flex-wrap gap-1"><Boton variante="texto" onClick={() => editar(fila)}>Editar</Boton>{fila.Estado !== 'PUBLICADA' && <Boton variante="texto" onClick={() => estado(fila.IdNoticia, 'PUBLICADA')}>Publicar</Boton>}{fila.Estado === 'PUBLICADA' && <Boton variante="texto" onClick={() => estado(fila.IdNoticia, 'DESPUBLICADA')}>Despublicar</Boton>}<Boton variante="texto" onClick={() => estado(fila.IdNoticia, 'INACTIVA')}>Desactivar</Boton></div> }
          ]} />
        </div>
      </div>
    </div>
  );
}
