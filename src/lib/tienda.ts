import confetti from "canvas-confetti";
import { config } from "@/data/config";
import { cupones, type Cupon } from "@/data/cupones";
import { productos, type Producto, type Variante } from "@/data/productos";

export const soles = (n: number) => `S/ ${n.toFixed(2)}`;

export function precioDesde(p: Producto) {
  return Math.min(...p.variantes.map((v) => v.precio));
}

export type EstadoStock = "agotado" | "pocas" | "pedido" | "disponible";

export function estadoVariante(v: Variante): EstadoStock {
  if (v.stock === null) return "pedido";
  if (v.stock <= 0) return "agotado";
  if (v.stock <= config.umbralPocasUnidades) return "pocas";
  return "disponible";
}

export function estadoProducto(p: Producto): EstadoStock {
  const estados = p.variantes.map(estadoVariante);
  if (estados.every((e) => e === "agotado")) return "agotado";
  if (estados.some((e) => e === "disponible")) return "disponible";
  if (estados.some((e) => e === "pedido")) return "pedido";
  return "pocas";
}

export const etiquetaStock: Record<EstadoStock, string | null> = {
  agotado: "Agotado",
  pocas: "Pocas unidades",
  pedido: "A pedido",
  disponible: null,
};

export function getProducto(id: string) {
  return productos.find((p) => p.id === id);
}

export type Personalizacion = {
  nombre?: string;
  edad?: string;
  tematica?: string;
  colores?: string;
  fechaEvento?: string;
  notas?: string;
  actividades?: string;
};

export type ItemCarrito = {
  key: string;
  productoId: string;
  variante: number;
  cantidad: number;
  personalizacion: Personalizacion;
};

export type LineaCarrito = ItemCarrito & { producto: Producto; v: Variante; total: number };

export function resolverItems(items: ItemCarrito[]): LineaCarrito[] {
  return items.flatMap((it) => {
    const producto = getProducto(it.productoId);
    const v = producto?.variantes[it.variante];
    if (!producto || !v) return [];
    return [{ ...it, producto, v, total: v.precio * it.cantidad }];
  });
}

export type ResultadoCupon =
  | { ok: true; cupon: Cupon; descuento: number; envioGratis: boolean; mensaje: string }
  | { ok: false; mensaje: string };

export function validarCupon(codigo: string, lineas: LineaCarrito[]): ResultadoCupon {
  const c = cupones.find((x) => x.codigo.toUpperCase() === codigo.trim().toUpperCase());
  if (!c || !c.activo) return { ok: false, mensaje: "Este cupón no existe o ya no está activo." };
  if (c.vence) {
    const fin = new Date(c.vence + "T23:59:59");
    if (new Date() > fin) return { ok: false, mensaje: "Este cupón ya venció." };
  }
  const aplicables = c.categorias.length
    ? lineas.filter((l) => c.categorias.includes(l.producto.categoria))
    : lineas;
  const base = aplicables.reduce((s, l) => s + l.total, 0);
  if (c.categorias.length && base === 0)
    return { ok: false, mensaje: "Este cupón no aplica a los productos de tu carrito." };
  if (base < c.compraMinima)
    return { ok: false, mensaje: `Este cupón requiere una compra mínima de ${soles(c.compraMinima)}.` };
  let descuento = 0;
  if (c.tipo === "porcentaje") descuento = Math.round(base * c.valor) / 100;
  if (c.tipo === "monto") descuento = Math.min(c.valor, base);
  return { ok: true, cupon: c, descuento, envioGratis: c.tipo === "delivery", mensaje: `¡Cupón aplicado! ${c.descripcion}` };
}

export function cuponInicio() {
  return cupones.find((c) => c.activo && c.mostrarEnInicio);
}

export function codigoPedido() {
  const d = new Date();
  const aa = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rnd = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `FK-${aa}${mm}${dd}-${rnd}`;
}

export function textoPersonalizacion(p: Personalizacion) {
  const partes = [
    p.nombre && `Nombre: ${p.nombre}`,
    p.edad && `Edad: ${p.edad}`,
    p.tematica && `Temática: ${p.tematica}`,
    p.colores && `Colores: ${p.colores}`,
    p.fechaEvento && `Evento: ${p.fechaEvento}`,
    p.actividades && `Actividades: ${p.actividades}`,
    p.notas && `Detalles: ${p.notas}`,
  ].filter(Boolean);
  return partes.join(" · ");
}

export function lanzarConfeti() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  confetti({
    particleCount: 90,
    spread: 75,
    origin: { y: 0.7 },
    colors: ["#FFA3BE", "#FFAA9C", "#FFD486", "#B3E4C9", "#99DDD5", "#D7B8E0", "#E8508A"],
  });
}

export async function copiar(texto: string) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return copiarAlternativo(texto);
  }
}

/** Para cuando el portapapeles moderno está bloqueado (http sin "s", vista previa en iframe, algunos celulares). */
function copiarAlternativo(texto: string) {
  // Dentro de un modal el área de texto debe ir en el propio modal, si no el modal le roba el foco.
  const contenedor = document.activeElement?.closest('[role="dialog"]') ?? document.body;
  const area = document.createElement("textarea");
  area.value = texto;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.opacity = "0";
  area.style.fontSize = "16px"; // evita el zoom automático en iPhone
  contenedor.appendChild(area);
  area.focus();
  area.select();
  area.setSelectionRange(0, texto.length);
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    area.remove();
  }
}
