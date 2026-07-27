import { useState } from 'react';

export default function SelectorArchivoBase64({ etiqueta = 'Documento de respaldo', onChange }) {
  const [nombre, setNombre] = useState('');

  function leer(evento) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => {
      setNombre(archivo.name);
      onChange({
        nombreArchivo: archivo.name,
        tipoMime: archivo.type,
        contenidoBase64: lector.result
      });
    };
    lector.readAsDataURL(archivo);
  }

  return (
    <label className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low p-6 text-center">
      <span className="font-semibold text-primary">{etiqueta}</span>
      <span className="mt-1 text-body-sm text-on-surface-variant">{nombre || 'PDF, JPG o PNG'}</span>
      <input className="sr-only" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={leer} />
    </label>
  );
}

