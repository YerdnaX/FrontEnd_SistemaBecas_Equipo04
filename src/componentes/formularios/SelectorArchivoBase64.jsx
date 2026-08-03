import { useState } from 'react';
import { useLimitesArchivo } from '../../hooks/useLimitesArchivo.js';
import { formatearTamanoArchivo } from '../../utilidades/formato.js';

export default function SelectorArchivoBase64({ etiqueta = 'Documento de respaldo', onChange }) {
  const { tamanoMaximoMb, extensionesPermitidas } = useLimitesArchivo();
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState(null);

  const tamanoMaximoBytes = tamanoMaximoMb * 1024 * 1024;
  const aceptar = extensionesPermitidas.map((ext) => `.${ext}`).join(',');

  function leer(evento) {
    const seleccionado = evento.target.files?.[0];
    if (!seleccionado) return;
    setError(null);

    const extension = seleccionado.name.split('.').pop()?.toLowerCase();
    if (!extension || !extensionesPermitidas.includes(extension)) {
      setArchivo(null);
      setError(`Extensiones permitidas: ${extensionesPermitidas.join(', ')}.`);
      evento.target.value = '';
      return;
    }

    if (seleccionado.size > tamanoMaximoBytes) {
      setArchivo({ nombre: seleccionado.name, tamano: seleccionado.size, excede: true });
      setError(`El archivo pesa ${formatearTamanoArchivo(seleccionado.size)}, supera el máximo permitido de ${tamanoMaximoMb} MB.`);
      evento.target.value = '';
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      setArchivo({ nombre: seleccionado.name, tamano: seleccionado.size, excede: false });
      onChange({
        nombreArchivo: seleccionado.name,
        tipoMime: seleccionado.type,
        contenidoBase64: lector.result
      });
    };
    lector.readAsDataURL(seleccionado);
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low p-6 text-center">
        <span className="font-semibold text-primary">{etiqueta}</span>
        <span className="mt-1 text-body-sm text-on-surface-variant">
          {archivo ? archivo.nombre : `${extensionesPermitidas.join(', ').toUpperCase()} · máximo ${tamanoMaximoMb} MB`}
        </span>
        <input className="sr-only" type="file" accept={aceptar} onChange={leer} />
      </label>
      {archivo && !archivo.excede && (
        <span className="text-label-sm text-on-surface-variant">
          Tamaño del archivo: {formatearTamanoArchivo(archivo.tamano)} de un máximo de {tamanoMaximoMb} MB
        </span>
      )}
      {error && <span className="text-label-sm text-error">{error}</span>}
    </div>
  );
}
