export default function CampoSelect({ etiqueta, error, opciones = [], etiquetaVacia = 'Seleccione...', className = '', ...resto }) {
  return (
    <label className={`flex flex-col gap-1 text-body-sm ${className}`}>
      <span className="font-medium text-on-surface">{etiqueta}</span>
      <select
        className={`rounded-md border bg-surface-container-low px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/25 ${error ? 'border-error' : 'border-outline-variant'}`}
        {...resto}
      >
        <option value="">{etiquetaVacia}</option>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>
        ))}
      </select>
      {error && <span className="text-label-sm text-error">{error}</span>}
    </label>
  );
}
