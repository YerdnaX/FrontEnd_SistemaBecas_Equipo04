import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import CampoAreaTexto from '../../componentes/formularios/CampoAreaTexto.jsx';
import CampoSelect from '../../componentes/formularios/CampoSelect.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import {
  guardarEvaluacionAutomatica,
  guardarInformeSocial,
  obtenerEvaluacion
} from '../../servicios/servicioExpedientes.js';

const INFORME_VACIO = { resumen: '', hallazgos: '', recomendacion: '', observaciones: '' };

const colones = (valor) => `₡${Number(valor || 0).toLocaleString('es-CR')}`;

function describirRangoQuintil(precalculo) {
  const quintil = Number(precalculo.Quintil);
  if (quintil === 1) return `Hasta ${colones(precalculo.MaximoQ1)}`;
  if (quintil === 2) return `Más de ${colones(precalculo.MaximoQ1)} y hasta ${colones(precalculo.MaximoQ2)}`;
  if (quintil === 3) return `Más de ${colones(precalculo.MaximoQ2)} y hasta ${colones(precalculo.MaximoQ3)}`;
  if (quintil === 4) return `Más de ${colones(precalculo.MaximoQ3)} y hasta ${colones(precalculo.MaximoQ4)}`;
  return `Más de ${colones(precalculo.MaximoQ4)}`;
}

export default function EvaluacionIntegral() {
  const { id } = useParams();
  const [datos, setDatos] = useState(null);
  const [informe, setInforme] = useState(INFORME_VACIO);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState('');
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    setCargando(true);
    try {
      const respuesta = await obtenerEvaluacion(id);
      setDatos(respuesta.datos);
      const actual = respuesta.datos.informeSocial;
      setInforme(actual ? {
        resumen: actual.Resumen,
        hallazgos: actual.Hallazgos,
        recomendacion: actual.Recomendacion,
        observaciones: actual.Observaciones || ''
      } : INFORME_VACIO);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.mensaje });
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  function cambiarInforme(campo, valor) {
    setInforme((actual) => ({ ...actual, [campo]: valor }));
  }

  async function manejarGuardarInforme(evento) {
    evento.preventDefault();
    setProcesando('informe');
    setMensaje(null);
    try {
      await guardarInformeSocial(id, informe);
      setMensaje({ tipo: 'exito', texto: 'Informe social guardado y disponible para el comité.' });
      await cargar();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.mensaje || 'No fue posible guardar el informe social.' });
    } finally {
      setProcesando('');
    }
  }

  async function manejarEvaluacion() {
    setProcesando('evaluacion');
    setMensaje(null);
    try {
      await guardarEvaluacionAutomatica(id);
      setMensaje({ tipo: 'exito', texto: 'Evaluación integral calculada automáticamente.' });
      await cargar();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.mensaje || 'No fue posible calcular la evaluación.' });
    } finally {
      setProcesando('');
    }
  }

  if (cargando && !datos) return <EstadoCarga />;
  if (!datos) return mensaje && <AlertaMensaje tipo="error">{mensaje.texto}</AlertaMensaje>;

  const { evaluacion, componentes, precalculoQuintil, datosAutomaticos } = datos;

  return (
    <div className="flex flex-col gap-6">
      <EncabezadoPagina
        titulo="Evaluación integral"
        descripcion="El resultado se obtiene de fuentes académicas y del quintil socioeconómico; no se digitan puntajes manuales."
      />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}

      <Tarjeta>
        <h2 className="text-headline-sm font-semibold text-on-surface">Clasificación nacional por ingreso del hogar</h2>
        {precalculoQuintil ? (
          <>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md bg-surface-container-low p-3">
                <p className="text-label-sm text-on-surface-variant">Ingreso mensual del hogar</p>
                <p className="font-semibold">{colones(precalculoQuintil.IngresoHogar)}</p>
              </div>
              <div className="rounded-md bg-surface-container-low p-3">
                <p className="text-label-sm text-on-surface-variant">Integrantes del hogar</p>
                <p className="font-semibold">{precalculoQuintil.CantidadIntegrantes}</p>
              </div>
              <div className="rounded-md bg-surface-container-low p-3">
                <p className="text-label-sm text-on-surface-variant">Ingreso per cápita</p>
                <p className="font-semibold">{colones(precalculoQuintil.IngresoPerCapita)}</p>
              </div>
              <div className="rounded-md bg-surface-container-low p-3">
                <p className="text-label-sm text-on-surface-variant">Clasificación</p>
                <p className="font-semibold">Q{precalculoQuintil.Quintil} · {precalculoQuintil.EsElegible ? 'Cumple el criterio' : 'No cumple el criterio'}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-body-sm">
              <p><strong>Cálculo:</strong> {colones(precalculoQuintil.IngresoHogar)} ÷ {precalculoQuintil.CantidadIntegrantes} = {colones(precalculoQuintil.IngresoPerCapita)} por persona.</p>
              <p><strong>Rango aplicado:</strong> Q{precalculoQuintil.Quintil}: {describirRangoQuintil(precalculoQuintil)}.</p>
              <p><strong>Referencia:</strong> INEC Costa Rica, ENAHO {precalculoQuintil.AnioReferencia}. Periodo de la convocatoria: {precalculoQuintil.Periodo}.</p>
            </div>
            <div className="mt-4">
              <AlertaMensaje tipo="info">
                Esta es una clasificación nacional por ingreso per cápita. No equivale por sí sola a una declaración oficial de pobreza. Para el Segmento 2, únicamente Q1 y Q2 cumplen el criterio socioeconómico.
              </AlertaMensaje>
            </div>
          </>
        ) : (
          <AlertaMensaje tipo="advertencia">Faltan datos socioeconómicos para calcular la clasificación.</AlertaMensaje>
        )}
      </Tarjeta>

      <Tarjeta>
        <h2 className="text-headline-sm font-semibold">Informe social para el comité</h2>
        <form className="mt-4 grid gap-4" onSubmit={manejarGuardarInforme}>
          <CampoAreaTexto etiqueta="Resumen del caso" required value={informe.resumen}
            onChange={(e) => cambiarInforme('resumen', e.target.value)} />
          <CampoAreaTexto etiqueta="Hallazgos socioeconómicos" required value={informe.hallazgos}
            onChange={(e) => cambiarInforme('hallazgos', e.target.value)} />
          <CampoSelect etiqueta="Recomendación" required value={informe.recomendacion}
            onChange={(e) => cambiarInforme('recomendacion', e.target.value)}
            opciones={[
              { valor: 'FAVORABLE', etiqueta: 'Favorable' },
              { valor: 'CONDICIONADA', etiqueta: 'Condicionada' },
              { valor: 'DESFAVORABLE', etiqueta: 'Desfavorable' }
            ]} />
          <CampoAreaTexto etiqueta="Observaciones adicionales" value={informe.observaciones}
            onChange={(e) => cambiarInforme('observaciones', e.target.value)} />
          <Boton type="submit" cargando={procesando === 'informe'}>Guardar informe social</Boton>
        </form>
      </Tarjeta>

      <Tarjeta>
        <h2 className="text-headline-sm font-semibold text-on-surface">Cálculo automático</h2>
        <div className="mt-4">
          <TablaDatos
            filas={componentes}
            clave="IdComponente"
            columnas={[
              { clave: 'Nombre', etiqueta: 'Componente' },
              { clave: 'Porcentaje', etiqueta: 'Peso', render: (componente) => `${componente.Porcentaje}%` },
              {
                clave: 'fuente',
                etiqueta: 'Fuente',
                render: (componente) => componente.Codigo === 'ACADEMICO'
                  ? `Promedio ${datosAutomaticos?.PromedioNotasSimuladas ?? datosAutomaticos?.PromedioAcademico ?? 0}`
                  : componente.Codigo === 'SOCIOECONOMICO'
                    ? `Quintil Q${precalculoQuintil?.Quintil ?? '—'}`
                    : 'Sin fuente institucional: 0'
              },
              {
                clave: 'puntaje',
                etiqueta: 'Puntaje',
                render: (componente) => evaluacion?.puntajes?.find((p) => p.IdComponente === componente.IdComponente)?.Puntaje ?? 'Se calculará'
              }
            ]}
          />
        </div>
        {evaluacion?.Estado === 'COMPLETA' ? (
          <div className="mt-4"><AlertaMensaje tipo="exito" titulo={`Puntaje total: ${evaluacion.PuntajeTotal}`}>
            Evaluación {evaluacion.Origen === 'AUTOMATICA' ? 'automática' : 'histórica'} registrada.
          </AlertaMensaje></div>
        ) : (
          <Boton className="mt-4" onClick={manejarEvaluacion} cargando={procesando === 'evaluacion'}
            deshabilitado={!precalculoQuintil?.EsElegible}>
            Calcular evaluación automática
          </Boton>
        )}
      </Tarjeta>
    </div>
  );
}
