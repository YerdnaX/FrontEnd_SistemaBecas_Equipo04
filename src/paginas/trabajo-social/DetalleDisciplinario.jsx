import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { obtenerInvestigacion, pasarAAnalisis, resolverInvestigacion } from '../../servicios/servicioDisciplinario.js';

export default function DetalleDisciplinario() {
  const { id } = useParams();
  const [investigacion, setInvestigacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [procesando, setProcesando] = useState(false);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await obtenerInvestigacion(id);
      setInvestigacion(respuesta.datos);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  async function ejecutar(accion) {
    setProcesando(true);
    setError(null);
    try {
      await accion();
      await cargar();
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) return <EstadoCarga />;
  if (!investigacion) return error ? <AlertaMensaje tipo="error">{error}</AlertaMensaje> : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg font-semibold text-primary">Proceso disciplinario #{investigacion.IdInvestigacion}</h1>
        <EtiquetaEstado estado={investigacion.Estado} />
      </div>

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}
      {mensaje && <div className="mt-4"><AlertaMensaje tipo="exito">{mensaje}</AlertaMensaje></div>}

      <Tarjeta className="mt-6">
        <p className="text-body-sm text-on-surface-variant">Becado</p>
        <p className="text-body-md">{investigacion.NombreBecado} {investigacion.ApellidoBecado}</p>
        <p className="mt-3 text-body-sm text-on-surface-variant">Causal</p>
        <p className="text-body-md">{investigacion.Causal}</p>
        {investigacion.FechaAnalisis && investigacion.Estado === 'EN_REVISION' && (
          <p className="mt-3 text-body-sm font-medium text-advertencia">En análisis desde {new Date(investigacion.FechaAnalisis).toLocaleString()}</p>
        )}
      </Tarjeta>

      <Tarjeta className="mt-6">
        <h2 className="text-headline-sm font-semibold text-on-surface">Descargos recibidos</h2>
        {(!investigacion.descargos || investigacion.descargos.length === 0) && (
          <p className="mt-2 text-body-sm text-on-surface-variant">Aún no se han presentado descargos.</p>
        )}
        <ul className="mt-3 flex flex-col gap-3">
          {investigacion.descargos?.map((descargo) => (
            <li key={descargo.IdDescargo} className="border-t border-outline-variant pt-3 text-body-sm">
              <p className="text-on-surface-variant">{new Date(descargo.FechaPresentacion).toLocaleString()}</p>
              <p className="whitespace-pre-wrap">{descargo.Detalle}</p>
            </li>
          ))}
        </ul>
      </Tarjeta>

      {investigacion.Estado === 'EN_REVISION' && !investigacion.FechaAnalisis && (
        <Tarjeta className="mt-6">
          <Boton onClick={() => ejecutar(() => pasarAAnalisis(id))} cargando={procesando}>
            Pasar a análisis
          </Boton>
        </Tarjeta>
      )}

      {investigacion.Estado === 'EN_REVISION' && (
        <Tarjeta className="mt-6">
          <h2 className="text-headline-sm font-semibold text-on-surface">Resolver proceso</h2>
          <div className="mt-3 flex flex-col gap-4">
            <CampoTexto etiqueta="Motivo de la resolución" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
            <div className="flex flex-wrap gap-3">
              <Boton variante="secundario" onClick={() => ejecutar(() => resolverInvestigacion(id, { resultado: 'MANTENER', motivo }))} cargando={procesando}>
                Mantener beca
              </Boton>
              <Boton variante="peligro" onClick={() => ejecutar(() => resolverInvestigacion(id, { resultado: 'SUSPENDER', motivo }))} cargando={procesando}>
                Suspender beca
              </Boton>
              <Boton variante="peligro" onClick={() => ejecutar(() => resolverInvestigacion(id, { resultado: 'CANCELAR', motivo }))} cargando={procesando}>
                Cancelar beca
              </Boton>
            </div>
          </div>
        </Tarjeta>
      )}
    </div>
  );
}
