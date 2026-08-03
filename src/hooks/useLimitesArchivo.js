import { useEffect, useState } from 'react';
import { obtenerLimitesArchivo } from '../servicios/servicioPublico.js';

const VALOR_POR_DEFECTO = { tamanoMaximoMb: 8, extensionesPermitidas: ['pdf', 'jpg', 'jpeg', 'png'] };

// Cachea la única petición de límites entre todas las instancias de campo de
// archivo de la página (una solicitud puede renderizar varios a la vez, uno
// por requisito), para no repetir la llamada por cada campo.
let promesaCompartida = null;

/**
 * Límite máximo de tamaño y extensiones permitidas para archivos, tal como
 * los define el backend (única fuente de verdad, ver
 * BackEnd/src/configuracion/variablesEntorno.js). Evita que frontend y
 * backend queden con valores distintos.
 */
export function useLimitesArchivo() {
  const [limites, setLimites] = useState(VALOR_POR_DEFECTO);

  useEffect(() => {
    if (!promesaCompartida) {
      promesaCompartida = obtenerLimitesArchivo().then((respuesta) => respuesta.datos).catch(() => VALOR_POR_DEFECTO);
    }
    let activo = true;
    promesaCompartida.then((datos) => { if (activo) setLimites(datos); });
    return () => { activo = false; };
  }, []);

  return limites;
}
