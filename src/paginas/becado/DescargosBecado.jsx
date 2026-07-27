import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { obtenerInvestigacion, presentarDescargo } from '../../servicios/servicioDisciplinario.js';

export default function DescargosBecado() {
  const { id } = useParams();
  const [investigacion, setInvestigacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [detalle, setDetalle] = useState('');
  const [enviando, setEnviando] = useState(false);

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

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await presentarDescargo(id, { detalle });
      setDetalle('');
      await cargar();
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) return <EstadoCarga />;
  if (!investigacion) return error ? <AlertaMensaje tipo="error">{error}</AlertaMensaje> : null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg font-semibold text-primary">Proceso de revisión #{investigacion.IdInvestigacion}</h1>
        <EtiquetaEstado estado={investigacion.Estado} />
      </div>

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}

      <Tarjeta className="mt-6">
        <p className="text-body-sm text-on-surface-variant">Causal</p>
        <p className="text-body-md">{investigacion.Causal}</p>
        {investigacion.Descripcion && (
          <>
            <p className="mt-3 text-body-sm text-on-surface-variant">Descripción</p>
            <p className="whitespace-pre-wrap text-body-md">{investigacion.Descripcion}</p>
          </>
        )}
      </Tarjeta>

      {investigacion.Estado === 'EN_DESCARGOS' && (
        <Tarjeta className="mt-6">
          <h2 className="text-headline-sm font-semibold text-on-surface">Presentar descargos</h2>
          <form onSubmit={enviar} className="mt-3 flex flex-col gap-4">
            <textarea
              required
              minLength={10}
              rows={6}
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              className="rounded-md border border-outline-variant px-3 py-2 text-body-md outline-none focus:border-primary-container"
              placeholder="Explique su situación en relación con la causal indicada..."
            />
            <Boton type="submit" cargando={enviando}>Enviar descargos</Boton>
          </form>
        </Tarjeta>
      )}

      {investigacion.descargos?.length > 0 && (
        <Tarjeta className="mt-6">
          <h2 className="text-headline-sm font-semibold text-on-surface">Descargos presentados</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {investigacion.descargos.map((descargo) => (
              <li key={descargo.IdDescargo} className="border-t border-outline-variant pt-3 text-body-sm">
                <p className="text-on-surface-variant">{new Date(descargo.FechaPresentacion).toLocaleString()}</p>
                <p className="whitespace-pre-wrap">{descargo.Detalle}</p>
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}
    </div>
  );
}
