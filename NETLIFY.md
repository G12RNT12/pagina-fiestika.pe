# Publicar Fiestika en Netlify

## Configuración preparada

El proyecto usa TanStack Start con renderizado en servidor. Nitro genera los archivos públicos en `dist/` y la función de servidor en `.netlify/functions-internal/`.

`netlify.toml` establece:

| Ajuste | Valor |
| --- | --- |
| Rama recomendada | `main` |
| Directorio base | Raíz del repositorio (dejar vacío) |
| Comando de compilación | `npm ci && npm run build` |
| Directorio de publicación | `dist` |
| Node.js | `24` |
| `NITRO_PRESET` | `netlify` |

El comando instala las versiones de `package-lock.json`, incluso si la detección inicial del servicio utiliza otro gestor. Conserva las dependencias de desarrollo durante la compilación.

`nitro.config.ts` empaqueta las dependencias del servidor cuando se selecciona Netlify, evitando un error de rastreo de archivos observado en Windows. El preset de Lovable conserva su configuración.

No agregues una redirección general a `/index.html`: Nitro genera una función que atiende las rutas y devuelve la página o su respuesta 404. Subir únicamente `dist` por arrastre no incluye esa función; utiliza el despliegue conectado a Git.

## Pasos de publicación

1. Sube los archivos de configuración y documentación de este cambio al repositorio de GitHub.
2. En Netlify, crea un proyecto importando el repositorio `G12RNT12/pagina-fiestika.pe`.
3. Selecciona `main` y comprueba los valores de la tabla. Netlify debe leerlos desde `netlify.toml`.
4. Inicia el despliegue y revisa que el registro indique el preset `netlify` y una compilación exitosa.
5. Abre la URL asignada y verifica catálogo, personalización, carrito, cupones y checkout en móvil y escritorio.
6. Comprueba que WhatsApp y correo abren el resumen correcto. El registro en Sheets se valida por separado revisando la hoja; `no-cors` no permite confirmar el guardado desde el navegador.
7. Si vas a usar `fiestika.pe`, añade el dominio en Netlify y configura los registros DNS que indique el servicio. Los metadatos sociales actuales apuntan a ese dominio.

La tienda no necesita claves privadas ni variables de entorno comerciales para arrancar: sus datos públicos se encuentran en `src/data/`. `NITRO_PRESET` es una variable de compilación incluida en la configuración.

## Pendientes de contenido encontrados

- Los 76 productos no tienen sus fotos principales predeterminadas en `public/images/<categoria>/<id>.webp`. Se muestran los marcadores pastel del componente de imágenes hasta subirlas.
- Falta `public/images/sitio/qr-yape.png`. El checkout oculta el QR si no carga y mantiene los números de pago.
- `linkPagoTarjeta` está vacío: el cliente recibe la indicación de solicitar el enlace por WhatsApp.
- `cuentasBancarias` está vacío: la opción de transferencia no se muestra.
- La URL de Apps Script ya está configurada, pero su disponibilidad y el guardado real no se verificaron en esta revisión. Una prueba de registro enviaría datos a la hoja de pedidos.

Estos pendientes no impiden compilar la tienda. Las fotos y los datos de pago se mantienen manualmente.

## Comprobaciones realizadas

- Compilación de producción con `NITRO_PRESET=netlify`: correcta.
- Función de servidor generada, ejecutada localmente: `/` devuelve HTTP 200 con el catálogo; una ruta inexistente devuelve HTTP 404.
- Dos pruebas de rutas en Vitest: correctas. Se ajustó el montaje al documento HTML completo y se omitieron los recursos del head en jsdom, que no carga hojas de estilo.
- Revisión de TypeScript con `npx tsc --noEmit`: correcta.

Estas comprobaciones locales no sustituyen la revisión del despliegue real en Netlify ni la validación de los servicios externos.

Referencias: [Nitro en Netlify](https://nitro.build/deploy/providers/netlify), [dependencias en Netlify](https://docs.netlify.com/build/configure-builds/manage-dependencies/) y [versiones de Node.js](https://docs.netlify.com/build/configure-builds/available-software-at-build-time/).
