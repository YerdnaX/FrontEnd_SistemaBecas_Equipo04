import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { obtenerConvocatoria, crearConvocatoria, actualizarConvocatoria } from '../../servicios/servicioConvocatorias.js';
import { listarTiposBeca } from '../../servicios/servicioTiposBeca.js';

const FORMULARIO_INICIAL = {
  idTipoBeca: '', nombre: '', descripcion: '', fechaInicio: '', fechaFin: '', cupos: '', presupuesto: '', requisitos: []
};

export default function FormularioConvocatoria() {
  const { id } = useParams();
  const navegar = useNavigate();
  const esNueva = !id || id === 'nueva';

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
            fechaInicio: convocatoria.FechaInicio.slice(0, 10),
            fechaFin: convocatoria.FechaFin.slice(0, 10),
            cupos: convocatoria.Cupos,
            presupuesto: convocatoria.Presupuesto,
            requisitos: convocatoria.requisitos.map((r) => ({ nombre: r.Nombre, descripcion: r.Descripcion || '', obligatorio: r.Obligatorio }))
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

  function actualizarCampo(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
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

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const datos = {
        ...formulario,
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
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoSelect etiqueta="Tipo de beca" value={formulario.idTipoBeca} required
            onChange={(e) => actualizarCampo('idTipoBeca', e.target.value)}
            opciones={tiposBeca.map((t) => ({ valor: t.IdTipoBeca, etiqueta: t.Nombre }))} />
          <CampoTexto etiqueta="Nombre" value={formulario.nombre} required onChange={(e) => actualizarCampo('nombre', e.target.value)} />
          <CampoTexto etiqueta="Fecha de inicio" type="date" value={formulario.fechaInicio} required onChange={(e) => actualizarCampo('fechaInicio', e.target.value)} />
          <CampoTexto etiqueta="Fecha de cierre" type="date" value={formulario.fechaFin} required onChange={(e) => actualizarCampo('fechaFin', e.target.value)} />
          <CampoTexto etiqueta="Cupos" type="number" min="1" value={formulario.cupos} required onChange={(e) => actualizarCampo('cupos', e.target.value)} />
          <CampoTexto etiqueta="Presupuesto (₡)" type="number" min="0" value={formulario.presupuesto} onChange={(e) => actualizarCampo('presupuesto', e.target.value)} />
        </div>
        <CampoTexto etiqueta="Descripción" value={formulario.descripcion} onChange={(e) => actualizarCampo('descripcion', e.target.value)} />

        <div>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-on-surface">Requisitos documentales</p>
            <Boton type="button" variante="secundario" onClick={agregarRequisito}>Agregar requisito</Boton>
          </div>
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

        <Boton type="submit" cargando={guardando}>Guardar convocatoria</Boton>
      </form>
    </Tarjeta>
  );
}
