import { createFileRoute } from "@tanstack/react-router";
import { CarritoProvider } from "@/lib/carrito";
import { Header } from "@/components/tienda/Header";
import { Hero } from "@/components/tienda/Hero";
import { Catalogo, Categorias, MasVendidos } from "@/components/tienda/Catalogo";
import { ComoComprar, Contacto, Fiestikers, Politicas, Preguntas, QuienesSomos, WhatsAppFlotante } from "@/components/tienda/Secciones";
import { ProductoModal } from "@/components/tienda/ProductoModal";
import { Carrito } from "@/components/tienda/Carrito";
import { Checkout } from "@/components/tienda/Checkout";
import { LegalesProvider } from "@/components/tienda/Legales";

const titulo = "Fiestika Perú — Crea una fiesta linda, sin complicarte";
const desc =
  "Banderines, cake toppers, stickers, tatuajes temporales y detalles personalizados para tu fiesta. Pide por WhatsApp. Lima y Callao.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: desc },
      { property: "og:title", content: titulo },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://fiestika.pe" },
      { property: "og:image", content: "https://fiestika.pe/images/sitio/og.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://fiestika.pe/images/sitio/og.jpg" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <CarritoProvider>
      <LegalesProvider>
        <Header />
        <main>
          <Hero />
          <QuienesSomos />
          <Categorias />
          <MasVendidos />
          <Catalogo />
          <ComoComprar />
          <Fiestikers />
          <Preguntas />
          <Politicas />
        </main>
        <Contacto />
        <WhatsAppFlotante />
        <ProductoModal />
        <Carrito />
        <Checkout />
      </LegalesProvider>
    </CarritoProvider>
  );
}
