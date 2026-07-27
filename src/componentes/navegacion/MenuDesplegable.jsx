import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MenuDesplegable({ etiqueta, enlaces, alinear = 'izquierda', botonClassName = '', children }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierto((valor) => !valor)}
        aria-expanded={abierto}
        className={botonClassName || 'flex items-center gap-1 text-body-sm hover:underline'}
      >
        {children || (
          <>
            {etiqueta}
            <span aria-hidden="true" className={`text-[10px] transition-transform ${abierto ? 'rotate-180' : ''}`}>▾</span>
          </>
        )}
      </button>
      {abierto && (
        <div className={`absolute ${alinear === 'derecha' ? 'right-0' : 'left-0'} z-30 mt-2 w-56 overflow-hidden rounded-lg border border-outline-variant bg-white text-on-surface shadow-elevation-l3`}>
          {enlaces.map((enlace) => (
            <Link
              key={enlace.ruta}
              to={enlace.ruta}
              onClick={() => setAbierto(false)}
              className="block border-b border-outline-variant px-4 py-2 text-body-sm last:border-0 hover:bg-surface-container"
            >
              {enlace.etiqueta}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
