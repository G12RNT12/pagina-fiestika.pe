import { createContext, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { config } from "@/data/config";
import { cn } from "@/lib/utils";
import { inputCls } from "./ProductoModal";

type Tipo = "terminos" | "privacidad" | "reclamaciones" | null;
const gl = globalThis as { __fiestikaLegalesCtx?: React.Context<{ abrir: (t: Tipo) => void }> };
const Ctx = (gl.__fiestikaLegalesCtx ??= createContext<{ abrir: (t: Tipo) => void }>({ abrir: () => {} }));
export const useLegales = () => useContext(Ctx);

export function LegalesProvider({ children }: { children: ReactNode }) {
  const [tipo, setTipo] = useState<Tipo>(null);
  return (
    <Ctx.Provider value={{ abrir: setTipo }}>
      {children}
      <Dialog open={!!tipo} onOpenChange={(o) => !o && setTipo(null)}>
        <DialogContent className="max-h-[90vh] w-[calc(100%-1.5rem)] max-w-2xl overflow-y-auto rounded-3xl border-border bg-card sm:rounded-3xl">
          {tipo === "terminos" && <Terminos />}
          {tipo === "privacidad" && <Privacidad />}
          {tipo === "reclamaciones" && <Reclamaciones onListo={() => setTipo(null)} />}
        </DialogContent>
      </Dialog>
    </Ctx.Provider>
  );
}

function Terminos() {
  return (
    <div className="space-y-3 text-sm font-semibold leading-relaxed">
      <DialogTitle className="titular text-3xl">Términos y condiciones</DialogTitle>
      <DialogDescription>Al comprar en {config.marca} aceptas lo siguiente:</DialogDescription>
      <p>1. Los productos son personalizados y se elaboran a pedido. Las imágenes son referenciales; los colores pueden variar ligeramente.</p>
      <p>2. Los pedidos se agendan con el 50% de adelanto y se confirman por WhatsApp. No realizamos pedidos ni envíos contraentrega.</p>
      <p>3. Te enviaremos el diseño para tu aprobación antes de producir. Una vez aprobado no se aceptan cambios.</p>
      <p>4. Las entregas se realizan en Lima Metropolitana y Callao, de lunes a sábado, de 11:00 a. m. a 8:30 p. m.</p>
      <p>5. Las cancelaciones, devoluciones y pedidos no recogidos se rigen por nuestras Políticas publicadas en esta página.</p>
      <p>6. Los precios están expresados en soles (S/) e incluyen IGV cuando corresponda. Los cupones no son acumulables.</p>
      <p>7. Al usar nuestro sitio aceptas estos términos y nuestra política de privacidad.</p>
    </div>
  );
}

function Privacidad() {
  return (
    <div className="space-y-3 text-sm font-semibold leading-relaxed">
      <DialogTitle className="titular text-3xl">Política de privacidad</DialogTitle>
      <DialogDescription>Conforme a la Ley N.º 29733, Ley de Protección de Datos Personales, y su reglamento.</DialogDescription>
      <p><b>Responsable:</b> {config.marca}, Lima, Perú. Contacto: {config.correo}.</p>
      <p><b>Datos que recopilamos:</b> nombre, celular, correo, DNI/RUC (opcional), dirección de entrega y datos de personalización que nos brindas voluntariamente al hacer tu pedido.</p>
      <p><b>Finalidad:</b> gestionar y entregar tu pedido, comunicarnos contigo por WhatsApp o correo y emitir comprobantes de pago.</p>
      <p><b>Almacenamiento:</b> este sitio no guarda tus datos en servidores; tu carrito se guarda solo en tu navegador. Los datos que nos envías por WhatsApp o correo se usan únicamente para tu pedido.</p>
      <p><b>Fotos:</b> las fotos que nos envías para tu diseño se usan solo para elaborarlo. Solo publicaremos fotos de tu pedido con tu autorización.</p>
      <p><b>Tus derechos (ARCO):</b> puedes solicitar acceso, rectificación, cancelación u oposición escribiendo a {config.correo}.</p>
    </div>
  );
}

function Reclamaciones({ onListo }: { onListo: () => void }) {
  const [f, setF] = useState({ tipo: "Reclamo", nombre: "", doc: "", celular: "", correo: "", direccion: "", pedido: "", monto: "", detalle: "", solicitud: "" });
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.nombre.trim() || !f.doc.trim() || !f.celular.trim() || !f.detalle.trim()) {
      setErr("Completa los campos obligatorios (*).");
      return;
    }
    const cuerpo = [
      `LIBRO DE RECLAMACIONES — ${config.marca}`,
      `Fecha: ${new Date().toLocaleString("es-PE")}`,
      `Tipo: ${f.tipo}`,
      `Nombre: ${f.nombre}`,
      `DNI/CE: ${f.doc}`,
      `Celular: ${f.celular}`,
      `Correo: ${f.correo}`,
      `Dirección: ${f.direccion}`,
      `Código de pedido: ${f.pedido}`,
      `Monto reclamado: ${f.monto}`,
      "",
      `Detalle: ${f.detalle}`,
      `Pedido del consumidor: ${f.solicitud}`,
    ].join("\n");
    window.location.href = `mailto:${config.correo}?subject=${encodeURIComponent(`${f.tipo} — Libro de Reclamaciones`)}&body=${encodeURIComponent(cuerpo)}`;
    onListo();
  };

  const campo = (k: keyof typeof f, label: string, extra = "") => (
    <label className={cn("text-sm font-bold", extra)}>
      {label}
      <input className={cn(inputCls, "mt-1")} value={f[k]} onChange={set(k)} />
    </label>
  );

  return (
    <form onSubmit={enviar} className="space-y-3">
      <DialogTitle className="titular text-3xl">📖 Libro de Reclamaciones</DialogTitle>
      <DialogDescription>Conforme al Código de Protección y Defensa del Consumidor. Responderemos en un plazo máximo de 15 días hábiles.</DialogDescription>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold sm:col-span-2">
          Tipo *
          <select className={cn(inputCls, "mt-1")} value={f.tipo} onChange={set("tipo")}>
            <option>Reclamo</option>
            <option>Queja</option>
          </select>
        </label>
        {campo("nombre", "Nombre completo *", "sm:col-span-2")}
        {campo("doc", "DNI / CE *")}
        {campo("celular", "Celular *")}
        {campo("correo", "Correo")}
        {campo("direccion", "Dirección")}
        {campo("pedido", "Código de pedido")}
        {campo("monto", "Monto reclamado (S/)")}
        <label className="text-sm font-bold sm:col-span-2">
          Detalle *
          <textarea rows={3} className={cn(inputCls, "mt-1")} value={f.detalle} onChange={set("detalle")} />
        </label>
        <label className="text-sm font-bold sm:col-span-2">
          ¿Qué solicitas?
          <textarea rows={2} className={cn(inputCls, "mt-1")} value={f.solicitud} onChange={set("solicitud")} />
        </label>
      </div>
      <p className="text-xs text-muted-foreground">Reclamo: disconformidad con el producto. Queja: disconformidad con la atención.</p>
      {err && <p className="text-sm font-bold text-destructive">{err}</p>}
      <button className="pill w-full bg-primary py-3 font-extrabold text-primary-foreground">Enviar por correo</button>
    </form>
  );
}
