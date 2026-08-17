import { useEffect } from 'react';
import Boton from './Boton.jsx';

export default function DialogoConfirmacion({
  abierto,
  titulo,
  mensaje,
  confirmar,
  cancelar,
  cargando,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  varianteConfirmar = 'primario',
  children
}) {
  useEffect(() => {
    if (!abierto) return;
    function manejarTecla(evento) {
      if (evento.key === 'Escape') cancelar?.();
    }
    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [abierto, cancelar]);

  if (!abierto) return null;

  return (
    <div className="anim-fade fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="dialogo-confirmacion-titulo">
      <div className="anim-pop w-full max-w-md rounded-lg border border-outline-variant bg-surface-container-high p-6 shadow-elevation-l3">
        <h2 id="dialogo-confirmacion-titulo" className="text-headline-sm font-semibold text-on-surface">{titulo}</h2>
        {mensaje && <p className="mt-3 text-body-md text-on-surface-variant">{mensaje}</p>}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <Boton variante="secundario" onClick={cancelar} disabled={cargando}>{textoCancelar}</Boton>
          <Boton variante={varianteConfirmar} cargando={cargando} onClick={confirmar}>{textoConfirmar}</Boton>
        </div>
      </div>
    </div>
  );
}
