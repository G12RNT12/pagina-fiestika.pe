import { Mail } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { config, linkWhatsApp } from "@/data/config";
import { galeria, politicas, preguntas, quienesSomos, testimonios } from "@/data/contenido";
import { Titulo } from "./Catalogo";
import { IconoInstagram, IconoTikTok, IconoWhatsApp, Imagen } from "./Imagen";
import { useLegales } from "./Legales";

export function Negrita({ texto, claseNegrita = "text-foreground" }: { texto: string; claseNegrita?: string }) {
  return (
    <>
      {texto.split(/(\*\*[^*]+\*\*)/g).map((t, i) =>
        t.startsWith("**") ? <strong key={i} className={`font-extrabold ${claseNegrita}`}>{t.slice(2, -2)}</strong> : <span key={i}>{t}</span>,
      )}
    </>
  );
}

const pasos = [
  { n: "01", t: "Elige", d: "Explora el catálogo y escoge tus productos favoritos.", c: "bg-rosa", e: "🛍️" },
  { n: "02", t: "Personaliza", d: "Cuéntanos nombre, edad, temática y colores.", c: "bg-amarillo", e: "✨" },
  { n: "03", t: "Envía y paga", d: "Manda tu pedido por WhatsApp y paga tu adelanto del 50%.", c: "bg-menta", e: "💬" },
  { n: "04", t: "Recibe", d: "Te lo llevamos en Lima y Callao, o lo recoges tú.", c: "bg-aqua", e: "🛵" },
];

export function QuienesSomos() {
  const q = quienesSomos;
  return (
    <section id="quienes-somos" className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Titulo chip="#nosotros" titulo={q.titulo} />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-center text-lg font-semibold text-muted-foreground lg:text-left">
            {q.parrafos.map((t) => (
              <p key={t}>
                <Negrita texto={t} />
              </p>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {q.valores.map((v, i) => (
              <div
                key={v.titulo}
                className={`flex items-start gap-4 rounded-3xl p-5 text-pastel-foreground shadow-card sm:flex-col lg:flex-row ${v.color} ${i === 1 ? "lg:translate-x-6" : ""}`}
              >
                <span className="text-3xl" aria-hidden>{v.icono}</span>
                <div>
                  <p className="titular text-xl">{v.titulo}</p>
                  <p className="mt-1 text-sm font-semibold opacity-80">{v.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ComoComprar() {
  return (
    <section id="como-comprar" className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Titulo chip="#fácil" titulo="Cómo comprar" sub="Cuatro pasos y tu fiesta está lista." />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map((p, i) => (
            <li key={p.n} className={`rebote relative rounded-3xl p-6 text-pastel-foreground shadow-card ${p.c}`} style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>
              <span className="font-mono text-sm">{p.n}</span>
              <p className="mt-2 text-4xl" aria-hidden>{p.e}</p>
              <h3 className="titular mt-3 text-3xl">{p.t}</h3>
              <p className="mt-1 font-semibold">{p.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Fiestikers() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Titulo chip="#fiestikers" titulo="Fiestikers felices" sub="Fiestas reales de nuestros clientes." />
        {/* Celular y tablet: carrusel deslizable. Computadora: cuadrícula de 4. */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-3 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0">
          {galeria.map((g, i) => (
            <Imagen
              key={g.src}
              src={g.src}
              alt={g.alt}
              className={`aspect-2/3 w-[68%] shrink-0 snap-start rounded-3xl sm:w-[40%] lg:w-full ${i % 2 === 1 ? "lg:translate-y-6" : ""}`}
            />
          ))}
        </div>
        <p className="mt-2 text-center font-mono text-xs text-muted-foreground lg:hidden">← desliza para ver más →</p>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonios.map((t, i) => (
            <figure key={t.nombre} className={`rounded-3xl border border-border bg-card p-6 shadow-card ${i === 1 ? "md:-translate-y-4" : ""}`}>
              <p className="text-2xl text-primary" aria-hidden>★★★★★</p>
              <blockquote className="mt-2 font-semibold">“{t.texto}”</blockquote>
              <figcaption className="mt-4 font-mono text-xs uppercase text-muted-foreground">{t.nombre} · {t.distrito}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Preguntas() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Titulo chip="#dudas" titulo="Preguntas frecuentes" />
        <Accordion type="single" collapsible className="space-y-3">
          {preguntas.map((q, i) => (
            <AccordionItem key={i} value={`q${i}`} className="rounded-3xl border border-border bg-card px-5">
              <AccordionTrigger className="text-left text-base font-extrabold hover:no-underline">{q.p}</AccordionTrigger>
              <AccordionContent className="font-semibold text-muted-foreground">{q.r}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function Politicas() {
  const { abrir } = useLegales();
  const colores = ["bg-rosa", "bg-menta", "bg-amarillo", "bg-lila"];
  return (
    <section id="politicas" className="px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Titulo chip="#transparencia" titulo="Políticas" />
        <Accordion type="multiple" className="space-y-3">
          {politicas.map((p, i) => (
            <AccordionItem key={p.titulo} value={p.titulo} className="overflow-hidden rounded-3xl border border-border bg-card">
              <AccordionTrigger className="px-5 text-left text-base font-extrabold hover:no-underline">
                <span className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${colores[i % 4]}`} aria-hidden />
                  {p.titulo}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5">
                <ul className="list-disc space-y-2 pl-5 font-semibold text-muted-foreground">
                  {p.puntos.map((x) => <li key={x}><Negrita texto={x} /></li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-6 text-center font-semibold italic text-muted-foreground">
          Al realizar el adelanto para agendar tu pedido, entendemos que estás de acuerdo con estas políticas. 💗
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => abrir("terminos")} className="pill border border-border bg-card px-5 py-2 font-bold">Términos y condiciones</button>
          <button onClick={() => abrir("privacidad")} className="pill border border-border bg-card px-5 py-2 font-bold">Política de privacidad</button>
        </div>
      </div>
    </section>
  );
}

export function Contacto() {
  const { abrir } = useLegales();
  const redes = [
    { href: config.redes.instagram, label: "Instagram", icon: <IconoInstagram className="h-5 w-5" /> },
    { href: config.redes.tiktok, label: "TikTok", icon: <IconoTikTok className="h-5 w-5" /> },
    { href: config.redes.linktree, label: "Linktree", icon: <span className="font-mono text-sm font-bold">✳</span> },
  ];
  return (
    <footer id="contacto" className="px-4 pb-24 pt-16 sm:pb-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-tinta p-8 text-tinta-foreground sm:p-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="titular text-5xl sm:text-6xl">¿Hacemos tu fiesta?</h2>
            <p className="mt-3 max-w-md font-semibold opacity-80">Escríbenos y armamos juntos todo lo que necesitas. Atendemos Lima y Callao.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={linkWhatsApp("Hola Fiestika 🎉 Quiero hacer un pedido.")} target="_blank" rel="noreferrer" className="pill flex items-center justify-center gap-2 whitespace-nowrap bg-whatsapp px-6 py-3 font-extrabold text-pastel-foreground">
                <IconoWhatsApp className="h-5 w-5" />
                <span>
                  Pedidos <span className="font-semibold opacity-80">· {config.whatsappVisible}</span>
                </span>
              </a>
              <a
                href={linkWhatsApp(
                  "Hola Fiestika 🎉 Quiero cotizar un pedido corporativo.",
                  config.whatsappCorporativo || config.whatsapp,
                )}
                target="_blank"
                rel="noreferrer"
                className="pill flex items-center justify-center gap-2 whitespace-nowrap bg-aqua px-6 py-3 font-extrabold text-pastel-foreground"
              >
                <IconoWhatsApp className="h-5 w-5" />
                <span>
                  Corporativos
                  {config.whatsappCorporativoVisible && <span className="font-semibold opacity-80"> · {config.whatsappCorporativoVisible}</span>}
                </span>
              </a>
              <a href={`mailto:${config.correo}`} className="pill flex min-w-0 items-center justify-center gap-2 break-all bg-rosa px-6 py-3 font-extrabold text-pastel-foreground">
                <Mail className="h-5 w-5" /> {config.correo}
              </a>
            </div>
            <div className="mt-6 flex gap-2">
              {redes.map((r) => (
                <a key={r.label} href={r.href} target="_blank" rel="noreferrer" aria-label={r.label} className="pill grid h-11 w-11 place-items-center bg-tinta-foreground/10 transition-colors hover:bg-primary">
                  {r.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs uppercase opacity-70">Medios de pago</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="pill bg-lila px-4 py-2 font-extrabold text-pastel-foreground">yape</span>
                <span className="pill bg-aqua px-4 py-2 font-extrabold text-pastel-foreground">plin</span>
                <span className="pill bg-tinta-foreground px-4 py-2 font-extrabold italic text-tinta">VISA</span>
                <span className="pill bg-durazno px-4 py-2 font-extrabold text-pastel-foreground">Mastercard</span>
                {config.cuentasBancarias.length > 0 && <span className="pill bg-menta px-4 py-2 font-extrabold text-pastel-foreground">Transferencia</span>}
              </div>
            </div>
            <button onClick={() => abrir("reclamaciones")} className="flex items-center gap-3 rounded-2xl border border-tinta-foreground/20 p-4 text-left font-bold transition-colors hover:bg-tinta-foreground/10">
              <span className="text-3xl" aria-hidden>📖</span>
              <span>Libro de Reclamaciones<span className="block text-xs font-semibold opacity-70">Conforme al Código de Protección al Consumidor</span></span>
            </button>
            <div className="flex flex-wrap gap-4 text-sm font-semibold opacity-80">
              <button onClick={() => abrir("terminos")} className="underline">Términos y condiciones</button>
              <button onClick={() => abrir("privacidad")} className="underline">Política de privacidad</button>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-tinta-foreground/15 pt-6 text-center font-mono text-xs opacity-70">
          © {new Date().getFullYear()} {config.marca} · fiestika.pe · {config.eslogan}
        </p>
      </div>
    </footer>
  );
}

export function WhatsAppFlotante() {
  return (
    <a
      href={linkWhatsApp("Hola Fiestika 🎉 Tengo una consulta.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="pill fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center bg-whatsapp text-pastel-foreground shadow-soft transition-transform hover:scale-110"
    >
      <IconoWhatsApp className="h-7 w-7" />
    </a>
  );
}
