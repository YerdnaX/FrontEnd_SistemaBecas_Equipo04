import { Routes, Route } from 'react-router-dom';
import RutaProtegida from './rutas/RutaProtegida.jsx';

import LandingPublico from './paginas/publico/LandingPublico.jsx';
import ListaConvocatoriasPublicas from './paginas/publico/ListaConvocatoriasPublicas.jsx';
import DetalleConvocatoriaPublica from './paginas/publico/DetalleConvocatoriaPublica.jsx';
import ListaNoticiasPublicas from './paginas/publico/ListaNoticiasPublicas.jsx';

import RegistroUsuario from './paginas/autenticacion/RegistroUsuario.jsx';
import ActivacionCuenta from './paginas/autenticacion/ActivacionCuenta.jsx';
import InicioSesion from './paginas/autenticacion/InicioSesion.jsx';
import VerificacionDosFactores from './paginas/autenticacion/VerificacionDosFactores.jsx';
import RecuperacionContrasena from './paginas/autenticacion/RecuperacionContrasena.jsx';
import RestablecimientoContrasena from './paginas/autenticacion/RestablecimientoContrasena.jsx';

import PanelAspirante from './paginas/aspirante/PanelAspirante.jsx';
import SolicitudDatosPersonales from './paginas/aspirante/SolicitudDatosPersonales.jsx';
import SolicitudDatosAcademicos from './paginas/aspirante/SolicitudDatosAcademicos.jsx';
import SolicitudDatosSocioeconomicos from './paginas/aspirante/SolicitudDatosSocioeconomicos.jsx';
import CargaDocumental from './paginas/aspirante/CargaDocumental.jsx';
import RevisionEnvioSolicitud from './paginas/aspirante/RevisionEnvioSolicitud.jsx';
import ResultadoSolicitud from './paginas/aspirante/ResultadoSolicitud.jsx';
import FormalizacionBeneficio from './paginas/aspirante/FormalizacionBeneficio.jsx';
import PanelBecado from './paginas/becado/PanelBecado.jsx';
import ExpedienteBecado from './paginas/becado/ExpedienteBecado.jsx';
import JustificacionesCursos from './paginas/becado/JustificacionesCursos.jsx';
import RenovacionBeca from './paginas/becado/RenovacionBeca.jsx';
import MisConsultas from './paginas/consultas/MisConsultas.jsx';
import ActivacionFinanciera from './paginas/finanzas/ActivacionFinanciera.jsx';
import ValidacionAcademica from './paginas/registro-academico/ValidacionAcademica.jsx';

import PanelAdministrativo from './paginas/administracion/PanelAdministrativo.jsx';
import GestionTiposBeca from './paginas/administracion/GestionTiposBeca.jsx';
import ListaConvocatoriasAdministrativas from './paginas/administracion/ListaConvocatoriasAdministrativas.jsx';
import FormularioConvocatoria from './paginas/administracion/FormularioConvocatoria.jsx';
import GestionEtapasConvocatoria from './paginas/administracion/GestionEtapasConvocatoria.jsx';
import GestionNoticias from './paginas/administracion/GestionNoticias.jsx';
import GestionUsuarios from './paginas/administracion/GestionUsuarios.jsx';
import FormularioUsuario from './paginas/administracion/FormularioUsuario.jsx';
import GestionRolesPermisos from './paginas/administracion/GestionRolesPermisos.jsx';
import GestionEmpleados from './paginas/administracion/GestionEmpleados.jsx';
import MiembrosComite from './paginas/administracion/MiembrosComite.jsx';

import BandejaExpedientes from './paginas/trabajo-social/BandejaExpedientes.jsx';
import DetalleExpediente from './paginas/trabajo-social/DetalleExpediente.jsx';
import VerificacionDocumental from './paginas/trabajo-social/VerificacionDocumental.jsx';
import EvaluacionIntegral from './paginas/trabajo-social/EvaluacionIntegral.jsx';
import VisitaDomiciliaria from './paginas/trabajo-social/VisitaDomiciliaria.jsx';
import BandejaConsultas from './paginas/trabajo-social/BandejaConsultas.jsx';
import SeguimientoBecario from './paginas/trabajo-social/SeguimientoBecario.jsx';
import RevisionJustificacionCurso from './paginas/trabajo-social/RevisionJustificacionCurso.jsx';
import RevisionRenovacion from './paginas/trabajo-social/RevisionRenovacion.jsx';

import PanelComite from './paginas/comite/PanelComite.jsx';
import SesionComite from './paginas/comite/SesionComite.jsx';
import ActasInformesComite from './paginas/comite/ActasInformesComite.jsx';
import ReportesIndicadores from './paginas/reportes/ReportesIndicadores.jsx';

import AccesoDenegado from './paginas/AccesoDenegado.jsx';

const ROLES_ASPIRANTE = ['ASPIRANTE'];
const ROLES_SOLICITANTE = ['ASPIRANTE', 'BECADO'];
const ROLES_BECADO = ['BECADO'];
const ROLES_ADMINISTRACION = ['ADMINISTRADOR', 'COORDINADOR_BECAS'];
const ROLES_ADMIN = ['ADMINISTRADOR'];
const ROLES_TRABAJO_SOCIAL = ['TRABAJADORA_SOCIAL', 'ADMINISTRADOR'];
const ROLES_COMITE = ['COMITE_BECAS', 'ADMINISTRADOR'];
const ROLES_REPORTES = ['TRABAJADORA_SOCIAL', 'COORDINADOR_BECAS', 'COMITE_BECAS', 'ADMINISTRADOR'];
const ROLES_FINANZAS = ['FINANZAS', 'ADMINISTRADOR'];
const ROLES_REGISTRO = ['REGISTRO_ACADEMICO', 'ADMINISTRADOR'];

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPublico />} />
      <Route path="/convocatorias" element={<ListaConvocatoriasPublicas />} />
      <Route path="/convocatorias/:id" element={<DetalleConvocatoriaPublica />} />
      <Route path="/noticias" element={<ListaNoticiasPublicas />} />

      <Route path="/registro" element={<RegistroUsuario />} />
      <Route path="/activar-cuenta" element={<ActivacionCuenta />} />
      <Route path="/login" element={<InicioSesion />} />
      <Route path="/verificar-2fa" element={<VerificacionDosFactores />} />
      <Route path="/recuperar-contrasena" element={<RecuperacionContrasena />} />
      <Route path="/restablecer-contrasena" element={<RestablecimientoContrasena />} />

      <Route path="/aspirante" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><PanelAspirante /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/personal" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><SolicitudDatosPersonales /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/academicos" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><SolicitudDatosAcademicos /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/socioeconomicos" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><SolicitudDatosSocioeconomicos /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/documentos" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><CargaDocumental /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/revision" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><RevisionEnvioSolicitud /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/resultado" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><ResultadoSolicitud /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/formalizacion" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><FormalizacionBeneficio /></RutaProtegida>} />

      <Route path="/becado" element={<RutaProtegida rolesPermitidos={ROLES_BECADO}><PanelBecado /></RutaProtegida>} />
      <Route path="/becado/expediente" element={<RutaProtegida rolesPermitidos={ROLES_BECADO}><ExpedienteBecado /></RutaProtegida>} />
      <Route path="/becado/justificaciones" element={<RutaProtegida rolesPermitidos={ROLES_BECADO}><JustificacionesCursos /></RutaProtegida>} />
      <Route path="/becado/renovaciones/:id" element={<RutaProtegida rolesPermitidos={ROLES_BECADO}><RenovacionBeca /></RutaProtegida>} />
      <Route path="/consultas" element={<RutaProtegida rolesPermitidos={ROLES_SOLICITANTE}><MisConsultas /></RutaProtegida>} />

      <Route path="/finanzas/beneficios/:id" element={<RutaProtegida rolesPermitidos={ROLES_FINANZAS}><ActivacionFinanciera /></RutaProtegida>} />
      <Route path="/registro-academico/expedientes/:id" element={<RutaProtegida rolesPermitidos={ROLES_REGISTRO}><ValidacionAcademica /></RutaProtegida>} />

      <Route path="/admin" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><PanelAdministrativo /></RutaProtegida>} />
      <Route path="/admin/tipos-beca" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><GestionTiposBeca /></RutaProtegida>} />
      <Route path="/admin/convocatorias" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><ListaConvocatoriasAdministrativas /></RutaProtegida>} />
      <Route path="/admin/convocatorias/:id" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><FormularioConvocatoria /></RutaProtegida>} />
      <Route path="/admin/convocatorias/:id/etapas" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><GestionEtapasConvocatoria /></RutaProtegida>} />
      <Route path="/admin/noticias" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><GestionNoticias /></RutaProtegida>} />
      <Route path="/admin/usuarios" element={<RutaProtegida rolesPermitidos={ROLES_ADMIN}><GestionUsuarios /></RutaProtegida>} />
      <Route path="/admin/usuarios/:id" element={<RutaProtegida rolesPermitidos={ROLES_ADMIN}><FormularioUsuario /></RutaProtegida>} />
      <Route path="/admin/roles" element={<RutaProtegida rolesPermitidos={ROLES_ADMIN}><GestionRolesPermisos /></RutaProtegida>} />
      <Route path="/admin/empleados" element={<RutaProtegida rolesPermitidos={ROLES_ADMIN}><GestionEmpleados /></RutaProtegida>} />
      <Route path="/admin/comite/miembros" element={<RutaProtegida rolesPermitidos={ROLES_ADMIN}><MiembrosComite /></RutaProtegida>} />

      <Route path="/trabajo-social/expedientes" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><BandejaExpedientes /></RutaProtegida>} />
      <Route path="/trabajo-social/expedientes/:id" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><DetalleExpediente /></RutaProtegida>} />
      <Route path="/trabajo-social/expedientes/:id/documentos" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><VerificacionDocumental /></RutaProtegida>} />
      <Route path="/trabajo-social/expedientes/:id/evaluacion" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><EvaluacionIntegral /></RutaProtegida>} />
      <Route path="/trabajo-social/expedientes/:id/visita" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><VisitaDomiciliaria /></RutaProtegida>} />
      <Route path="/trabajo-social/consultas" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><BandejaConsultas /></RutaProtegida>} />
      <Route path="/trabajo-social/becarios/:id/seguimiento" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><SeguimientoBecario /></RutaProtegida>} />
      <Route path="/trabajo-social/justificaciones/:id" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><RevisionJustificacionCurso /></RutaProtegida>} />
      <Route path="/trabajo-social/renovaciones/:id" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><RevisionRenovacion /></RutaProtegida>} />

      <Route path="/comite" element={<RutaProtegida rolesPermitidos={ROLES_COMITE}><PanelComite /></RutaProtegida>} />
      <Route path="/comite/sesiones/:id" element={<RutaProtegida rolesPermitidos={ROLES_COMITE}><SesionComite /></RutaProtegida>} />
      <Route path="/comite/informes" element={<RutaProtegida rolesPermitidos={ROLES_COMITE}><ActasInformesComite /></RutaProtegida>} />
      <Route path="/reportes" element={<RutaProtegida rolesPermitidos={ROLES_REPORTES}><ReportesIndicadores /></RutaProtegida>} />

      <Route path="*" element={<AccesoDenegado />} />
    </Routes>
  );
}
