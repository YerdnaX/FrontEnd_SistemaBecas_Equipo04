function leerArchivoComoBase64(archivo) {
  return new Promise((resolver, rechazar) => {
    const lector = new FileReader();
    lector.onload = () => resolver(lector.result);
    lector.onerror = rechazar;
    lector.readAsDataURL(archivo);
  });
}

export default function CampoArchivo({ etiqueta, onArchivoListo, error }) {
  async function manejarCambio(evento) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;
    const contenidoBase64 = await leerArchivoComoBase64(archivo);
    onArchivoListo({ nombreArchivo: archivo.name, tipoMime: archivo.type, contenidoBase64 });
  }

  return (
    <label className="flex flex-col gap-1 text-body-sm">
      <span className="font-medium text-on-surface">{etiqueta}</span>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={manejarCambio}
        className="rounded-md border border-outline-variant bg-white px-3 py-2 text-body-sm"
      />
      {error && <span className="text-label-sm text-error">{error}</span>}
    </label>
  );
}
