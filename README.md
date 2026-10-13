# Fiestika Perú

Tienda web de artículos personalizados para fiestas, con el lema **«Crea una fiesta linda, sin complicarte»**. Permite explorar el catálogo, elegir variantes y preparar un pedido para coordinarlo por WhatsApp con el equipo de Fiestika.

El catálogo incluye decoración, detalles para invitados, papelería, tatuajes temporales, gorros, actividades, regalos y descartables. Los precios se muestran en soles peruanos (S/).

## Funcionalidades

- Catálogo con búsqueda, filtros por categoría, orden por precio y productos destacados.
- Productos con variantes, disponibilidad y opciones de personalización.
- Carrito persistente en `localStorage`, con cantidades y cupones de descuento.
- Checkout por pasos: datos del cliente, entrega, diseño, pago y confirmación.
- Delivery por distrito en Lima y Callao, envío a provincias por Shalom y recojo coordinado.
- Adelanto del 50% o pago completo, con instrucciones para Yape/Plin, tarjeta y transferencias según la configuración.
- Resumen y código de pedido para enviarlo por WhatsApp; alternativa de envío por correo.
- Presentación de la marca, galería, testimonios, preguntas frecuentes, contacto y políticas.
- Marcadores pastel para las imágenes faltantes mediante el componente de imágenes de la tienda.

La tienda funciona en una sola página (`/`), con navegación mediante anclas a sus secciones. Los detalles de productos, carrito, checkout y textos legales se abren en modales.

## Cómo funciona

El catálogo y la configuración se mantienen en archivos TypeScript editables. No hay un backend propio de comercio, base de datos de productos ni panel de administración. El stock se actualiza manualmente y los pagos se coordinan con el equipo; la web no verifica automáticamente su recepción.

El checkout abre WhatsApp con el resumen del pedido. Las fotos necesarias para los diseños se envían por ese canal después de hacer el pedido. También existe una integración opcional con Google Sheets mediante Apps Script para registrar los pedidos.

## Desarrollo local

Necesitas Node.js y npm compatibles con Vite 8.

```sh
git clone https://github.com/G12RNT12/pagina-fiestika.pe.git
cd pagina-fiestika.pe
npm ci
npm run dev
```

Abre la dirección que indique Vite en la terminal.

| Comando | Uso |
| --- | --- |
| `npm run dev` | Iniciar el entorno de desarrollo. |
| `npm run build` | Generar la compilación de producción. |
| `npm run build:dev` | Compilar en modo desarrollo. |
| `npm run preview` | Previsualizar la compilación. |
| `npm run lint` | Revisar el código con ESLint. |
| `npm run test` | Ejecutar las pruebas de Vitest. |
| `npm run test:watch` | Ejecutar las pruebas en modo observación. |
| `npm run format` | Formatear el proyecto con Prettier. |

## Editar la tienda

Los datos que puede modificar el propietario se encuentran en `src/data/`:

| Archivo | Contenido |
| --- | --- |
| `config.ts` | Marca, textos del inicio, WhatsApp, correo, redes, pagos, recargo de tarjeta, delivery, recojo, anticipación de entrega, integración con Sheets y ruleta. |
| `categorias.ts` | Identificadores, nombres, descripciones, colores pastel e iconos de categorías. |
| `productos.ts` | Productos, variantes, precios, stock, imágenes, destacados y personalización. |
| `cupones.ts` | Descuentos por porcentaje o monto, envío gratis, vigencia, compra mínima y categorías aplicables. |
| `contenido.ts` | Presentación, galería, testimonios, preguntas frecuentes y políticas. |

### Productos e imágenes

1. Abre `src/data/productos.ts` y copia un bloque de producto dentro de su categoría.
2. Asigna un `id` único y modifica nombre, descripción y variantes.
3. Define cada variante con `v("Nombre", precio, stock)`, con el precio en soles.
4. El stock omitido o `null` significa **a pedido**; `0`, **agotado**; un número positivo indica unidades disponibles.
5. Usa `destacado: true` para mostrarlo en «Más vendidos» y `personalizable` para controlar la personalización.
6. Añade su imagen y revisa el resultado con `npm run dev`.

Las fotos se guardan en `public/images/<categoria>/`. El identificador de categoría debe coincidir con el definido en `categorias.ts`. Por defecto, la imagen de cada producto sigue esta estructura:

```text
public/images/<categoria>/<id-del-producto>.webp
```

Por ejemplo, `banderines-caritas` utiliza `public/images/decoracion/banderines-caritas.webp`. En el código, la ruta es `/images/decoracion/banderines-caritas.webp`, sin el prefijo `public`.

Para usar otras fotos o varias imágenes, define el arreglo `imagenes` del producto. Los recursos generales del sitio se guardan en `public/images/sitio/`. El componente `Imagen.tsx` muestra un marcador pastel si la imagen no se puede cargar.

### Pagos y entregas

Actualiza `src/data/config.ts` para mantener los números de Yape/Plin, el QR, las cuentas bancarias y los costos por distrito. Si `cuentasBancarias` está vacío, no se muestra la opción de transferencia. Si `linkPagoTarjeta` está vacío, se indica que el enlace se enviará por WhatsApp.

El envío por Shalom distingue el costo de embalaje del flete, que se cotiza según el destino. La anticipación mínima de entrega también se configura en este archivo.

## Registro opcional en Google Sheets

`google-apps-script/pedidos.gs` contiene el script y sus instrucciones de instalación. Está preparado para una hoja llamada `PEDIDOS 2026`, con una distribución específica de columnas y pedidos a partir de la fila 7. Revisa esas constantes si tu hoja tiene otra estructura.

1. Abre la hoja de cálculo y entra en **Extensiones → Apps Script**.
2. Copia el contenido de `google-apps-script/pedidos.gs` y guarda.
3. Implementa como **Aplicación web**, ejecutada con tu cuenta y con acceso para cualquier usuario, siguiendo las instrucciones del archivo.
4. Copia la URL que termina en `/exec` en `urlHojaPedidos`, dentro de `src/data/config.ts`.

Para desactivar el registro, deja `urlHojaPedidos: ""`. Si modificas el script, publica una nueva versión de la implementación.

El navegador envía los datos en modo `no-cors`, por lo que la tienda no confirma si se guardaron en la hoja. El pedido sigue saliendo por WhatsApp aunque falle el registro.

## Tecnologías y estructura

Construido con React 19, TypeScript, TanStack Start y Router, Vite, Tailwind CSS 4 y componentes Radix UI. Utiliza Vitest y Testing Library para pruebas, y ESLint y Prettier para revisión y formato.

```text
src/
  components/tienda/   Interfaz y flujo de compra
  components/ui/      Componentes reutilizables
  data/               Catálogo, configuración y contenido editable
  lib/                Carrito, cálculos y utilidades
  routes/             Página principal y estructura de rutas
  test/               Configuración y pruebas
public/images/        Fotos y recursos del sitio
google-apps-script/   Integración opcional con Sheets
```

Aunque los datos comerciales se mantienen en archivos, el proyecto utiliza TanStack Start y una configuración de compilación con Nitro. Revisa `vite.config.ts` y la salida de `npm run build` al elegir el entorno de despliegue.

## Sincronización con Lovable

Este repositorio está conectado a [Lovable](https://lovable.dev). Los commits enviados a la rama conectada se sincronizan con su editor.

Conserva el historial publicado: evita force push y no hagas rebase, amend o squash de commits ya subidos. Mantén la rama conectada en un estado funcional.
