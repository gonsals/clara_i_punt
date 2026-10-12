# Clara i Punt

Tienda de ganxet artesanal basada en el Figma de Clara i Punt. Astro renderiza las páginas en el servidor; React se utiliza para búsqueda, galerías, navegación y carrito. Airtable sigue siendo la fuente del catálogo.

## Ver la web en local

Requisitos: Node 22 o superior y pnpm 10.

```sh
pnpm install
pnpm dev
```

Abre http://127.0.0.1:4321/. El servidor actual se ha dejado ejecutando para revisar los cambios.

Crea `.env.local` a partir de `.env.example` y configura `AIRTABLE_API_KEY` y `AIRTABLE_DB_ID`. Las credenciales permanecen en el servidor. `.env.local`, `.vercel` y los resultados de pruebas están excluidos de Git.

## Qué funciona

- Portada, colección, historia, ayuda, contacto y privacidad, adaptadas a móvil.
- Catálogo real de Airtable con paginación, caché de servidor de un minuto y estados de error.
- Búsqueda sin distinguir acentos, categorías, orden por precio y nombre, y filtro de disponibilidad.
- Fichas con galería, detalles, cuidados y productos relacionados.
- Carrito persistente entre páginas y pestañas, cantidades limitadas, eliminación y resumen de importes.
- Consulta de la cesta por correo. Abre la aplicación de correo; el usuario revisa y envía el mensaje. No crea una reserva, un pedido confirmado ni un cobro.
- Validación de compra en servidor en `POST /api/cart/validate`: no confía en precios del cliente y rechaza referencias, stock sin confirmar, cantidades incorrectas y peticiones de otro origen.
- Metadatos, datos estructurados de producto, navegación por teclado, diálogos con foco y estados 404 reales.

En local se muestran tres productos ficticios adicionales para revisar el diseño. Llevan la etiqueta «Mostra», precio orientativo y no se pueden añadir ni validar como compra. `SHOW_PRODUCT_PLACEHOLDERS=false` los oculta. Los registros de prueba existentes tienen nombres y fotos de presentación en local; los datos de Airtable no se han sobrescrito. En producción se muestra exclusivamente el catálogo real.

Sin credenciales, el servidor de desarrollo muestra las tres piezas de referencia de Figma y los tres productos ficticios. Estas referencias nunca se pueden comprar. En producción, un catálogo sin configurar presenta un estado informativo y contacto.

## Gestionar el catálogo en Airtable

La tabla `Productos` mantiene los campos existentes. Se han añadido los campos opcionales de tienda mediante el script idempotente `scripts/setup-airtable.mjs`.

| Campo         | Tipo               | Uso                                                     |
| ------------- | ------------------ | ------------------------------------------------------- |
| `Nombre`      | Texto              | Nombre comercial de la pieza                            |
| `Precio`      | Moneda             | Precio positivo en euros                                |
| `Descripcion` | Texto largo        | Descripción del producto                                |
| `Imagenes`    | Adjuntos           | Primera imagen para catálogo; las demás para la galería |
| `Colores`     | Selección múltiple | Colores mostrados en la ficha                           |
| `Categoria`   | Selección          | Bosses, Xals i mocadors o Complements                   |
| `Stock`       | Número entero      | Unidades reales; cero indica agotado                    |
| `Estado`      | Selección          | Disponible, Esgotat o Esborrany                         |
| `Material`    | Texto              | Composición real de la pieza                            |
| `Medidas`     | Texto              | Medidas reales                                          |
| `Cuidados`    | Texto largo        | Instrucciones particulares de cuidado                   |
| `Destacado`   | Casilla            | Prioridad en la portada                                 |

Un registro con estado `Esborrany` no aparece en la web. Stock vacío permite añadir la pieza a una cesta de consulta, con una unidad máxima, pero bloquea la validación de compra. Un stock de cero o un estado `Esgotat` bloquea añadirla. No se deduce inventario de las fotografías ni del precio.

```sh
pnpm airtable:schema   # Muestra los campos que faltan, sin escribir
pnpm airtable:setup    # Añade solo los campos que faltan
```

La preparación del esquema necesita un token con `schema.bases:read` y `schema.bases:write` y el rol adecuado sobre la base. El catálogo en ejecución solo necesita lectura de registros.

## Estado de los pagos

Stripe **todavía no está instalado, implementado ni activo**. Vercel ha localizado el proyecto `tumarres-projects/clara-i-punt`, pero ha detenido la instalación de la integración hasta que el propietario acepte sus condiciones y complete el alta:

https://vercel.com/tumarres-projects/~/integrations/accept-terms/stripe?source=cli

Tras completar ese paso, hay que implementar Checkout y su webhook con el proveedor real, registrar los pedidos pagados y resolver la reserva y actualización del stock. El correo actual es una consulta, nunca una confirmación de pago. Antes de vender deben estar confirmados los productos, stock, costes y destinos de envío, datos del titular y condiciones comerciales.

## Validación

```sh
pnpm check
pnpm test
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
```

Las pruebas de navegador recorren escritorio y móvil con el catálogo real de lectura: búsqueda, fichas, galería, carrito persistente, consulta por correo, navegación y 404. No envían mensajes, crean pedidos ni cobran. La prueba de cesta se omite si el entorno no contiene una pieza real que se pueda añadir a una consulta.

El build local utiliza el adaptador Node y genera `dist/server/entry.mjs`. Vercel utiliza su adaptador cuando `VERCEL` está definido, evitando los problemas de enlaces simbólicos del empaquetado Vercel en Windows. No se ha desplegado esta actualización a producción.

## Referencia visual

[Figma — Branding, página Design](https://www.figma.com/design/vjv0EwSAsyojrdoJ9cv6ik/Branding?node-id=71-532). Se conservan Figtree, el logotipo, las flores y la paleta; se han optimizado las fotografías de referencia a WebP y se ha completado la experiencia de tienda.

La portada recupera la composición de escritorio y móvil, bandas con movimiento, carrusel móvil automático y controles de los carruseles de piezas e ideas. El movimiento se puede pausar y respeta la preferencia de movimiento reducido. Los textos identifican a Clara como nuestra abuela y autora de las piezas reales.

Las cinco fotos nuevas son placeholders generados con la herramienta integrada `imagegen`. La mujer de la fotografía es ficticia y no es Clara. [Archivos y prompts](public/images/placeholders/PROMPTS.md). [Inventario de Figma y alcance de la revisión](docs/design-reference.md).
