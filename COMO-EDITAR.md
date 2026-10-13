# Cómo editar la tienda Fiestika 💗

Todo el contenido vive en la carpeta `src/data/`. No necesitas base de datos.

## 1. Agregar un producto
1. Abre `src/data/productos.ts`.
2. Copia un bloque completo `{ ... },` (desde `{` hasta `},`).
3. Pégalo dentro de la lista de su categoría (cada categoría tiene su bloque, ej. `// DECORACIÓN`).
4. Cambia:
   - `id`: un nombre único sin espacios (ej. `"vasos-personalizados"`).
   - `nombre`, `descripcion`, `notas` (opcional).
   - `categoria`: uno de `decoracion`, `detalles-invitados`, `papeleria`, `tatuajes`, `gorros`, `actividades`, `regalos`, `sos`.
   - `destacado: true` si quieres que salga en "Más vendidos".
   - `personalizable: true` si el cliente debe escribir nombre, edad, temática, etc.
   - `variantes`: cada opción con su `nombre`, `precio` y `stock`.

## 2. Cambiar precios o stock
Cada variante se escribe así: `v("Nombre de la opción", precio, stock)`.
- `v("15 und", 20)` → S/ 20.00, a pedido (sin stock escrito)
- `v("15 und", 20, 10)` → quedan 10 unidades (si son 5 o menos, sale "Pocas unidades").
- stock `0` → **Agotado** (el cliente verá "Consultar por WhatsApp").
- sin stock o `null` → **A pedido** (se fabrica sin límite).

## 3. Subir imágenes
1. Guarda la foto (ideal `.webp`, cuadrada, ~1000×1000 px) en la carpeta de su categoría:
   `public/images/decoracion/`, `public/images/papeleria/`, etc.
2. Nómbrala igual que el `id` del producto: por ejemplo `public/images/decoracion/cake-toppers.webp`. ¡Se conecta sola!
3. Si una imagen no existe, la web muestra un dibujito pastel automáticamente.

Imágenes del sitio (`public/images/sitio/`):
- `logo-claro.png` y `logo-oscuro.png` (logo para cada modo)
- `qr-yape.png` (QR de Yape)
- `og.jpg` (imagen al compartir en WhatsApp/Instagram)

Galería de clientes: sube fotos a `public/images/galeria/` y edita la lista en `src/data/contenido.ts`.

## 4. Datos de contacto, pagos y delivery
Abre `src/data/config.ts`: WhatsApp, correo, redes, Yape/Plin, cuentas bancarias, link de pago con tarjeta (`linkPagoTarjeta`), costos por distrito, días mínimos de anticipación y la ruleta (`montoMinimoRuleta`: monto desde el cual el cliente puede girarla al terminar su compra).

## 5. Cupones
Abre `src/data/cupones.ts`. Cada cupón tiene `codigo`, `tipo` (`porcentaje`, `monto` o `delivery`), `valor`, `vence` (`"2026-12-31"` o `null`), `compraMinima`, `categorias` (vacío = todo), `activo` y `mostrarEnInicio` (aparece en el banner).

## 6. Textos, preguntas y políticas
En `src/data/contenido.ts` están testimonios, preguntas frecuentes y políticas. Usa `**texto**` para poner negrita.

## 7. Anotar pedidos en la hoja de Google
Cada pedido de la web se puede anotar solo en la hoja **PEDIDOS 2026** (además de enviarse por WhatsApp).
1. Abre la hoja > **Extensiones > Apps Script**, pega todo `google-apps-script/pedidos.gs` y guarda.
2. **Implementar > Nueva implementación > Aplicación web** (Ejecutar como: *Yo* · Acceso: *Cualquier usuario*). Autoriza y copia la URL `/exec`.
3. Pégala en `src/data/config.ts` → `urlHojaPedidos`.

El pedido entra en la primera fila libre del mes con estado **POR CONFIRMAR** y pago **PENDIENTE**. Los pagos (1. PAGO, 2. PAGO), gastos y motorizado los completas tú cuando confirmes el Yape.
