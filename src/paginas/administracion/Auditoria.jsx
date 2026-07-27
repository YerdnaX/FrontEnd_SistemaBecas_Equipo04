import { useEffect, useState } from 'react';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import * as servicioSeguridad from '../../servicios/servicioSeguridad.js';

const PESTANAS = ['Auditoría', 'Eventos de seguridad', 'Sesiones activas'];

export default function Auditoria() {
  const [pestana, setPestana] = useState(0);
  const [error, setError] = useState(null);

  return (
    <div>
      <h1 className="text-headline-lg font-semibold text-primary">Auditoría y seguridad</h1>

      <div className="mt-4 flex gap-2 border-b border-outline-variant">
        {PESTANAS.map((titulo, indice) => (
          <button
            key={titulo}
            onClick={() => { setPestana(indice); setError(null); }}
            className={`px-4 py-2 text-body-sm font-medium ${pestana === indice ? 'border-b-2 border-primary-container text-primary-container' : 'text-on-surface-variant'}`}
          >
            {titulo}
          </button>
        ))}
      </div>

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}

      <div className="mt-6">
        {pestana === 0 && <TablaAuditoria onError={setError} />}
        {pestana === 1 && <TablaEventos onError={setError} />}
        {pestana === 2 && <TablaSesiones onError={setError} />}
      </div>
    </div>
  );
}

function TablaAuditoria({ onError }) {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const respuesta = await servicioSeguridad.listarAuditoria();
        setRegistros(respuesta.datos);
      } catch (err) { onError(err.mensaje); } finally { setCargando(false); }
    })();
  }, []);

  if (cargando) return <EstadoCarga />;
  if (registros.length === 0) return <EstadoVacio titulo="Sin registros de auditoría" />;

  return (
    <Tarjeta className="overflow-x-auto">
      <table className="w-full text-left text-body-sm">
        <thead className="bg-surface-container-low">
          <tr>
            <th className="px-3 py-2">Fecha</th>
            <th className="px-3 py-2">Usuario</th>
            <th className="px-3 py-2">Módulo</th>
            <th className="px-3 py-2">Acción</th>
            <th className="px-3 py-2">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((r) => (
            <tr key={r.IdAuditoria} className="border-t border-outline-variant">
              <td className="px-3 py-2">{new Date(r.Fecha).toLocaleString()}</td>
              <td className="px-3 py-2">{r.CorreoUsuario || 'sistema'}</td>
              <td className="px-3 py-2">{r.Modulo}</td>
              <td className="px-3 py-2">{r.Accion}</td>
              <td className="px-3 py-2 text-on-surface-variant">{r.Detalle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Tarjeta>
  );
}

function TablaEventos({ onError }) {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const respuesta = await servicioSeguridad.listarEventosSeguridad();
        setEventos(respuesta.datos);
      } catch (err) { onError(err.mensaje); } finally { setCargando(false); }
    })();
  }, []);

  if (cargando) return <EstadoCarga />;
  if (eventos.length === 0) return <EstadoVacio titulo="Sin eventos de seguridad" />;

  return (
    <Tarjeta className="overflow-x-auto">
      <table className="w-full text-left text-body-sm">
        <thead className="bg-surface-container-low">
          <tr>
            <th className="px-3 py-2">Fecha</th>
            <th className="px-3 py-2">Usuario</th>
            <th className="px-3 py-2">Tipo</th>
            <th className="px-3 py-2">Nivel</th>
            <th className="px-3 py-2">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((ev) => (
            <tr key={ev.IdEvento} className="border-t border-outline-variant">
              <td className="px-3 py-2">{new Date(ev.Fecha).toLocaleString()}</td>
              <td className="px-3 py-2">{ev.CorreoUsuario || '—'}</td>
              <td className="px-3 py-2">{ev.TipoEvento}</td>
              <td className="px-3 py-2">{ev.Nivel}</td>
              <td className="px-3 py-2 text-on-surface-variant">{ev.Descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Tarjeta>
  );
}

function TablaSesiones({ onError }) {
  const [sesiones, setSesiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [revocando, setRevocando] = useState(null);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await servicioSeguridad.listarSesionesActivas();
      setSesiones(respuesta.datos);
    } catch (err) { onError(err.mensaje); } finally { setCargando(false); }
  }

  useEffect(() => { cargar(); }, []);

  async function revocar(id) {
    setRevocando(id);
    try {
      await servicioSeguridad.revocarSesionAdmin(id);
      await cargar();
    } catch (err) { onError(err.mensaje); } finally { setRevocando(null); }
  }

  if (cargando) return <EstadoCarga />;
  if (sesiones.length === 0) return <EstadoVacio titulo="No hay sesiones activas" />;

  return (
    <Tarjeta className="overflow-x-auto">
      <table className="w-full text-left text-body-sm">
        <thead className="bg-surface-container-low">
          <tr>
            <th className="px-3 py-2">Usuario</th>
            <th className="px-3 py-2">IP</th>
            <th className="px-3 py-2">Creada</th>
            <th className="px-3 py-2">Expira</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {sesiones.map((s) => (
            <tr key={s.IdSesion} className="border-t border-outline-variant">
              <td className="px-3 py-2">{s.Correo}</td>
              <td className="px-3 py-2">{s.DireccionIp || '—'}</td>
              <td className="px-3 py-2">{new Date(s.FechaCreacion).toLocaleString()}</td>
              <td className="px-3 py-2">{new Date(s.FechaVencimiento).toLocaleString()}</td>
              <td className="px-3 py-2">
                <Boton variante="peligro" cargando={revocando === s.IdSesion} onClick={() => revocar(s.IdSesion)}>
                  Revocar
                </Boton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Tarjeta>
  );
}
