import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PasosSolicitud from '../../componentes/formularios/PasosSolicitud.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { validarSolicitud, enviarSolicitud } from '../../servicios/servicioSolicitudes.js';

const ETIQUETAS_SECCION = {
  datosPersonales: 'Datos personales',
  datosAcademicos: 'Datos académicos',
  datosSocioeconomicos: 'Datos socioeconómicos'
};

export default function RevisionEnvioSolicitud() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [validacion, setValidacion] = useState(null);
  const [estadoSolicitud, setEstadoSolicitud] = useState('BORRADOR');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [declaraVeracidad, setDeclaraVeracidad] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await validarSolicitud(id);
      setValidacion(respuesta.datos);
      setEstadoSolicitud(respuesta.datos.estadoSolicitud || 'BORRADOR');
    } catch (err) {
      setError(err.mensaje || 'No fue posible validar la solicitud.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  async function manejarEnvio() {
    setError(null);
    setEnviando(true);
    try {
      await enviarSolicitud(id);
      navegar(`/aspirante/solicitudes/${id}/resultado`);
    } catch (err) {
      setError(err.mensaje || 'No fue posible enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <div>
      <PasosSolicitud pasoActual="revision" estadoSolicitud={estadoSolicitud} />
      <Tarjeta>
        <h1 className="text-headline-sm font-semibold text-on-surface">Revisión final</h1>

        {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}

        {validacion?.estadoSolicitud !== 'BORRADOR' ? (
          <AlertaMensaje tipo="info" titulo="Solicitud ya enviada">
            Esta solicitud ya fue enviada y no puede modificarse.
          </AlertaMensaje>
        ) : (
          <>
            <div className="mt-6 flex flex-col gap-2">
              {Object.entries(validacion.secciones).map(([clave, completa]) => (
                <div key={clave} className={`flex items-center justify-between rounded-md border px-4 py-2 ${completa ? 'border-exito' : 'border-error'}`}>
                  <span>{ETIQUETAS_SECCION[clave]}</span>
                  <span className={completa ? 'text-exito' : 'text-error'}>{completa ? 'Completa' : 'Incompleta'}</span>
                </div>
              ))}
            </div>

            {validacion.documentosFaltantes.length > 0 && (
              <div className="mt-4">
                <AlertaMensaje tipo="advertencia" titulo="Documentos faltantes">
                  <ul className="list-disc pl-5">
                    {validacion.documentosFaltantes.map((nombre) => <li key={nombre}>{nombre}</li>)}
                  </ul>
                </AlertaMensaje>
              </div>
            )}

            <label className="mt-6 flex items-center gap-2 text-body-sm">
              <input type="checkbox" checked={declaraVeracidad} onChange={(e) => setDeclaraVeracidad(e.target.checked)} />
              Declaro que la información suministrada es veraz y completa.
            </label>

            <div className="mt-6">
              <Boton
                onClick={manejarEnvio}
                cargando={enviando}
                deshabilitado={!validacion.completa || !declaraVeracidad}
              >
                Enviar solicitud
              </Boton>
            </div>
          </>
        )}
      </Tarjeta>
    </div>
  );
}
