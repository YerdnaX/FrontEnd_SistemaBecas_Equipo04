import { useState } from 'react';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import { recuperarContrasena } from '../../servicios/servicioAutenticacion.js';

export default function RecuperacionContrasena() {
  const [correo, setCorreo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    await recuperarContrasena(correo).catch(() => {});
    setEnviando(false);
    setEnviado(true);
  }

  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-md px-4 py-16 md:px-12">
        <Tarjeta>
          <h1 className="text-headline-md font-semibold text-primary">Recuperar contraseña</h1>
          {enviado ? (
            <AlertaMensaje tipo="exito" titulo="¡Correo enviado!">
              Si el correo está registrado, recibirá instrucciones para restablecer su contraseña.
            </AlertaMensaje>
          ) : (
            <form className="mt-6 flex flex-col gap-4" onSubmit={manejarEnvio}>
              <CampoTexto etiqueta="Correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              <Boton type="submit" cargando={enviando}>Enviar instrucciones</Boton>
            </form>
          )}
        </Tarjeta>
      </main>
      <PiePagina />
    </div>
  );
}
