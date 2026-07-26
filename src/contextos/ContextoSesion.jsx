import { createContext, useCallback, useEffect, useState } from 'react';
import {
  iniciarSesion as apiIniciarSesion,
  verificarDosFactores as apiVerificarDosFactores,
  cerrarSesionApi,
  obtenerUsuarioActual
} from '../servicios/servicioAutenticacion.js';
import {
  establecerTokenAcceso,
  establecerRefreshToken,
  obtenerRefreshToken,
  limpiarSesion
} from '../servicios/almacenSesion.js';

export const ContextoSesion = createContext(null);

export function ProveedorSesion({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarUsuarioActual = useCallback(async () => {
    try {
      const respuesta = await obtenerUsuarioActual();
      setUsuario(respuesta.datos);
    } catch {
      limpiarSesion();
      setUsuario(null);
    }
  }, []);

  useEffect(() => {
    async function iniciar() {
      if (obtenerRefreshToken()) {
        await cargarUsuarioActual();
      }
      setCargando(false);
    }
    iniciar();
  }, [cargarUsuarioActual]);

  const iniciarSesion = useCallback(async (correo, contrasena) => {
    const respuesta = await apiIniciarSesion(correo, contrasena);
    if (respuesta.datos?.requiereDosFactores) {
      return {
        requiereDosFactores: true,
        retoId: respuesta.datos.retoId,
        correo: respuesta.datos.correo,
        expiraEnMinutos: respuesta.datos.expiraEnMinutos
      };
    }

    establecerTokenAcceso(respuesta.datos.tokenAcceso);
    establecerRefreshToken(respuesta.datos.refreshToken);
    setUsuario(respuesta.datos.usuario);
    return { requiereDosFactores: false, usuario: respuesta.datos.usuario };
  }, []);

  const verificarDosFactores = useCallback(async (retoId, correo, codigo) => {
    const respuesta = await apiVerificarDosFactores(retoId, correo, codigo);
    establecerTokenAcceso(respuesta.datos.tokenAcceso);
    establecerRefreshToken(respuesta.datos.refreshToken);
    setUsuario(respuesta.datos.usuario);
    return respuesta.datos.usuario;
  }, []);

  const cerrarSesion = useCallback(async () => {
    const refreshToken = obtenerRefreshToken();
    limpiarSesion();
    setUsuario(null);
    if (refreshToken) {
      await cerrarSesionApi(refreshToken).catch(() => {});
    }
  }, []);

  const tienePermiso = useCallback((codigo) => usuario?.permisos?.includes(codigo) || false, [usuario]);
  const tieneRol = useCallback((...codigos) => codigos.some((codigo) => usuario?.roles?.includes(codigo)), [usuario]);

  const valor = {
    usuario,
    cargando,
    iniciarSesion,
    verificarDosFactores,
    cerrarSesion,
    tienePermiso,
    tieneRol
  };

  return <ContextoSesion.Provider value={valor}>{children}</ContextoSesion.Provider>;
}
