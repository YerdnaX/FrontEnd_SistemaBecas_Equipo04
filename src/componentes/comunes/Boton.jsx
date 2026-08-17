const TAMANOS = {
  sm: 'px-3 py-1.5 text-label-sm gap-1.5',
  md: 'px-4 py-2 text-button gap-2',
  lg: 'px-5 py-3 text-body-md gap-2'
};

const VARIANTES = {
  primario: 'bg-primary-container text-on-primary-container shadow-elevation-l1 hover:bg-primary hover:shadow-elevation-l2 active:bg-primary-container',
  secundario: 'border border-outline text-on-surface hover:border-primary-container hover:bg-surface-container-high',
  peligro: 'bg-error text-on-error hover:bg-error/85',
  texto: 'text-primary hover:bg-primary-container/15',
  icono: 'rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
};

export default function Boton({ variante = 'primario', tamano = 'md', deshabilitado, cargando, className = '', children, ...resto }) {
  const esIcono = variante === 'icono';
  return (
    <button
      disabled={deshabilitado || cargando}
      className={`inline-flex items-center justify-center rounded-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        esIcono ? '' : TAMANOS[tamano]
      } ${VARIANTES[variante]} ${className}`}
      {...resto}
    >
      {cargando ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
          Procesando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
