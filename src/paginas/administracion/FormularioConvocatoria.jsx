import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { obtenerConvocatoria, crearConvocatoria, actualizarConvocatoria } from '../../servicios/servicioConvocatorias.js';
import { listarTiposBeca, obtenerTipoBeca } from '../../servicios/servicioTiposBeca.js';
import { useSesion } from '../../hooks/useSesion.js';

const FORMULARIO_INICIAL = {
  idTipoBeca: '', nombre: '', descripcion: '', fechaInicio: '', fechaFin: '', cupos: '', presupuesto: '',
  requisitosHeredados: [], requisitosAdicionales: []
};

export default function FormularioConvocatoria() {
  const { id } = useParams();
  const navegar = useNavigate();
  const esNueva = !id || id === 'nueva';
  const { tienePermiso } = useSesion();
  const puedeGuardar = tienePermiso(esNueva ? 'CONVOCATORIA_CREAR' : 'CONVOCATORIA_EDITAR');

  const [tiposBeca, setTiposBeca] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const respuestaTipos = await listarTiposBeca(true);
        setTiposBeca(respuestaTipos.datos);
        if (!esNueva) {
          const respuesta = await obtenerConvocatoria(id);
          const convocatoria = respuesta.datos;
          setFormulario({
            idTipoBeca: convocatoria.IdTipoBeca,
            nombre: convocatoria.Nombre,
            descripcion: convocatoria.Descripcion || '',
            fechaInicio: convocatoria.FechaInicio.slice(0, 16),
            fechaFin: convocatoria.FechaFin.slice(0, 16),
            cupos: convocatoria.Cupos,
            presupuesto: convocatoria.Presupuesto,
            requisitosHeredados: convocatoria.requisitos,
            requisitosAdicionales: []
          });
        }
      } catch (err) {
        setError(err.mensaje);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id, esNueva]);

  // Vista previa de los requisitos que se heredarán de la beca elegida (solo
  // para convocatorias nuevas; una convocatoria existente ya tiene los suyos
  // copiados y fijos, ver arriba).
  useEffect(() => {
    if (!esNueva || !formulario.idTipoBeca) return;
    let cancelado = false;
    obtenerTipoBeca(Number(formulario.idTipoBeca)).then((respuesta) => {
      if (!cancelado) setFormulario((actual) => ({ ...actual, requisitosHeredados: respuesta.datos.requisitos }));
    }).catch(() => {});
    return () => { cancelado = true; };
  }, [esNueva, formulario.idTipoBeca]);

  function actualizarCampo(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function agregarRequisito() {
    setFormulario((actual) => ({
      ...actual, requisitosAdicionales: [...actual.requisitosAdicionales, { nombre: '', descripcion: '', obligatorio: true }]
    }));
  }
  function actualizarRequisito(indice, campo, valor) {
    setFormulario((actual) => ({
      ...actual, requisitosAdicionales: actual.requisitosAdicionales.map((r, i) => (i === indice ? { ...r, [campo]: valor } : r))
    }));
  }
  function quitarRequisito(indice) {
    setFormulario((actual) => ({ ...actual, requisitosAdicionales: actual.requisitosAdicionales.filter((_, i) => i !== indice) }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const { requisitosHeredados, ...resto } = formulario;
      const datos = {
        ...resto,
        idTipoBeca: Number(formulario.idTipoBeca),
        cupos: Number(formulario.cupos),
        presupuesto: Number(formulario.presupuesto) || 0
      };
      if (esNueva) {
        const respuesta = await crearConvocatoria(datos);
        navegar(`/admin/convocatorias/${respuesta.datos.IdConvocatoria}`);
      } else {
        await actualizarConvocatoria(id, datos);
        navegar('/admin/convocatorias');
      }
    } catch (err) {
      setError(err.mensaje || 'No fue posible guardar la convocatoria.');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <Tarjeta>
      <h1 className="text-headline-sm font-semibold text-primary">{esNueva ? 'Nueva convocatoria' : 'Editar convocatoria'}</h1>
      <form className="mt-6 flex flex-col gap-4" onSubmit={manejarEnvio}>
        {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}
        {!puedeGuardar && (
          <AlertaMensaje tipo="info">Solo lectura: no tiene permiso para {esNueva ? 'crear' : 'editar'} convocatorias.</AlertaMensaje>
        )}
        <fieldset disabled={!puedeGuardar} className="contents">
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoSelect etiqueta="Tipo de beca" value={formulario.idTipoBeca} required
            onChange={(e) => actualizarCampo('idTipoBeca', e.target.value)}
            opciones={tiposBeca.map((t) => ({ valor: t.IdTipoBeca, etiqueta: t.Nombre }))} />
          <CampoTexto etiqueta="Nombre" value={formulario.nombre} required onChange={(e) => actualizarCampo('nombre', e.target.value)} />
          <CampoTexto etiqueta="Fecha y hora de apertura" type="datetime-local" value={formulario.fechaInicio} required
            onChange={(e) => actualizarCampo('fechaInicio', e.target.value)} />
          <CampoTexto etiqueta="Fecha y hora de cierre" type="datetime-local" value={formulario.fechaFin} required
            helperText="Debe ser posterior a la fecha y hora de apertura." onChange={(e) => actualizarCampo('fechaFin', e.target.value)} />
          <CampoTexto etiqueta="Cupos" type="number" min="1" value={formulario.cupos} required onChange={(e) => actualizarCampo('cupos', e.target.value)} />
          <CampoTexto etiqueta="Presupuesto (₡)" type="number" min="0" value={formulario.presupuesto} onChange={(e) => actualizarCampo('presupuesto', e.target.value)} />
        </div>
        <CampoTexto etiqueta="Descripción" value={formulario.descripcion} onChange={(e) => actualizarCampo('descripcion', e.target.value)} />

        <div>
          <p className="font-semibold text-on-surface">Requisitos heredados de la beca</p>
          <p className="text-body-sm text-on-surface-variant">
            Definidos en la ficha de la beca. Para modificarlos, edite la beca en «Gestión de becas».
          </p>
          {formulario.requisitosHeredados.length === 0 ? (
            <p className="mt-2 text-body-sm text-on-surface-variant">Esta beca aún no tiene requisitos definidos.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-1">
              {formulario.requisitosHeredados.map((requisito, indice) => (
                <li key={requisito.IdRequisitoBeca ?? requisito.IdRequisito ?? indice} className="rounded-md border border-outline-variant px-3 py-2 text-body-sm">
                  {requisito.Nombre} {requisito.Obligatorio ? '(obligatorio)' : '(opcional)'}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-on-surface">Requisitos adicionales de esta convocatoria</p>
            <Boton type="button" variante="secundario" onClick={agregarRequisito}>Agregar requisito</Boton>
          </div>
          {formulario.requisitosAdicionales.map((requisito, indice) => (
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
        </fieldset>

        {puedeGuardar && <Boton type="submit" cargando={guardando}>Guardar convocatoria</Boton>}
      </form>
    </Tarjeta>
  );
}
