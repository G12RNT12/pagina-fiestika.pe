// =============================================================
// TEXTOS: testimonios, galería, preguntas frecuentes y políticas
// =============================================================

// Sección "¿Quiénes somos?" (va antes de las categorías). Usa **texto** para negrita.
export const quienesSomos = {
  titulo: "¿Quiénes somos?",
  parrafos: [
    "Somos **Fiestika**, un emprendimiento limeño que diseña y arma detalles personalizados para que cada celebración se sienta única.",
    "Cada banderín, topper, sticker o tatuaje lo hacemos **a mano y con tu temática**, cuidando los colores, los nombres y cada detalle. Tú nos cuentas cómo imaginas tu fiesta y nosotros nos encargamos del resto.",
  ],
  valores: [
    {
      icono: "✂️",
      titulo: "Hecho a mano",
      texto: "Diseñamos, imprimimos y armamos cada pedido nosotros mismos.",
      color: "bg-rosa",
    },
    {
      icono: "🎨",
      titulo: "100% personalizado",
      texto: "Tu temática, tus colores, tus fotos y tus frases.",
      color: "bg-amarillo",
    },
    {
      icono: "💬",
      titulo: "Te acompañamos",
      texto: "Te enviamos el diseño para tu aprobación antes de producir.",
      color: "bg-menta",
    },
  ],
};

export const galeria: { src: string; alt: string }[] = [
  {
    src: "/images/galeria/cliente-1.webp",
    alt: "Caja, toppers, sorbete y banderín de caritas con temática de playa",
  },
  { src: "/images/galeria/cliente-2.webp", alt: "Tattoo station de Bluey" },
  { src: "/images/galeria/cliente-3.webp", alt: "Tattoo station, caja y sorbetes" },
  {
    src: "/images/galeria/cliente-4.webp",
    alt: "Fiesta de Spider-Man con tatuajes, vasos y stickers personalizados",
  },
  {
    src: "/images/galeria/cliente-5.webp",
    alt: "Caja de regalo de cumpleaños personalizada con foto",
  },
  { src: "/images/galeria/cliente-6.webp", alt: "Niñas eligiendo sus stickers en la fiesta" },
  {
    src: "/images/galeria/cliente-7.webp",
    alt: "Sorbetes de Stitch y stickers para una karaoke night",
  },
];

export const testimonios = [
  {
    nombre: "@alicia...",
    distrito: "Surco",
    texto: "Me encantó todo, muchas gracias 🫶🏻",
  },
  {
    nombre: "@kiara...",
    distrito: "Callao",
    texto: "😍 me encantó, super recomendado 🫶🏼✨",
  },
  {
    nombre: "@mafer",
    distrito: "San Miguel",
    texto:
      "Los mejores!! 💖 ame cada cosa que hicieron para mi cumple! 💕💕 todo estuvo super lindo 🥰",
  },
];

export const preguntas = [
  {
    p: "¿Con cuánta anticipación debo hacer mi pedido?",
    r: "Te recomendamos pedir con al menos 3 días hábiles de anticipación (ej.: si pides el lunes 5, la entrega puede ser desde el jueves 8). Para pedidos grandes, mejor una semana.",
  },
  {
    p: "¿Cómo envío las fotos para mi diseño?",
    r: "Las fotos para tu diseño (caritas, polaroids) nos las envías por WhatsApp después de hacer tu pedido.",
  },
  {
    p: "¿Hacen envíos fuera de Lima?",
    r: "¡Sí! Enviamos a todo el Perú por Shalom. Cobramos S/ 3 por embalar tu pedido y el costo del envío de Shalom depende del destino (te lo indicamos por WhatsApp). En Lima y Callao tenemos delivery propio.",
  },
  {
    p: "¿Cómo pago?",
    r: "Puedes pagar con Yape, Plin, transferencia bancaria o tarjeta. Agendamos tu pedido con el 50% de adelanto.",
  },
  {
    p: "¿Veo el diseño antes de que lo impriman?",
    r: "¡Sí! Te enviamos el diseño por WhatsApp para tu aprobación antes de producir.",
  },
  {
    p: "¿Puedo recoger mi pedido?",
    r: "Sí, puedes recogerlo tú o enviar tu propia movilidad a la puerta principal del Colegio Liceo Naval, en Ventanilla. Coordinamos la hora por WhatsApp.",
  },
];

export const politicas = [
  {
    titulo: "Pagos y delivery",
    puntos: [
      "Agendamos tu pedido con el **50% de adelanto.** Una vez terminado, te enviaremos fotos del resultado para que puedas cancelar el **saldo restante.**",
      "**Si eliges nuestro delivery**, el motorizado recoge los pedidos un día antes de la fecha de entrega, por lo que el **pedido + delivery deberán estar cancelados hasta las 7:00 p. m. del día anterior.** Solo con el pago completo podremos agendar el envío.",
      "**Si envías tu propia movilidad**, puedes cancelar el saldo antes de que le entreguemos tu pedido.",
      "**No realizamos pedidos ni envíos contraentrega.**",
    ],
  },
  {
    titulo: "Cancelaciones",
    puntos: [
      "Una vez realizado el **adelanto del 50%**, empezamos a trabajar en tu pedido. Si surge algún imprevisto y necesitas cancelarlo después de haber recibido los diseños, se devolverá **únicamente el 25%** del total de tu pedido. **El otro 25%** corresponde al trabajo de diseño y preparación ya realizado.",
      "Si el pedido ya está **armado** (terminado), **no se realiza devolución de ningún monto.**",
    ],
  },
  {
    titulo: "Entregas",
    puntos: [
      "Nuestro delivery realiza entregas de lunes a sábado, **de 11:00 a. m. a 8:30 p. m.**, sin hora exacta.",
      "Por favor, mantente atento(a) a nuestros mensajes. Si no logramos coordinar la entrega a tiempo, **el envío se reprogramará para el siguiente día disponible.**",
    ],
  },
  {
    titulo: "Pedidos terminados y no recogidos",
    puntos: [
      "Si tu pedido ya está terminado y no logramos obtener respuesta para coordinar su entrega o recojo, podremos guardarlo por un **plazo máximo de 30 días.**",
      "Pasado ese tiempo, el pedido será descartado y no corresponderá devolución del adelanto, ya que fue personalizado y elaborado especialmente para ti.",
    ],
  },
];
