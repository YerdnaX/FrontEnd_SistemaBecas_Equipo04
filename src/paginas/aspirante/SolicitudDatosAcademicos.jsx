import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PasosSolicitud from '../../componentes/formularios/PasosSolicitud.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { obtenerSolicitud, guardarDatosAcademicos } from '../../servicios/servicioSolicitudes.js';

const FORMULARIO_INICIAL = {
  numeroEstudiante: '', carrera: '', nivelAcademico: '', promedio: '', creditosMatriculados: '', condicionAcademica: ''
};

export default function SolicitudDatosAcademicos() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerSolicitud(id).then((respuesta) => {
      const datos = respuesta.datos.datosAcademicos;
      if (datos) {
        setFormulario({
          numeroEstudiante: datos.NumeroEstudiante || '',
          carrera: datos.Carrera || '',
          nivelAcademico: datos.NivelAcademico || '',
          promedio: datos.Promedio ?? '',
          creditosMatriculados: datos.CreditosMatriculados ?? '',
          condicionAcademica: datos.CondicionAcademica || ''
        });
      }
    }).catch((err) => setError(err.mensaje)).finally(() => setCargando(false));
  }, [id]);

  function actualizarCampo(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await guardarDatosAcademicos(id, {
        ...formulario,
        promedio: Number(formulario.promedio),
        creditosMatriculados: Number(formulario.creditosMatriculados)
      });
      navegar(`/aspirante/solicitudes/${id}/socioeconomicos`);
    } catch (err) {
      setError(err.mensaje || 'No fue posible guardar los datos académicos.');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <div>
      <PasosSolicitud pasoActual="academicos" />
      <Tarjeta>
        <h1 className="text-headline-sm font-semibold text-primary">Información académica</h1>
        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={manejarEnvio}>
          {error && <div className="sm:col-span-2"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}
          <CampoTexto etiqueta="Número de estudiante" value={formulario.numeroEstudiante} required
            onChange={(e) => actualizarCampo('numeroEstudiante', e.target.value)} />
          <CampoTexto etiqueta="Carrera" value={formulario.carrera} required
            onChange={(e) => actualizarCampo('carrera', e.target.value)} />
          <CampoTexto etiqueta="Nivel o periodo" value={formulario.nivelAcademico} required
            onChange={(e) => actualizarCampo('nivelAcademico', e.target.value)} />
          <CampoTexto etiqueta="Promedio" type="number" step="0.01" min="0" max="100" value={formulario.promedio} required
            onChange={(e) => actualizarCampo('promedio', e.target.value)} />
          <CampoTexto etiqueta="Créditos matriculados" type="number" min="0" value={formulario.creditosMatriculados} required
            onChange={(e) => actualizarCampo('creditosMatriculados', e.target.value)} />
          <CampoTexto etiqueta="Condición académica" value={formulario.condicionAcademica}
            onChange={(e) => actualizarCampo('condicionAcademica', e.target.value)} />
          <div className="sm:col-span-2">
            <Boton type="submit" cargando={guardando}>Guardar y continuar</Boton>
          </div>
        </form>
      </Tarjeta>
    </div>
  );
}
