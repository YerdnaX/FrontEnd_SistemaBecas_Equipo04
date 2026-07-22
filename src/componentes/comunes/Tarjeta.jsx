export default function Tarjeta({ className = '', children }) {
  return (
    <div className={`rounded-lg bg-surface-container-lowest p-6 shadow-elevation-l2 ${className}`}>
      {children}
    </div>
  );
}
