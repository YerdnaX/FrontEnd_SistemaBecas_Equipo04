import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../componentes/comunes/EncabezadoPagina.jsx';
import TablaDatos from '../../componentes/comunes/TablaDatos.jsx';
import Boton from '../../componentes/comunes/Boton.jsx';
import AlertaMensaje from '../../componentes/comunes/AlertaMensaje.jsx';
import { generarDocumentoActa, listarActas } from '../../servicios/servicioSegmentoDos.js';

export default function ActasInformesComite() {
  const [actas, setActas] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  async function cargar() {
    try { setActas((await listarActas()).datos); }
    catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }
  useEffect(() => { cargar(); }, []);

  async function generar(id) {
    try {
      const respuesta = await generarDocumentoActa(id);
      setMensaje({ tipo: 'exito', texto: `Documento PDF generado y asociado (archivo #${respuesta.datos.idArchivo}).` });
      cargar();
    } catch (error) { setMensaje({ tipo: 'error', texto: error.message }); }
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Actas e informes del comité" descripcion="Repositorio institucional de sesiones, acuerdos y documentos generados." />
      {mensaje && <AlertaMensaje tipo={mensaje.tipo}>{mensaje.texto}</AlertaMensaje>}
      <TablaDatos filas={actas} clave="IdActa" columnas={[
        { clave: 'NumeroActa', etiqueta: 'Acta' },
        { clave: 'Sesion', etiqueta: 'Sesión' },
        { clave: 'FechaSesion', etiqueta: 'Fecha', render: (fila) => new Date(fila.FechaSesion).toLocaleDateString('es-CR') },
        { clave: 'Estado', etiqueta: 'Estado' },
        { clave: 'IdArchivo', etiqueta: 'Documento', render: (fila) => fila.IdArchivo ? `Archivo #${fila.IdArchivo}` : 'Pendiente' },
        { clave: 'acciones', etiqueta: 'Acciones', render: (fila) => <Boton variante="texto" onClick={() => generar(fila.IdActa)}>Generar PDF</Boton> }
      ]} />
    </div>
  );
}

