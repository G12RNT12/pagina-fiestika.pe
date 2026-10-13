// =============================================================
// CATEGORÍAS DE LA TIENDA
// - "id" debe coincidir con la carpeta en public/images/<id>/
// - "color" puede ser: rosa, durazno, amarillo, menta, aqua, lila
// - "icono" es un emoji que se muestra si falta una imagen
// =============================================================

export type ColorPastel = "rosa" | "durazno" | "amarillo" | "menta" | "aqua" | "lila";

export type Categoria = {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: ColorPastel;
};

export const categorias: Categoria[] = [
  { id: "decoracion", nombre: "Decoración", descripcion: "Banderines, toppers y más", icono: "🎉", color: "rosa" },
  { id: "detalles-invitados", nombre: "Para invitados", descripcion: "Vasos, cajitas y sorpresas", icono: "🎁", color: "menta" },
  { id: "papeleria", nombre: "Papelería", descripcion: "Stickers, etiquetas e invitaciones", icono: "✏️", color: "amarillo" },
  { id: "tatuajes", nombre: "Tatuajes", descripcion: "Diseños con tu temática", icono: "🦋", color: "lila" },
  { id: "gorros", nombre: "Gorros", descripcion: "Gorros de fiesta con tu temática", icono: "👑", color: "durazno" },
  { id: "actividades", nombre: "Actividades", descripcion: "Libros de juegos e individuales", icono: "🖍️", color: "aqua" },
  { id: "regalos", nombre: "Regalos", descripcion: "Álbumes, cuadros, Hot Wheels", icono: "💝", color: "rosa" },
  { id: "sos", nombre: "SOS descartables", descripcion: "Vasos, platos, cubiertos", icono: "🚨", color: "amarillo" },
];

export const colorClase: Record<ColorPastel, string> = {
  rosa: "bg-rosa",
  durazno: "bg-durazno",
  amarillo: "bg-amarillo",
  menta: "bg-menta",
  aqua: "bg-aqua",
  lila: "bg-lila",
};

export function getCategoria(id: string) {
  return categorias.find((c) => c.id === id);
}
