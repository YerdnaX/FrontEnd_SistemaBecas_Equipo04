export default function EstadoCarga({ mensaje = 'Cargando información...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-on-surface-variant">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-container border-t-transparent" />
      <p className="text-body-md">{mensaje}</p>
    </div>
  );
}
