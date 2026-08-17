import { useEffect, useState } from 'react';
import Boton from '../../componentes/comunes/Boton.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import * as servicioSeguridad from '../../servicios/servicioSeguridad.js';

const PESTANAS = ['Auditoría', 'Eventos de seguridad', 'Sesiones activas'];

export default function Auditoria() {
  const [pestana, setPestana] = useState(0);
  const [error, setError] = useState(null);

  return (
    <div>
      <h1 className="text-headline-lg font-semibold text-on-surface">Auditoría y seguridad</h1>

      <div className="mt-4 flex gap-2" role="tablist" aria-label="Auditoría y seguridad">
        {PESTANAS.map((titulo, indice) => (
          <button
            key={titulo}
            role="tab"
            aria-selected={pestana === indice}
            onClick={() => { setPestana(indice); setError(null); }}
            className={`rounded-md px-4 py-2 text-body-sm font-medium transition ${pestana === indice ? 'bg-primary-container text-on-primary-container' : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'}`}
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

  return (
    <TablaDatos
      clave="IdAuditoria"
      textoVacio="Sin registros de auditoría"
      filas={registros}
      columnas={[
        { clave: 'Fecha', etiqueta: 'Fecha', render: (r) => new Date(r.Fecha).toLocaleString() },
        { clave: 'Usuario', etiqueta: 'Usuario', render: (r) => r.CorreoUsuario || 'sistema' },
        { clave: 'Modulo', etiqueta: 'Módulo' },
        { clave: 'Accion', etiqueta: 'Acción' },
        { clave: 'Detalle', etiqueta: 'Detalle', render: (r) => <span className="text-on-surface-variant">{r.Detalle}</span> }
      ]}
    />
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

  return (
    <TablaDatos
      clave="IdEvento"
      textoVacio="Sin eventos de seguridad"
      filas={eventos}
      columnas={[
        { clave: 'Fecha', etiqueta: 'Fecha', render: (ev) => new Date(ev.Fecha).toLocaleString() },
        { clave: 'Usuario', etiqueta: 'Usuario', render: (ev) => ev.CorreoUsuario || '—' },
        { clave: 'TipoEvento', etiqueta: 'Tipo' },
        { clave: 'Nivel', etiqueta: 'Nivel' },
        { clave: 'Descripcion', etiqueta: 'Descripción', render: (ev) => <span className="text-on-surface-variant">{ev.Descripcion}</span> }
      ]}
    />
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

  return (
    <TablaDatos
      clave="IdSesion"
      textoVacio="No hay sesiones activas"
      filas={sesiones}
      columnas={[
        { clave: 'Correo', etiqueta: 'Usuario' },
        { clave: 'DireccionIp', etiqueta: 'IP', render: (s) => s.DireccionIp || '—' },
        { clave: 'FechaCreacion', etiqueta: 'Creada', render: (s) => new Date(s.FechaCreacion).toLocaleString() },
        { clave: 'FechaVencimiento', etiqueta: 'Expira', render: (s) => new Date(s.FechaVencimiento).toLocaleString() },
        {
          clave: 'acciones',
          etiqueta: '',
          render: (s) => (
            <Boton variante="peligro" cargando={revocando === s.IdSesion} onClick={() => revocar(s.IdSesion)}>
              Revocar
            </Boton>
          )
        }
      ]}
    />
  );
}
