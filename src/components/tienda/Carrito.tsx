import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useCarrito } from "@/lib/carrito";
import { soles, textoPersonalizacion } from "@/lib/tienda";
import { cn } from "@/lib/utils";
import { Imagen } from "./Imagen";
import { inputCls } from "./ProductoModal";

export function Carrito() {
  const c = useCarrito();
  const [codigo, setCodigo] = useState("");
  const r = c.resultadoCupon;
  const descuento = r?.ok ? r.descuento : 0;

  return (
    <Sheet open={c.abiertoCarrito} onOpenChange={c.setAbiertoCarrito}>
      <SheetContent className="flex w-full flex-col gap-0 border-border bg-card p-0 sm:max-w-md">
        <div className="border-b border-border p-5">
          <SheetTitle className="titular text-3xl">Tu carrito 🛍️</SheetTitle>
          <SheetDescription className="font-semibold">
            {c.cantidadTotal ? `${c.cantidadTotal} producto(s)` : "Aún no agregas nada"}
          </SheetDescription>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {c.lineas.length === 0 && (
            <div className="rounded-3xl bg-muted p-8 text-center">
              <p className="text-5xl">🎈</p>
              <p className="mt-2 font-bold">Tu carrito está vacío</p>
              <a href="#catalogo" onClick={() => c.setAbiertoCarrito(false)} className="pill mt-4 inline-block bg-primary px-5 py-2 font-bold text-primary-foreground">
                Ver catálogo
              </a>
            </div>
          )}
          {c.lineas.map((l) => (
            <div key={l.key} className="flex gap-3 rounded-3xl border border-border bg-background p-3">
              <Imagen src={l.producto.imagenes[0]} alt={l.producto.nombre} categoria={l.producto.categoria} className="h-20 w-20 shrink-0 rounded-2xl text-3xl" />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold leading-tight">{l.producto.nombre}</p>
                <p className="text-sm text-muted-foreground">{l.v.nombre}</p>
                {Object.keys(l.personalizacion).length > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">✨ {textoPersonalizacion(l.personalizacion)}</p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <div className="pill flex items-center border border-border">
                    <button className="p-1.5" onClick={() => c.cambiarCantidad(l.key, l.cantidad - 1)} aria-label="Restar">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center font-mono text-sm font-bold">{l.cantidad}</span>
                    <button className="p-1.5" onClick={() => c.cambiarCantidad(l.key, l.cantidad + 1)} aria-label="Sumar">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-extrabold text-fucsia">{soles(l.total)}</span>
                  <button onClick={() => c.eliminar(l.key)} aria-label="Eliminar" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {c.lineas.length > 0 && (
          <div className="space-y-3 border-t border-border p-5">
            {c.cupon ? (
              <div className={cn("flex items-center justify-between rounded-2xl p-3 text-sm font-bold", r?.ok ? "bg-menta text-pastel-foreground" : "bg-muted text-destructive")}>
                <span>
                  <span className="font-mono">{c.cupon}</span> — {r?.mensaje}
                </span>
                <button onClick={c.quitarCupon} className="underline">Quitar</button>
              </div>
            ) : (
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (codigo.trim()) c.aplicarCupon(codigo);
                  setCodigo("");
                }}
              >
                <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código de cupón" className={cn(inputCls, "font-mono uppercase")} aria-label="Cupón" />
                <button className="pill bg-foreground px-5 font-bold text-background">Aplicar</button>
              </form>
            )}
            <dl className="space-y-1 text-sm font-semibold">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{soles(c.subtotal)}</dd></div>
              {descuento > 0 && <div className="flex justify-between text-fucsia"><dt>Descuento</dt><dd>- {soles(descuento)}</dd></div>}
              <div className="flex justify-between text-muted-foreground">
                <dt>Delivery</dt>
                <dd>{r?.ok && r.envioGratis ? "¡Gratis!" : "Se calcula según distrito"}</dd>
              </div>
              <div className="flex justify-between pt-2 text-lg font-extrabold"><dt>Total</dt><dd>{soles(c.subtotal - descuento)}</dd></div>
            </dl>
            <button
              onClick={() => {
                c.setAbiertoCarrito(false);
                c.setAbiertoCheckout(true);
              }}
              className="pill w-full bg-primary py-4 text-lg font-extrabold text-primary-foreground shadow-soft"
            >
              Finalizar pedido
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
