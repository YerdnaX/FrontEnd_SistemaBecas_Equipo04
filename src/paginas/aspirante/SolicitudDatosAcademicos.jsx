import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PasosSolicitud from '../../componentes/formularios/PasosSolicitud.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { obtenerSolicitud, guardarDatosAcademicos } from '../../servicios/servicioSolicitudes.js';
import { useSesion } from '../../hooks/useSesion.js';

const FORMULARIO_INICIAL = {
  numeroEstudiante: '', carrera: '', nivelAcademico: '', promedio: '', creditosMatriculados: '', condicionAcademica: ''
};

const CARRERAS = [
  'Dirección y Administración de Empresas',
  'Electrónica',
  'Investigación Criminal',
  'Mecánica Dental',
  'Secretariado Ejecutivo',
  'Tecnologías de Información',
  'Turismo',
  'Big Data',
  'Gestión de Calidad',
  'Ciberseguridad'
];

const CONDICIONES_ACADEMICAS = [
  'Regular',
  'En buen estado',
  'En riesgo académico',
  'En prueba',
  'Suspendido'
];

function obtenerPeriodoActual(fecha = new Date()) {
  const mes = fecha.getMonth() + 1;
  const anio = fecha.getFullYear();
  const cuatrimestre = mes <= 4 ? 'I' : mes <= 8 ? 'II' : 'III';
  return `${cuatrimestre} Cuatrimestre ${anio}`;
}

function obtenerNombreCompleto(usuario) {
  return [usuario?.nombre, usuario?.primerApellido, usuario?.segundoApellido].filter(Boolean).join(' ');
}

function esPromedioValido(valor) {
  if (valor === '' || valor === null || valor === undefined) return false;
  const numero = Number(valor);
  return Number.isFinite(numero) && numero >= 0 && numero <= 100;
}

function esCreditosValido(valor) {
  if (valor === '' || valor === null || valor === undefined) return false;
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0;
}

function esCondicionAcademicaValida(valor) {
  return CONDICIONES_ACADEMICAS.includes(valor);
}

export default function SolicitudDatosAcademicos() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuario } = useSesion();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [estadoSolicitud, setEstadoSolicitud] = useState('BORRADOR');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [erroresCampos, setErroresCampos] = useState({});
  const [guardando, setGuardando] = useState(false);

  const nombreEstudiante = obtenerNombreCompleto(usuario);
  const numeroEstudianteAutomatico = formulario.numeroEstudiante || String(usuario?.idUsuario ?? '');
  const nivelAcademico = obtenerPeriodoActual();
  const promedioValido = esPromedioValido(formulario.promedio);
  const creditosValido = esCreditosValido(formulario.creditosMatriculados);
  const carreraValida = CARRERAS.includes(formulario.carrera);
  const condicionAcademicaValida = esCondicionAcademicaValida(formulario.condicionAcademica);

  useEffect(() => {
    obtenerSolicitud(id).then((respuesta) => {
      const datos = respuesta.datos.datosAcademicos;
      if (datos) {
        setEstadoSolicitud(respuesta.datos.Estado || 'BORRADOR');
        setFormulario({
          numeroEstudiante: datos.NumeroEstudiante || '',
          carrera: datos.Carrera || '',
          nivelAcademico: datos.NivelAcademico || obtenerPeriodoActual(),
          promedio: datos.Promedio ?? '',
          creditosMatriculados: datos.CreditosMatriculados ?? '',
          condicionAcademica: datos.CondicionAcademica || ''
        });
      } else {
        setFormulario((actual) => ({ ...actual, nivelAcademico: obtenerPeriodoActual() }));
      }
    }).catch((err) => setError(err.mensaje)).finally(() => setCargando(false));
  }, [id]);

  function actualizarCampo(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
    setErroresCampos((actual) => {
      if (!actual[campo]) return actual;
      const siguiente = { ...actual };
      delete siguiente[campo];
      return siguiente;
    });
  }

  function validarFormulario() {
    const nuevosErrores = {};
    if (!numeroEstudianteAutomatico.trim()) nuevosErrores.numeroEstudiante = 'No fue posible obtener el número de estudiante.';
    if (!carreraValida) nuevosErrores.carrera = 'Seleccione una carrera de la lista.';
    if (!promedioValido) nuevosErrores.promedio = 'El promedio debe estar entre 0 y 100.';
    if (!creditosValido) nuevosErrores.creditosMatriculados = 'Los créditos matriculados deben ser un número entero positivo.';
    if (!condicionAcademicaValida) nuevosErrores.condicionAcademica = 'Seleccione una condición académica de la lista.';
    return nuevosErrores;
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
    const nuevosErrores = validarFormulario();
    setErroresCampos(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      setError('Revise los campos marcados antes de continuar.');
      return;
    }
    setGuardando(true);
    try {
      await guardarDatosAcademicos(id, {
        ...formulario,
        numeroEstudiante: numeroEstudianteAutomatico,
        nivelAcademico,
        promedio: Number(formulario.promedio),
        creditosMatriculados: Number(formulario.creditosMatriculados)
      });
      navegar(`/aspirante/solicitudes/${id}/notas`);
    } catch (err) {
      setError(err.mensaje || 'No fue posible guardar los datos académicos.');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <div>
      <PasosSolicitud pasoActual="academicos" estadoSolicitud={estadoSolicitud} />
      <Tarjeta className="mx-auto w-full max-w-5xl">
        <h1 className="text-headline-sm font-semibold text-primary">Información académica</h1>
        <form className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={manejarEnvio}>
          {error && <div className="md:col-span-2 xl:col-span-3"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}
          <CampoTexto etiqueta="Nombre del estudiante" value={nombreEstudiante} readOnly
            className="md:col-span-2 xl:col-span-3"
            success={Boolean(nombreEstudiante)} />
          <CampoTexto etiqueta="Número de estudiante" value={numeroEstudianteAutomatico} readOnly
            error={erroresCampos.numeroEstudiante}
            success={Boolean(numeroEstudianteAutomatico)}
            helperText="Se obtiene automáticamente de su cuenta." />
          <label className="flex flex-col gap-1 text-body-sm">
            <span className="font-medium text-on-surface">Carrera</span>
            <select
              className={`rounded-md border px-3 py-2 text-body-md outline-none focus:border-primary-container ${erroresCampos.carrera ? 'border-error' : carreraValida ? 'border-exito text-exito' : 'border-outline-variant'}`}
              value={formulario.carrera}
              onChange={(e) => actualizarCampo('carrera', e.target.value)}
              required
            >
              <option value="">Seleccione una carrera</option>
              {CARRERAS.map((carrera) => <option key={carrera} value={carrera}>{carrera}</option>)}
            </select>
            {erroresCampos.carrera ? <span className="text-label-sm text-error">{erroresCampos.carrera}</span> : carreraValida ? <span className="text-label-sm text-exito">Correcto</span> : null}
          </label>
          <CampoTexto etiqueta="Nivel o periodo" value={nivelAcademico} readOnly
            success={Boolean(nivelAcademico)} />
          <CampoTexto etiqueta="Promedio" type="number" step="0.01" min="0" max="100" value={formulario.promedio} required
            error={erroresCampos.promedio}
            success={promedioValido}
            onChange={(e) => actualizarCampo('promedio', e.target.value)} />
          <CampoTexto etiqueta="Créditos matriculados" type="number" min="1" step="1" value={formulario.creditosMatriculados} required
            error={erroresCampos.creditosMatriculados}
            success={creditosValido}
            onChange={(e) => actualizarCampo('creditosMatriculados', e.target.value)} />
          <label className="flex flex-col gap-1 text-body-sm">
            <span className="font-medium text-on-surface">Condición académica</span>
            <select
              className={`rounded-md border px-3 py-2 text-body-md outline-none focus:border-primary-container ${erroresCampos.condicionAcademica ? 'border-error' : condicionAcademicaValida ? 'border-exito text-exito' : 'border-outline-variant'}`}
              value={formulario.condicionAcademica}
              onChange={(e) => actualizarCampo('condicionAcademica', e.target.value)}
              required
            >
              <option value="">Seleccione una condición</option>
              {CONDICIONES_ACADEMICAS.map((condicion) => <option key={condicion} value={condicion}>{condicion}</option>)}
            </select>
            {erroresCampos.condicionAcademica ? <span className="text-label-sm text-error">{erroresCampos.condicionAcademica}</span> : condicionAcademicaValida ? <span className="text-label-sm text-exito">Correcto</span> : null}
          </label>
          <div className="sm:col-span-2">
            <Boton type="submit" cargando={guardando}>Guardar y continuar</Boton>
          </div>
        </form>
      </Tarjeta>
    </div>
  );
}
