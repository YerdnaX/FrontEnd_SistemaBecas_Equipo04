import { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import RutaProtegida from './rutas/RutaProtegida.jsx';

import LandingPublico from './paginas/publico/LandingPublico.jsx';
import ListaConvocatoriasPublicas from './paginas/publico/ListaConvocatoriasPublicas.jsx';
import DetalleConvocatoriaPublica from './paginas/publico/DetalleConvocatoriaPublica.jsx';
import ListaNoticiasPublicas from './paginas/publico/ListaNoticiasPublicas.jsx';

import RegistroUsuario from './paginas/autenticacion/RegistroUsuario.jsx';
import InicioSesion from './paginas/autenticacion/InicioSesion.jsx';
import RecuperacionContrasena from './paginas/autenticacion/RecuperacionContrasena.jsx';
import RestablecimientoContrasena from './paginas/autenticacion/RestablecimientoContrasena.jsx';

import PanelAspirante from './paginas/aspirante/PanelAspirante.jsx';
import ContinuarSolicitud from './paginas/aspirante/ContinuarSolicitud.jsx';
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
import BandejaBeneficios from './paginas/beneficios/BandejaBeneficios.jsx';

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
import BandejaJustificaciones from './paginas/trabajo-social/BandejaJustificaciones.jsx';
import BandejaRenovaciones from './paginas/trabajo-social/BandejaRenovaciones.jsx';
import ConvocatoriasBecas from './paginas/trabajo-social/ConvocatoriasBecas.jsx';

import PanelComite from './paginas/comite/PanelComite.jsx';
import SesionComite from './paginas/comite/SesionComite.jsx';
import ActasInformesComite from './paginas/comite/ActasInformesComite.jsx';
import ReportesIndicadores from './paginas/reportes/ReportesIndicadores.jsx';

import ApelacionEstudiante from './paginas/apelaciones/ApelacionEstudiante.jsx';
import BandejaApelaciones from './paginas/apelaciones/BandejaApelaciones.jsx';
import DetalleApelacion from './paginas/apelaciones/DetalleApelacion.jsx';
import DescargosBecado from './paginas/becado/DescargosBecado.jsx';
import BandejaDisciplinario from './paginas/trabajo-social/BandejaDisciplinario.jsx';
import DetalleDisciplinario from './paginas/trabajo-social/DetalleDisciplinario.jsx';
import CierreExpediente from './paginas/trabajo-social/CierreExpediente.jsx';
import ConfiguracionSistema from './paginas/administracion/ConfiguracionSistema.jsx';
import Auditoria from './paginas/administracion/Auditoria.jsx';
import ChatbotAdmin from './paginas/administracion/ChatbotAdmin.jsx';
import ChatbotPublico from './paginas/publico/ChatbotPublico.jsx';
import MisSesiones from './paginas/cuenta/MisSesiones.jsx';
import MiCuenta from './paginas/cuenta/MiCuenta.jsx';

import AccesoDenegado from './paginas/AccesoDenegado.jsx';
import SesionExpirada from './paginas/SesionExpirada.jsx';
import NoEncontrado from './paginas/NoEncontrado.jsx';
import BotonChatAsistente from './componentes/asistente/BotonChatAsistente.jsx';

const ROLES_ASPIRANTE = ['ASPIRANTE'];
const ROLES_BECADO = ['BECADO', 'ADMINISTRADOR'];
const ROLES_ADMINISTRACION = ['ADMINISTRADOR', 'COORDINADOR_BECAS'];
const ROLES_TRABAJO_SOCIAL = ['TRABAJADORA_SOCIAL', 'ADMINISTRADOR'];
const ROLES_COMITE = ['COMITE_BECAS', 'ADMINISTRADOR'];
const ROLES_CONFIGURACION = ['ADMINISTRADOR'];
const ROLES_CHATBOT_GESTION = ['ADMINISTRADOR', 'TRABAJADORA_SOCIAL'];

export default function App() {
  const navegar = useNavigate();

  useEffect(() => {
    function manejarSesionExpirada() {
      navegar('/sesion-expirada');
    }
    window.addEventListener('sgbe:sesion-expirada', manejarSesionExpirada);
    return () => window.removeEventListener('sgbe:sesion-expirada', manejarSesionExpirada);
  }, [navegar]);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPublico />} />
          <Route path="/convocatorias" element={<ListaConvocatoriasPublicas />} />
          <Route path="/convocatorias/:id" element={<DetalleConvocatoriaPublica />} />
          <Route path="/noticias" element={<ListaNoticiasPublicas />} />

          <Route path="/registro" element={<RegistroUsuario />} />
          <Route path="/login" element={<InicioSesion />} />
          <Route path="/recuperar-contrasena" element={<RecuperacionContrasena />} />
          <Route path="/restablecer-contrasena" element={<RestablecimientoContrasena />} />

          <Route path="/aspirante" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><PanelAspirante /></RutaProtegida>} />
          <Route path="/aspirante/solicitudes/:id/continuar" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><ContinuarSolicitud /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/personal" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><SolicitudDatosPersonales /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/academicos" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><SolicitudDatosAcademicos /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/socioeconomicos" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><SolicitudDatosSocioeconomicos /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/documentos" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><CargaDocumental /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/revision" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><RevisionEnvioSolicitud /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/resultado" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><ResultadoSolicitud /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/formalizacion" element={<RutaProtegida permisosRequeridos={['FORMALIZACION_GESTIONAR']}><FormalizacionBeneficio /></RutaProtegida>} />

      <Route path="/becado" element={<RutaProtegida permisosRequeridos={['BECADO_VER_PROPIO']}><PanelBecado /></RutaProtegida>} />
      <Route path="/becado/expediente" element={<RutaProtegida permisosRequeridos={['BECADO_VER_PROPIO']}><ExpedienteBecado /></RutaProtegida>} />
      <Route path="/becado/justificaciones" element={<RutaProtegida permisosRequeridos={['JUSTIFICACION_CREAR_PROPIA']}><JustificacionesCursos /></RutaProtegida>} />
      <Route path="/becado/renovaciones/:id" element={<RutaProtegida permisosRequeridos={['RENOVACION_CREAR_PROPIA']}><RenovacionBeca /></RutaProtegida>} />
      <Route path="/consultas" element={<RutaProtegida permisosRequeridos={['CONSULTA_CREAR_PROPIA']}><MisConsultas /></RutaProtegida>} />

      <Route path="/finanzas" element={<RutaProtegida permisosRequeridos={['ACTIVACION_FINANCIERA_GESTIONAR']}><BandejaBeneficios area="finanzas" /></RutaProtegida>} />
      <Route path="/finanzas/beneficios/:id" element={<RutaProtegida permisosRequeridos={['ACTIVACION_FINANCIERA_GESTIONAR']}><ActivacionFinanciera /></RutaProtegida>} />
      <Route path="/registro-academico" element={<RutaProtegida permisosRequeridos={['VALIDACION_ACADEMICA_GESTIONAR']}><BandejaBeneficios area="registro" /></RutaProtegida>} />
      <Route path="/registro-academico/expedientes/:id" element={<RutaProtegida permisosRequeridos={['VALIDACION_ACADEMICA_GESTIONAR']}><ValidacionAcademica /></RutaProtegida>} />

      <Route path="/admin" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><PanelAdministrativo /></RutaProtegida>} />
      <Route path="/admin/tipos-beca" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><GestionTiposBeca /></RutaProtegida>} />
      <Route path="/admin/convocatorias" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><ListaConvocatoriasAdministrativas /></RutaProtegida>} />
      <Route path="/admin/convocatorias/:id" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><FormularioConvocatoria /></RutaProtegida>} />
      <Route path="/admin/convocatorias/:id/etapas" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><GestionEtapasConvocatoria /></RutaProtegida>} />
      <Route path="/admin/noticias" element={<RutaProtegida permisosRequeridos={['NOTICIA_GESTIONAR']}><GestionNoticias /></RutaProtegida>} />
      <Route path="/admin/usuarios" element={<RutaProtegida permisosRequeridos={['USUARIO_GESTIONAR']}><GestionUsuarios /></RutaProtegida>} />
      <Route path="/admin/usuarios/:id" element={<RutaProtegida permisosRequeridos={['USUARIO_GESTIONAR']}><FormularioUsuario /></RutaProtegida>} />
      <Route path="/admin/roles" element={<RutaProtegida permisosRequeridos={['ROL_GESTIONAR']}><GestionRolesPermisos /></RutaProtegida>} />
      <Route path="/admin/empleados" element={<RutaProtegida permisosRequeridos={['EMPLEADO_GESTIONAR']}><GestionEmpleados /></RutaProtegida>} />
      <Route path="/admin/comite/miembros" element={<RutaProtegida permisosRequeridos={['COMITE_MIEMBRO_GESTIONAR']}><MiembrosComite /></RutaProtegida>} />

      <Route path="/trabajo-social/expedientes" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><BandejaExpedientes /></RutaProtegida>} />
      <Route path="/trabajo-social/expedientes/:id" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><DetalleExpediente /></RutaProtegida>} />
      <Route path="/trabajo-social/expedientes/:id/documentos" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><VerificacionDocumental /></RutaProtegida>} />
      <Route path="/trabajo-social/expedientes/:id/evaluacion" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><EvaluacionIntegral /></RutaProtegida>} />
      <Route path="/trabajo-social/expedientes/:id/visita" element={<RutaProtegida permisosRequeridos={['VISITA_GESTIONAR']}><VisitaDomiciliaria /></RutaProtegida>} />
      <Route path="/trabajo-social/consultas" element={<RutaProtegida permisosRequeridos={['CONSULTA_GESTIONAR']}><BandejaConsultas /></RutaProtegida>} />
      <Route path="/trabajo-social/becarios" element={<RutaProtegida permisosRequeridos={['SEGUIMIENTO_GESTIONAR']}><BandejaBeneficios area="seguimiento" /></RutaProtegida>} />
      <Route path="/trabajo-social/becarios/:id/seguimiento" element={<RutaProtegida permisosRequeridos={['SEGUIMIENTO_GESTIONAR']}><SeguimientoBecario /></RutaProtegida>} />
      <Route path="/trabajo-social/justificaciones" element={<RutaProtegida permisosRequeridos={['JUSTIFICACION_RESOLVER']}><BandejaJustificaciones /></RutaProtegida>} />
      <Route path="/trabajo-social/justificaciones/:id" element={<RutaProtegida permisosRequeridos={['JUSTIFICACION_RESOLVER']}><RevisionJustificacionCurso /></RutaProtegida>} />
      <Route path="/trabajo-social/renovaciones" element={<RutaProtegida permisosRequeridos={['RENOVACION_RESOLVER']}><BandejaRenovaciones /></RutaProtegida>} />
      <Route path="/trabajo-social/renovaciones/:id" element={<RutaProtegida permisosRequeridos={['RENOVACION_RESOLVER']}><RevisionRenovacion /></RutaProtegida>} />
      <Route path="/trabajo-social/convocatorias" element={<RutaProtegida permisosRequeridos={['CONVOCATORIA_VER']}><ConvocatoriasBecas /></RutaProtegida>} />

      <Route path="/comite" element={<RutaProtegida rolesPermitidos={ROLES_COMITE}><PanelComite /></RutaProtegida>} />
      <Route path="/comite/sesiones/:id" element={<RutaProtegida rolesPermitidos={ROLES_COMITE}><SesionComite /></RutaProtegida>} />
      <Route path="/comite/informes" element={<RutaProtegida permisosRequeridos={['ACTA_VER']}><ActasInformesComite /></RutaProtegida>} />
      <Route path="/reportes" element={<RutaProtegida permisosRequeridos={['REPORTE_VER']}><ReportesIndicadores /></RutaProtegida>} />

          {/* Segmento 03 */}
          <Route path="/ayuda" element={<ChatbotPublico />} />

          <Route path="/mi-cuenta/sesiones" element={<RutaProtegida><MisSesiones /></RutaProtegida>} />
          <Route path="/mi-cuenta" element={<RutaProtegida><MiCuenta /></RutaProtegida>} />

          <Route path="/apelaciones" element={<RutaProtegida><BandejaApelaciones /></RutaProtegida>} />
          <Route path="/apelaciones/:id" element={<RutaProtegida><DetalleApelacion /></RutaProtegida>} />
          <Route path="/apelaciones/resoluciones/:idResolucion" element={<RutaProtegida permisosRequeridos={['APELACION_CREAR_PROPIA']}><ApelacionEstudiante /></RutaProtegida>} />

          <Route path="/becado/descargos/:id" element={<RutaProtegida rolesPermitidos={ROLES_BECADO}><DescargosBecado /></RutaProtegida>} />

          <Route path="/trabajo-social/apelaciones" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><BandejaApelaciones /></RutaProtegida>} />
          <Route path="/trabajo-social/disciplinario" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><BandejaDisciplinario /></RutaProtegida>} />
          <Route path="/trabajo-social/disciplinario/:id" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><DetalleDisciplinario /></RutaProtegida>} />
          <Route path="/trabajo-social/expedientes/:id/cierre" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><CierreExpediente /></RutaProtegida>} />

          <Route path="/admin/configuracion" element={<RutaProtegida rolesPermitidos={ROLES_CONFIGURACION}><ConfiguracionSistema /></RutaProtegida>} />
          <Route path="/admin/auditoria" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><Auditoria /></RutaProtegida>} />
          <Route path="/admin/chatbot" element={<RutaProtegida rolesPermitidos={ROLES_CHATBOT_GESTION}><ChatbotAdmin /></RutaProtegida>} />

          <Route path="/403" element={<AccesoDenegado />} />
          <Route path="/sesion-expirada" element={<SesionExpirada />} />

          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>

      <footer className="border-t border-outline-variant bg-surface-container-lowest py-6">
        <div className="mx-auto flex max-w-container-max justify-center px-4 md:px-12">
          <Link to="/" aria-label="Ir al inicio">
            <img src="/images/logo.png" alt="Logo SGBE CUC" className="h-16 w-16 object-contain" />
          </Link>
        </div>
      </footer>

      <BotonChatAsistente />
    </div>
  );
}
