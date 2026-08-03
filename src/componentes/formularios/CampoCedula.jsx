import { useState } from 'react';
import CampoTexto from './CampoTexto.jsx';
import Boton from '../comunes/Boton.jsx';
import { consultarCedula } from '../../servicios/servicioAutenticacion.js';
import { cedulaEsValida } from '../../utilidades/validaciones.js';

/**
 * Campo de cédula reutilizable: valida el formato (9 dígitos, solo
 * números), y al completarse consulta el servicio externo para
 * autocompletar nombre/apellidos. La consulta se dispara al perder el foco
 * (cédula ya completa) y también puede reintentarse con el botón, en vez de
 * disparar una petición por cada tecla escrita.
 */
export default function CampoCedula({ cedula, onCedulaChange, onDatosEncontrados, error, deshabilitado = false, requerido = true }) {
  const [verificando, setVerificando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  function manejarCambio(evento) {
    const valor = evento.target.value.replace(/\D/g, '').slice(0, 9);
    onCedulaChange(valor);
    setMensaje(null);
  }

  async function verificar() {
    if (!cedulaEsValida(cedula)) {
      setMensaje({ tipo: 'error', texto: 'La cédula debe contener exactamente 9 dígitos numéricos.' });
      return;
    }
    setVerificando(true);
    setMensaje(null);
    try {
      const respuesta = await consultarCedula(cedula);
      onDatosEncontrados?.(respuesta.datos);
      setMensaje({ tipo: 'exito', texto: 'Cédula verificada. Se completaron el nombre y los apellidos.' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.mensaje || 'No fue posible verificar la cédula.' });
    } finally {
      setVerificando(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-end gap-2">
        <CampoTexto
          className="flex-1"
          etiqueta="Cédula"
          inputMode="numeric"
          maxLength={9}
          placeholder="9 dígitos, sin guiones"
          value={cedula}
          onChange={manejarCambio}
          onBlur={() => { if (cedulaEsValida(cedula)) verificar(); }}
          error={error}
          disabled={deshabilitado}
          required={requerido}
        />
        <Boton
          type="button"
          variante="secundario"
          cargando={verificando}
          deshabilitado={deshabilitado || !cedulaEsValida(cedula)}
          onClick={verificar}
        >
          Verificar
        </Boton>
      </div>
      {mensaje && (
        <span className={`text-label-sm ${mensaje.tipo === 'error' ? 'text-error' : 'text-exito'}`}>
          {mensaje.texto}
        </span>
      )}
    </div>
  );
}
