import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PasosSolicitud from '../../componentes/formularios/PasosSolicitud.jsx';
import CampoArchivo from '../../componentes/formularios/CampoArchivo.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { obtenerSolicitud, listarDocumentos, cargarDocumento, eliminarDocumento } from '../../servicios/servicioSolicitudes.js';
import { obtenerConvocatoria } from '../../servicios/servicioConvocatorias.js';

export default function CargaDocumental() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [requisitos, setRequisitos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [archivosPendientes, setArchivosPendientes] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [subiendoRequisito, setSubiendoRequisito] = useState(null);

  async function cargar() {
    setCargando(true);
    try {
      const solicitud = await obtenerSolicitud(id);
      const [convocatoria, docs] = await Promise.all([
        obtenerConvocatoria(solicitud.datos.IdConvocatoria),
        listarDocumentos(id)
      ]);
      setRequisitos(convocatoria.datos.requisitos);
      setDocumentos(docs.datos);
    } catch (err) {
      setError(err.mensaje || 'No fue posible cargar los documentos.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  async function subirDocumento(idRequisito) {
    const archivo = archivosPendientes[idRequisito];
    if (!archivo) return;
    setSubiendoRequisito(idRequisito);
    setError(null);
    try {
      await cargarDocumento(id, { idRequisito, ...archivo });
      await cargar();
    } catch (err) {
      setError(err.mensaje || 'No fue posible cargar el archivo.');
    } finally {
      setSubiendoRequisito(null);
    }
  }

  async function manejarEliminar(idDocumento) {
    await eliminarDocumento(id, idDocumento).catch((err) => setError(err.mensaje));
    await cargar();
  }

  if (cargando) return <EstadoCarga />;

  return (
    <div>
      <PasosSolicitud pasoActual="documentos" />
      <Tarjeta>
        <h1 className="text-headline-sm font-semibold text-primary">Documentos requeridos</h1>
        {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}

        <div className="mt-6 flex flex-col gap-4">
          {requisitos.map((requisito) => {
            const documento = documentos.find((d) => d.IdRequisito === requisito.IdRequisito);
            return (
              <div key={requisito.IdRequisito} className="rounded-md border border-outline-variant p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-on-surface">
                    {requisito.Nombre} {requisito.Obligatorio ? '(obligatorio)' : '(opcional)'}
                  </p>
                  {documento && <EtiquetaEstado estado={documento.Estado} />}
                </div>
                {requisito.Descripcion && <p className="mt-1 text-body-sm text-on-surface-variant">{requisito.Descripcion}</p>}

                {documento ? (
                  <div className="mt-3 flex items-center justify-between rounded bg-surface-container-low px-3 py-2 text-body-sm">
                    <span>{documento.NombreOriginal}</span>
                    <button className="text-error hover:underline" onClick={() => manejarEliminar(documento.IdDocumentoSolicitud)}>
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
                    <CampoArchivo
                      etiqueta="Seleccionar archivo (PDF, JPG o PNG)"
                      onArchivoListo={(archivo) => setArchivosPendientes((actual) => ({ ...actual, [requisito.IdRequisito]: archivo }))}
                    />
                    <Boton
                      type="button"
                      cargando={subiendoRequisito === requisito.IdRequisito}
                      deshabilitado={!archivosPendientes[requisito.IdRequisito]}
                      onClick={() => subirDocumento(requisito.IdRequisito)}
                    >
                      Cargar
                    </Boton>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <Boton onClick={() => navegar(`/aspirante/solicitudes/${id}/revision`)}>Continuar a revisión</Boton>
        </div>
      </Tarjeta>
    </div>
  );
}
