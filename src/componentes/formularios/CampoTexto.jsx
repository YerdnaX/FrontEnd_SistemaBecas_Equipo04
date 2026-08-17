export default function CampoTexto({ etiqueta, error, success = false, helperText = '', className = '', ...resto }) {
  return (
    <label className={`flex flex-col gap-1 text-body-sm ${className}`}>
      <span className={`font-medium ${success ? 'text-exito' : 'text-on-surface'}`}>{etiqueta}</span>
      <input
        className={`rounded-md border bg-surface-container-low px-3 py-2 text-body-md text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/25 ${
          error ? 'border-error' : success ? 'border-exito text-exito' : 'border-outline-variant'
        }`}
        {...resto}
      />
      {error
        ? <span className="text-label-sm text-error">{error}</span>
        : helperText
          ? <span className="text-label-sm text-on-surface-variant">{helperText}</span>
          : success
            ? <span className="text-label-sm text-exito">Correcto</span>
            : null}
    </label>
  );
}
