import { useState } from 'react';
import { useLimitesArchivo } from '../../hooks/useLimitesArchivo.js';
import { formatearTamanoArchivo } from '../../utilidades/formato.js';

function leerArchivoComoBase64(archivo) {
  return new Promise((resolver, rechazar) => {
    const lector = new FileReader();
    lector.onload = () => resolver(lector.result);
    lector.onerror = rechazar;
    lector.readAsDataURL(archivo);
  });
}

export default function CampoArchivo({ etiqueta, onArchivoListo, error }) {
  const { tamanoMaximoMb, extensionesPermitidas } = useLimitesArchivo();
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [errorLocal, setErrorLocal] = useState(null);

  const tamanoMaximoBytes = tamanoMaximoMb * 1024 * 1024;
  const aceptar = extensionesPermitidas.map((ext) => `.${ext}`).join(',');

  async function manejarCambio(evento) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;
    setErrorLocal(null);

    const extension = archivo.name.split('.').pop()?.toLowerCase();
    if (!extension || !extensionesPermitidas.includes(extension)) {
      setArchivoSeleccionado(null);
      setErrorLocal(`Extensiones permitidas: ${extensionesPermitidas.join(', ')}.`);
      evento.target.value = '';
      return;
    }

    if (archivo.size > tamanoMaximoBytes) {
      setArchivoSeleccionado({ nombre: archivo.name, tamano: archivo.size, excede: true });
      setErrorLocal(
        `El archivo pesa ${formatearTamanoArchivo(archivo.size)}, supera el máximo permitido de ${tamanoMaximoMb} MB.`
      );
      evento.target.value = '';
      return;
    }

    setArchivoSeleccionado({ nombre: archivo.name, tamano: archivo.size, excede: false });
    const contenidoBase64 = await leerArchivoComoBase64(archivo);
    onArchivoListo({ nombreArchivo: archivo.name, tipoMime: archivo.type, contenidoBase64 });
  }

  return (
    <label className="flex flex-col gap-1 text-body-sm">
      <span className="font-medium text-on-surface">{etiqueta}</span>
      <span className="text-label-sm text-on-surface-variant">
        Tamaño máximo por archivo: <strong>{tamanoMaximoMb} MB</strong> · Formatos: {extensionesPermitidas.join(', ').toUpperCase()}
      </span>
      <input
        type="file"
        accept={aceptar}
        onChange={manejarCambio}
        className="rounded-md border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface file:mr-3 file:rounded-md file:border-0 file:bg-primary-container file:px-3 file:py-1.5 file:text-label-sm file:font-semibold file:text-on-primary-container"
      />
      {archivoSeleccionado && (
        <span className={`text-label-sm ${archivoSeleccionado.excede ? 'text-error font-semibold' : 'text-on-surface-variant'}`}>
          {archivoSeleccionado.nombre} — Tamaño del archivo: {formatearTamanoArchivo(archivoSeleccionado.tamano)} de un máximo de {tamanoMaximoMb} MB
        </span>
      )}
      {(error || errorLocal) && <span className="text-label-sm text-error">{error || errorLocal}</span>}
    </label>
  );
}
