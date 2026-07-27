import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PasosSolicitud from '../../componentes/formularios/PasosSolicitud.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { obtenerSolicitud, guardarDatosSocioeconomicos } from '../../servicios/servicioSolicitudes.js';

const TIPOS_VIVIENDA = [
  'Propia',
  'Alquilada',
  'Prestada',
  'Familiar',
  'Cedida',
  'Residencial',
  'Otro'
];

const SITUACIONES_LABORALES = [
  'Empleado(a)',
  'Desempleado(a)',
  'Independiente',
  'Pensionado(a)',
  'Estudiante',
  'Trabajo temporal',
  'Otro'
];

const FORMULARIO_INICIAL = {
  tipoVivienda: '', cantidadIntegrantes: '', ingresoMensual: '', gastoMensual: '', situacionLaboral: '', observaciones: ''
};

const MIEMBRO_VACIO = { nombre: '', parentesco: '', edad: '', ocupacion: '', ingresoMensual: '', dependeEconomicamente: true };

function esEnteroPositivo(valor) {
  if (valor === '' || valor === null || valor === undefined) return false;
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0;
}

function esNumeroPositivo(valor) {
  if (valor === '' || valor === null || valor === undefined) return false;
  const numero = Number(valor);
  return Number.isFinite(numero) && numero > 0;
}

function esTipoViviendaValido(valor) {
  return TIPOS_VIVIENDA.includes(valor);
}

function esSituacionLaboralValida(valor) {
  return SITUACIONES_LABORALES.includes(valor);
}

export default function SolicitudDatosSocioeconomicos() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [miembros, setMiembros] = useState([]);
  const [estadoSolicitud, setEstadoSolicitud] = useState('BORRADOR');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [erroresCampos, setErroresCampos] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerSolicitud(id).then((respuesta) => {
      const datos = respuesta.datos.datosSocioeconomicos;
      if (datos) {
        setEstadoSolicitud(respuesta.datos.Estado || 'BORRADOR');
        setFormulario({
          tipoVivienda: datos.TipoVivienda || '',
          cantidadIntegrantes: datos.CantidadIntegrantes ?? '',
          ingresoMensual: datos.IngresoMensual ?? '',
          gastoMensual: datos.GastoMensual ?? '',
          situacionLaboral: datos.SituacionLaboral || '',
          observaciones: datos.Observaciones || ''
        });
        setMiembros((datos.miembrosFamiliares || []).map((m) => ({
          nombre: m.Nombre, parentesco: m.Parentesco, edad: m.Edad, ocupacion: m.Ocupacion || '',
          ingresoMensual: m.IngresoMensual, dependeEconomicamente: Boolean(m.DependeEconomicamente)
        })));
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

  function actualizarMiembro(indice, campo, valor) {
    setMiembros((actual) => actual.map((m, i) => (i === indice ? { ...m, [campo]: valor } : m)));
  }

  function agregarMiembro() {
    setMiembros((actual) => [...actual, { ...MIEMBRO_VACIO }]);
  }

  function quitarMiembro(indice) {
    setMiembros((actual) => actual.filter((_, i) => i !== indice));
  }

  function validarFormulario() {
    const nuevosErrores = {};
    if (!esTipoViviendaValido(formulario.tipoVivienda)) nuevosErrores.tipoVivienda = 'Seleccione un tipo de vivienda de la lista.';
    if (!esEnteroPositivo(formulario.cantidadIntegrantes)) nuevosErrores.cantidadIntegrantes = 'La cantidad de integrantes debe ser un entero positivo.';
    if (!esNumeroPositivo(formulario.ingresoMensual)) nuevosErrores.ingresoMensual = 'El ingreso mensual debe ser un número positivo.';
    if (!esNumeroPositivo(formulario.gastoMensual)) nuevosErrores.gastoMensual = 'Los gastos mensuales deben ser un número positivo.';
    if (!esSituacionLaboralValida(formulario.situacionLaboral)) nuevosErrores.situacionLaboral = 'Seleccione una situación laboral de la lista.';
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
      await guardarDatosSocioeconomicos(id, {
        ...formulario,
        cantidadIntegrantes: Number(formulario.cantidadIntegrantes),
        ingresoMensual: Number(formulario.ingresoMensual),
        gastoMensual: Number(formulario.gastoMensual),
        miembrosFamiliares: miembros.map((m) => ({ ...m, edad: Number(m.edad), ingresoMensual: Number(m.ingresoMensual) || 0 }))
      });
      navegar(`/aspirante/solicitudes/${id}/documentos`);
    } catch (err) {
      setError(err.mensaje || 'No fue posible guardar los datos socioeconómicos.');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <div>
      <PasosSolicitud pasoActual="socioeconomicos" estadoSolicitud={estadoSolicitud} />
      <Tarjeta className="mx-auto w-full max-w-5xl">
        <h1 className="text-headline-sm font-semibold text-primary">Situación socioeconómica</h1>
        <form className="mt-6 flex flex-col gap-6" onSubmit={manejarEnvio}>
          {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="flex flex-col gap-1 text-body-sm">
              <span className="font-medium text-on-surface">Tipo de vivienda</span>
              <select
                className={`rounded-md border px-3 py-2 text-body-md outline-none focus:border-primary-container ${erroresCampos.tipoVivienda ? 'border-error' : esTipoViviendaValido(formulario.tipoVivienda) ? 'border-exito text-exito' : 'border-outline-variant'}`}
                value={formulario.tipoVivienda}
                onChange={(e) => actualizarCampo('tipoVivienda', e.target.value)}
                required
              >
                <option value="">Seleccione un tipo</option>
                {TIPOS_VIVIENDA.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
              </select>
              {erroresCampos.tipoVivienda ? <span className="text-label-sm text-error">{erroresCampos.tipoVivienda}</span> : esTipoViviendaValido(formulario.tipoVivienda) ? <span className="text-label-sm text-exito">Correcto</span> : null}
            </label>
            <CampoTexto etiqueta="Integrantes del hogar" type="number" min="1" step="1" value={formulario.cantidadIntegrantes} required
              error={erroresCampos.cantidadIntegrantes}
              success={esEnteroPositivo(formulario.cantidadIntegrantes)}
              onChange={(e) => actualizarCampo('cantidadIntegrantes', e.target.value)} />
            <CampoTexto etiqueta="Ingreso mensual del hogar (₡)" type="number" min="1" step="0.01" value={formulario.ingresoMensual} required
              error={erroresCampos.ingresoMensual}
              success={esNumeroPositivo(formulario.ingresoMensual)}
              onChange={(e) => actualizarCampo('ingresoMensual', e.target.value)} />
            <CampoTexto etiqueta="Gastos mensuales (₡)" type="number" min="1" step="0.01" value={formulario.gastoMensual} required
              error={erroresCampos.gastoMensual}
              success={esNumeroPositivo(formulario.gastoMensual)}
              onChange={(e) => actualizarCampo('gastoMensual', e.target.value)} />
            <label className="flex flex-col gap-1 text-body-sm">
              <span className="font-medium text-on-surface">Situación laboral</span>
              <select
                className={`rounded-md border px-3 py-2 text-body-md outline-none focus:border-primary-container ${erroresCampos.situacionLaboral ? 'border-error' : esSituacionLaboralValida(formulario.situacionLaboral) ? 'border-exito text-exito' : 'border-outline-variant'}`}
                value={formulario.situacionLaboral}
                onChange={(e) => actualizarCampo('situacionLaboral', e.target.value)}
                required
              >
                <option value="">Seleccione una situación</option>
                {SITUACIONES_LABORALES.map((situacion) => <option key={situacion} value={situacion}>{situacion}</option>)}
              </select>
              {erroresCampos.situacionLaboral ? <span className="text-label-sm text-error">{erroresCampos.situacionLaboral}</span> : esSituacionLaboralValida(formulario.situacionLaboral) ? <span className="text-label-sm text-exito">Correcto</span> : null}
            </label>
            <CampoTexto etiqueta="Observaciones" value={formulario.observaciones}
              className="md:col-span-2 xl:col-span-3"
              onChange={(e) => actualizarCampo('observaciones', e.target.value)} />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-headline-sm font-semibold text-on-surface">Grupo familiar</h2>
              <Boton type="button" variante="secundario" onClick={agregarMiembro}>Agregar integrante</Boton>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              {miembros.map((miembro, indice) => (
                <div key={indice} className="grid gap-3 rounded-md border border-outline-variant p-4 md:grid-cols-2 xl:grid-cols-5">
                  <CampoTexto etiqueta="Nombre" value={miembro.nombre} onChange={(e) => actualizarMiembro(indice, 'nombre', e.target.value)} />
                  <CampoTexto etiqueta="Parentesco" value={miembro.parentesco} onChange={(e) => actualizarMiembro(indice, 'parentesco', e.target.value)} />
                  <CampoTexto etiqueta="Edad" type="number" min="0" value={miembro.edad} onChange={(e) => actualizarMiembro(indice, 'edad', e.target.value)} />
                  <CampoTexto etiqueta="Ocupación" value={miembro.ocupacion} onChange={(e) => actualizarMiembro(indice, 'ocupacion', e.target.value)} />
                  <CampoTexto etiqueta="Ingreso (₡)" type="number" min="0" value={miembro.ingresoMensual} onChange={(e) => actualizarMiembro(indice, 'ingresoMensual', e.target.value)} />
                  <button type="button" className="text-body-sm text-error hover:underline sm:col-span-5 sm:justify-self-start" onClick={() => quitarMiembro(indice)}>
                    Quitar integrante
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Boton type="submit" cargando={guardando}>Guardar y continuar</Boton>
        </form>
      </Tarjeta>
    </div>
  );
}
