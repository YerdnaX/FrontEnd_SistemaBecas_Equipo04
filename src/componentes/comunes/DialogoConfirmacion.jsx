import Boton from './Boton.jsx';

export default function DialogoConfirmacion({ abierto, titulo, mensaje, confirmar, cancelar, cargando }) {
  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-elevation-l3">
        <h2 className="text-headline-sm font-semibold text-primary">{titulo}</h2>
        <p className="mt-3 text-body-md text-on-surface-variant">{mensaje}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Boton variante="secundario" onClick={cancelar}>Cancelar</Boton>
          <Boton cargando={cargando} onClick={confirmar}>Confirmar</Boton>
        </div>
      </div>
    </div>
  );
}

