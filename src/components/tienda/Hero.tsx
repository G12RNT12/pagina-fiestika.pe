import { config, linkWhatsApp } from "@/data/config";
import { cuponInicio } from "@/lib/tienda";
import { IconoWhatsApp } from "./Imagen";

const flotantes = [
  { e: "🎈", c: "left-[4%] top-[18%] text-6xl", rot: "-10deg", d: "0s" },
  { e: "⭐", c: "right-[8%] top-[14%] text-5xl", rot: "12deg", d: "1s" },
  { e: "🎂", c: "left-[8%] bottom-[18%] text-6xl", rot: "8deg", d: "2s" },
  { e: "🎁", c: "right-[6%] bottom-[22%] text-6xl", rot: "-8deg", d: "0.5s" },
  { e: "✨", c: "left-[45%] top-[8%] text-4xl", rot: "0deg", d: "1.5s" },
];

export function Hero() {
  const cupon = cuponInicio();
  const t = config.textosInicio;
  return (
    <section id="inicio" className="relative overflow-hidden px-4 pb-20 pt-32 sm:pt-36">
      {flotantes.map((f, i) => (
        <span
          key={i}
          aria-hidden
          className={`flotar pointer-events-none absolute hidden select-none sm:block ${f.c}`}
          style={{ ["--rot" as string]: f.rot, animationDelay: f.d }}
        >
          {f.e}
        </span>
      ))}

      <div className="relative mx-auto max-w-5xl text-center">
        {cupon && (
          <p className="mx-auto mb-6 inline-flex max-w-xl flex-wrap items-center justify-center gap-x-2 gap-y-1.5 rounded-3xl bg-card px-5 py-3 text-sm font-bold leading-snug shadow-card sm:rounded-full sm:py-2">
            <span>
              <span aria-hidden>🎟️</span> {cupon.descripcion}
            </span>
            <span className="pill whitespace-nowrap bg-primary px-3 py-0.5 font-mono text-primary-foreground">
              {cupon.codigo}
            </span>
          </p>
        )}

        <h1 className="titular text-[2.2rem] text-foreground sm:text-7xl lg:text-[6.5rem]">
          Crea una celebración <span className="relative inline-block text-primary">linda</span>,
          sin complicarte
        </h1>

        {/* cinta curva decorativa */}
        <svg viewBox="0 0 600 60" className="mx-auto -mt-2 w-full max-w-xl text-aqua" aria-hidden>
          <path
            d="M5 40 C 120 0, 220 70, 320 30 S 520 0, 595 35"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>

        <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-muted-foreground sm:text-xl">
          {t.subtitulo}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#catalogo"
            className="pill bg-primary px-8 py-4 text-lg font-extrabold text-primary-foreground shadow-soft transition-transform hover:-translate-y-1"
          >
            Ver catálogo
          </a>
          <a
            href={linkWhatsApp("Hola Fiestika 🎉 Quiero información para mi fiesta.")}
            target="_blank"
            rel="noreferrer"
            className="pill flex items-center gap-2 border-2 border-foreground/10 bg-card px-8 py-4 text-lg font-extrabold transition-transform hover:-translate-y-1"
          >
            <IconoWhatsApp className="h-5 w-5 text-whatsapp" /> Escríbenos por WhatsApp
          </a>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {t.etiquetas.map((e, i) => (
            <span
              key={e}
              className={`flotar-lento pill px-4 py-1.5 font-mono text-sm text-pastel-foreground shadow-card ${["bg-menta", "bg-amarillo", "bg-lila"][i % 3]}`}
              style={{ ["--rot" as string]: `${(i - 1) * 4}deg`, animationDelay: `${i * 0.7}s` }}
            >
              {e}
            </span>
          ))}
        </div>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Atendemos Lima y Callao
        </p>
      </div>
    </section>
  );
}
