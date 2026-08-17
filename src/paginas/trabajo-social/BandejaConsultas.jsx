import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { asignarConsulta, cambiarEstadoConsulta, listarBandejaConsultas, obtenerConsulta, responderConsulta } from '../../servicios/servicioSegmentoDos.js';

export default function BandejaConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [estado, setEstado] = useState('');
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    try {
      const resultado = await listarBandejaConsultas({ estado, pagina, limite: 20 });
      setConsultas(resultado.datos.items);
      setTotal(resultado.datos.total);
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }
  useEffect(() => { cargar(); }, [estado, pagina]);

  async function abrir(id) {
    const resultado = await obtenerConsulta(id);
    setSeleccionada(resultado.datos);
  }

  async function asignarme() {
    await asignarConsulta(seleccionada.IdConsulta);
    await abrir(seleccionada.IdConsulta);
    cargar();
  }

  async function enviar(evento) {
    evento.preventDefault();
    const resultado = await responderConsulta(seleccionada.IdConsulta, respuesta);
    setSeleccionada(resultado.datos);
    setRespuesta('');
    cargar();
  }

  async function cerrar() {
    await cambiarEstadoConsulta(seleccionada.IdConsulta, 'CERRADA');
    await abrir(seleccionada.IdConsulta);
    cargar();
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Bandeja de consultas" descripcion="Asigne, responda y cierre conversaciones de aspirantes y becados." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <div className="max-w-xs"><CampoSelect etiqueta="Estado" value={estado} onChange={(e) => { setEstado(e.target.value); setPagina(1); }} opciones={[{ valor: 'ABIERTA', etiqueta: 'Abierta' }, { valor: 'RESPONDIDA', etiqueta: 'En atención' }, { valor: 'CERRADA', etiqueta: 'Cerrada' }]} /></div>
      <div className="grid min-h-[540px] gap-4 lg:grid-cols-[1fr_1.8fr]">
        <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
          {consultas.map((consulta) => (
            <button key={consulta.IdConsulta} type="button" onClick={() => abrir(consulta.IdConsulta)} className="block w-full border-b border-outline-variant p-4 text-left hover:bg-surface-container-high">
              <strong>{consulta.NombreUsuario}</strong>
              <span className="block text-body-sm">{consulta.Asunto}</span>
              <span className="text-label-sm text-on-surface-variant">{consulta.Estado} · {consulta.Responsable || 'Sin asignar'}</span>
            </button>
          ))}
        </div>
        <Tarjeta>
          {!seleccionada && <p className="text-center text-on-surface-variant">Seleccione una consulta.</p>}
          {seleccionada && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant pb-4">
                <div><h2 className="font-semibold">{seleccionada.Asunto}</h2><p className="text-body-sm">{seleccionada.NombreUsuario}</p></div>
                <div className="flex gap-2"><Boton variante="secundario" onClick={asignarme}>Asignarme</Boton><Boton variante="secundario" onClick={cerrar}>Cerrar</Boton></div>
              </div>
              <div className="my-5 space-y-3">
                {seleccionada.mensajes.map((item) => <div key={item.IdRespuesta} className="rounded-lg bg-surface-container-low p-3"><strong className="text-label-sm">{item.Autor}</strong><p>{item.Mensaje}</p></div>)}
              </div>
              {seleccionada.Estado !== 'CERRADA' && <form className="space-y-3" onSubmit={enviar}><CampoAreaTexto etiqueta="Respuesta formal" value={respuesta} onChange={(e) => setRespuesta(e.target.value)} required /><Boton type="submit">Enviar respuesta</Boton></form>}
            </>
          )}
        </Tarjeta>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-body-sm text-on-surface-variant">Página {pagina} · {total} consultas</span>
        <div className="flex gap-2">
          <Boton variante="secundario" deshabilitado={pagina <= 1} onClick={() => setPagina((valor) => valor - 1)}>Anterior</Boton>
          <Boton variante="secundario" deshabilitado={pagina * 20 >= total} onClick={() => setPagina((valor) => valor + 1)}>Siguiente</Boton>
        </div>
      </div>
    </div>
  );
}
