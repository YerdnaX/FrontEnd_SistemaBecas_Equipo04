const CATEGORIAS = {
  ACADEMICA: { etiqueta: 'Académica', clase: 'bg-categoria-academica-container text-categoria-academica', barra: 'bg-categoria-academica', borde: 'border-categoria-academica' },
  FINANCIERA: { etiqueta: 'Financiera', clase: 'bg-categoria-financiera-container text-categoria-financiera', barra: 'bg-categoria-financiera', borde: 'border-categoria-financiera' },
  CONVOCATORIA: { etiqueta: 'Convocatoria', clase: 'bg-categoria-convocatoria-container text-categoria-convocatoria', barra: 'bg-categoria-convocatoria', borde: 'border-categoria-convocatoria' },
  EVENTO: { etiqueta: 'Evento', clase: 'bg-categoria-evento-container text-categoria-evento', barra: 'bg-categoria-evento', borde: 'border-categoria-evento' },
  URGENTE: { etiqueta: 'Urgente', clase: 'bg-categoria-urgente-container text-categoria-urgente', barra: 'bg-categoria-urgente', borde: 'border-categoria-urgente' },
  GENERAL: { etiqueta: 'General', clase: 'bg-categoria-general-container text-categoria-general', barra: 'bg-categoria-general', borde: 'border-categoria-general' }
};

export function obtenerCategoria(categoria) {
  return CATEGORIAS[categoria] || CATEGORIAS.GENERAL;
}

export const OPCIONES_CATEGORIA = Object.entries(CATEGORIAS).map(([valor, { etiqueta }]) => ({ valor, etiqueta }));

/**
 * Insignia de color por categoría/tema de noticia (tarea 20). Reutiliza la
 * misma paleta que la franja lateral de las tarjetas de noticias para que
 * el color sea consistente en toda la aplicación (tarea 14).
 */
export default function EtiquetaCategoria({ categoria }) {
  const { etiqueta, clase } = obtenerCategoria(categoria);
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-label-sm font-semibold ${clase}`}>
      {etiqueta}
    </span>
  );
}
