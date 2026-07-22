const ESTILOS_POR_TIPO = {
  error: 'bg-error-container text-on-error-container border-error',
  exito: 'bg-exito-container text-exito border-exito',
  advertencia: 'bg-advertencia-container text-advertencia border-advertencia',
  info: 'bg-surface-container text-on-surface border-outline-variant'
};

export default function AlertaMensaje({ tipo = 'info', titulo, children }) {
  return (
    <div className={`rounded-md border-l-4 px-4 py-3 text-body-sm ${ESTILOS_POR_TIPO[tipo] || ESTILOS_POR_TIPO.info}`} role={tipo === 'error' ? 'alert' : 'status'}>
      {titulo && <p className="font-semibold">{titulo}</p>}
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}
