import { Routes, Route } from 'react-router-dom';
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
import SolicitudDatosPersonales from './paginas/aspirante/SolicitudDatosPersonales.jsx';
import SolicitudDatosAcademicos from './paginas/aspirante/SolicitudDatosAcademicos.jsx';
import SolicitudDatosSocioeconomicos from './paginas/aspirante/SolicitudDatosSocioeconomicos.jsx';
import CargaDocumental from './paginas/aspirante/CargaDocumental.jsx';
import RevisionEnvioSolicitud from './paginas/aspirante/RevisionEnvioSolicitud.jsx';
import ResultadoSolicitud from './paginas/aspirante/ResultadoSolicitud.jsx';

import PanelAdministrativo from './paginas/administracion/PanelAdministrativo.jsx';
import GestionTiposBeca from './paginas/administracion/GestionTiposBeca.jsx';
import ListaConvocatoriasAdministrativas from './paginas/administracion/ListaConvocatoriasAdministrativas.jsx';
import FormularioConvocatoria from './paginas/administracion/FormularioConvocatoria.jsx';
import GestionEtapasConvocatoria from './paginas/administracion/GestionEtapasConvocatoria.jsx';

import BandejaExpedientes from './paginas/trabajo-social/BandejaExpedientes.jsx';
import DetalleExpediente from './paginas/trabajo-social/DetalleExpediente.jsx';
import VerificacionDocumental from './paginas/trabajo-social/VerificacionDocumental.jsx';
import EvaluacionIntegral from './paginas/trabajo-social/EvaluacionIntegral.jsx';

import PanelComite from './paginas/comite/PanelComite.jsx';
import SesionComite from './paginas/comite/SesionComite.jsx';

import AccesoDenegado from './paginas/AccesoDenegado.jsx';

const ROLES_ASPIRANTE = ['ASPIRANTE'];
const ROLES_ADMINISTRACION = ['ADMINISTRADOR', 'COORDINADOR_BECAS'];
const ROLES_TRABAJO_SOCIAL = ['TRABAJADORA_SOCIAL', 'ADMINISTRADOR'];
const ROLES_COMITE = ['COMITE_BECAS', 'ADMINISTRADOR'];

export default function App() {
  return (
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
      <Route path="/aspirante/solicitudes/:id/personal" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><SolicitudDatosPersonales /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/academicos" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><SolicitudDatosAcademicos /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/socioeconomicos" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><SolicitudDatosSocioeconomicos /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/documentos" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><CargaDocumental /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/revision" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><RevisionEnvioSolicitud /></RutaProtegida>} />
      <Route path="/aspirante/solicitudes/:id/resultado" element={<RutaProtegida rolesPermitidos={ROLES_ASPIRANTE}><ResultadoSolicitud /></RutaProtegida>} />

      <Route path="/admin" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><PanelAdministrativo /></RutaProtegida>} />
      <Route path="/admin/tipos-beca" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><GestionTiposBeca /></RutaProtegida>} />
      <Route path="/admin/convocatorias" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><ListaConvocatoriasAdministrativas /></RutaProtegida>} />
      <Route path="/admin/convocatorias/:id" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><FormularioConvocatoria /></RutaProtegida>} />
      <Route path="/admin/convocatorias/:id/etapas" element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRACION}><GestionEtapasConvocatoria /></RutaProtegida>} />

      <Route path="/trabajo-social/expedientes" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><BandejaExpedientes /></RutaProtegida>} />
      <Route path="/trabajo-social/expedientes/:id" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><DetalleExpediente /></RutaProtegida>} />
      <Route path="/trabajo-social/expedientes/:id/documentos" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><VerificacionDocumental /></RutaProtegida>} />
      <Route path="/trabajo-social/expedientes/:id/evaluacion" element={<RutaProtegida rolesPermitidos={ROLES_TRABAJO_SOCIAL}><EvaluacionIntegral /></RutaProtegida>} />

      <Route path="/comite" element={<RutaProtegida rolesPermitidos={ROLES_COMITE}><PanelComite /></RutaProtegida>} />
      <Route path="/comite/sesiones/:id" element={<RutaProtegida rolesPermitidos={ROLES_COMITE}><SesionComite /></RutaProtegida>} />

      <Route path="*" element={<AccesoDenegado />} />
    </Routes>
  );
}
