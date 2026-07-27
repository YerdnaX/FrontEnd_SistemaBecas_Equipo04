function crearUrlTemporal(archivo) {
  const [, contenido = ''] = archivo.contenidoBase64.split(',');
  const binario = atob(contenido);
  const bytes = new Uint8Array(binario.length);
  for (let indice = 0; indice < binario.length; indice += 1) {
    bytes[indice] = binario.charCodeAt(indice);
  }
  return URL.createObjectURL(new Blob([bytes], { type: archivo.tipoMime }));
}

export function abrirArchivo(archivo, ventana = null) {
  const destino = ventana || window.open('', '_blank');
  if (!destino) {
    descargarArchivo(archivo);
    return;
  }
  const url = crearUrlTemporal(archivo);
  destino.location.href = url;
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export function descargarArchivo(archivo) {
  const url = crearUrlTemporal(archivo);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = archivo.nombreOriginal || 'archivo';
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
