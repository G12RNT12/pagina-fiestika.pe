// =============================================================
// PRODUCTOS DE FIESTIKA
// Para agregar un producto: copia un bloque { ... } completo,
// pégalo dentro de la lista de su categoría y cambia sus datos.
//
// Cada variante es: v("Nombre de la opción", precio, stock)
//   - stock omitido o null -> A PEDIDO (se fabrica cuando lo pides)
//   - un número (ej. 12)   -> unidades disponibles
//   - 0                    -> AGOTADO
//
// La imagen se toma sola de: /images/<categoria>/<id>.webp
// (si aún no existe, se muestra un dibujito pastel).
// =============================================================

export type Variante = {
  nombre: string;
  precio: number; // en soles
  stock: number | null;
};

export type SeleccionMultiple = {
  titulo: string;
  cantidad: number; // cuántas opciones debe elegir el cliente (exactas)
  opciones: string[];
};

export type Producto = {
  id: string;
  nombre: string;
  categoria: string; // id de src/data/categorias.ts
  descripcion: string;
  notas?: string;
  imagenes: string[];
  destacado: boolean; // true = aparece en "Más vendidos"
  personalizable: boolean; // true = muestra campos de nombre, edad, temática...
  variantes: Variante[];
  seleccionMultiple?: SeleccionMultiple;
};

/** Atajo para escribir variantes: v("Nombre", precio, stock) */
const v = (nombre: string, precio: number, stock: number | null = null): Variante => ({ nombre, precio, stock });

type Datos = Omit<Producto, "imagenes" | "categoria" | "destacado" | "personalizable"> &
  Partial<Pick<Producto, "imagenes" | "destacado" | "personalizable">>;

/** Arma los productos de una categoría y les pone la imagen automática. */
function categoria(cat: string, lista: Datos[], extra: Partial<Producto> = {}): Producto[] {
  return lista.map((p) => ({
    destacado: false,
    personalizable: true,
    imagenes: [`/images/${cat}/${p.id}.webp`],
    ...extra,
    ...p,
    categoria: cat,
  }));
}

// -------------------- DECORACIÓN --------------------
const decoracion = categoria("decoracion", [
  {
    id: "banderines-caritas",
    nombre: "Banderines de caritas",
    descripcion: "Puedes elegir entre caras e imágenes.",
    notas: "S/ 2.50 por carita adicional.",
    destacado: true,
    variantes: [
      v("Caras grandes (9 und · 25.6 cm · 2 m aprox)", 48),
      v("Caras medianas (8 und · 14 cm · 1.5 m)", 35),
      v("Mini caritas (6 und · 9 cm · 0.5 m)", 20),
    ],
  },
  {
    id: "banderines-3-en-1",
    nombre: "Banderines 3 en 1",
    descripcion: "2 tiras \"Feliz cumpleaños\" (español o inglés) + 2 imágenes + 1 tira de 5 caritas medianas.",
    notas: "S/ 2.50 por carita adicional.",
    variantes: [v("Set 3 en 1", 60)],
  },
  {
    id: "cake-toppers",
    nombre: "Cake toppers",
    descripcion: "Topper para torta con la temática de tu fiesta.",
    destacado: true,
    variantes: [v("2D (liso, sin relieve)", 15), v("3D (en capas)", 25), v("3D + luces (luces cálidas en 3 tiempos)", 30)],
  },
  {
    id: "sorbetes-decorados",
    nombre: "Sorbetes decorados",
    descripcion: "Paquete de 15 sorbetes, delgado o grueso.",
    notas: "Colores sujetos a disponibilidad.",
    variantes: [v("Paquete de 15", 25)],
  },
  {
    id: "vela-chispera",
    nombre: "Vela chispera",
    descripcion: "Vela chispera decorada para la torta.",
    variantes: [v("Decorada", 6), v("Con carita", 7)],
  },
  {
    id: "toppers-bocaditos",
    nombre: "Toppers para bocaditos",
    descripcion: "Toppers personalizados para tus bocaditos.",
    destacado: true,
    variantes: [v("15 und", 20), v("30 und", 30)],
  },
  {
    id: "maxi-toppers",
    nombre: "Maxi toppers",
    descripcion: "Toppers largos para bocaditos.",
    variantes: [v("10 und", 26)],
  },
  {
    id: "toppers-hamburguesa",
    nombre: "Toppers para hamburguesa",
    descripcion: "Toppers gruesos para hamburguesas.",
    variantes: [v("10 und", 30)],
  },
  {
    id: "vasos-shots",
    nombre: "Vasos de shots",
    descripcion: "Con stickers en vinil laminado, resistentes al agua.",
    variantes: [v("3 oz · 12 und", 40), v("3 oz · 24 und", 70), v("7 oz · 12 und", 80), v("7 oz · 24 und", 140)],
  },
  {
    id: "vasos-carton",
    nombre: "Vasos de cartón",
    descripcion: "Vasos de cartón con sticker personalizado.",
    variantes: [v("Unidad", 3)],
  },
  {
    id: "deco-torta-velita",
    nombre: "Decoración para torta con soporte de velita",
    descripcion: "Diseño en capas + soporte + velita.",
    variantes: [v("Set completo", 50)],
  },
  {
    id: "pines-acrilico",
    nombre: "Pines de acrílico",
    descripcion: "Pines personalizados de acrílico.",
    variantes: [v("Circular 3.5 cm · 1 und", 3), v("Circular o corazón 5 cm · 1 und", 6), v("Circular o corazón 5 cm · 2 und", 10)],
  },
  {
    id: "pines-metal",
    nombre: "Pines de metal",
    descripcion: "Pines personalizados de metal.",
    variantes: [v("1 und", 9), v("2 und", 16)],
  },
  {
    id: "celebracion-restaurantes",
    nombre: "Celebración en restaurantes",
    descripcion: "Combo para 2: 4 sorbetes, 2 posavasos laminados, 1 cartel A5 en foam + parante de acrílico, 2 sobreplatos con aplicación 3D.",
    variantes: [v("Combo para 2", 40)],
  },
]);

// -------------------- DETALLES PARA INVITADOS --------------------
const detalles = categoria("detalles-invitados", [
  {
    id: "vasos-stickers",
    nombre: "Vasos de stickers",
    descripcion: "Vaso con tapa y sorbete, con o sin stickers.",
    notas: "Colores sujetos a disponibilidad. Consulta precios por paquete para eventos.",
    variantes: [v("Vaso + 15 stickers en vinil", 13), v("Vaso + 15 stickers normales", 10), v("Solo vaso", 6)],
  },
  {
    id: "vaso-decorado",
    nombre: "Vaso decorado",
    descripcion: "Vaso con tapa y sorbete + 1 sticker en vinil y lazo.",
    variantes: [v("Unidad", 8)],
  },
  {
    id: "loncheras",
    nombre: "Loncheras",
    descripcion: "Loncheras con sticker personalizado.",
    notas: "No incluye dulces.",
    variantes: [v("1 und", 5.5), v("10 und (S/ 4.50 c/u)", 45)],
  },
  {
    id: "cajitas-3d",
    nombre: "Cajitas con detalles 3D",
    descripcion: "Cajitas personalizadas con detalles en relieve.",
    variantes: [v("1 und", 8), v("6 und", 45), v("15 und", 105)],
  },
  {
    id: "cajas-torta",
    nombre: "Cajas para torta",
    descripcion: "Cajas personalizadas para porciones de torta.",
    variantes: [v("Pack de 20", 35)],
  },
  {
    id: "tarjeta-velas-deseos",
    nombre: "Tarjeta para velas de deseos",
    descripcion: "Pack de 8 tarjetas de 15 × 10 cm.",
    notas: "No incluye vela.",
    variantes: [v("Pack de 8", 7)],
  },
  {
    id: "set-bienvenida",
    nombre: "Set de bienvenida",
    descripcion: "Gorro con aplicación 3D, portacubiertos, vaso personalizado, sorbete, mini bandeja personalizada e individual.",
    variantes: [v("1 set", 25), v("6 sets", 147), v("12 sets", 271)],
  },
  {
    id: "caja-pop-corn",
    nombre: "Caja pop corn",
    descripcion: "Cajas personalizadas para pop corn.",
    notas: "No incluye pop corn.",
    variantes: [
      v("Pequeña (12 × 7 × 4.5 cm) · pack 15 (S/ 4.50 c/u)", 67.5),
      v("Pequeña (12 × 7 × 4.5 cm) · pack 30 (S/ 4.00 c/u)", 120),
      v("Mediana (14 × 11.8 × 8 cm) · pack 5", 50),
    ],
  },
  {
    id: "vaso-pop-corn",
    nombre: "Vaso pop corn 16 oz",
    descripcion: "Vasos personalizados para pop corn de 16 oz.",
    variantes: [v("20 und", 35), v("50 und", 70), v("100 und", 140)],
  },
  {
    id: "conos-papel",
    nombre: "Conos de papel para chips o pop corn",
    descripcion: "Conos personalizados en papel opalina.",
    variantes: [v("1 und", 3.5), v("10 und", 32), v("25 und", 83)],
  },
  {
    id: "mini-bolsas",
    nombre: "Mini bolsas",
    descripcion: "Mini bolsas personalizadas en papel fotográfico.",
    variantes: [v("1 und", 3)],
  },
  {
    id: "bolsas-sorpresas",
    nombre: "Bolsas para sorpresas",
    descripcion: "Bolsas personalizadas para sorpresas.",
    variantes: [v("Pack de 15 (S/ 4.50 c/u)", 67.5)],
  },
  {
    id: "box-lunch-3d",
    nombre: "Box lunch 3D",
    descripcion: "Box lunch con detalles en relieve.",
    notas: "No incluye dulces. De 15 a más: S/ 6.50 c/u (consúltanos por WhatsApp).",
    variantes: [v("1 und", 8), v("10 und (S/ 7.50 c/u)", 75), v("15 und (S/ 6.50 c/u)", 97.5)],
  },
  {
    id: "box-lunch-sin-relieve",
    nombre: "Box lunch sin relieve",
    descripcion: "Box lunch personalizado, impresión lisa.",
    notas: "No incluye dulces.",
    variantes: [v("1 und", 6.5), v("10 und (S/ 6 c/u)", 60)],
  },
]);

// -------------------- PAPELERÍA --------------------
const papeleria = categoria("papeleria", [
  {
    id: "letreros-props",
    nombre: "Letreros para fotos (props)",
    descripcion: "Letreros divertidos para las fotos de tu fiesta.",
    variantes: [v("Grande (30 cm aprox) · 1 und", 8), v("Grande (30 cm aprox) · 5 und", 37), v("Mini (15 cm aprox) · 1 und", 4.5), v("Mini (15 cm aprox) · 5 und", 20)],
  },
  {
    id: "stickers-personalizados",
    nombre: "Stickers personalizados y cortados",
    descripcion: "Stickers de 5 cm aprox, cortados a la forma.",
    variantes: [
      v("15 und", 27), v("30 und", 36), v("50 und", 44),
      v("15 und · vinil", 37), v("30 und · vinil", 46), v("50 und · vinil", 54),
    ],
  },
  {
    id: "stickers-plancha",
    nombre: "Stickers en plancha",
    descripcion: "Mini planchas A6 de stickers, pack de 9.",
    destacado: true,
    variantes: [v("Pack de 9", 68), v("Pack de 9 · efecto holográfico", 74)],
  },
  {
    id: "stickers-botellas",
    nombre: "Stickers para botellas",
    descripcion: "Etiquetas personalizadas para botellas.",
    variantes: [v("15 und (S/ 3.50 c/u)", 52.5), v("30 und (S/ 2.90 c/u)", 87)],
  },
  {
    id: "stickers-polaroid",
    nombre: "Stickers tipo polaroid",
    descripcion: "Stickers con tus fotos en estilo polaroid.",
    variantes: [v("20 und", 25), v("45 und", 40)],
  },
  {
    id: "deco-puertas",
    nombre: "Deco de puertas",
    descripcion: "Decoración para la puerta con caritas, banner y banderín.",
    variantes: [
      v("Grande (10 caritas A5 + banner A4 o número grande + banderín mediano)", 65),
      v("Mini (6 caritas A5 + banner A4 o número + banderín pequeño)", 40),
    ],
  },
  { id: "centro-mesa", nombre: "Centro de mesa", descripcion: "Centro de mesa personalizado.", variantes: [v("Unidad", 6.5)] },
  { id: "servilleteros", nombre: "Servilleteros", descripcion: "Servilleteros personalizados.", variantes: [v("Unidad", 4.5)] },
  { id: "table-tent", nombre: "Table tent", descripcion: "Cartelito de mesa personalizado.", variantes: [v("Unidad", 8)] },
  {
    id: "billetes",
    nombre: "\"Billetes\" personalizados",
    descripcion: "Billetes tamaño real, doble cara, con la cara del cumpleañero/a.",
    variantes: [
      v("Papel bond · 12 und", 12), v("Papel bond · 24 und", 18), v("Papel bond · 50 und", 25),
      v("Opalina · 12 und", 20), v("Opalina · 24 und", 32), v("Opalina · 50 und", 55),
      v("Fotográfico brillante · 12 und", 28), v("Fotográfico brillante · 24 und", 45), v("Fotográfico brillante · 50 und", 80),
    ],
  },
  {
    id: "posters-a4",
    nombre: "Posters A4",
    descripcion: "Posters en papel fotográfico brillante.",
    variantes: [v("Vertical/horizontal · 1 und", 8), v("Vertical/horizontal · 10 und", 65), v("Cuadrado · 1 und", 6.5), v("Cuadrado · 10 und", 55)],
  },
]);

// -------------------- TATUAJES --------------------
const notaTattoo = "Duran más de 2 días si se evita el contacto con agua.";
const tatuajes = categoria("tatuajes", [
  {
    id: "plancha-tatuajes",
    nombre: "Plancha de tatuajes",
    descripcion: "25 tatuajes de 3 cm aprox, incluye instrucciones.",
    notas: notaTattoo,
    destacado: true,
    variantes: [v("Plancha de 25", 33)],
  },
  {
    id: "baby-tattoo",
    nombre: "Baby tattoo",
    descripcion: "Para bebés menores de 2 años: tipo sticker, se remueve al instante. 15 und de 4.5 cm.",
    notas: notaTattoo,
    variantes: [v("15 und", 25)],
  },
  {
    id: "zona-tattoo",
    nombre: "Zona tattoo",
    descripcion: "30 tatuajes de 4 cm, instrucciones 20 × 14, spray personalizado y 1 esponja.",
    notas: notaTattoo,
    variantes: [v("Set completo", 45)],
  },
  {
    id: "tattoo-station",
    nombre: "Tattoo station",
    descripcion: "36 tatuajes de 3 cm, 1 atomizador personalizado, 2 esponjas e instrucciones con la temática.",
    notas: notaTattoo,
    variantes: [v("Estación 16 × 11 × 15 cm", 65), v("Estación 21 × 10 × 19 cm", 70)],
  },
]);

// -------------------- GORROS --------------------
const gorros = categoria("gorros", [
  {
    id: "gorro-fiesta",
    nombre: "Gorro fiesta",
    descripcion: "Gorros personalizados con tu temática.",
    destacado: true,
    variantes: [v("Sin relieve · 1 und", 6), v("Sin relieve · pack 8", 43), v("Con aplicación 3D en 3 capas · 1 und", 8.5)],
  },
]);

// -------------------- ACTIVIDADES --------------------
const actividades = categoria("actividades", [
  {
    id: "individuales",
    nombre: "Individuales",
    descripcion: "Individuales de mesa con actividades. Precio por unidad, mínimo 10.",
    notas: "Pedido mínimo: 10 unidades.",
    variantes: [v("Papel bond (c/u)", 2.5), v("Opalina (c/u)", 4), v("Fotográfico brillante (c/u)", 6.5)],
  },
  {
    id: "tripticos",
    nombre: "Trípticos",
    descripcion: "Trípticos de actividades en papel bond.",
    variantes: [v("1 und", 2.5), v("10 und", 20)],
  },
  {
    id: "libro-juegos",
    nombre: "Libro de juegos A5",
    descripcion: "Portada en papel fotográfico e interior en bond. Tú eliges 8 actividades.",
    variantes: [v("1 und", 6), v("5 und", 27)],
    seleccionMultiple: {
      titulo: "Elige 8 actividades",
      cantidad: 8,
      opciones: [
        "Laberinto",
        "Michi",
        "Sudoku",
        "Sopa de letras",
        "¿Quién conoce más al cumpleañero?",
        "Encuentra al cumpleañero (sticker para raspar)",
        "Casita quemada",
        "Tuti fruti",
        "Crea la ropa del cumpleañero",
        "Dibujos para colorear",
      ],
    },
  },
]);

// -------------------- REGALOS --------------------
const regalos = categoria("regalos", [
  {
    id: "varitas-monedas-nfc",
    nombre: "Varitas y monedas NFC",
    descripcion: "Elige varita o moneda; coloca tu tarjeta dentro y paga con ella.",
    notas: "Colores sujetos a stock.",
    variantes: [v("Varita", 25), v("Moneda", 25)],
  },
  {
    id: "album-cumpleanos",
    nombre: "Álbum de cumpleaños",
    descripcion: "Álbum de figuras A5 con 50 figuras, caja personalizada con foto, 1 polaroid, 2 sobres y tarjeta para dedicar.",
    variantes: [v("Álbum completo", 70)],
  },
  {
    id: "caja-regalo",
    nombre: "Caja de regalo de cartón",
    descripcion: "Decorada con stickers por fuera y por dentro.",
    notas: "Adicionales: letrero Feliz cumpleaños +S/ 2 · foto polaroid +S/ 1.50 · luces LED +S/ 3 (indícalos en notas).",
    variantes: [v("34 × 25 × 8 cm", 20), v("30 × 30 × 10 cm", 30), v("40 × 40 × 10 cm", 40)],
  },
  { id: "tarjeta-cumpleanos", nombre: "Tarjeta de cumpleaños A5", descripcion: "Portada + interior para dedicatoria.", variantes: [v("Unidad", 10)] },
  { id: "tarjeta-viral", nombre: "Tarjeta viral", descripcion: "Con dedicatoria al reverso.", variantes: [v("Unidad", 15)] },
  {
    id: "llaveros",
    nombre: "Llaveros",
    descripcion: "Llaveros personalizados.",
    variantes: [v("Sin tarjeta · 1 und", 5), v("Sin tarjeta · 2 und", 9), v("Con tarjeta · 1 und", 8), v("Con tarjeta · 2 und", 14)],
  },
  {
    id: "fotos-imantadas",
    nombre: "Fotos imantadas con marco acrílico",
    descripcion: "Tus fotos favoritas con imán y marco acrílico.",
    variantes: [v("Rectangular 7 × 4.5 cm", 6), v("Circular 3.5 cm", 3.5)],
  },
  { id: "mini-album", nombre: "Mini álbum", descripcion: "8 fotitos de 4 × 4.5 cm.", variantes: [v("Unidad", 5)] },
  {
    id: "latas-gaseosa",
    nombre: "Latas de gaseosa personalizadas",
    descripcion: "Con etiqueta temática. Gaseosa a elegir: Inka Kola, Sprite, Coca-Cola o Fanta (indícala en notas).",
    variantes: [v("Con gaseosa + etiqueta", 16), v("Solo etiqueta", 7)],
  },
  {
    id: "cuadros",
    nombre: "Cuadros",
    descripcion: "Cuadros personalizados.",
    notas: "+S/ 5 caja de regalo personalizada (indícalo en notas). Modelos sujetos a stock.",
    variantes: [v("Mini 10 × 15", 14), v("Mediano 15 × 20", 25), v("Grande 20 × 25", 35)],
  },
  { id: "hot-wheels", nombre: "Hot Wheels personalizado", descripcion: "Carrito Hot Wheels personalizado.", variantes: [v("1 carrito", 24)] },
  {
    id: "combo-hot-wheels",
    nombre: "Combo Hot Wheels",
    descripcion: "Combos de regalo personalizados.",
    variantes: [v("1 carrito + 1 lata de gaseosa o cerveza + 1 diploma", 40), v("2 chocolates + 1 lata de gaseosa o cerveza", 23)],
  },
  { id: "rompecabezas", nombre: "Rompecabezas A5", descripcion: "48 piezas + imagen de referencia.", variantes: [v("Unidad", 35)] },
]);

// -------------------- SOS (vasos, platos, cubiertos) --------------------
// Stock inicial: 20 por variante. Ajústalo según tu inventario.
const S = 20;
const sos = categoria(
  "sos",
  [
    { id: "velas", nombre: "Velas", descripcion: "Velas para torta.", variantes: [v("Paquete de 10", 4, S)] },
    { id: "velas-colores", nombre: "Velas de colores", descripcion: "Velas de colores para torta.", variantes: [v("Pack", 5, S)] },
    {
      id: "globos-happy-birthday",
      nombre: "Globos grandes Happy Birthday",
      descripcion: "Letras de 41 cm aprox. Vienen desinflados, incluyen tubito y cinta.",
      variantes: [v("Set", 15, S)],
    },
    { id: "globos-feliz-cumpleanos", nombre: "Globos Feliz cumpleaños", descripcion: "Globos con letras Feliz cumpleaños.", variantes: [v("Set", 6, S)] },
    { id: "cortinas-metalizadas", nombre: "Cortinas metalizadas", descripcion: "Cortinas metalizadas para el fondo de fotos.", variantes: [v("1 und", 6, S), v("2 und", 10, S)] },
    { id: "vasos-colores", nombre: "Vasos de colores", descripcion: "Vasos de colores.", variantes: [v("Paquete de 10", 4.5, S)] },
    { id: "platos-colores", nombre: "Platos de colores", descripcion: "Platos circulares o en forma de flor.", variantes: [v("Circular · paquete de 5", 3.5, S), v("Flor · paquete de 5", 3.5, S)] },
    { id: "coronita", nombre: "Coronita", descripcion: "Coronita para el/la cumpleañero/a.", notas: "Colores sujetos a disponibilidad.", variantes: [v("Unidad", 4, S)] },
    { id: "vincha-cumpleanera", nombre: "Vincha cumpleañera", descripcion: "Vincha para la cumpleañera.", notas: "Colores sujetos a disponibilidad.", variantes: [v("Unidad", 7, S)] },
    { id: "banda-cumpleanera", nombre: "Banda cumpleañera", descripcion: "Banda para la cumpleañera.", notas: "Colores sujetos a disponibilidad.", variantes: [v("Unidad", 10, S)] },
    { id: "bombarda", nombre: "Bombarda", descripcion: "Bombarda de confeti.", variantes: [v("Unidad", 5, S)] },
    { id: "pulsera-neon", nombre: "Pulsera neón", descripcion: "Pulseras que brillan en la oscuridad.", variantes: [v("10 und", 2.8, S), v("25 und", 7, S), v("50 und", 12, S)] },
    { id: "vasos-plastico-7", nombre: "Vasos de plástico #7", descripcion: "Vasos de plástico #7.", variantes: [v("10 und", 0.7, S), v("25 und", 1.8, S), v("50 und", 3, S)] },
    { id: "plato-torta", nombre: "Plato para torta", descripcion: "Platos descartables para torta.", variantes: [v("10 und", 3, S), v("25 und", 5, S)] },
    { id: "cucharitas-blancas", nombre: "Cucharitas blancas", descripcion: "Cucharitas descartables blancas.", variantes: [v("25 und", 3, S), v("50 und", 4, S)] },
    { id: "cuchara-acrilica", nombre: "Cuchara grande acrílica", descripcion: "Cucharas grandes acrílicas.", variantes: [v("25 und", 3.5, S), v("50 und", 6, S)] },
  ],
  { personalizable: false },
);

export const productos: Producto[] = [
  ...decoracion,
  ...detalles,
  ...papeleria,
  ...tatuajes,
  ...gorros,
  ...actividades,
  ...regalos,
  ...sos,
];
