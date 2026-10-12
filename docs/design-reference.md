# Referencia de diseño

Archivo: [Branding — Clara i Punt](https://www.figma.com/design/vjv0EwSAsyojrdoJ9cv6ik/Branding?node-id=71-532).

Se inventariaron las siete páginas del archivo:

| Página        | Contenido principal                                   |
| ------------- | ----------------------------------------------------- |
| Cover         | Portada, 36:73                                        |
| Branding      | Identidad de marca y composiciones de referencia      |
| Refes         | Cinco paneles de referencias visuales                 |
| Wireframes    | Web de escritorio 71:261 y móvil 105:86               |
| Design System | Botones, menú, footer e iconos                        |
| Design        | Web de escritorio 71:1182 y 2003:258; móvil 105:512   |
| Construction  | Construcción de la marca, colores, logos y tipografía |

La implementación usa el contexto completo y la captura de 71:1182, la referencia móvil disponible y los recursos originales del proyecto. Se descargaron los SVG exactos de logos, flores y flechas en `public/images/figma/`.

La cuota del conector Figma del plan Starter se agotó después del inventario y la lectura de la composición de escritorio. No se pudo profundizar en todos los componentes auxiliares ni obtener contexto de motion. No se afirma una comparación visual completa de cada nodo.

El movimiento recupera el comportamiento del código anterior: bandas en sentidos opuestos a 50 y 100 px/s, banda de proximidad a 90 px/s y carrusel móvil cada 2500 ms. Se implementa con CSS y desplazamiento nativo, controles manuales, pausa al interactuar, pausa global y `prefers-reduced-motion`.

Los huecos fotográficos de la portada y la historia se rellenan provisionalmente. Clara es la abuela de la familia y autora de los productos reales. La fotografía generada muestra a una mujer ficticia de espaldas y lleva una indicación visible de imagen provisional; debe sustituirse por una fotografía auténtica cuando esté disponible.

Los productos ficticios Bossa Cerdanya, Necesser Flor y Mocador Núvol aparecen solo en desarrollo, con etiqueta de muestra y precio orientativo. No tienen stock, no se pueden añadir a la cesta ni validar como compra. No se crearon registros ni se cambiaron productos remotos en Airtable para esta revisión.

Las fichas de producto, colección, historia, ayuda, contacto y cesta amplían la composición de referencia usando sus colores, tipografía, esquinas y recursos de marca. El Figma contiene principalmente la portada en escritorio y móvil, no diseños independientes completos de cada ruta comercial.
