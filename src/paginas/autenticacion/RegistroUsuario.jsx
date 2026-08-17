import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EncabezadoPublico from '../../componentes/navegacion/EncabezadoPublico.jsx';
import PiePagina from '../../componentes/navegacion/PiePagina.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoCedula from '../../componentes/formularios/CampoCedula.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import DialogoConfirmacion from '../../componentes/comunes/DialogoConfirmacion.jsx';
import { registrarUsuario, verificarRegistro } from '../../servicios/servicioAutenticacion.js';
import { contrasenaEsSegura, cedulaEsValida } from '../../utilidades/validaciones.js';

const FORMULARIO_INICIAL = {
  cedula: '', nombre: '', primerApellido: '', segundoApellido: '', correo: '', contrasena: '', confirmacion: '', aceptaTerminos: false
};

export default function RegistroUsuario() {
  const navegar = useNavigate();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [exito, setExito] = useState(false);
  const [requiereVerificacion, setRequiereVerificacion] = useState(false);
  const [correoMostrado, setCorreoMostrado] = useState('');
  const [expiraEnHoras, setExpiraEnHoras] = useState(null);
  const [codigoVerificacion, setCodigoVerificacion] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrarTerminos, setMostrarTerminos] = useState(false);

  function actualizarCampo(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function validar() {
    const nuevosErrores = {};
    if (!cedulaEsValida(formulario.cedula)) nuevosErrores.cedula = 'La cédula debe contener exactamente 9 dígitos numéricos.';
    if (!formulario.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!formulario.primerApellido.trim()) nuevosErrores.primerApellido = 'El primer apellido es obligatorio.';
    if (!formulario.correo.trim()) nuevosErrores.correo = 'El correo es obligatorio.';
    if (!contrasenaEsSegura(formulario.contrasena)) {
      nuevosErrores.contrasena = 'Debe tener 8+ caracteres, una mayúscula, un número y un carácter especial.';
    }
    if (formulario.contrasena !== formulario.confirmacion) nuevosErrores.confirmacion = 'Las contraseñas no coinciden.';
    if (!formulario.aceptaTerminos) nuevosErrores.aceptaTerminos = 'Debe aceptar los términos.';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setErrorGeneral(null);
    setMensaje(null);
    if (!validar()) return;

    setEnviando(true);
    try {
      const respuesta = await registrarUsuario(formulario);
      if (respuesta.datos?.requiereVerificacion) {
        setRequiereVerificacion(true);
        setCorreoMostrado(respuesta.datos.correo || formulario.correo);
        setExpiraEnHoras(respuesta.datos.expiraEnHoras || null);
        setMensaje('Le enviamos un código de activación a su correo.');
      }
    } catch (error) {
      setErrorGeneral(error.mensaje);
      const erroresApi = {};
      (error.errores || []).forEach((item) => { erroresApi[item.campo] = item.mensaje; });
      setErrores(erroresApi);
    } finally {
      setEnviando(false);
    }
  }

  async function manejarVerificacion(evento) {
    evento.preventDefault();
    setErrorGeneral(null);
    setMensaje(null);

    setEnviando(true);
    try {
      await verificarRegistro(formulario.correo, codigoVerificacion);
      setExito(true);
      setRequiereVerificacion(false);
    } catch (error) {
      setErrorGeneral(error.mensaje || 'No fue posible validar el código.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <EncabezadoPublico />
      <main className="mx-auto max-w-2xl px-4 py-12 md:px-12">
        <Tarjeta>
          <img src="/images/logo.png" alt="Logo SGBE CUC" className="mx-auto mb-3 h-16 w-16 object-contain" />
          <h1 className="text-headline-md font-semibold text-on-surface">Crear cuenta</h1>

          {exito ? (
            <AlertaMensaje tipo="exito" titulo="Cuenta creada">
              Su cuenta fue activada correctamente. Ya puede iniciar sesión.
              <Link to="/login" className="mt-2 block font-semibold underline">Ir a iniciar sesión</Link>
            </AlertaMensaje>
          ) : requiereVerificacion ? (
            <form className="mt-6 flex flex-col gap-4" onSubmit={manejarVerificacion}>
              {mensaje && <AlertaMensaje tipo="info">{mensaje}</AlertaMensaje>}
              {errorGeneral && <AlertaMensaje tipo="error">{errorGeneral}</AlertaMensaje>}
              <p className="text-body-sm text-on-surface-variant">
                Ingrese el código de 6 dígitos enviado a {correoMostrado}.
                {expiraEnHoras ? ` Vence en ${expiraEnHoras} horas.` : ''}
              </p>
              <CampoTexto
                etiqueta="Código de activación"
                value={codigoVerificacion}
                onChange={(e) => setCodigoVerificacion(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
              <Boton type="submit" cargando={enviando}>Activar cuenta</Boton>
              <p className="text-body-sm text-on-surface-variant">
                ¿Ya activó su cuenta? <Link to="/login" className="font-semibold text-primary-container hover:underline">Inicie sesión</Link>
              </p>
            </form>
          ) : (
            <form className="mt-6 flex flex-col gap-4" onSubmit={manejarEnvio}>
              {errorGeneral && <AlertaMensaje tipo="error">{errorGeneral}</AlertaMensaje>}
              <CampoCedula
                cedula={formulario.cedula}
                onCedulaChange={(valor) => actualizarCampo('cedula', valor)}
                onDatosEncontrados={(datos) => setFormulario((actual) => ({
                  ...actual,
                  nombre: datos.nombre || actual.nombre,
                  primerApellido: datos.primerApellido || actual.primerApellido,
                  segundoApellido: datos.segundoApellido || actual.segundoApellido
                }))}
                error={errores.cedula}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <CampoTexto etiqueta="Nombre" value={formulario.nombre} error={errores.nombre}
                  onChange={(e) => actualizarCampo('nombre', e.target.value)} />
                <CampoTexto etiqueta="Primer apellido" value={formulario.primerApellido} error={errores.primerApellido}
                  onChange={(e) => actualizarCampo('primerApellido', e.target.value)} />
              </div>
              <CampoTexto etiqueta="Segundo apellido (opcional)" value={formulario.segundoApellido}
                onChange={(e) => actualizarCampo('segundoApellido', e.target.value)} />
              <CampoTexto etiqueta="Correo" type="email" value={formulario.correo} error={errores.correo}
                onChange={(e) => actualizarCampo('correo', e.target.value)} />
              <CampoTexto etiqueta="Contraseña" type="password" value={formulario.contrasena} error={errores.contrasena}
                onChange={(e) => actualizarCampo('contrasena', e.target.value)} />
              <CampoTexto etiqueta="Confirmar contraseña" type="password" value={formulario.confirmacion} error={errores.confirmacion}
                onChange={(e) => actualizarCampo('confirmacion', e.target.value)} />
              <label className="flex items-center gap-2 text-body-sm">
                <input type="checkbox" checked={formulario.aceptaTerminos}
                  onChange={(e) => actualizarCampo('aceptaTerminos', e.target.checked)} />
                <span>
                  Acepto los{' '}
                  <button
                    type="button"
                    className="font-semibold text-primary-container underline hover:text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      setMostrarTerminos(true);
                    }}
                  >
                    términos y condiciones
                  </button>
                  .
                </span>
              </label>
              {errores.aceptaTerminos && <p className="text-label-sm text-error">{errores.aceptaTerminos}</p>}

              <Boton type="submit" cargando={enviando}>Crear cuenta</Boton>
              <p className="text-body-sm text-on-surface-variant">
                ¿Ya tiene cuenta? <Link to="/login" className="font-semibold text-primary-container hover:underline">Inicie sesión</Link>
              </p>
            </form>
          )}
        </Tarjeta>
      </main>

      <DialogoConfirmacion
        abierto={mostrarTerminos}
        titulo="Términos y condiciones"
        cancelar={() => setMostrarTerminos(false)}
        confirmar={() => setMostrarTerminos(false)}
        textoCancelar="Cerrar"
        textoConfirmar="Aceptar"
      >
        <div className="space-y-3 text-body-sm text-on-surface-variant">
          <p>
            La información registrada en este sistema se utiliza únicamente con fines académicos y estudiantiles,
            como parte del proceso de gestión y análisis de becas del proyecto SGBE-CUC.
          </p>
          <p>
            Sus datos no serán usados para fines comerciales ni compartidos fuera del alcance educativo del proyecto :D
          </p>
          <p>
            Al continuar con el registro, usted acepta el tratamiento de sus datos bajo estas condiciones :D?
          </p>
        </div>
      </DialogoConfirmacion>

      <PiePagina />
    </div>
  );
}
