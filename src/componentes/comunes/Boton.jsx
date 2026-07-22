const VARIANTES = {
  primario: 'bg-primary-container text-on-primary hover:bg-primary',
  secundario: 'border border-primary-container text-primary-container hover:bg-surface-container',
  peligro: 'bg-error text-on-error hover:opacity-90',
  texto: 'text-primary-container hover:underline'
};

export default function Boton({ variante = 'primario', deshabilitado, cargando, className = '', children, ...resto }) {
  return (
    <button
      disabled={deshabilitado || cargando}
      className={`rounded-md px-4 py-2 text-label-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTES[variante]} ${className}`}
      {...resto}
    >
      {cargando ? 'Procesando...' : children}
    </button>
  );
}
