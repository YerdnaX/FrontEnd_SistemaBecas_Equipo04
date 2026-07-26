import { useEffect, useState } from 'react';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import * as servicio from '../../servicios/servicioConfiguracion.js';

const PESTANAS = ['Correo', 'Plantillas', 'Parámetros', 'Catálogo de documentos'];

export default function ConfiguracionSistema() {
  const [pestana, setPestana] = useState(0);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  function notificarError(err) { setError(err.mensaje); setMensaje(null); }
  function notificarExito(texto) { setMensaje(texto); setError(null); }

  return (
    <div>
      <h1 className="text-headline-lg font-semibold text-primary">Configuración del sistema</h1>

      <div className="mt-4 flex gap-2 border-b border-outline-variant">
        {PESTANAS.map((titulo, indice) => (
          <button
            key={titulo}
            onClick={() => { setPestana(indice); setError(null); setMensaje(null); }}
            className={`px-4 py-2 text-body-sm font-medium ${pestana === indice ? 'border-b-2 border-primary-container text-primary-container' : 'text-on-surface-variant'}`}
          >
            {titulo}
          </button>
        ))}
      </div>

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}
      {mensaje && <div className="mt-4"><AlertaMensaje tipo="exito">{mensaje}</AlertaMensaje></div>}

      <div className="mt-6">
        {pestana === 0 && <SeccionCorreo onError={notificarError} onExito={notificarExito} />}
        {pestana === 1 && <SeccionPlantillas onError={notificarError} onExito={notificarExito} />}
        {pestana === 2 && <SeccionParametros onError={notificarError} onExito={notificarExito} />}
        {pestana === 3 && <SeccionCatalogo onError={notificarError} onExito={notificarExito} />}
      </div>
    </div>
  );
}

function SeccionCorreo({ onError, onExito }) {
  const [estado, setEstado] = useState(null);
  const [nombreRemitente, setNombreRemitente] = useState('');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await servicio.obtenerEstadoCorreo();
      setEstado(respuesta.datos);
      setNombreRemitente(respuesta.datos.nombreRemitente);
    } catch (err) { onError(err); } finally { setCargando(false); }
  }

  useEffect(() => { cargar(); }, []);

  async function guardar() {
    setProcesando(true);
    try {
      await servicio.actualizarNombreRemitente(nombreRemitente);
      onExito('Nombre de remitente actualizado.');
      await cargar();
    } catch (err) { onError(err); } finally { setProcesando(false); }
  }

  async function reintentar() {
    setProcesando(true);
    try {
      const respuesta = await servicio.reintentarCorreosFallidos();
      onExito(`Reintento ejecutado: ${respuesta.datos.exitosos} exitosos, ${respuesta.datos.fallidos} siguen fallidos.`);
    } catch (err) { onError(err); } finally { setProcesando(false); }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <Tarjeta>
      <AlertaMensaje tipo={estado.smtpConfigurado ? 'exito' : 'advertencia'}>
        {estado.smtpConfigurado
          ? `SMTP configurado. Remitente: ${estado.remitente}`
          : 'SMTP no configurado en variables de entorno. Los correos solo quedarán registrados, sin enviarse.'}
      </AlertaMensaje>

      <div className="mt-4 flex items-end gap-3">
        <CampoTexto etiqueta="Nombre visible del remitente" value={nombreRemitente} onChange={(e) => setNombreRemitente(e.target.value)} className="max-w-xs" />
        <Boton onClick={guardar} cargando={procesando}>Guardar</Boton>
      </div>

      <div className="mt-6 border-t border-outline-variant pt-4">
        <p className="text-body-sm text-on-surface-variant">Reintentar correos que quedaron marcados como fallidos.</p>
        <Boton variante="secundario" className="mt-2" onClick={reintentar} cargando={procesando}>Reintentar envíos fallidos</Boton>
      </div>
    </Tarjeta>
  );
}

function SeccionPlantillas({ onError, onExito }) {
  const [plantillas, setPlantillas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await servicio.listarPlantillas();
      setPlantillas(respuesta.datos);
    } catch (err) { onError(err); } finally { setCargando(false); }
  }

  useEffect(() => { cargar(); }, []);

  async function guardar() {
    setGuardando(true);
    try {
      await servicio.actualizarPlantilla(seleccionada.Codigo, {
        asunto: seleccionada.Asunto, contenido: seleccionada.Contenido, activo: seleccionada.Activo
      });
      onExito('Plantilla actualizada.');
      await cargar();
    } catch (err) { onError(err); } finally { setGuardando(false); }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Tarjeta>
        <h2 className="text-headline-sm font-semibold text-on-surface">Plantillas</h2>
        <ul className="mt-3 flex flex-col gap-1">
          {plantillas.map((p) => (
            <li key={p.Codigo}>
              <button
                onClick={() => setSeleccionada(p)}
                className={`w-full rounded-md px-3 py-2 text-left text-body-sm ${seleccionada?.Codigo === p.Codigo ? 'bg-primary-container text-on-primary' : 'hover:bg-surface-container-low'}`}
              >
                {p.Codigo} {!p.Activo && '(inactiva)'}
              </button>
            </li>
          ))}
        </ul>
      </Tarjeta>

      {seleccionada && (
        <Tarjeta>
          <CampoTexto etiqueta="Asunto" value={seleccionada.Asunto} onChange={(e) => setSeleccionada({ ...seleccionada, Asunto: e.target.value })} />
          <label className="mt-3 flex flex-col gap-1 text-body-sm">
            <span className="font-medium text-on-surface">Contenido (HTML, use {'{{variable}}'})</span>
            <textarea
              rows={8}
              value={seleccionada.Contenido}
              onChange={(e) => setSeleccionada({ ...seleccionada, Contenido: e.target.value })}
              className="rounded-md border border-outline-variant px-3 py-2 font-mono text-label-sm outline-none focus:border-primary-container"
            />
          </label>
          <label className="mt-3 flex items-center gap-2 text-body-sm">
            <input type="checkbox" checked={Boolean(seleccionada.Activo)} onChange={(e) => setSeleccionada({ ...seleccionada, Activo: e.target.checked })} />
            Activa
          </label>
          <Boton className="mt-4" onClick={guardar} cargando={guardando}>Guardar plantilla</Boton>
        </Tarjeta>
      )}
    </div>
  );
}

function SeccionParametros({ onError, onExito }) {
  const [parametros, setParametros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardandoClave, setGuardandoClave] = useState(null);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await servicio.listarParametros();
      setParametros(respuesta.datos);
    } catch (err) { onError(err); } finally { setCargando(false); }
  }

  useEffect(() => { cargar(); }, []);

  function actualizarValorLocal(clave, valor) {
    setParametros((actuales) => actuales.map((p) => (p.Clave === clave ? { ...p, Valor: valor } : p)));
  }

  async function guardar(clave, valor) {
    setGuardandoClave(clave);
    try {
      await servicio.actualizarParametro(clave, valor);
      onExito(`Parámetro ${clave} actualizado.`);
    } catch (err) { onError(err); } finally { setGuardandoClave(null); }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <Tarjeta>
      <div className="flex flex-col gap-4">
        {parametros.map((p) => (
          <div key={p.Clave} className="flex items-end gap-3 border-b border-outline-variant pb-3 last:border-b-0">
            <CampoTexto
              etiqueta={`${p.Clave}${p.Descripcion ? ` — ${p.Descripcion}` : ''}`}
              value={p.Valor}
              onChange={(e) => actualizarValorLocal(p.Clave, e.target.value)}
              className="max-w-md"
            />
            <Boton variante="secundario" onClick={() => guardar(p.Clave, p.Valor)} cargando={guardandoClave === p.Clave}>
              Guardar
            </Boton>
          </div>
        ))}
      </div>
    </Tarjeta>
  );
}

function SeccionCatalogo({ onError, onExito }) {
  const [tipos, setTipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevo, setNuevo] = useState({ codigo: '', nombre: '', descripcion: '' });
  const [creando, setCreando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await servicio.listarTiposDocumento();
      setTipos(respuesta.datos);
    } catch (err) { onError(err); } finally { setCargando(false); }
  }

  useEffect(() => { cargar(); }, []);

  async function crear(evento) {
    evento.preventDefault();
    setCreando(true);
    try {
      await servicio.crearTipoDocumento(nuevo);
      setNuevo({ codigo: '', nombre: '', descripcion: '' });
      onExito('Tipo de documento creado.');
      await cargar();
    } catch (err) { onError(err); } finally { setCreando(false); }
  }

  async function alternarActivo(tipo) {
    try {
      await servicio.actualizarTipoDocumento(tipo.IdTipoDocumento, { nombre: tipo.Nombre, descripcion: tipo.Descripcion, activo: !tipo.Activo });
      await cargar();
    } catch (err) { onError(err); }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Tarjeta>
        <h2 className="text-headline-sm font-semibold text-on-surface">Tipos de documento</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {tipos.map((tipo) => (
            <li key={tipo.IdTipoDocumento} className="flex items-center justify-between border-b border-outline-variant pb-2 text-body-sm">
              <span>{tipo.Nombre} {!tipo.Activo && '(inactivo)'}</span>
              <Boton variante="texto" onClick={() => alternarActivo(tipo)}>{tipo.Activo ? 'Desactivar' : 'Activar'}</Boton>
            </li>
          ))}
        </ul>
      </Tarjeta>

      <Tarjeta>
        <h2 className="text-headline-sm font-semibold text-on-surface">Nuevo tipo de documento</h2>
        <form onSubmit={crear} className="mt-3 flex flex-col gap-3">
          <CampoTexto etiqueta="Código" required value={nuevo.codigo} onChange={(e) => setNuevo({ ...nuevo, codigo: e.target.value })} />
          <CampoTexto etiqueta="Nombre" required value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
          <CampoTexto etiqueta="Descripción" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
          <Boton type="submit" cargando={creando}>Crear</Boton>
        </form>
      </Tarjeta>
    </div>
  );
}
