import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSesion } from '../../hooks/useSesion.js';
import { rutaPrincipalPorRol } from '../../utilidades/rutasPorRol.js';

const ENLACES = [
  { ruta: '/', etiqueta: 'Inicio' },
  { ruta: '/convocatorias', etiqueta: 'Convocatorias' },
  { ruta: '/noticias', etiqueta: 'Noticias' },
  { ruta: '/ayuda', etiqueta: 'Ayuda' }
];

function avatarInicial(nombre) {
  return (nombre || '?').trim().charAt(0).toUpperCase() || '?';
}

export default function EncabezadoPublico() {
  const { usuario } = useSesion();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const rutaMiCuenta = usuario ? '/mi-cuenta' : null;

  return (
    <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface-container-lowest/95 backdrop-blur">
      <div className="mx-auto flex max-w-container-max items-center justify-between px-4 py-4 md:px-12">
        <Link to="/" className="flex items-center gap-3 text-headline-sm font-bold text-on-surface">
          <img src="/images/logo.png" alt="Logo SGBE CUC" className="h-14 w-14 object-contain" />
          <span>SGBE · CUC</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {ENLACES.map((enlace) => (
            <Link key={enlace.ruta} to={enlace.ruta} className="text-body-md text-on-surface-variant transition hover:text-primary">
              {enlace.etiqueta}
            </Link>
          ))}
          {usuario ? (
            <Link to={rutaMiCuenta} className="inline-flex items-center gap-2 rounded-md bg-primary-container px-4 py-2 text-label-md text-on-primary-container transition hover:bg-primary">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest font-semibold text-primary-container">
                {avatarInicial(usuario.nombre)}
              </span>
              <span className="hidden sm:inline">Mi cuenta</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-body-md text-on-surface-variant transition hover:text-primary">Iniciar sesión</Link>
              <Link to="/registro" className="rounded-md bg-primary-container px-4 py-2 text-label-md text-on-primary-container transition hover:bg-primary">Registrarme</Link>
            </>
          )}
        </nav>

        <button
          className="rounded-md p-2 text-on-surface md:hidden"
          onClick={() => setMenuAbierto((valor) => !valor)}
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
        >
          <span className="text-headline-sm" aria-hidden="true">☰</span>
        </button>
      </div>

      {menuAbierto && (
        <nav className="anim-fade flex flex-col gap-3 border-t border-outline-variant px-4 py-4 md:hidden">
          {ENLACES.map((enlace) => (
            <Link key={enlace.ruta} to={enlace.ruta} onClick={() => setMenuAbierto(false)} className="text-body-md text-on-surface">{enlace.etiqueta}</Link>
          ))}
          {usuario ? (
            <Link to={rutaMiCuenta} onClick={() => setMenuAbierto(false)} className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container font-semibold text-on-primary-container">
                {avatarInicial(usuario.nombre)}
              </span>
              <span className="text-on-surface">Mi cuenta</span>
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuAbierto(false)} className="text-on-surface">Iniciar sesión</Link>
              <Link to="/registro" onClick={() => setMenuAbierto(false)} className="text-on-surface">Registrarme</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
