import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSesion } from '../../hooks/useSesion.js';
import { rutaPrincipalPorRol } from '../../utilidades/rutasPorRol.js';

const ENLACES = [
  { ruta: '/', etiqueta: 'Inicio' },
  { ruta: '/convocatorias', etiqueta: 'Convocatorias' },
  { ruta: '/noticias', etiqueta: 'Noticias' }
];

export default function EncabezadoPublico() {
  const { usuario } = useSesion();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const rutaMiCuenta = usuario ? rutaPrincipalPorRol(usuario.roles) : null;

  return (
    <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface-container-lowest">
      <div className="mx-auto flex max-w-container-max items-center justify-between px-4 py-4 md:px-12">
        <Link to="/" className="text-headline-sm font-bold text-primary-container">SGBE · CUC</Link>

        <nav className="hidden items-center gap-6 md:flex">
          {ENLACES.map((enlace) => (
            <Link key={enlace.ruta} to={enlace.ruta} className="text-body-md text-on-surface hover:text-primary-container">
              {enlace.etiqueta}
            </Link>
          ))}
          {usuario ? (
            <Link to={rutaMiCuenta} className="rounded-md bg-primary-container px-4 py-2 text-label-md text-on-primary">Mi cuenta</Link>
          ) : (
            <>
              <Link to="/login" className="text-body-md text-on-surface hover:text-primary-container">Iniciar sesión</Link>
              <Link to="/registro" className="rounded-md bg-primary-container px-4 py-2 text-label-md text-on-primary">Registrarme</Link>
            </>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setMenuAbierto((valor) => !valor)} aria-label="Abrir menú">
          <span className="text-headline-sm">☰</span>
        </button>
      </div>

      {menuAbierto && (
        <nav className="flex flex-col gap-3 border-t border-outline-variant px-4 py-4 md:hidden">
          {ENLACES.map((enlace) => (
            <Link key={enlace.ruta} to={enlace.ruta} onClick={() => setMenuAbierto(false)}>{enlace.etiqueta}</Link>
          ))}
          {usuario ? (
            <Link to={rutaMiCuenta} onClick={() => setMenuAbierto(false)}>Mi cuenta</Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuAbierto(false)}>Iniciar sesión</Link>
              <Link to="/registro" onClick={() => setMenuAbierto(false)}>Registrarme</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
