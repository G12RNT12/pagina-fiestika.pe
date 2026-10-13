import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { resolverItems, validarCupon, type ItemCarrito, type LineaCarrito, type Personalizacion, type ResultadoCupon } from "./tienda";

const CLAVE = "fiestika-carrito";

type Ctx = {
  items: ItemCarrito[];
  lineas: LineaCarrito[];
  cantidadTotal: number;
  subtotal: number;
  cupon: string;
  resultadoCupon: ResultadoCupon | null;
  agregar: (productoId: string, variante: number, cantidad: number, personalizacion: Personalizacion) => void;
  cambiarCantidad: (key: string, cantidad: number) => void;
  eliminar: (key: string) => void;
  vaciar: () => void;
  aplicarCupon: (codigo: string) => void;
  quitarCupon: () => void;
  // UI compartida
  abiertoCarrito: boolean;
  setAbiertoCarrito: (v: boolean) => void;
  abiertoCheckout: boolean;
  setAbiertoCheckout: (v: boolean) => void;
  productoAbierto: string | null;
  setProductoAbierto: (id: string | null) => void;
  categoriaFiltro: string;
  setCategoriaFiltro: (id: string) => void;
};

// Contexto estable aunque el archivo se recargue en caliente durante la edición.
const g = globalThis as { __fiestikaCarritoCtx?: React.Context<Ctx | null> };
const CarritoCtx = (g.__fiestikaCarritoCtx ??= createContext<Ctx | null>(null));

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cupon, setCupon] = useState("");
  const [cargado, setCargado] = useState(false);
  const [abiertoCarrito, setAbiertoCarrito] = useState(false);
  const [abiertoCheckout, setAbiertoCheckout] = useState(false);
  const [productoAbierto, setProductoAbierto] = useState<string | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) {
        const d = JSON.parse(raw);
        setItems(Array.isArray(d.items) ? d.items : []);
        setCupon(typeof d.cupon === "string" ? d.cupon : "");
      }
    } catch {
      /* ignorar */
    }
    setCargado(true);
  }, []);

  useEffect(() => {
    if (cargado) localStorage.setItem(CLAVE, JSON.stringify({ items, cupon }));
  }, [items, cupon, cargado]);

  const lineas = useMemo(() => resolverItems(items), [items]);
  const subtotal = lineas.reduce((s, l) => s + l.total, 0);
  const cantidadTotal = lineas.reduce((s, l) => s + l.cantidad, 0);
  const resultadoCupon = cupon ? validarCupon(cupon, lineas) : null;

  const value: Ctx = {
    items,
    lineas,
    cantidadTotal,
    subtotal,
    cupon,
    resultadoCupon,
    agregar: (productoId, variante, cantidad, personalizacion) => {
      const firma = JSON.stringify(personalizacion);
      setItems((prev) => {
        const existe = prev.find(
          (i) => i.productoId === productoId && i.variante === variante && JSON.stringify(i.personalizacion) === firma,
        );
        if (existe) return prev.map((i) => (i === existe ? { ...i, cantidad: i.cantidad + cantidad } : i));
        return [...prev, { key: `${productoId}-${Date.now()}`, productoId, variante, cantidad, personalizacion }];
      });
    },
    cambiarCantidad: (key, cantidad) =>
      setItems((prev) => prev.map((i) => (i.key === key ? { ...i, cantidad: Math.max(1, cantidad) } : i))),
    eliminar: (key) => setItems((prev) => prev.filter((i) => i.key !== key)),
    vaciar: () => {
      setItems([]);
      setCupon("");
    },
    aplicarCupon: (c) => setCupon(c.trim().toUpperCase()),
    quitarCupon: () => setCupon(""),
    abiertoCarrito,
    setAbiertoCarrito,
    abiertoCheckout,
    setAbiertoCheckout,
    productoAbierto,
    setProductoAbierto,
    categoriaFiltro,
    setCategoriaFiltro,
  };

  return <CarritoCtx.Provider value={value}>{children}</CarritoCtx.Provider>;
}

export function useCarrito() {
  const c = useContext(CarritoCtx);
  if (!c) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return c;
}
