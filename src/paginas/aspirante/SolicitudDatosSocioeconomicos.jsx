import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PasosSolicitud from '../../componentes/formularios/PasosSolicitud.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { obtenerSolicitud, guardarDatosSocioeconomicos } from '../../servicios/servicioSolicitudes.js';

const FORMULARIO_INICIAL = {
  tipoVivienda: '', cantidadIntegrantes: '', ingresoMensual: '', gastoMensual: '', situacionLaboral: '', observaciones: ''
};

const MIEMBRO_VACIO = { nombre: '', parentesco: '', edad: '', ocupacion: '', ingresoMensual: '', dependeEconomicamente: true };

export default function SolicitudDatosSocioeconomicos() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [miembros, setMiembros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerSolicitud(id).then((respuesta) => {
      const datos = respuesta.datos.datosSocioeconomicos;
      if (datos) {
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

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
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
      <PasosSolicitud pasoActual="socioeconomicos" />
      <Tarjeta>
        <h1 className="text-headline-sm font-semibold text-primary">Situación socioeconómica</h1>
        <form className="mt-6 flex flex-col gap-6" onSubmit={manejarEnvio}>
          {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
          <div className="grid gap-4 sm:grid-cols-2">
            <CampoTexto etiqueta="Tipo de vivienda" value={formulario.tipoVivienda} required
              onChange={(e) => actualizarCampo('tipoVivienda', e.target.value)} />
            <CampoTexto etiqueta="Integrantes del hogar" type="number" min="1" value={formulario.cantidadIntegrantes} required
              onChange={(e) => actualizarCampo('cantidadIntegrantes', e.target.value)} />
            <CampoTexto etiqueta="Ingreso mensual del hogar (₡)" type="number" min="0" value={formulario.ingresoMensual} required
              onChange={(e) => actualizarCampo('ingresoMensual', e.target.value)} />
            <CampoTexto etiqueta="Gastos mensuales (₡)" type="number" min="0" value={formulario.gastoMensual} required
              onChange={(e) => actualizarCampo('gastoMensual', e.target.value)} />
            <CampoTexto etiqueta="Situación laboral" value={formulario.situacionLaboral} required
              onChange={(e) => actualizarCampo('situacionLaboral', e.target.value)} />
            <CampoTexto etiqueta="Observaciones" value={formulario.observaciones}
              onChange={(e) => actualizarCampo('observaciones', e.target.value)} />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-headline-sm font-semibold text-on-surface">Grupo familiar</h2>
              <Boton type="button" variante="secundario" onClick={agregarMiembro}>Agregar integrante</Boton>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              {miembros.map((miembro, indice) => (
                <div key={indice} className="grid gap-3 rounded-md border border-outline-variant p-4 sm:grid-cols-5">
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
