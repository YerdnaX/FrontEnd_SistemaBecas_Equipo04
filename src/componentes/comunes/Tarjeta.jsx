export default function Tarjeta({ className = '', interactiva = false, children, ...resto }) {
  return (
    <div
      className={`rounded-lg border border-outline-variant bg-surface-container p-6 shadow-elevation-l1 ${
        interactiva ? 'transition hover:border-outline hover:bg-surface-container-high' : ''
      } ${className}`}
      {...resto}
    >
      {children}
    </div>
  );
}
