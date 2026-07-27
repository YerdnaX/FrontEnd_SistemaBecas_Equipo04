import { useEffect, useState } from 'react';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import { listarMisSesiones, revocarMiSesion } from '../../servicios/servicioSeguridad.js';

export default function MisSesiones() {
  const [sesiones, setSesiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [revocando, setRevocando] = useState(null);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await listarMisSesiones();
      setSesiones(respuesta.datos);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function revocar(id) {
    setRevocando(id);
    try {
      await revocarMiSesion(id);
      await cargar();
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setRevocando(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-headline-lg font-semibold text-primary">Mis sesiones activas</h1>
      <p className="mt-1 text-body-sm text-on-surface-variant">
        Aquí puede ver desde dónde ha iniciado sesión y cerrar cualquiera que no reconozca.
      </p>

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}
      {cargando && <EstadoCarga />}
      {!cargando && sesiones.length === 0 && <EstadoVacio titulo="No hay sesiones activas" />}

      {!cargando && sesiones.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {sesiones.map((s) => (
            <Tarjeta key={s.IdSesion} className="flex items-center justify-between">
              <div>
                <p className="text-body-md">{s.AgenteUsuario || 'Dispositivo desconocido'}</p>
                <p className="text-body-sm text-on-surface-variant">
                  IP: {s.DireccionIp || '—'} · Iniciada: {new Date(s.FechaCreacion).toLocaleString()}
                </p>
              </div>
              <Boton variante="peligro" cargando={revocando === s.IdSesion} onClick={() => revocar(s.IdSesion)}>
                Cerrar sesión
              </Boton>
            </Tarjeta>
          ))}
        </div>
      )}
    </div>
  );
}
