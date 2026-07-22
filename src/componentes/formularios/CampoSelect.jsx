export default function CampoSelect({ etiqueta, error, opciones = [], className = '', ...resto }) {
  return (
    <label className={`flex flex-col gap-1 text-body-sm ${className}`}>
      <span className="font-medium text-on-surface">{etiqueta}</span>
      <select
        className={`rounded-md border bg-white px-3 py-2 text-body-md outline-none focus:border-primary-container ${error ? 'border-error' : 'border-outline-variant'}`}
        {...resto}
      >
        <option value="">Seleccione...</option>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>
        ))}
      </select>
      {error && <span className="text-label-sm text-error">{error}</span>}
    </label>
  );
}
