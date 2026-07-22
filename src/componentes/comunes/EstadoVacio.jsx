export default function EstadoVacio({ titulo = 'No hay información disponible', descripcion, accion }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-outline-variant bg-surface-container-low py-14 text-center">
      <p className="text-headline-sm font-semibold text-on-surface">{titulo}</p>
      {descripcion && <p className="max-w-md text-body-sm text-on-surface-variant">{descripcion}</p>}
      {accion}
    </div>
  );
}
