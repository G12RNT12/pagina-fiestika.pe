import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { linkWhatsApp } from "@/data/config";
import { useCarrito } from "@/lib/carrito";
import { estadoVariante, etiquetaStock, getProducto, lanzarConfeti, soles, type Personalizacion } from "@/lib/tienda";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { IconoWhatsApp, Imagen } from "./Imagen";

export const inputCls =
  "w-full rounded-2xl border border-input bg-background px-4 py-2.5 font-semibold outline-none focus:ring-2 focus:ring-ring";

export function ProductoModal() {
  const { productoAbierto, setProductoAbierto, agregar, setAbiertoCarrito } = useCarrito();
  const p = productoAbierto ? getProducto(productoAbierto) : undefined;
  const [img, setImg] = useState(0);
  const [vi, setVi] = useState(0);
  const [cant, setCant] = useState(1);
  const [elegidas, setElegidas] = useState<string[]>([]);

  useEffect(() => {
    if (p) {
      setImg(0);
      setCant(1);
      setElegidas([]);
      const primera = p.variantes.findIndex((v) => estadoVariante(v) !== "agotado");
      setVi(primera >= 0 ? primera : 0);
    }
  }, [p?.id]);

  if (!p) return null;
  const v = p.variantes[vi] ?? p.variantes[0]!;
  const estado = estadoVariante(v);
  const sinStock = estado === "agotado" || (v.stock !== null && cant > v.stock);

  const consultar = linkWhatsApp(
    `Hola Fiestika 🎉 Quiero consultar por: ${p.nombre} – ${v.nombre} – cantidad: ${cant}. ¿Tienen disponibilidad?`,
  );

  const sm = p.seleccionMultiple;
  const faltan = sm ? sm.cantidad - elegidas.length : 0;
  const onAgregar = () => {
    if (sm && faltan !== 0) {
      toast.error(`Elige exactamente ${sm.cantidad} actividades.`);
      return;
    }
    // El diseño (temática, colores, nombre…) se pide una sola vez en el checkout.
    const pers: Personalizacion = sm ? { actividades: elegidas.join(", ") } : {};
    agregar(p.id, vi, cant, pers);
    lanzarConfeti();
    toast.success("¡Agregado al carrito! 🎉", { description: `${p.nombre} – ${v.nombre}` });
    setProductoAbierto(null);
    setAbiertoCarrito(true);
  };

  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && setProductoAbierto(null)}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-4xl overflow-y-auto rounded-3xl border-border bg-card p-0 sm:rounded-3xl">
        <div className="grid md:grid-cols-2">
          <div className="p-4">
            <Imagen src={p.imagenes[img]} alt={p.nombre} categoria={p.categoria} eager className="aspect-square w-full rounded-3xl" />
            {p.imagenes.length > 1 && (
              <div className="mt-3 flex gap-2">
                {p.imagenes.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setImg(i)}
                    aria-label={`Ver imagen ${i + 1}`}
                    className={cn("h-16 w-16 overflow-hidden rounded-2xl border-2", i === img ? "border-primary" : "border-transparent")}
                  >
                    <Imagen src={src} alt="" categoria={p.categoria} className="h-full w-full text-2xl" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 p-6 md:pl-2">
            <div>
              <DialogTitle className="titular text-3xl">{p.nombre}</DialogTitle>
              <DialogDescription className="mt-2 font-semibold text-muted-foreground">{p.descripcion}</DialogDescription>
              {p.notas && <p className="mt-2 text-sm text-muted-foreground">💡 {p.notas}</p>}
            </div>

            <p className="text-3xl font-extrabold text-fucsia">{soles(v.precio * cant)}</p>

            <fieldset>
              <legend className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">Elige una opción</legend>
              <div className="flex flex-wrap gap-2">
                {p.variantes.map((x, i) => {
                  const e = estadoVariante(x);
                  return (
                    <button
                      key={x.nombre}
                      onClick={() => setVi(i)}
                      className={cn(
                        "pill border-2 px-4 py-2 text-sm font-bold transition-colors",
                        i === vi ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background",
                        e === "agotado" && i !== vi && "opacity-50 line-through",
                      )}
                    >
                      {x.nombre} · {soles(x.precio)}
                    </button>
                  );
                })}
              </div>
              {etiquetaStock[estado] && (
                <p className="mt-2 font-mono text-xs font-bold text-muted-foreground">
                  {etiquetaStock[estado]}
                  {estado === "pocas" && v.stock !== null && ` (quedan ${v.stock})`}
                </p>
              )}
            </fieldset>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase text-muted-foreground">Cantidad</span>
              <div className="pill flex items-center border border-border bg-background">
                <button className="p-2.5" onClick={() => setCant(Math.max(1, cant - 1))} aria-label="Restar">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-mono font-bold">{cant}</span>
                <button className="p-2.5" onClick={() => setCant(cant + 1)} aria-label="Sumar">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {sm && (
              <fieldset className="rounded-3xl bg-muted p-4">
                <legend className="sr-only">{sm.titulo}</legend>
                <p className="titular text-lg">🧩 {sm.titulo}</p>
                <p className="mb-3 font-mono text-xs text-muted-foreground">
                  {elegidas.length}/{sm.cantidad} elegidas{faltan > 0 ? ` · faltan ${faltan}` : " · ¡listo!"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sm.opciones.map((o) => {
                    const on = elegidas.includes(o);
                    const lleno = !on && elegidas.length >= sm.cantidad;
                    return (
                      <button
                        key={o}
                        type="button"
                        aria-pressed={on}
                        disabled={lleno}
                        onClick={() => setElegidas(on ? elegidas.filter((x) => x !== o) : [...elegidas, o])}
                        className={cn(
                          "pill border-2 px-3 py-1.5 text-sm font-bold transition-colors",
                          on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
                          lleno && "opacity-40",
                        )}
                      >
                        {on ? "✓ " : ""}{o}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {p.personalizable && (
              <p className="rounded-3xl bg-muted p-4 text-sm font-semibold">
                ✨ <span className="font-extrabold">Producto personalizado.</span> La temática, los colores, el nombre y las frases los
                completas al finalizar tu pedido, en el paso <span className="font-extrabold">Diseño</span>.
              </p>
            )}

            {sinStock ? (
              <div className="space-y-2">
                <p className="text-sm font-bold text-destructive">
                  {estado === "agotado" ? "Esta opción está agotada." : `Solo tenemos ${v.stock} unidades disponibles.`}
                </p>
                <a
                  href={consultar}
                  target="_blank"
                  rel="noreferrer"
                  className="pill flex w-full items-center justify-center gap-2 bg-whatsapp py-4 text-lg font-extrabold text-pastel-foreground"
                >
                  <IconoWhatsApp className="h-5 w-5" /> Consultar por WhatsApp
                </a>
              </div>
            ) : (
              <button
                onClick={onAgregar}
                className="pill w-full bg-primary py-4 text-lg font-extrabold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Agregar al carrito
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
