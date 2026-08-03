import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PasosSolicitud from '../../componentes/formularios/PasosSolicitud.jsx';
import CampoTexto from '../../componentes/formularios/CampoTexto.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import Tarjeta from '../../componentes/comunes/Tarjeta.jsx';
import EstadoCarga from '../../componentes/comunes/EstadoCarga.jsx';
import { obtenerSolicitud, guardarNotasSimuladas } from '../../servicios/servicioSolicitudes.js';

const MATERIA_INICIAL = () => ({ nombreMateria: '', nota: '', periodo: '' });

function calcularPromedio(materias) {
  const notas = materias.map((m) => Number(m.nota)).filter((n) => Number.isFinite(n));
  if (notas.length === 0) return null;
  const promedio = notas.reduce((total, nota) => total + nota, 0) / notas.length;
  return Math.round(promedio * 100) / 100;
}

export default function SolicitudNotasSimuladas() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [materias, setMaterias] = useState([MATERIA_INICIAL()]);
  const [estadoSolicitud, setEstadoSolicitud] = useState('BORRADOR');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerSolicitud(id).then((respuesta) => {
      setEstadoSolicitud(respuesta.datos.Estado || 'BORRADOR');
      const notas = respuesta.datos.notasSimuladas;
      if (notas?.materias?.length) {
        setMaterias(notas.materias.map((m) => ({ nombreMateria: m.NombreMateria, nota: String(m.Nota), periodo: m.Periodo })));
      }
    }).catch((err) => setError(err.mensaje)).finally(() => setCargando(false));
  }, [id]);

  function actualizarMateria(indice, campo, valor) {
    setMaterias((actual) => actual.map((m, i) => (i === indice ? { ...m, [campo]: valor } : m)));
  }
  function agregarMateria() {
    setMaterias((actual) => [...actual, MATERIA_INICIAL()]);
  }
  function quitarMateria(indice) {
    setMaterias((actual) => (actual.length > 1 ? actual.filter((_, i) => i !== indice) : actual));
  }

  const promedio = calcularPromedio(materias);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await guardarNotasSimuladas(id, {
        materias: materias.map((m) => ({ ...m, nota: Number(m.nota) }))
      });
      navegar(`/aspirante/solicitudes/${id}/socioeconomicos`);
    } catch (err) {
      setError(err.mensaje || 'No fue posible guardar las notas simuladas.');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <EstadoCarga />;

  return (
    <div>
      <PasosSolicitud pasoActual="notas" estadoSolicitud={estadoSolicitud} />
      <Tarjeta className="mx-auto w-full max-w-5xl">
        <h1 className="text-headline-sm font-semibold text-primary">Simulación de notas del periodo</h1>
        <AlertaMensaje tipo="info" titulo="Información simulada">
          Estas notas son una simulación ingresada por usted para fines del sistema académico de prueba;
          no provienen de Registro Académico. Escala utilizada: 0 a 100.
        </AlertaMensaje>

        <form className="mt-6 flex flex-col gap-4" onSubmit={manejarEnvio}>
          {error && <AlertaMensaje tipo="error">{error}</AlertaMensaje>}

          {materias.map((materia, indice) => (
            <div key={indice} className="grid gap-2 rounded-md border border-outline-variant p-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
              <CampoTexto etiqueta="Materia" value={materia.nombreMateria} required
                onChange={(e) => actualizarMateria(indice, 'nombreMateria', e.target.value)} />
              <CampoTexto etiqueta="Nota (0-100)" type="number" min="0" max="100" step="0.1" value={materia.nota} required
                onChange={(e) => actualizarMateria(indice, 'nota', e.target.value)} />
              <CampoTexto etiqueta="Periodo académico" value={materia.periodo} required placeholder="Ej. I Cuatrimestre 2026"
                onChange={(e) => actualizarMateria(indice, 'periodo', e.target.value)} />
              <button type="button" className="text-error" disabled={materias.length === 1} onClick={() => quitarMateria(indice)}>
                Quitar
              </button>
            </div>
          ))}

          <div>
            <Boton type="button" variante="secundario" onClick={agregarMateria}>Agregar materia</Boton>
          </div>

          <div className="rounded-md bg-surface-container-low px-4 py-3">
            <p className="font-semibold text-on-surface">
              Promedio calculado: {promedio === null ? '—' : promedio}
            </p>
          </div>

          <Boton type="submit" cargando={guardando}>Guardar y continuar</Boton>
        </form>
      </Tarjeta>
    </div>
  );
}
