import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { categorias, colorClase, getCategoria } from "@/data/categorias";
import { productos, type Producto } from "@/data/productos";
import { useCarrito } from "@/lib/carrito";
import { estadoProducto, etiquetaStock, precioDesde, soles } from "@/lib/tienda";
import { cn } from "@/lib/utils";
import { Imagen } from "./Imagen";

export function Titulo({ chip, titulo, sub }: { chip: string; titulo: string; sub?: string }) {
  return (
    <div className="mb-10 text-center">
      <span className="pill inline-block bg-lila px-4 py-1 font-mono text-xs text-pastel-foreground">
        {chip}
      </span>
      <h2 className="titular mt-3 text-4xl sm:text-6xl">{titulo}</h2>
      {sub && <p className="mx-auto mt-3 max-w-xl font-semibold text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Categorias() {
  const { setCategoriaFiltro } = useCarrito();
  return (
    <section className="px-4 py-16" aria-labelledby="t-cat">
      <div className="mx-auto max-w-6xl">
        <Titulo chip="#categorías" titulo="¿Qué celebramos?" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categorias.map((c, i) => (
            <a
              key={c.id}
              href="#catalogo"
              onClick={() => setCategoriaFiltro(c.id)}
              className={cn(
                "rebote group relative flex min-h-40 flex-col justify-between overflow-hidden rounded-3xl p-5 text-pastel-foreground shadow-card",
                colorClase[c.color],
              )}
              style={{ ["--rot" as string]: "0deg" }}
            >
              <span className="text-4xl transition-transform group-hover:scale-125" aria-hidden>
                {c.icono}
              </span>
              <div>
                <h3 className="titular text-xl sm:text-2xl">{c.nombre}</h3>
                <p className="text-sm font-semibold opacity-80">{c.descripcion}</p>
              </div>
              <span
                aria-hidden
                className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-card/30"
              />
              <span className="sr-only">
                Ver {c.nombre} — categoría {i + 1}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TarjetaProducto({ p }: { p: Producto }) {
  const { setProductoAbierto } = useCarrito();
  const estado = estadoProducto(p);
  const etiqueta = etiquetaStock[estado];
  const cat = getCategoria(p.categoria);
  return (
    <button
      onClick={() => setProductoAbierto(p.id)}
      className="rebote group flex flex-col overflow-hidden rounded-3xl border border-border bg-card text-left shadow-card"
    >
      <div className="relative aspect-square overflow-hidden">
        <Imagen
          src={p.imagenes[0]}
          alt={p.nombre}
          categoria={p.categoria}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        {etiqueta && (
          <span
            className={cn(
              "pill absolute left-3 top-3 px-3 py-1 font-mono text-xs font-bold",
              estado === "agotado" && "bg-foreground text-background",
              estado === "pocas" && "bg-amarillo text-pastel-foreground",
              estado === "pedido" && "bg-aqua text-pastel-foreground",
            )}
          >
            {etiqueta}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {cat?.nombre}
        </span>
        <h3 className="titular text-lg leading-tight">{p.nombre}</h3>
        <p className="mt-auto pt-2 text-sm font-bold text-muted-foreground">
          desde <span className="text-xl font-extrabold text-fucsia">{soles(precioDesde(p))}</span>
        </p>
      </div>
    </button>
  );
}

const POR_PAGINA = 12;

export function Catalogo() {
  const { categoriaFiltro, setCategoriaFiltro } = useCarrito();
  const [q, setQ] = useState("");
  const [orden, setOrden] = useState("relevancia");
  const [visibles, setVisibles] = useState(POR_PAGINA);

  const lista = useMemo(() => {
    let r = productos.filter((p) => categoriaFiltro === "todas" || p.categoria === categoriaFiltro);
    if (q.trim()) {
      const t = q.toLowerCase();
      r = r.filter((p) => (p.nombre + " " + p.descripcion).toLowerCase().includes(t));
    }
    if (orden === "menor") r = [...r].sort((a, b) => precioDesde(a) - precioDesde(b));
    if (orden === "mayor") r = [...r].sort((a, b) => precioDesde(b) - precioDesde(a));
    return r;
  }, [categoriaFiltro, q, orden]);

  // Al cambiar de categoría, búsqueda u orden, vuelve a mostrar solo la primera tanda.
  useEffect(() => setVisibles(POR_PAGINA), [categoriaFiltro, q, orden]);

  const tabs = [{ id: "todas", nombre: "Todo" }, ...categorias];

  return (
    <section id="catalogo" className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Titulo
          chip="#catálogo"
          titulo="Nuestro catálogo"
          sub="Todo se personaliza con tu temática, nombres y colores."
        />

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={categoriaFiltro === t.id}
              onClick={() => setCategoriaFiltro(t.id)}
              className={cn(
                "pill shrink-0 border border-border px-4 py-2 text-sm font-bold transition-colors",
                categoriaFiltro === t.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-muted",
              )}
            >
              {t.nombre}
            </button>
          ))}
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <label className="pill flex flex-1 items-center gap-2 border border-border bg-card px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar banderines, stickers, toppers…"
              className="w-full bg-transparent font-semibold outline-none placeholder:text-muted-foreground"
              aria-label="Buscar productos"
            />
          </label>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="pill border border-border bg-card px-4 py-3 font-bold"
            aria-label="Ordenar"
          >
            <option value="relevancia">Ordenar: destacados</option>
            <option value="menor">Precio: menor a mayor</option>
            <option value="mayor">Precio: mayor a menor</option>
          </select>
        </div>

        {lista.length ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {lista.slice(0, visibles).map((p) => (
                <TarjetaProducto key={p.id} p={p} />
              ))}
            </div>
            {visibles < lista.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisibles(visibles + POR_PAGINA)}
                  className="pill border-2 border-primary bg-card px-8 py-3 font-extrabold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Ver más productos ({lista.length - visibles})
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="rounded-3xl bg-muted p-10 text-center font-bold">
            No encontramos productos. ¡Escríbenos y lo hacemos a pedido! 💗
          </p>
        )}
      </div>
    </section>
  );
}

export function MasVendidos() {
  const lista = productos.filter((p) => p.destacado);
  if (!lista.length) return null;
  return (
    <section className="relative px-4 py-16">
      <div
        className="absolute inset-x-0 top-1/2 -z-10 h-2/3 -translate-y-1/2 -skew-y-2 bg-rosa/40"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl">
        <Titulo chip="#favoritos" titulo="Más vendidos" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {lista.map((p) => (
            <TarjetaProducto key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
