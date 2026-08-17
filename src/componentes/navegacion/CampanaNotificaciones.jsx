import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarNotificaciones, marcarNotificacionLeida, marcarTodasLeidas } from '../../servicios/servicioNotificaciones.js';

export default function CampanaNotificaciones() {
  const [abierta, setAbierta] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

  async function cargar() {
    const respuesta = await listarNotificaciones().catch(() => null);
    if (respuesta) setNotificaciones(respuesta.datos);
  }

  useEffect(() => { cargar(); }, []);
  const pendientes = notificaciones.filter((notificacion) => !notificacion.Leida).length;

  async function leer(notificacion) {
    if (!notificacion.Leida) await marcarNotificacionLeida(notificacion.IdNotificacion);
    setAbierta(false);
    cargar();
  }

  async function leerTodas() {
    await marcarTodasLeidas();
    cargar();
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => setAbierta((valor) => !valor)} className="relative rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface" aria-label="Notificaciones">
        <span aria-hidden="true">🔔</span>
        {pendientes > 0 && <span className="absolute right-0 top-0 rounded-full bg-error px-1 text-[10px] font-semibold text-on-error">{pendientes}</span>}
      </button>
      {abierta && (
        <div className="anim-pop absolute right-0 mt-2 w-80 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-high text-on-surface shadow-elevation-l3">
          <div className="flex items-center justify-between border-b border-outline-variant p-3">
            <strong>Notificaciones</strong>
            <button type="button" className="text-label-sm text-primary" onClick={leerTodas}>Leer todas</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notificaciones.slice(0, 8).map((notificacion) => (
              <Link
                key={notificacion.IdNotificacion}
                to={notificacion.Enlace || '#'}
                onClick={() => leer(notificacion)}
                className={`block border-b border-outline-variant px-3 py-2 text-body-sm hover:bg-surface-container-highest ${notificacion.Leida ? '' : 'bg-primary-container/15'}`}
              >
                <span className="block font-semibold">{notificacion.Titulo}</span>
                <span className="line-clamp-2 text-on-surface-variant">{notificacion.Mensaje}</span>
              </Link>
            ))}
            {notificaciones.length === 0 && <p className="p-4 text-center text-body-sm text-on-surface-variant">No hay notificaciones.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

