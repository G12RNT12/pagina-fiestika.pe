// =============================================================
// CONFIGURACIÓN GENERAL DE FIESTIKA
// Cambia aquí teléfonos, correo, redes, pagos y costos de delivery.
// =============================================================

export type CuentaBancaria = {
  banco: string;
  tipo: string;
  numero: string;
  cci: string;
  titular: string;
};

export const config = {
  marca: "Fiestika Perú",
  eslogan: "Crea una fiesta linda, sin complicarte.",

  // WhatsApp: código de país + número, sin espacios ni "+"
  whatsapp: "51926601630",
  whatsappVisible: "926 601 630",
  // WhatsApp para pedidos corporativos (empresas, colegios, eventos grandes).
  // Mientras esté "", el botón "Corporativos" usa el número de arriba.
  whatsappCorporativo: "51926601630",
  whatsappCorporativoVisible: "926 601 630",
  correo: "fiestikaperu@gmail.com",

  redes: {
    instagram: "https://www.instagram.com/fiestika.pe/",
    tiktok: "https://www.tiktok.com/@fiestika.pe",
    linktree: "https://linktr.ee/fiestikaperu",
  },

  // ---------- Pagos ----------
  yape: { numero: "931830657", titular: "Grace Magallanes", qr: "/images/sitio/qr-yape.png" },
  plin: { numero: "942467229", titular: "Grace Magallanes" },
  // Link de Mercado Pago / Izipay / Culqi. Déjalo "" si aún no tienes.
  linkPagoTarjeta: "",
  // Recargo por pagar con tarjeta (% sobre productos + delivery). Pon 0 para no cobrar recargo.
  recargoTarjeta: 5,
  // Cuentas para transferencia. Si la lista está vacía, no se muestra la opción "Transferencia".
  cuentasBancarias: [
    // {
    //   banco: "BCP",
    //   tipo: "Cuenta de ahorros",
    //   numero: "191-00000000-0-00",
    //   cci: "002-191-000000000000-00",
    //   titular: "Fiestika Perú",
    // },
    // {
    //   banco: "Interbank",
    //   tipo: "Cuenta de ahorros",
    //   numero: "000-0000000000",
    //   cci: "003-000-000000000000-00",
    //   titular: "Fiestika Perú",
    // },
  ] as CuentaBancaria[],

  // ---------- Entregas ----------
  // Envío a provincias por Shalom: cobramos el embalaje; el flete de Shalom se cotiza según el destino.
  shalom: {
    embalaje: 3, // S/
  },
  // Punto de recojo (cuando el cliente elige "Recojo / movilidad propia")
  recojo: {
    lugar: "Puerta principal del Colegio Liceo Naval, Ventanilla",
    mapa: "https://maps.app.goo.gl/UpZJzDZhJaz2q6tN9",
  },
  diasMinimosAnticipacion: 3, // días hábiles (lunes a sábado) entre el pedido y la primera entrega posible
  umbralPocasUnidades: 5, // stock <= este número muestra "Pocas unidades"
  // Costos de delivery por distrito (S/)
  delivery: [
    // S/ 13
    { distrito: "Barranco", costo: 13 },
    { distrito: "Bellavista", costo: 13 },
    { distrito: "Breña", costo: 13 },
    { distrito: "Callao", costo: 13 },
    { distrito: "Carmen de la Legua", costo: 13 },
    { distrito: "Centro de Lima", costo: 13 },
    { distrito: "Cercado de Lima", costo: 13 },
    { distrito: "Chorrillos", costo: 13 },
    { distrito: "Comas", costo: 13 },
    { distrito: "Independencia", costo: 13 },
    { distrito: "Jesús María", costo: 13 },
    { distrito: "La Molina", costo: 13 },
    { distrito: "La Perla", costo: 13 },
    { distrito: "La Victoria", costo: 13 },
    { distrito: "Lima", costo: 13 },
    { distrito: "Lince", costo: 13 },
    { distrito: "Los Olivos", costo: 13 },
    { distrito: "Magdalena", costo: 13 },
    { distrito: "Miraflores", costo: 13 },
    { distrito: "Pueblo Libre", costo: 13 },
    { distrito: "Puente Piedra", costo: 13 },
    { distrito: "Rímac", costo: 13 },
    { distrito: "San Borja", costo: 13 },
    { distrito: "San Isidro", costo: 13 },
    { distrito: "San Luis", costo: 13 },
    { distrito: "San Martín de Porres", costo: 13 },
    { distrito: "San Miguel", costo: 13 },
    { distrito: "Santiago de Surco", costo: 13 },
    { distrito: "Surquillo", costo: 13 },
    // S/ 16
    { distrito: "Ate", costo: 16 },
    { distrito: "El Agustino", costo: 16 },
    { distrito: "San Juan de Lurigancho", costo: 16 },
    { distrito: "San Juan de Miraflores", costo: 16 },
    { distrito: "Santa Anita", costo: 16 },
    { distrito: "Villa El Salvador", costo: 16 },
    { distrito: "Villa María del Triunfo", costo: 16 },
    // S/ 18
    { distrito: "Carabayllo", costo: 18 },
    { distrito: "La Punta", costo: 18 },
    { distrito: "Mariscal Cáceres (SJL)", costo: 18 },
    { distrito: "Márquez", costo: 18 },
    { distrito: "Musa (La Molina)", costo: 18 },
    { distrito: "Oquendo", costo: 18 },
    { distrito: "Urb. José Gálvez (VMT)", costo: 18 },
    { distrito: "Urb. Pachacámac (VES)", costo: 18 },
    { distrito: "Ventanilla", costo: 18 },
  ],

  // ---------- Hoja de pedidos (Google Sheets) ----------
  // URL de la Aplicación web de Apps Script (termina en /exec).
  // Ver google-apps-script/pedidos.gs. Déjalo "" para no anotar pedidos en la hoja.
  urlHojaPedidos:
    "https://script.google.com/macros/s/AKfycbykxNZevW0zWnXhdUX4_FmCmW2ay5_2UMTFigebkM-JzwY-vvJwFE8cZCA5R38DiCc0rQ/exec",

  // ---------- Ruleta ----------
  // Si el pedido (productos con descuento, sin delivery) supera este monto, puede girar la ruleta al terminar.
  // Si no, se le invita a usar su código en su próxima compra o regalarlo.
  montoMinimoRuleta: 150,
  // La ruleta la juega el equipo con el código del cliente tras confirmar el pago (no se enlaza desde la web).
  urlRuleta: "https://fiestikaruleta.netlify.app/",

  // ---------- Textos del inicio ----------
  textosInicio: {
    titular: "Crea una fiesta linda, sin complicarte",
    subtitulo:
      "Banderines, cake toppers, stickers, tatuajes y detalles personalizados hechos a mano en Lima. Tú eliges la temática, nosotros lo hacemos realidad.",
    etiquetas: ["#personalizado", "#cumpleaños", "#hechoamano"],
  },
};

export function linkWhatsApp(mensaje: string, numero: string = config.whatsapp) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
