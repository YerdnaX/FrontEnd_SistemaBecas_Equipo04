export default function EncabezadoPagina({ titulo, descripcion, acciones }) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-outline-variant pb-5 md:flex-row md:items-end">
      <div>
        <h1 className="text-headline-lg font-semibold text-primary">{titulo}</h1>
        {descripcion && <p className="mt-1 max-w-3xl text-body-md text-on-surface-variant">{descripcion}</p>}
      </div>
      {acciones && <div className="flex flex-wrap gap-2">{acciones}</div>}
    </div>
  );
}

