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
