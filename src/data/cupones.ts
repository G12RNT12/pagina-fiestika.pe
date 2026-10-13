// =============================================================
// CUPONES DE DESCUENTO
// tipo: "porcentaje" (valor = %), "monto" (valor = S/), "delivery" (envío gratis)
// vence: "AAAA-MM-DD" o null si no vence
// categorias: [] = aplica a todo; o lista de ids (ej. ["decoracion"])
// mostrarEnInicio: true = se anuncia en el banner del inicio (solo uno)
// =============================================================

export type Cupon = {
  codigo: string;
  tipo: "porcentaje" | "monto" | "delivery";
  valor: number;
  vence: string | null;
  compraMinima: number;
  categorias: string[];
  activo: boolean;
  mostrarEnInicio?: boolean;
  descripcion: string;
};

export const cupones: Cupon[] = [
  {
    codigo: "FIESTA10",
    tipo: "porcentaje",
    valor: 15,
    vence: "2026-12-31",
    compraMinima: 200,
    categorias: [],
    activo: true,
    mostrarEnInicio: true,
    descripcion: "15% de descuento en compras desde S/ 200",
  },
  {
    codigo: "DECO5",
    tipo: "monto",
    valor: 5,
    vence: null,
    compraMinima: 30,
    categorias: ["decoracion"],
    activo: true,
    descripcion: "S/ 5 de descuento en decoración",
  },
];
