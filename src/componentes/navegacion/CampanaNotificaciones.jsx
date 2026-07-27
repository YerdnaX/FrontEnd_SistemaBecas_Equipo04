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
      <button type="button" onClick={() => setAbierta((valor) => !valor)} className="relative rounded-full p-2 hover:bg-white/10" aria-label="Notificaciones">
        <span aria-hidden="true">🔔</span>
        {pendientes > 0 && <span className="absolute right-0 top-0 rounded-full bg-error px-1 text-[10px] text-white">{pendientes}</span>}
      </button>
      {abierta && (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-lg border border-outline-variant bg-white text-on-surface shadow-elevation-l3">
          <div className="flex items-center justify-between border-b p-3">
            <strong>Notificaciones</strong>
            <button type="button" className="text-label-sm text-primary-container" onClick={leerTodas}>Leer todas</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notificaciones.slice(0, 8).map((notificacion) => (
              <Link
                key={notificacion.IdNotificacion}
                to={notificacion.Enlace || '#'}
                onClick={() => leer(notificacion)}
                className={`block border-b px-3 py-2 text-body-sm hover:bg-surface-container ${notificacion.Leida ? '' : 'bg-primary-fixed/40'}`}
              >
                <span className="block font-semibold">{notificacion.Titulo}</span>
                <span className="line-clamp-2 text-on-surface-variant">{notificacion.Mensaje}</span>
              </Link>
            ))}
            {notificaciones.length === 0 && <p className="p-4 text-center text-body-sm">No hay notificaciones.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

