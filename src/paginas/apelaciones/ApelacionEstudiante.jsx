import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { presentarApelacion } from '../../servicios/servicioApelaciones.js';

export default function ApelacionEstudiante() {
  const { idResolucion } = useParams();
  const navegar = useNavigate();
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const respuesta = await presentarApelacion(idResolucion, { motivo });
      setExito(true);
      setTimeout(() => navegar(`/apelaciones/${respuesta.datos.IdApelacion}`), 1200);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-headline-lg font-semibold text-on-surface">Presentar apelación</h1>
      <p className="mt-1 text-body-sm text-on-surface-variant">
        Explique con claridad por qué considera que la resolución debe revisarse. Su apelación será
        atendida por la Oficina de Becas.
      </p>

      <Tarjeta className="mt-6">
        {error && <div className="mb-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}
        {exito && <div className="mb-4"><AlertaMensaje tipo="exito">Apelación presentada correctamente. Redirigiendo...</AlertaMensaje></div>}

        <form onSubmit={enviar} className="flex flex-col gap-4">
          <CampoAreaTexto
            etiqueta="Motivo de la apelación"
            required
            minLength={10}
            rows={6}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Describa los hechos y la razón por la que apela esta resolución..."
          />

          <Boton type="submit" cargando={enviando}>Enviar apelación</Boton>
        </form>
      </Tarjeta>
    </div>
  );
}
