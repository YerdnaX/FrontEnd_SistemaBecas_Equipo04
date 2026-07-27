import EstadoVacio from './EstadoVacio.jsx';

export default function TablaDatos({ columnas, filas, clave = 'id', textoVacio = 'No hay registros' }) {
  if (!filas?.length) return <EstadoVacio titulo={textoVacio} />;
  return (
    <div className="overflow-x-auto rounded-lg border border-outline-variant bg-surface-container-lowest">
      <table className="w-full text-left text-body-sm">
        <thead className="bg-surface-container-low">
          <tr>
            {columnas.map((columna) => <th key={columna.clave} className="px-4 py-3 font-semibold">{columna.etiqueta}</th>)}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, indice) => (
            <tr key={fila[clave] ?? indice} className="border-t border-outline-variant">
              {columnas.map((columna) => (
                <td key={columna.clave} className="px-4 py-3 align-top">
                  {columna.render ? columna.render(fila) : (fila[columna.clave] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

