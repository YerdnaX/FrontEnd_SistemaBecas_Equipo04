export default function CampoAreaTexto({ etiqueta, error, className = '', ...resto }) {
  return (
    <label className={`flex flex-col gap-1 text-body-sm ${className}`}>
      <span className="font-medium text-on-surface">{etiqueta}</span>
      <textarea
        className={`min-h-28 rounded-md border bg-surface-container-low px-3 py-2 text-body-md text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/25 ${error ? 'border-error' : 'border-outline-variant'}`}
        {...resto}
      />
      {error && <span className="text-label-sm text-error">{error}</span>}
    </label>
  );
}
