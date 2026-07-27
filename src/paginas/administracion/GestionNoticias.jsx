import { useEffect, useMemo, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { cambiarEstadoNoticia, crearNoticia, listarNoticias } from '../../servicios/servicioSegmentoDos.js';

export default function GestionNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [formulario, setFormulario] = useState({ titulo: '', contenido: '', publicoDestino: 'GENERAL' });
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
      await crearNoticia(formulario);
      setFormulario({ titulo: '', contenido: '', publicoDestino: 'GENERAL' });
      setMensaje({ tipo: 'exito', texto: 'Noticia creada como borrador.' });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
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
            <h2 className="font-semibold text-primary">Nueva noticia</h2>
            <CampoTexto etiqueta="Título" value={formulario.titulo} onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })} required />
            <CampoAreaTexto etiqueta="Contenido" value={formulario.contenido} onChange={(e) => setFormulario({ ...formulario, contenido: e.target.value })} required />
            <CampoSelect etiqueta="Público" value={formulario.publicoDestino} onChange={(e) => setFormulario({ ...formulario, publicoDestino: e.target.value })} opciones={[{ valor: 'GENERAL', etiqueta: 'Público general y todos' }, { valor: 'ASPIRANTE', etiqueta: 'Aspirantes' }, { valor: 'BECADO', etiqueta: 'Becados' }]} />
            <Boton type="submit">Guardar borrador</Boton>
          </form>
        </Tarjeta>
        <div>
          <CampoTexto etiqueta="Buscar por título" value={buscar} onChange={(e) => setBuscar(e.target.value)} className="mb-4 max-w-sm" />
          <TablaDatos filas={filtradas} clave="IdNoticia" columnas={[
            { clave: 'Titulo', etiqueta: 'Noticia' },
            { clave: 'PublicoDestino', etiqueta: 'Público' },
            { clave: 'Estado', etiqueta: 'Estado' },
            { clave: 'FechaPublicacion', etiqueta: 'Fecha', render: (fila) => fila.FechaPublicacion ? new Date(fila.FechaPublicacion).toLocaleDateString('es-CR') : 'Sin publicar' },
            { clave: 'acciones', etiqueta: 'Acciones', render: (fila) => <div className="flex gap-1">{fila.Estado !== 'PUBLICADA' && <Boton variante="texto" onClick={() => estado(fila.IdNoticia, 'PUBLICADA')}>Publicar</Boton>}{fila.Estado === 'PUBLICADA' && <Boton variante="texto" onClick={() => estado(fila.IdNoticia, 'DESPUBLICADA')}>Despublicar</Boton>}<Boton variante="texto" onClick={() => estado(fila.IdNoticia, 'INACTIVA')}>Desactivar</Boton></div> }
          ]} />
        </div>
      </div>
    </div>
  );
}
