import { useEffect, useState } from 'react';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import EstadoVacio from '../../componentes/comunes/EstadoVacio.jsx';
import EtiquetaEstado from '../../componentes/comunes/EtiquetaEstado.jsx';
import { listarTiposBeca, crearTipoBeca, actualizarTipoBeca, cambiarEstadoTipoBeca, obtenerTipoBeca } from '../../servicios/servicioTiposBeca.js';
import { useSesion } from '../../hooks/useSesion.js';

const FORMULARIO_INICIAL = { nombre: '', descripcion: '', porcentajeCobertura: '', rubros: [], criterios: [], requisitos: [] };

export default function GestionTiposBeca() {
  const { tienePermiso } = useSesion();
  const puedeCrear = tienePermiso('TIPO_BECA_CREAR');
  const puedeEditar = tienePermiso('TIPO_BECA_EDITAR');
  const [tiposBeca, setTiposBeca] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [idEnEdicion, setIdEnEdicion] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const porcentajeCoberturaNumero = Number(formulario.porcentajeCobertura) || 0;
  const sumaRubros = formulario.rubros.reduce((total, rubro) => total + (Number(rubro.porcentaje) || 0), 0);
  const porcentajeRestante = porcentajeCoberturaNumero - sumaRubros;
  const rubrosCompletos = Math.abs(porcentajeRestante) <= 0.009;

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await listarTiposBeca();
      setTiposBeca(respuesta.datos);
    } catch (err) {
      setError(err.mensaje);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  function actualizarCampo(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function agregarRubro() {
    setFormulario((actual) => ({ ...actual, rubros: [...actual.rubros, { nombre: '', porcentaje: '' }] }));
  }
  function actualizarRubro(indice, campo, valor) {
    setFormulario((actual) => ({
      ...actual, rubros: actual.rubros.map((r, i) => (i === indice ? { ...r, [campo]: valor } : r))
    }));
  }
  function quitarRubro(indice) {
    setFormulario((actual) => ({ ...actual, rubros: actual.rubros.filter((_, i) => i !== indice) }));
  }

  function agregarCriterio() {
    setFormulario((actual) => ({ ...actual, criterios: [...actual.criterios, { nombre: '', obligatorio: true }] }));
  }
  function actualizarCriterio(indice, campo, valor) {
    setFormulario((actual) => ({
      ...actual, criterios: actual.criterios.map((c, i) => (i === indice ? { ...c, [campo]: valor } : c))
    }));
  }
  function quitarCriterio(indice) {
    setFormulario((actual) => ({ ...actual, criterios: actual.criterios.filter((_, i) => i !== indice) }));
  }

  function agregarRequisito() {
    setFormulario((actual) => ({ ...actual, requisitos: [...actual.requisitos, { nombre: '', descripcion: '', obligatorio: true }] }));
  }
  function actualizarRequisito(indice, campo, valor) {
    setFormulario((actual) => ({
      ...actual, requisitos: actual.requisitos.map((r, i) => (i === indice ? { ...r, [campo]: valor } : r))
    }));
  }
  function quitarRequisito(indice) {
    setFormulario((actual) => ({ ...actual, requisitos: actual.requisitos.filter((_, i) => i !== indice) }));
  }

  function nuevoTipoBeca() {
    setFormulario(FORMULARIO_INICIAL);
    setIdEnEdicion(null);
    setMostrarFormulario(true);
  }

  async function editarTipoBeca(id) {
    const respuesta = await obtenerTipoBeca(id);
    const tipoBeca = respuesta.datos;
    setFormulario({
      nombre: tipoBeca.Nombre,
      descripcion: tipoBeca.Descripcion || '',
      porcentajeCobertura: tipoBeca.PorcentajeCobertura,
      rubros: tipoBeca.rubros.map((r) => ({ nombre: r.Nombre, porcentaje: r.Porcentaje })),
      criterios: tipoBeca.criterios.map((c) => ({ nombre: c.Nombre, obligatorio: c.Obligatorio })),
      requisitos: (tipoBeca.requisitos || []).map((r) => ({ nombre: r.Nombre, descripcion: r.Descripcion || '', obligatorio: r.Obligatorio }))
    });
    setIdEnEdicion(id);
    setMostrarFormulario(true);
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);

    if (!rubrosCompletos) {
      setError(`Los rubros deben sumar exactamente ${porcentajeCoberturaNumero.toFixed(2)}%. Actualmente suman ${sumaRubros.toFixed(2)}%.`);
      return;
    }

    setGuardando(true);
    try {
      const datos = { ...formulario, porcentajeCobertura: Number(formulario.porcentajeCobertura) };
      if (idEnEdicion) {
        await actualizarTipoBeca(idEnEdicion, datos);
      } else {
        await crearTipoBeca(datos);
      }
      setMostrarFormulario(false);
      await cargar();
    } catch (err) {
      setError(err.mensaje || 'No fue posible guardar el tipo de beca.');
    } finally {
      setGuardando(false);
    }
  }

  async function manejarCambioEstado(id, activo) {
    if (!window.confirm(`¿Confirma ${activo ? 'activar' : 'desactivar'} este tipo de beca?`)) return;
    await cambiarEstadoTipoBeca(id, activo).catch((err) => setError(err.mensaje));
    await cargar();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg font-semibold text-primary">Gestión de tipos de beca</h1>
        {puedeCrear && <Boton onClick={nuevoTipoBeca}>Nuevo tipo de beca</Boton>}
      </div>

      {error && <div className="mt-4"><AlertaMensaje tipo="error">{error}</AlertaMensaje></div>}

      {mostrarFormulario && (
        <Tarjeta className="mt-6">
          <h2 className="text-headline-sm font-semibold text-on-surface">{idEnEdicion ? 'Editar' : 'Nuevo'} tipo de beca</h2>
          <form className="mt-4 flex flex-col gap-4" onSubmit={manejarEnvio}>
            <div className="grid gap-4 sm:grid-cols-2">
              <CampoTexto etiqueta="Nombre" value={formulario.nombre} required onChange={(e) => actualizarCampo('nombre', e.target.value)} />
              <CampoTexto etiqueta="Porcentaje de cobertura" type="number" min="0" max="100" value={formulario.porcentajeCobertura} required
                onChange={(e) => actualizarCampo('porcentajeCobertura', e.target.value)} />
            </div>
            <CampoTexto etiqueta="Descripción" value={formulario.descripcion} onChange={(e) => actualizarCampo('descripcion', e.target.value)} />

            <div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-on-surface">Rubros de cobertura</p>
                <Boton type="button" variante="secundario" onClick={agregarRubro}>Agregar rubro</Boton>
              </div>
              <div className="mt-2 rounded-md border border-outline-variant bg-surface-container px-3 py-2 text-body-sm">
                <p>Suma de rubros: <strong>{sumaRubros.toFixed(2)}%</strong></p>
                <p>
                  Restante por asignar:{' '}
                  <strong className={rubrosCompletos ? 'text-exito' : porcentajeRestante < 0 ? 'text-error' : 'text-advertencia'}>
                    {porcentajeRestante.toFixed(2)}%
                  </strong>
                </p>
              </div>
              {formulario.rubros.map((rubro, indice) => (
                <div key={indice} className="mt-2 flex gap-2">
                  <CampoTexto className="flex-1" etiqueta="Nombre" value={rubro.nombre} onChange={(e) => actualizarRubro(indice, 'nombre', e.target.value)} />
                  <CampoTexto etiqueta="%" type="number" value={rubro.porcentaje} onChange={(e) => actualizarRubro(indice, 'porcentaje', e.target.value)} />
                  <button type="button" className="self-end text-error" onClick={() => quitarRubro(indice)}>Quitar</button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-on-surface">Criterios de elegibilidad</p>
                <Boton type="button" variante="secundario" onClick={agregarCriterio}>Agregar criterio</Boton>
              </div>
              {formulario.criterios.map((criterio, indice) => (
                <div key={indice} className="mt-2 flex items-center gap-2">
                  <CampoTexto className="flex-1" etiqueta="Descripción" value={criterio.nombre} onChange={(e) => actualizarCriterio(indice, 'nombre', e.target.value)} />
                  <label className="flex items-center gap-1 text-body-sm">
                    <input type="checkbox" checked={criterio.obligatorio} onChange={(e) => actualizarCriterio(indice, 'obligatorio', e.target.checked)} />
                    Obligatorio
                  </label>
                  <button type="button" className="text-error" onClick={() => quitarCriterio(indice)}>Quitar</button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-on-surface">Requisitos documentales de la beca</p>
                <Boton type="button" variante="secundario" onClick={agregarRequisito}>Agregar requisito</Boton>
              </div>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Se copian automáticamente a cada convocatoria nueva de esta beca; ninguna otra beca los comparte.
              </p>
              {formulario.requisitos.map((requisito, indice) => (
                <div key={indice} className="mt-2 flex items-center gap-2">
                  <CampoTexto className="flex-1" etiqueta="Nombre" value={requisito.nombre} onChange={(e) => actualizarRequisito(indice, 'nombre', e.target.value)} />
                  <CampoTexto className="flex-1" etiqueta="Descripción" value={requisito.descripcion} onChange={(e) => actualizarRequisito(indice, 'descripcion', e.target.value)} />
                  <label className="flex items-center gap-1 text-body-sm">
                    <input type="checkbox" checked={requisito.obligatorio} onChange={(e) => actualizarRequisito(indice, 'obligatorio', e.target.checked)} />
                    Obligatorio
                  </label>
                  <button type="button" className="text-error" onClick={() => quitarRequisito(indice)}>Quitar</button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {(idEnEdicion ? puedeEditar : puedeCrear) && <Boton type="submit" cargando={guardando}>Guardar</Boton>}
              <Boton type="button" variante="secundario" onClick={() => setMostrarFormulario(false)}>Cancelar</Boton>
            </div>
          </form>
        </Tarjeta>
      )}

      <div className="mt-6">
        {cargando && <EstadoCarga />}
        {!cargando && tiposBeca.length === 0 && <EstadoVacio titulo="No hay tipos de beca registrados" />}
        {!cargando && tiposBeca.length > 0 && (
          <div className="overflow-x-auto rounded-lg bg-surface-container-lowest shadow-elevation-l2">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Cobertura</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tiposBeca.map((tipoBeca) => (
                  <tr key={tipoBeca.IdTipoBeca} className="border-t border-outline-variant">
                    <td className="px-4 py-3">{tipoBeca.Nombre}</td>
                    <td className="px-4 py-3">{tipoBeca.PorcentajeCobertura}%</td>
                    <td className="px-4 py-3"><EtiquetaEstado estado={tipoBeca.Activo ? 'ACTIVO' : 'INACTIVO'} /></td>
                    <td className="px-4 py-3">
                      {puedeEditar ? (
                        <>
                          <button className="mr-3 text-primary-container hover:underline" onClick={() => editarTipoBeca(tipoBeca.IdTipoBeca)}>Editar</button>
                          <button className="text-error hover:underline" onClick={() => manejarCambioEstado(tipoBeca.IdTipoBeca, !tipoBeca.Activo)}>
                            {tipoBeca.Activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </>
                      ) : <span className="text-on-surface-variant">Solo lectura</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
