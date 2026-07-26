import { Link, useNavigate } from 'react-router-dom';
import { useSesion } from '../../hooks/useSesion.js';
import Boton from '../comunes/Boton.jsx';

function enlacesPorRol(roles = []) {
  const enlaces = [];
  if (roles.includes('ASPIRANTE')) enlaces.push({ ruta: '/aspirante', etiqueta: 'Mi panel' });
  if (roles.includes('BECADO')) enlaces.push({ ruta: '/apelaciones', etiqueta: 'Mis apelaciones' });
  if (roles.includes('ADMINISTRADOR') || roles.includes('COORDINADOR_BECAS')) {
    enlaces.push({ ruta: '/admin', etiqueta: 'Administración' });
    enlaces.push({ ruta: '/admin/auditoria', etiqueta: 'Auditoría' });
  }
  if (roles.includes('ADMINISTRADOR')) {
    enlaces.push({ ruta: '/admin/configuracion', etiqueta: 'Configuración' });
  }
  if (roles.includes('TRABAJADORA_SOCIAL')) {
    enlaces.push({ ruta: '/trabajo-social/expedientes', etiqueta: 'Expedientes' });
    enlaces.push({ ruta: '/trabajo-social/apelaciones', etiqueta: 'Apelaciones' });
    enlaces.push({ ruta: '/trabajo-social/disciplinario', etiqueta: 'Disciplinario' });
  }
  if (roles.includes('ADMINISTRADOR') || roles.includes('TRABAJADORA_SOCIAL')) {
    enlaces.push({ ruta: '/admin/chatbot', etiqueta: 'Chatbot' });
  }
  if (roles.includes('COMITE_BECAS')) enlaces.push({ ruta: '/comite', etiqueta: 'Comité' });
  enlaces.push({ ruta: '/mi-cuenta/sesiones', etiqueta: 'Mis sesiones' });
  return enlaces;
}

export default function EncabezadoPrivado() {
  const { usuario, cerrarSesion } = useSesion();
  const navegar = useNavigate();

  async function manejarCerrarSesion() {
    await cerrarSesion();
    navegar('/login');
  }

  return (
    <header className="sticky top-0 z-10 border-b border-outline-variant bg-primary-container text-on-primary">
      <div className="mx-auto flex max-w-container-max items-center justify-between px-4 py-3 md:px-12">
        <Link to="/" className="text-headline-sm font-bold">SGBE · CUC</Link>
        <nav className="flex items-center gap-4">
          {enlacesPorRol(usuario?.roles).map((enlace) => (
            <Link key={enlace.ruta} to={enlace.ruta} className="text-body-sm hover:underline">{enlace.etiqueta}</Link>
          ))}
          <span className="hidden text-body-sm md:inline">{usuario?.nombre}</span>
          <Boton variante="secundario" className="border-white text-white hover:bg-white/10" onClick={manejarCerrarSesion}>
            Cerrar sesión
          </Boton>
        </nav>
      </div>
    </header>
  );
}