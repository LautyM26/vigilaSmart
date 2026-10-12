# Especificación técnica: vistas `/camaras` e `/instalacion`

> **Estado:** validada (D-6 a D-9 tomadas el 2026-09-24) · `CamarasView` implementada con tests CAM-01 a CAM-11
> **Alcance:** `CamarasView.jsx`, `InstalacionView.jsx` y su interacción con `Navbar` y `Layout`
> **Stack:** React 19 · React Router DOM 7 · CSS Modules
> **Depende de:** [layout-components.md](./layout-components.md) (validada)

Mismas convenciones que la spec del Layout: IDs de criterio (`CAM-xx`, `INS-xx`, `NAVX-xx`), **DEBE** = obligatorio, **PUEDE** = opcional.

## 0. Principios comunes a las dos vistas

- **Contenido como datos.** El texto y los datos de cada vista viven en un módulo de `src/data/` versionado en el repo, no dentro del JSX. Las vistas solo los presentan.
- **Sin datos inventados.** Modelos, especificaciones, zonas y condiciones de garantía los aporta el negocio (ver §5). Si un dato opcional falta, se omite: nunca se muestra un valor de relleno.
- **Sin carga remota.** Los datos son estáticos e importados en el build, así que no hay estados de carga ni de error de red. Si en el futuro vienen de una API, esta spec se amplía.
- **Ubicación y nombres.** `src/pages/Camaras/CamarasView.jsx` y `src/pages/Instalacion/InstalacionView.jsx`, cada una con su `*.module.css`. La tipografía de lectura común sigue en `src/pages/ContentPage.module.css`. Los archivos actuales `Camaras.jsx` e `Instalacion.jsx` se renombran.
- **Contacto.** Todo link a WhatsApp se arma con un helper nuevo, `buildWhatsAppUrl(message)`, en `src/config/contact.js`. Hoy existe solo la constante `WHATSAPP_URL`.

---

## 1. `CamarasView.jsx` (ruta `/camaras`)

### Responsabilidad principal

Presentar el catálogo de cámaras con sus especificaciones, explicar el almacenamiento continuo y la visión nocturna, y llevar a pedir presupuesto por WhatsApp.

### Prop Types (entradas)

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| — | — | — | — | No recibe props: es una vista de ruta. Lee `CAMERAS` y `CAMERA_CAPABILITIES` de `src/data/cameras.js` y el filtro de la URL. |

**Contrato de datos: `Camera`** (cada elemento de `CAMERAS`)

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | `string` | Sí | Slug único (`domo-exterior-2mp`). Se usa como `key` y como ancla `#camara-{id}`. |
| `name` | `string` | Sí | Nombre comercial del modelo. |
| `environment` | `'indoor' \| 'outdoor'` | Sí | Uso interior o exterior. Es el campo que se filtra. |
| `resolution` | `string` | Sí | Texto a mostrar, por ejemplo `'1080p (2 MP)'`. |
| `nightVisionRangeM` | `number \| null` | Sí | Alcance de visión nocturna en metros. `null` = no tiene o no se informa. |
| `storage` | `Array<'microsd' \| 'cloud' \| 'nvr'>` | Sí | Opciones de almacenamiento continuo compatibles (al menos una). |
| `maxMicroSdGb` | `number \| null` | No | Capacidad máxima de microSD, si aplica. |
| `highlights` | `string[]` | No | Hasta 3 características extra en texto corto. |
| `image` | `{ src: string, alt: string, width: number, height: number }` | Sí | Foto del equipo. `alt` describe el modelo, no "imagen de cámara". |

`CAMERA_CAPABILITIES`: dos bloques fijos (`continuousStorage` y `nightVision`), cada uno con `title` y `text`, que explican la capacidad en general, sin atarla a un modelo.

### Estado interno (State)

| Variable | Tipo | Origen | Propósito |
|---|---|---|---|
| `environmentFilter` | `'all' \| 'indoor' \| 'outdoor'` | Parámetro de URL `?ambiente=todas\|interior\|exterior`, vía `useSearchParams` | Filtro activo del catálogo. |
| `visibleCameras` | `Camera[]` | Derivado: `CAMERAS` filtrado por `environmentFilter` | Lista a renderizar. Se calcula en el render; no es estado propio. |

El filtro vive en la URL y no en `useState`: así se puede compartir el link filtrado ("mirá las de exterior") y los botones Atrás y Adelante lo respetan.

### Comportamiento esperado (criterios de aceptación)

- **CAM-01** Renderiza, en este orden: `h1` "Cámaras", una bajada, los dos bloques de `CAMERA_CAPABILITIES` (almacenamiento continuo y visión nocturna), el filtro, el catálogo y un CTA final a WhatsApp.
- **CAM-02** El catálogo muestra un ítem por cada cámara visible, en el orden del array de datos.
- **CAM-03** Cada ítem muestra imagen, nombre, ambiente (Interior/Exterior), resolución y opciones de almacenamiento. El alcance de visión nocturna y la capacidad de microSD aparecen solo si no son `null`.
- **CAM-04** Cada ítem tiene un link "Consultar este modelo" que abre WhatsApp con un mensaje que incluye el nombre del modelo, armado con `buildWhatsAppUrl`. Cumple BTN-10 (aviso de pestaña nueva).
- **CAM-05** El filtro son tres botones ("Todas", "Interior", "Exterior") con `aria-pressed` en el activo. Al tocarlos se actualiza `?ambiente=` usando `replace`, para no llenar el historial con cada cambio.
- **CAM-06** Con `ambiente` ausente o con un valor inválido (`?ambiente=xyz`), la vista se comporta como "Todas" y no falla.
- **CAM-07** Un texto con `aria-live="polite"` anuncia la cantidad de resultados ("3 modelos") cada vez que cambia el filtro.
- **CAM-08** Si el filtro no deja resultados, se muestra un estado vacío con un botón "Ver todas" (vuelve a `ambiente=todas`) y un link a WhatsApp.
- **CAM-09** Si `CAMERAS` está vacío, se ocultan el filtro y el catálogo, y se muestra "Consultanos por WhatsApp los modelos disponibles" con su link.
- **CAM-10** El título de la pestaña es "Cámaras — VigilaSmart" y hay una `meta description` propia, ambos con los elementos `<title>` y `<meta>` de React 19.
- **CAM-11** Cambiar el filtro NO mueve el scroll: solo cambia la query, no la ruta.

### Consideraciones técnicas / edge cases

- **Imágenes:**
  - `loading="lazy"` y `decoding="async"` en todas, porque el catálogo empieza debajo del primer pantallazo.
  - `width` y `height` explícitos para que el layout no salte al cargar.
  - Formato WebP o AVIF, importadas desde `src/assets/cameras/` para que Vite les agregue hash de caché.
- **Imagen rota:** si una imagen no carga (`onError`), se oculta el recuadro de la foto y el resto del ítem se mantiene. El nombre y las especificaciones son la información esencial.
- **Rendimiento:** con un catálogo de decenas de ítems, filtrar en cada render no cuesta nada. No hace falta `useMemo` ni cargar la vista con `lazy()` (el JS total pesa hoy 86 kB gzip).
- **SEO básico:**
  - El contenido se renderiza en el cliente. Google ejecuta JS e indexa, pero otros buscadores y las vistas previas de links (WhatsApp, redes) solo leen el HTML inicial.
  - Si importa cómo se ve el link compartido, el paso siguiente es prerenderizar las rutas en el build (fuera de este alcance).
- **Datos incompletos:** un campo requerido faltante es un error del módulo de datos, no de la vista. Se recomienda un test que valide `CAMERAS` contra este contrato: `id` únicos, `storage` no vacío, `alt` no vacío.
- **Fondo:** el velo sale oscurecido porque la ruta no es `/` (VID-07). El texto `--sub` mantiene ≥ 4.5:1 sobre ese fondo.
- **Layout del catálogo:** lista con separadores o grilla de 1, 2 o 3 columnas según ancho. Las fotos de los productos son el contenido, así que los ítems son legítimos (no son tarjetas decorativas de ícono + texto).

---

## 2. `InstalacionView.jsx` (ruta `/instalacion`)

### Responsabilidad principal

Explicar cómo es el servicio de instalación, dónde se presta y qué garantía tiene, y resolver dudas frecuentes antes de pedir presupuesto.

### Prop Types (entradas)

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| — | — | — | — | No recibe props: es una vista de ruta. Lee `INSTALLATION` de `src/data/installation.js`. |

**Contrato de datos: `INSTALLATION`**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `steps` | `Array<{ title: string, text: string }>` | Sí (≥ 1) | Pasos del servicio, en orden. |
| `coverage.zones` | `string[]` | Sí (puede estar vacío) | Zonas o localidades cubiertas. |
| `coverage.note` | `string \| null` | No | Aclaración, por ejemplo "Otras zonas: consultar". |
| `warranty` | `Array<{ title: string, text: string }>` | Sí (puede estar vacío) | Condiciones de garantía (equipos, mano de obra, plazos). |
| `faqs` | `Array<{ id: string, question: string, answer: string }>` | Sí (puede estar vacío) | Preguntas frecuentes. `id` es un slug único. |

### Estado interno (State)

**Sin estado de React.** El acordeón de preguntas frecuentes se arma con `<details name="faq">` y `<summary>` nativos. Con el atributo `name`, el navegador ya garantiza que haya una sola pregunta abierta a la vez y maneja el teclado y la semántica accesible sin JavaScript.

Alternativa descartada: `openFaqId: string | null` con `useState`. Solo haría falta si se necesitara medir qué preguntas se abren o abrir una desde código. Ver **D-8**.

### Comportamiento esperado (criterios de aceptación)

- **INS-01** Renderiza, en este orden: `h1` "Instalación", una bajada y las secciones "Cómo es el servicio" (`#servicio`), "Zonas de cobertura" (`#cobertura`), "Garantía" (`#garantia`) y "Preguntas frecuentes" (`#preguntas`), más un CTA final a WhatsApp.
- **INS-02** Los pasos se muestran en un `<ol>` numerado, en el orden de los datos. Acá la numeración aporta información: es una secuencia.
- **INS-03** Si `coverage.zones` tiene elementos, se listan. Si está vacío, se muestra "Escribinos con tu ubicación y te confirmamos si llegamos a tu zona" con un link a WhatsApp que lleva el mensaje "¿Llegan a mi zona?".
- **INS-04** Si `warranty` tiene elementos, se listan. Si está vacío, se muestra "Te detallamos las condiciones de garantía junto con el presupuesto".
- **INS-05** Todas las preguntas empiezan cerradas. Al abrir una, se cierra la que estaba abierta (`name="faq"`). Se opera con teclado (Enter/Espacio sobre el `summary`) y el indicador visual (chevron) rota según el estado.
- **INS-06** Si `faqs` está vacío, la sección "Preguntas frecuentes" no se renderiza y su ancla no existe.
- **INS-07** Las respuestas se renderizan como texto, nunca con `dangerouslySetInnerHTML`. Los saltos de línea se respetan separando en párrafos.
- **INS-08** Si se entra con un ancla (`/instalacion#garantia`, por ejemplo desde un mensaje de WhatsApp), la vista se posiciona en esa sección y no arriba de todo (ver NAVX-04).
- **INS-09** El título de la pestaña es "Instalación — VigilaSmart" y hay una `meta description` propia.
- **INS-10** Los CTA a WhatsApp cumplen BTN-10 (aviso de pestaña nueva).

### Consideraciones técnicas / edge cases

- **Soporte de `<details name>`:** Chrome 120+, Safari 17.2+ y Firefox 130+. En navegadores más viejos se degrada solo: se pueden abrir varias preguntas a la vez y todo sigue funcionando.
- **Búsqueda dentro de la página:** con Ctrl+F, Chrome abre el `<details>` que contiene el texto buscado. No hay que bloquearlo.
- **SEO:** el texto de las respuestas está en el DOM aunque estén cerradas, así que se indexa. No vale la pena agregar datos estructurados `FAQPage`: desde 2023 Google solo muestra ese resultado enriquecido para sitios de gobierno y salud.
- **Lectura:** el ancho de texto máximo es 60–65ch. Las respuestas largas se parten en párrafos, no en un bloque único.
- **Anclas:** la barra superior no es fija, así que no hace falta compensar su altura. Si en el futuro pasa a ser sticky, se agrega `scroll-margin-top` a las secciones.
- **Movimiento reducido:** el scroll hacia un ancla es suave solo si el usuario no pidió reducir movimiento. Ya lo cubre el reset global (`scroll-behavior: auto`).

---

## 3. Interacción de `Navbar` y `Layout` con las vistas

La mayoría de este comportamiento ya está en la spec del Layout. Lo que se agrega (NAVX-03 a NAVX-05) es responsabilidad de `Layout`, no del `Navbar`: el `Navbar` solo navega y marca la ruta activa.

- **NAVX-01 · Ruta activa.** Al navegar a `/camaras` o `/instalacion`, el `NavLink` correspondiente recibe `aria-current="page"` y el estilo activo: subrayado fino en escritorio y fondo resaltado en el panel móvil (NAV-08). Sigue activo aunque la URL tenga query (`/camaras?ambiente=exterior`) o ancla (`/instalacion#garantia`). "Inicio" no se marca en esas rutas (prop `end`).
- **NAVX-02 · Menú.** El panel móvil se cierra al navegar, ya sea con un clic en un link (NAV-04) o con Atrás/Adelante (NAV-07).
- **NAVX-03 · Scroll al cambiar de vista.** Cuando cambia `pathname`, `Layout` lleva el scroll arriba de todo sin animación (`behavior: 'instant'`), para que el `scroll-behavior: smooth` global no anime el salto entre páginas.
- **NAVX-04 · Excepciones al scroll top:**
  - si la URL nueva trae ancla (`#garantia`), se hace scroll hasta ese elemento en lugar de arriba;
  - si solo cambió la query (filtros de `/camaras`), no se mueve el scroll (CAM-11).
- **NAVX-05 · Foco al cambiar de vista.** Tras una navegación (no en la carga inicial), el foco pasa al `h1` de la vista nueva, que lleva `tabIndex={-1}`. Así un lector de pantalla anuncia la página nueva y la navegación con Tab sigue desde el contenido, no desde el link del menú.
- **NAVX-06 · Título.** Cada vista actualiza el título de la pestaña (CAM-10, INS-09). El `Navbar` no interviene.
- **NAVX-07 · Video.** Navegar entre vistas no reinicia el video de fondo (VID-01); solo se oscurece el velo fuera de `/` (VID-07).

**Diferencias con el código actual:** `Layout` ya cumple NAVX-03. Faltan la excepción de ancla de NAVX-04 (hoy siempre sube arriba de todo) y NAVX-05. La excepción de query ya se cumple de hecho, porque el efecto solo depende de `pathname`.

---

## 4. Decisiones tomadas

| ID | Decisión | Impacto |
|---|---|---|
| D-6 | Un solo filtro (ambiente). | Sin cambios. |
| D-7 | Al volver con Atrás, la vista arranca desde arriba (comportamiento deseado). | Se mantiene el router declarativo. |
| D-8 | Acordeón con `<details name="faq">` nativo, sin estado. | INS-05 |
| D-9 | Importa la vista previa de links: se prerenderiza el HTML de cada ruta en el build. | Change aparte: cada ruta tiene que llegar con su `<title>` y su `meta description` en el HTML estático. Hoy ya los declara cada vista (CAM-10, INS-09). |

## 5. Datos que tiene que aportar el negocio (bloqueante para implementar)

| Dato | Para | Formato |
|---|---|---|
| Modelos de cámara con sus especificaciones | CAM-02, CAM-03 | Un registro por modelo, según el contrato `Camera` |
| Fotos de cada modelo | CAM-03 | WebP o JPG de 1200px de lado mayor, fondo neutro |
| Pasos reales del servicio | INS-02 | 3 a 5 pasos, título + una frase |
| Zonas de cobertura | INS-03 | Lista de localidades o barrios |
| Condiciones de garantía | INS-04 | Plazo para equipos, plazo para mano de obra y exclusiones |
| Preguntas frecuentes | INS-05 | Las 5 a 8 que más hacen los clientes, con sus respuestas |
