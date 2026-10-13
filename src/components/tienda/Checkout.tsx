import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { config, linkWhatsApp } from "@/data/config";
import { politicas } from "@/data/contenido";
import { useCarrito } from "@/lib/carrito";
import { codigoPedido, copiar, lanzarConfeti, soles, textoPersonalizacion } from "@/lib/tienda";
import { cn } from "@/lib/utils";
import { IconoWhatsApp } from "./Imagen";
import { inputCls } from "./ProductoModal";
import { useLegales } from "./Legales";
import { Negrita } from "./Secciones";

type Medio = "yape" | "tarjeta" | "transferencia";
type Comprobante = "no" | "boleta" | "factura";

const pasos = ["Tus datos", "Entrega", "Diseño", "Pago", "Confirmar"];
const P = { datos: 0, entrega: 1, diseno: 2, pago: 3, confirmar: 4 };

const camposDiseno = [
  { k: "cumpleanero", label: "Nombre del/la cumpleañero/a", ph: "Ej. Valentina" },
  { k: "edad", label: "Edad que cumple", ph: "Ej. 5" },
  { k: "tematica", label: "Temática", ph: "Ej. Unicornios" },
  { k: "colores", label: "Colores", ph: "Ej. rosa y dorado" },
  { k: "frases", label: "Frases o textos", ph: "Ej. «Feliz cumple Vale»" },
] as const;
type Diseno = Record<(typeof camposDiseno)[number]["k"] | "detalles", string>;
const disenoVacio: Diseno = {
  cumpleanero: "",
  edad: "",
  tematica: "",
  colores: "",
  frases: "",
  detalles: "",
};

function fechaISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fechaLarga(iso: string) {
  const [a, m, dd] = iso.split("-");
  return `${dd}/${m}/${a}`;
}
/** Primera fecha de entrega: hoy + N días hábiles (lunes a sábado; los domingos no cuentan). Ej.: pide el lun 5 → desde el jue 8. */
function minEntrega() {
  const d = new Date();
  let habiles = 0;
  while (habiles < config.diasMinimosAnticipacion) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) habiles++;
  }
  return fechaISO(d);
}
const esDomingo = (iso: string) => !!iso && new Date(iso + "T12:00:00").getDay() === 0;
function sumarDias(iso: string, n: number) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return fechaISO(d);
}
const diaAntes = (iso: string) => sumarDias(iso, -1);

/** Ventana con las políticas (mismo contenido que la sección "Políticas") antes de enviar el pedido. */
function PoliticasPopup({ abierto, onCerrar, onAceptar }: { abierto: boolean; onCerrar: () => void; onAceptar: () => void }) {
  return (
    <Dialog open={abierto} onOpenChange={(o) => !o && onCerrar()}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-1.5rem)] max-w-2xl overflow-y-auto rounded-3xl border-0 bg-[#e8508a] p-6 text-center text-white sm:rounded-3xl sm:p-10 [&>button]:text-white">
        <div>
          <p className="text-lg font-semibold sm:text-2xl">Antes de agendar, te compartimos</p>
          <DialogTitle className="titular text-4xl leading-none sm:text-6xl">nuestras políticas</DialogTitle>
          <DialogDescription className="mt-1 text-lg font-semibold text-white sm:text-2xl">
            para que todo quede clarito:
          </DialogDescription>
        </div>
        <div className="divide-y divide-white/40">
          {politicas.map((p) => (
            <section key={p.titulo} className="space-y-2 py-5">
              <h3 className="titular text-2xl sm:text-3xl">{p.titulo}</h3>
              {p.puntos.map((x) => (
                <p key={x} className="font-medium leading-relaxed text-white/95">
                  <Negrita texto={x} claseNegrita="text-white" />
                </p>
              ))}
            </section>
          ))}
        </div>
        <p className="rounded-3xl bg-black/10 px-5 py-3 font-extrabold">
          Al realizar el adelanto para agendar tu pedido, entendemos que estás de acuerdo con estas políticas. 🤍
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button type="button" onClick={onCerrar} className="pill order-2 border-2 border-white/70 px-6 py-3 font-bold sm:order-1">
            Volver
          </button>
          <button
            type="button"
            onClick={onAceptar}
            className="pill order-1 flex items-center justify-center gap-2 bg-white px-6 py-3 font-extrabold text-[#e8508a] shadow-soft sm:order-2"
          >
            <IconoWhatsApp className="h-5 w-5" /> Acepto y envío mi pedido
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BotonCopiar({ texto }: { texto: string }) {
  return (
    <button
      type="button"
      onClick={async () => toast((await copiar(texto)) ? "¡Copiado! 📋" : "No se pudo copiar")}
      className="pill inline-flex items-center gap-1 bg-foreground px-3 py-1 text-xs font-bold text-background"
    >
      <Copy className="h-3 w-3" /> Copiar
    </button>
  );
}

export function Checkout() {
  const c = useCarrito();
  const { abrir } = useLegales();
  const [paso, setPaso] = useState(0);
  const [d, setD] = useState({
    nombre: "",
    celular: "",
    correo: "",
    doc: "",
    fechaEvento: "",
    fechaEntrega: "",
    direccion: "",
    referencia: "",
  });
  const [entrega, setEntrega] = useState<"delivery" | "recojo" | "shalom">("delivery");
  const [shalom, setShalom] = useState({ destino: "", agencia: "", dniRecoge: "" });
  const [distrito, setDistrito] = useState("");
  const [tipoPago, setTipoPago] = useState<"adelanto" | "completo">("adelanto");
  const [medio, setMedio] = useState<Medio>("yape");
  const [comprobante, setComprobante] = useState<Comprobante>("no");
  const [diseno, setDiseno] = useState<Diseno>(disenoVacio);
  const [verAviso, setVerAviso] = useState(false);
  const [acepto, setAcepto] = useState(false);
  const [verPoliticas, setVerPoliticas] = useState(false);
  const [error, setError] = useState("");
  const [pedido, setPedido] = useState<{ codigo: string; resumen: string; monto: number } | null>(
    null,
  );

  const r = c.resultadoCupon;
  const descuento = r?.ok ? r.descuento : 0;
  const costoDistrito = config.delivery.find((x) => x.distrito === distrito)?.costo ?? 0;
  const costoDelivery =
    entrega === "delivery"
      ? r?.ok && r.envioGratis
        ? 0
        : costoDistrito
      : entrega === "shalom"
        ? config.shalom.embalaje
        : 0;
  const textoShalom = `${shalom.agencia.trim()} – ${shalom.destino.trim()}`;
  const sinRecargo = Math.max(0, c.subtotal - descuento) + costoDelivery;
  // Pagar con tarjeta tiene un recargo (config.recargoTarjeta %) sobre productos + delivery.
  const recargo = medio === "tarjeta" ? Math.round(sinRecargo * config.recargoTarjeta) / 100 : 0;
  const total = sinRecargo + recargo;
  const aPagar = tipoPago === "adelanto" ? Math.round(total * 50) / 100 : total;
  const min = useMemo(minEntrega, []);
  // El evento debe ser al menos un día después de la primera entrega posible (se entrega el día anterior).
  const minEvento = sumarDias(min, 1);

  const aPersonalizar = c.lineas.filter((l) => l.producto.personalizable);
  // Si nada del carrito se personaliza, el paso "Diseño" se salta.
  const mover = (desde: number, dir: 1 | -1) => {
    const n = desde + dir;
    return n === P.diseno && aPersonalizar.length === 0 ? n + dir : n;
  };

  const textoDiseno = () =>
    [
      ...camposDiseno.map((f) => (diseno[f.k].trim() ? `${f.label}: ${diseno[f.k].trim()}` : null)),
      diseno.detalles.trim() ? `Detalles: ${diseno.detalles.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

  const set = (k: keyof typeof d) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setD({ ...d, [k]: e.target.value });

  const validar = () => {
    if (paso === P.datos) {
      if (!d.nombre.trim()) return "Escribe tu nombre.";
      if (!/^(9\d{8}|\+\d{8,15})$/.test(d.celular.replace(/[\s-]/g, "")))
        return "Escribe un celular de 9 dígitos (empieza con 9) o, si es del extranjero, con + y código de país.";
      if (comprobante !== "no" && !d.correo.trim())
        return "Escribe tu correo para enviarte el comprobante.";
      if (d.correo && !/^\S+@\S+\.\S+$/.test(d.correo)) return "Revisa tu correo.";
      const doc = d.doc.replace(/\s/g, "");
      if (comprobante === "boleta" && !/^\d{8}$/.test(doc))
        return "Para boleta escribe tu DNI (8 dígitos).";
      if (comprobante === "factura" && !/^\d{11}$/.test(doc))
        return "Para factura escribe tu RUC (11 dígitos).";
    }
    if (paso === P.entrega) {
      if (d.fechaEvento && d.fechaEvento < minEvento)
        return `Para esa fecha ya no llegamos 😢 La fecha del evento debe ser desde el ${fechaLarga(minEvento)}.`;
      if (!d.fechaEntrega) return "Elige la fecha de entrega.";
      if (d.fechaEntrega < min)
        return `Necesitamos al menos ${config.diasMinimosAnticipacion} días hábiles: la entrega puede ser desde el ${fechaLarga(min)}.`;
      if (esDomingo(d.fechaEntrega)) return "No entregamos los domingos. Elige otro día.";
      if (d.fechaEvento && d.fechaEntrega >= d.fechaEvento)
        return "La entrega no puede ser el mismo día del evento (repartimos de 11 a. m. a 8:30 p. m.). Elige una fecha anterior, idealmente un día antes.";
      if (entrega === "delivery" && !distrito) return "Elige tu distrito.";
      if (entrega === "delivery" && !d.direccion.trim()) return "Escribe tu dirección.";
      if (entrega === "shalom") {
        if (!shalom.destino.trim()) return "Escribe la ciudad y el departamento de destino.";
        if (!shalom.agencia.trim()) return "Escribe la agencia Shalom donde lo recogerás.";
        if (!/^\d{8}$/.test(shalom.dniRecoge.replace(/\s/g, "")))
          return "Escribe el DNI (8 dígitos) de quien recogerá en Shalom.";
      }
    }
    if (paso === P.diseno && !diseno.tematica.trim() && !diseno.detalles.trim())
      return "Cuéntanos al menos la temática o los detalles de tu diseño.";
    if (paso === P.confirmar && !acepto) return "Debes aceptar los términos y condiciones.";
    return "";
  };

  const siguiente = () => {
    const e = validar();
    setError(e);
    if (!e) setPaso(mover(paso, 1));
  };

  const medioTexto = {
    yape: "Yape / Plin",
    tarjeta: "Tarjeta de crédito/débito",
    transferencia: "Transferencia bancaria",
  }[medio];

  const lineasTexto = () =>
    c.lineas
      .map((l, i) => {
        const p = textoPersonalizacion(l.personalizacion);
        return `${i + 1}. ${l.producto.nombre} – ${l.v.nombre} x${l.cantidad} = ${soles(l.total)}${p ? `\n   ✨ ${p}` : ""}`;
      })
      .join("\n");

  const construir = (codigo: string) => {
    const lineas = lineasTexto();
    return [
      `Hola Fiestika 🎉 Este es mi pedido *${codigo}*`,
      "",
      "*Productos:*",
      lineas,
      "",
      ...(aPersonalizar.length && textoDiseno() ? ["*Diseño:*", textoDiseno(), ""] : []),
      `Subtotal: ${soles(c.subtotal)}`,
      r?.ok
        ? `Cupón ${c.cupon}: -${soles(descuento)}${r.envioGratis ? " (delivery gratis)" : ""}`
        : null,
      entrega === "delivery"
        ? `Delivery (${distrito}): ${soles(costoDelivery)}`
        : entrega === "shalom"
          ? `Envío por Shalom: embalaje ${soles(costoDelivery)} (el flete de Shalom según destino se coordina aparte)`
          : `Entrega: Recojo en ${config.recojo.lugar}`,
      recargo > 0 ? `Recargo por pago con tarjeta (${config.recargoTarjeta}%): ${soles(recargo)}` : null,
      `*Total: ${soles(total)}*`,
      `Tipo de pago: ${tipoPago === "adelanto" ? `Adelanto 50% → ${soles(aPagar)}` : `Pago completo → ${soles(aPagar)}`}`,
      `Medio de pago: ${medioTexto}`,
      "",
      `Fecha de entrega: ${fechaLarga(d.fechaEntrega)}`,
      d.fechaEvento ? `Fecha del evento: ${fechaLarga(d.fechaEvento)}` : null,
      entrega === "delivery"
        ? `Dirección: ${d.direccion}${d.referencia ? ` (Ref: ${d.referencia})` : ""}`
        : entrega === "shalom"
          ? `Shalom: ${textoShalom} · Recoge DNI ${shalom.dniRecoge.trim()}`
          : null,
      "",
      "*Mis datos:*",
      `Nombre: ${d.nombre}`,
      `Celular: ${d.celular}`,
      d.correo ? `Correo: ${d.correo}` : null,
      d.doc ? `DNI/RUC: ${d.doc}` : null,
      comprobante !== "no"
        ? `Comprobante: ${comprobante === "boleta" ? "Boleta" : "Factura"}`
        : null,
      "",
      "Adjunto mi comprobante de pago. 💗",
    ]
      .filter((x) => x !== null)
      .join("\n");
  };

  /** Anota el pedido en la hoja de Google (si config.urlHojaPedidos está configurada). */
  const anotarEnHoja = (codigo: string) => {
    if (!config.urlHojaPedidos) return;
    const detalle = [
      `Código web: ${codigo}`,
      d.fechaEvento ? `Fecha del evento: ${fechaLarga(d.fechaEvento)}` : null,
      aPersonalizar.length && textoDiseno() ? `DISEÑO:\n${textoDiseno()}` : null,
      `Pago elegido: ${tipoPago === "adelanto" ? "adelanto 50%" : "completo"} → ${soles(aPagar)} (${medioTexto})`,
      recargo > 0 ? `Incluye recargo tarjeta ${config.recargoTarjeta}%: ${soles(recargo)}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    const datos = {
      cliente: d.nombre.trim(),
      celular: d.celular.trim(),
      fechaEntrega: d.fechaEntrega,
      direccion:
        entrega === "delivery"
          ? `${d.direccion.trim()}, ${distrito}${d.referencia.trim() ? ` (Ref: ${d.referencia.trim()})` : ""}`
          : entrega === "shalom"
            ? `SHALOM: ${textoShalom}`
            : `RECOJO: ${config.recojo.lugar}`,
      comprobante: comprobante === "no" ? "NO" : "SI /PENDIENTE DE EMITIR",
      detalle,
      pedido: lineasTexto(),
      monto: Math.max(0, c.subtotal - descuento) + recargo,
      delivery: costoDelivery,
      medioPago: { yape: "YAPE", tarjeta: "TARJETA", transferencia: "TRANSFERENCIA BCP" }[medio],
    };
    // text/plain + no-cors: Apps Script no permite CORS; el pedido igual sale por WhatsApp si esto falla.
    fetch(config.urlHojaPedidos, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(datos),
    }).catch(() => {});
  };

  const confirmar = () => {
    const e = validar();
    setError(e);
    if (e) return;
    const codigo = codigoPedido();
    const resumen = construir(codigo);
    window.open(linkWhatsApp(resumen), "_blank");
    anotarEnHoja(codigo);
    setPedido({ codigo, resumen, monto: Math.max(0, c.subtotal - descuento) });
    c.vaciar();
    lanzarConfeti();
    setTimeout(lanzarConfeti, 600);
  };

  const cerrar = (o: boolean) => {
    c.setAbiertoCheckout(o);
    if (!o) {
      setPaso(0);
      setPedido(null);
      setError("");
      setAcepto(false);
      setComprobante("no");
      setVerAviso(false);
    }
  };

  const opcion = (activo: boolean) =>
    cn(
      "rounded-2xl border-2 p-3 text-left font-bold transition-colors",
      activo ? "border-primary bg-primary/10" : "border-border bg-background",
    );

  return (
    <Dialog open={c.abiertoCheckout} onOpenChange={cerrar}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-xl overflow-y-auto rounded-3xl border-border bg-card sm:rounded-3xl">
        {pedido ? (
          <div className="py-4 text-center">
            <p className="text-6xl">🎁</p>
            <DialogTitle className="titular mt-3 text-3xl">¡Gracias por tu compra!</DialogTitle>
            <DialogDescription className="mt-2 font-semibold">
              Tu código de pedido es{" "}
              <span className="pill bg-amarillo px-3 py-0.5 font-mono text-pastel-foreground">
                {pedido.codigo}
              </span>
            </DialogDescription>
            {pedido.monto > config.montoMinimoRuleta ? (
              <div className="mt-6 rounded-2xl bg-amarillo p-4 font-semibold text-pastel-foreground">
                <p className="titular text-xl">🎡 ¡Ganaste un giro en la ruleta!</p>
                <p className="mt-1 text-sm">
                  Cuando confirmemos tu pago, lo jugamos contigo y verás qué te llevaste.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-lila p-4 text-sm font-semibold text-pastel-foreground">
                <p>
                  🎟️ Guarda tu código <span className="font-mono font-bold">{pedido.codigo}</span>:
                  en tu próxima compra utilízalo para jugar a la ruleta o regálaselo a un amigo.
                </p>
                <div className="mt-2">
                  <BotonCopiar texto={pedido.codigo} />
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <a
                href={linkWhatsApp(pedido.resumen)}
                target="_blank"
                rel="noreferrer"
                className="pill flex items-center justify-center gap-2 bg-whatsapp px-5 py-3 font-bold text-pastel-foreground"
              >
                <IconoWhatsApp className="h-4 w-4" /> Reenviar por WhatsApp
              </a>
              <a
                href={`mailto:${config.correo}?subject=${encodeURIComponent(`Pedido ${pedido.codigo}`)}&body=${encodeURIComponent(pedido.resumen.replace(/\*/g, ""))}`}
                className="pill border border-border px-5 py-3 font-bold"
              >
                Enviar por correo
              </a>
            </div>
          </div>
        ) : (
          <>
            <DialogTitle className="titular text-3xl">Finalizar pedido</DialogTitle>
            <DialogDescription className="sr-only">
              Completa tus datos para enviar tu pedido por WhatsApp.
            </DialogDescription>
            <ol className="flex gap-1">
              {pasos.map((p, i) => (
                <li key={p} className="flex-1">
                  <div className={cn("h-2 rounded-full", i <= paso ? "bg-primary" : "bg-muted")} />
                  <span
                    className={cn(
                      "mt-1 block font-mono text-[10px] uppercase",
                      i === paso ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {p}
                  </span>
                </li>
              ))}
            </ol>

            {paso === 0 && (
              <div className="grid gap-3">
                <label className="text-sm font-bold">
                  Nombre completo *
                  <input
                    className={cn(inputCls, "mt-1")}
                    value={d.nombre}
                    onChange={set("nombre")}
                  />
                </label>
                <label className="text-sm font-bold">
                  Celular *
                  <input
                    inputMode="tel"
                    placeholder="9XX XXX XXX o +código país"
                    className={cn(inputCls, "mt-1")}
                    value={d.celular}
                    onChange={set("celular")}
                  />
                </label>
                <label className="text-sm font-bold">
                  ¿Necesitas comprobante?
                  <select
                    className={cn(inputCls, "mt-1")}
                    value={comprobante}
                    onChange={(e) => setComprobante(e.target.value as Comprobante)}
                  >
                    <option value="no">No</option>
                    <option value="boleta">Boleta (con DNI)</option>
                    <option value="factura">Factura (con RUC)</option>
                  </select>
                </label>
                <label className="text-sm font-bold">
                  Correo{comprobante !== "no" ? " *" : " (opcional)"}
                  <input
                    type="email"
                    className={cn(inputCls, "mt-1")}
                    value={d.correo}
                    onChange={set("correo")}
                  />
                </label>
                <label className="text-sm font-bold">
                  {comprobante === "factura"
                    ? "RUC *"
                    : comprobante === "boleta"
                      ? "DNI *"
                      : "DNI / RUC (opcional)"}
                  <input
                    inputMode="numeric"
                    className={cn(inputCls, "mt-1")}
                    value={d.doc}
                    onChange={set("doc")}
                  />
                </label>
              </div>
            )}

            {paso === 1 && (
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm font-bold">
                    Fecha del evento
                    <input
                      type="date"
                      min={minEvento}
                      className={cn(inputCls, "mt-1")}
                      value={d.fechaEvento}
                      onChange={set("fechaEvento")}
                    />
                  </label>
                  <label className="text-sm font-bold">
                    Fecha de entrega *
                    <input
                      type="date"
                      min={min}
                      max={d.fechaEvento ? diaAntes(d.fechaEvento) : undefined}
                      className={cn(inputCls, "mt-1")}
                      value={d.fechaEntrega}
                      onChange={set("fechaEntrega")}
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mínimo {config.diasMinimosAnticipacion} días hábiles de anticipación. Entregamos
                  de lunes a sábado (sin domingos) de 11 a. m. a 8:30 p. m., por eso la entrega no puede ser
                  el mismo día del evento: te recomendamos recibirlo máximo un día antes.
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    className={opcion(entrega === "delivery")}
                    onClick={() => setEntrega("delivery")}
                  >
                    🛵 Delivery
                    <span className="block text-xs font-semibold text-muted-foreground">
                      Lima y Callao
                    </span>
                  </button>
                  <button
                    type="button"
                    className={opcion(entrega === "recojo")}
                    onClick={() => setEntrega("recojo")}
                  >
                    🚗 Recojo / movilidad propia
                    <span className="block text-xs font-semibold text-muted-foreground">
                      Sin costo
                    </span>
                  </button>
                  <button
                    type="button"
                    className={opcion(entrega === "shalom")}
                    onClick={() => setEntrega("shalom")}
                  >
                    📦 Envío por Shalom
                    <span className="block text-xs font-semibold text-muted-foreground">
                      A todo el Perú
                    </span>
                  </button>
                </div>
                {entrega === "delivery" && (
                  <>
                    <label className="text-sm font-bold">
                      Distrito *
                      <select
                        className={cn(inputCls, "mt-1")}
                        value={distrito}
                        onChange={(e) => setDistrito(e.target.value)}
                      >
                        <option value="">Elige tu distrito</option>
                        {config.delivery.map((x) => (
                          <option key={x.distrito} value={x.distrito}>
                            {x.distrito} — {soles(x.costo)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm font-bold">
                      Dirección *
                      <input
                        className={cn(inputCls, "mt-1")}
                        value={d.direccion}
                        onChange={set("direccion")}
                      />
                    </label>
                    <label className="text-sm font-bold">
                      Referencia
                      <input
                        className={cn(inputCls, "mt-1")}
                        value={d.referencia}
                        onChange={set("referencia")}
                      />
                    </label>
                  </>
                )}
                {entrega === "shalom" && (
                  <>
                    <div className="rounded-2xl bg-muted p-4 text-sm font-semibold">
                      <p className="font-extrabold">📦 Envío a todo el Perú por Shalom</p>
                      <p className="mt-1">
                        Cobramos <span className="font-extrabold">{soles(config.shalom.embalaje)}</span> por
                        embalar tu pedido. El costo del envío de Shalom depende del destino: te lo indicamos
                        por WhatsApp.
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        La fecha de entrega es el día en que lo dejamos en Shalom; el tiempo de llegada depende
                        de la ciudad.
                      </p>
                    </div>
                    <label className="text-sm font-bold">
                      Ciudad y departamento de destino *
                      <input
                        placeholder="Ej. Arequipa, Arequipa"
                        maxLength={120}
                        className={cn(inputCls, "mt-1")}
                        value={shalom.destino}
                        onChange={(e) => setShalom({ ...shalom, destino: e.target.value })}
                      />
                    </label>
                    <label className="text-sm font-bold">
                      Agencia Shalom de destino *
                      <input
                        placeholder="Ej. Shalom Av. Ejército"
                        maxLength={120}
                        className={cn(inputCls, "mt-1")}
                        value={shalom.agencia}
                        onChange={(e) => setShalom({ ...shalom, agencia: e.target.value })}
                      />
                    </label>
                    <label className="text-sm font-bold">
                      DNI de quien recoge *
                      <input
                        inputMode="numeric"
                        maxLength={8}
                        className={cn(inputCls, "mt-1")}
                        value={shalom.dniRecoge}
                        onChange={(e) => setShalom({ ...shalom, dniRecoge: e.target.value })}
                      />
                    </label>
                  </>
                )}
                {entrega === "recojo" && (
                  <div className="rounded-2xl bg-muted p-4 text-sm font-semibold">
                    <p className="font-extrabold">📍 Punto de recojo</p>
                    <p className="mt-1">{config.recojo.lugar}</p>
                    <a
                      href={config.recojo.mapa}
                      target="_blank"
                      rel="noreferrer"
                      className="pill mt-3 inline-block bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground"
                    >
                      Ver en Google Maps
                    </a>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Coordinamos la hora de recojo por WhatsApp.
                    </p>
                  </div>
                )}
              </div>
            )}

            {paso === P.diseno && (
              <div className="grid gap-3">
                <p className="rounded-2xl bg-muted p-3 text-sm font-semibold">
                  ✨ Cuéntanos cómo imaginas tu diseño para:{" "}
                  <span className="font-extrabold">
                    {aPersonalizar.map((l) => l.producto.nombre).join(", ")}
                  </span>
                  .
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {camposDiseno.map((f) => (
                    <label
                      key={f.k}
                      className={cn(
                        "text-sm font-bold",
                        (f.k === "cumpleanero" || f.k === "frases") && "sm:col-span-2",
                      )}
                    >
                      {f.label}
                      <input
                        placeholder={f.ph}
                        maxLength={200}
                        className={cn(inputCls, "mt-1")}
                        value={diseno[f.k]}
                        onChange={(e) => setDiseno({ ...diseno, [f.k]: e.target.value })}
                      />
                    </label>
                  ))}
                </div>
                <label className="text-sm font-bold">
                  Detalles para tu pedido
                  <span className="block text-xs font-semibold text-muted-foreground">
                    Agrega toda la info que podamos necesitar para crear tu pedido. Si un producto
                    lleva algo distinto, indícalo aquí.
                  </span>
                  <textarea
                    rows={3}
                    maxLength={800}
                    value={diseno.detalles}
                    onFocus={() => setVerAviso(true)}
                    onChange={(e) => setDiseno({ ...diseno, detalles: e.target.value })}
                    className={cn(inputCls, "mt-1")}
                    placeholder="Ej. En los toppers poner «Vale 5», en los banderines usar fotos de la familia"
                  />
                </label>
                {verAviso && (
                  <p
                    role="status"
                    className="animate-in fade-in slide-in-from-top-1 rounded-2xl bg-amarillo p-3 text-sm font-bold text-pastel-foreground"
                  >
                    💬 Al recibir tus datos y la confirmación de pago, nos comunicaremos contigo
                    para hacerte algunas preguntas que hayan quedado al aire y así personalizar tu
                    pedido.
                  </p>
                )}
                <p
                  role="note"
                  className="flex items-start gap-3 rounded-2xl border-2 border-red-500 bg-red-500/10 p-4 text-base font-extrabold leading-snug text-red-600 dark:text-red-400"
                >
                  <span className="text-2xl leading-none" aria-hidden>
                    📸
                  </span>
                  <span>
                    Las fotos para tu diseño nos las envías por WhatsApp después de hacer tu pedido.
                  </span>
                </p>
              </div>
            )}

            {paso === P.pago && (
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={opcion(tipoPago === "adelanto")}
                    onClick={() => setTipoPago("adelanto")}
                  >
                    Adelanto 50%
                    <span className="block text-fucsia">{soles(Math.round(total * 50) / 100)}</span>
                  </button>
                  <button
                    type="button"
                    className={opcion(tipoPago === "completo")}
                    onClick={() => setTipoPago("completo")}
                  >
                    Pago completo<span className="block text-fucsia">{soles(total)}</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["yape", "tarjeta", "transferencia"] as Medio[])
                    .filter((m) => m !== "transferencia" || config.cuentasBancarias.length > 0)
                    .map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={cn(opcion(medio === m), "text-center text-sm")}
                        onClick={() => setMedio(m)}
                      >
                        {
                          {
                            yape: "📱 Yape / Plin",
                            tarjeta: config.recargoTarjeta ? `💳 Tarjeta (+${config.recargoTarjeta}%)` : "💳 Tarjeta",
                            transferencia: "🏦 Transferencia",
                          }[m]
                        }
                      </button>
                    ))}
                </div>
                <div className="rounded-3xl bg-muted p-4 text-sm font-semibold">
                  {medio === "yape" && (
                    <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                      <img
                        src={config.yape.qr}
                        alt="QR de Yape"
                        className="h-32 w-32 rounded-2xl bg-card object-contain"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                      <div className="space-y-2">
                        <p>
                          Yape: <span className="font-mono">{config.yape.numero}</span>{" "}
                          <BotonCopiar texto={config.yape.numero} />
                        </p>
                        <p>
                          Plin: <span className="font-mono">{config.plin.numero}</span>{" "}
                          <BotonCopiar texto={config.plin.numero} />
                        </p>
                        <p>Titular: {config.yape.titular}</p>
                      </div>
                    </div>
                  )}
                  {medio === "tarjeta" && recargo > 0 && (
                    <div className="mb-3 space-y-1 rounded-2xl bg-card p-3">
                      <p className="font-extrabold text-fucsia">
                        💳 El pago con tarjeta tiene un recargo de {config.recargoTarjeta}%.
                      </p>
                      <p className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{soles(sinRecargo)}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Recargo tarjeta ({config.recargoTarjeta}%)</span>
                        <span>{soles(recargo)}</span>
                      </p>
                      <p className="flex justify-between border-t border-border pt-1 font-extrabold">
                        <span>Total con tarjeta</span>
                        <span>{soles(total)}</span>
                      </p>
                    </div>
                  )}
                  {medio === "tarjeta" &&
                    (config.linkPagoTarjeta ? (
                      <a
                        href={config.linkPagoTarjeta}
                        target="_blank"
                        rel="noreferrer"
                        className="pill inline-block bg-primary px-5 py-3 font-bold text-primary-foreground"
                      >
                        Pagar {soles(aPagar)} con tarjeta
                      </a>
                    ) : (
                      <p>💳 Te enviamos el link de pago por WhatsApp.</p>
                    ))}
                  {medio === "transferencia" && (
                    <div className="space-y-3">
                      {config.cuentasBancarias.map((b) => (
                        <div key={b.numero} className="rounded-2xl bg-card p-3">
                          <p className="font-extrabold">
                            {b.banco} · {b.tipo}
                          </p>
                          <p>
                            N.º <span className="font-mono">{b.numero}</span>{" "}
                            <BotonCopiar texto={b.numero} />
                          </p>
                          <p>
                            CCI <span className="font-mono">{b.cci}</span>{" "}
                            <BotonCopiar texto={b.cci} />
                          </p>
                          <p className="text-muted-foreground">Titular: {b.titular}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {paso === P.confirmar && (
              <div className="space-y-3 text-sm">
                <ul className="space-y-1 rounded-3xl bg-muted p-4 font-semibold">
                  {c.lineas.map((l) => (
                    <li key={l.key} className="flex justify-between gap-2">
                      <span>
                        {l.producto.nombre} – {l.v.nombre} x{l.cantidad}
                      </span>
                      <span>{soles(l.total)}</span>
                    </li>
                  ))}
                  {descuento > 0 && (
                    <li className="flex justify-between text-fucsia">
                      <span>Descuento ({c.cupon})</span>
                      <span>-{soles(descuento)}</span>
                    </li>
                  )}
                  <li className="flex justify-between">
                    <span>{entrega === "delivery"
                        ? `Delivery (${distrito})`
                        : entrega === "shalom"
                          ? "Embalaje Shalom (+ envío según destino)"
                          : "Recojo"}</span>
                    <span>{soles(costoDelivery)}</span>
                  </li>
                  {recargo > 0 && (
                    <li className="flex justify-between">
                      <span>Recargo por tarjeta ({config.recargoTarjeta}%)</span>
                      <span>{soles(recargo)}</span>
                    </li>
                  )}
                  <li className="flex justify-between border-t border-border pt-2 text-base font-extrabold">
                    <span>Total</span>
                    <span>{soles(total)}</span>
                  </li>
                  <li className="flex justify-between font-extrabold text-fucsia">
                    <span>A pagar ahora ({tipoPago === "adelanto" ? "50%" : "100%"})</span>
                    <span>{soles(aPagar)}</span>
                  </li>
                </ul>
                <p className="rounded-2xl bg-amarillo p-3 font-bold text-pastel-foreground">
                  ⚠️ No realizamos pedidos ni envíos contraentrega.
                </p>
                <label className="flex items-start gap-2 font-semibold">
                  <input
                    type="checkbox"
                    checked={acepto}
                    onChange={(e) => setAcepto(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <span>
                    Acepto los{" "}
                    <button type="button" className="underline" onClick={() => abrir("terminos")}>
                      términos y condiciones
                    </button>
                    . Antes de enviar te mostraremos nuestras políticas.
                  </span>
                </label>
              </div>
            )}

            {error && <p className="text-sm font-bold text-destructive">{error}</p>}

            <div className="flex gap-2">
              {paso > 0 && (
                <button
                  onClick={() => {
                    setError("");
                    setPaso(mover(paso, -1));
                  }}
                  className="pill border border-border px-5 py-3 font-bold"
                >
                  Atrás
                </button>
              )}
              {paso < P.confirmar ? (
                <button
                  onClick={siguiente}
                  className="pill flex-1 bg-primary py-3 font-extrabold text-primary-foreground"
                >
                  Continuar
                </button>
              ) : (
                <button
                  onClick={() => {
                    const e = validar();
                    setError(e);
                    if (!e) setVerPoliticas(true);
                  }}
                  className="pill flex flex-1 items-center justify-center gap-2 bg-whatsapp py-3 font-extrabold text-pastel-foreground"
                >
                  <IconoWhatsApp className="h-5 w-5" /> Enviar pedido por WhatsApp
                </button>
              )}
            </div>
          </>
        )}
      </DialogContent>
      <PoliticasPopup
        abierto={verPoliticas}
        onCerrar={() => setVerPoliticas(false)}
        onAceptar={() => {
          setVerPoliticas(false);
          confirmar();
        }}
      />
    </Dialog>
  );
}
