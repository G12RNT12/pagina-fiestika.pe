import { useEffect, useRef, useState } from "react";
import { Menu, Moon, ShoppingBag, Sun, X } from "lucide-react";
import { useCarrito } from "@/lib/carrito";

const enlaces = [
  { id: "inicio", label: "Inicio" },
  { id: "quienes-somos", label: "Nosotros" },
  { id: "catalogo", label: "Catálogo" },
  { id: "como-comprar", label: "Cómo comprar" },
  { id: "politicas", label: "Políticas" },
  { id: "contacto", label: "Contacto" },
];

function Logo({ oscuro }: { oscuro: boolean }) {
  const [falla, setFalla] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => setFalla(false), [oscuro]);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFalla(true);
  }, [oscuro]);
  if (falla)
    return (
      <span className="titular text-2xl text-primary">
        Fiestika<span className="text-foreground">.pe</span>
      </span>
    );
  return (
    <img
      ref={ref}
      key={oscuro ? "o" : "c"}
      src={oscuro ? "/images/sitio/logo-oscuro.png" : "/images/sitio/logo-claro.png"}
      alt="Fiestika Perú"
      className="h-7 w-auto min-[360px]:h-10"
      onError={() => setFalla(true)}
    />
  );
}

export function Header() {
  const { cantidadTotal, setAbiertoCarrito } = useCarrito();
  const [oscuro, setOscuro] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    setOscuro(document.documentElement.classList.contains("dark"));
  }, []);

  const alternarTema = () => {
    const nuevo = !oscuro;
    setOscuro(nuevo);
    document.documentElement.classList.toggle("dark", nuevo);
    localStorage.setItem("fiestika-tema", nuevo ? "oscuro" : "claro");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-border bg-card/85 px-4 py-2 shadow-card backdrop-blur-md">
        <a href="#inicio" className="flex items-center" aria-label="Ir al inicio">
          <Logo oscuro={oscuro} />
        </a>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {enlaces.map((e) => (
            <a
              key={e.id}
              href={`#${e.id}`}
              className="pill px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-rosa hover:text-pastel-foreground"
            >
              {e.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={alternarTema}
            aria-label={oscuro ? "Activar modo claro" : "Activar modo oscuro"}
            className="pill grid h-10 w-10 place-items-center bg-amarillo text-pastel-foreground transition-transform hover:rotate-12"
          >
            {oscuro ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setAbiertoCarrito(true)}
            aria-label={`Abrir carrito (${cantidadTotal} productos)`}
            className="pill relative flex h-10 items-center gap-2 bg-primary px-4 font-bold text-primary-foreground shadow-soft"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="font-mono text-sm">{cantidadTotal}</span>
          </button>
          <button
            onClick={() => setMenu(!menu)}
            className="pill grid h-10 w-10 place-items-center bg-muted lg:hidden"
            aria-label="Menú"
            aria-expanded={menu}
          >
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {menu && (
        <nav className="mx-auto mt-2 flex max-w-6xl flex-wrap gap-2 rounded-3xl border border-border bg-card p-3 shadow-card lg:hidden">
          {enlaces.map((e) => (
            <a
              key={e.id}
              href={`#${e.id}`}
              onClick={() => setMenu(false)}
              className="pill bg-muted px-4 py-2 text-sm font-bold"
            >
              {e.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
