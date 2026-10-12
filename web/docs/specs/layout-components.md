# Especificación técnica: componentes del Layout

> **Estado:** validada (decisiones D-1 a D-5 tomadas el 2026-09-24)
> **Alcance:** `Navbar.jsx`, `VideoBackground.jsx`, `HeroButton.jsx`
> **Stack:** React 19 · React Router DOM 7 · CSS Modules

Cada criterio de aceptación tiene un ID (`NAV-xx`, `VID-xx`, `BTN-xx`) para referenciarlo en tests y PRs. **DEBE** = obligatorio. **PUEDE** = opcional.

---

## 1. `Navbar.jsx`

### Responsabilidad principal

Mostrar la marca y la navegación principal (rutas internas y contacto): en línea en escritorio y detrás de un botón hamburguesa en pantallas chicas.

### Prop Types (entradas)

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| — | — | — | — | No recibe props. Los links salen de la constante `NAV_LINKS` y los datos de contacto de `src/config/contact.js`. |

**Contexto requerido:** DEBE renderizarse dentro de un Router (`BrowserRouter` en la app, `MemoryRouter` en tests), porque usa `Link` y `NavLink`.

### Estado interno (State)

| Variable | Tipo | Valor inicial | Propósito |
|---|---|---|---|
| `isMenuOpen` | `boolean` | `false` | Panel móvil abierto o cerrado. Es la única fuente de verdad del menú. |

Referencias que no son estado: `burgerRef` (para devolver el foco al botón) y `panelId` (de `useId`, para `aria-controls`).

### Comportamiento esperado (criterios de aceptación)

- **NAV-01** Al cargar, `isMenuOpen` es `false`: el panel está oculto y sus links quedan fuera del orden de tabulación.
- **NAV-02** Un clic en el botón hamburguesa alterna `isMenuOpen`.
- **NAV-03** El botón expone `aria-expanded={isMenuOpen}`, `aria-controls` con el id del panel y `aria-label` "Abrir menú" o "Cerrar menú" según el estado.
- **NAV-04** Un clic en cualquier enlace del panel (Inicio, Cámaras, Instalación, WhatsApp, Llamar ahora) o en la marca pone `isMenuOpen` en `false`.
- **NAV-05** Con el menú abierto, `Escape` pone `isMenuOpen` en `false` y devuelve el foco al botón hamburguesa.
- **NAV-06** Tocar fuera del panel (capa `scrim`) pone `isMenuOpen` en `false`.
- **NAV-07** Si la ruta cambia por cualquier vía, incluidos los botones Atrás y Adelante del navegador, el menú queda cerrado.
- **NAV-08** El link de la ruta actual lleva `aria-current="page"` y estilo activo. "Inicio" solo está activo en `/` exacto (prop `end`).
- **NAV-09** "Contactar por WhatsApp" abre en pestaña nueva con `rel="noopener noreferrer"`. "Llamar ahora" usa `tel:` en la misma pestaña.
- **NAV-10** Desde 1200px, los links se muestran en línea y el botón y el scrim quedan ocultos. El valor de `isMenuOpen` no altera la vista.
- **NAV-11** Por debajo de 1200px, el panel se despliega anclado arriba a la derecha, con una transición de 200 ms.
- **NAV-12** *(D-2)* Si la ventana pasa a ≥1200px con el menú abierto, `isMenuOpen` pasa a `false` (listener de `matchMedia('(min-width: 1200px)')`, que se elimina al desmontar).
- **NAV-13** *(D-5)* El link de WhatsApp incluye un texto oculto visualmente, "(se abre en una pestaña nueva)", que sí leen los lectores de pantalla (clase global `.visually-hidden`).

### Consideraciones técnicas / edge cases

- **Patrón de accesibilidad:** *disclosure* (un botón que muestra u oculta contenido), no un modal. No hay trampa de foco ni bloqueo de scroll.
- **Panel cerrado:** usa `visibility: hidden` y no solo `opacity: 0`. Si no, sus links recibirían foco con Tab estando invisibles.
- **Área táctil:** el botón mide al menos 44×44 px, aunque el dibujo sea más chico.
- **Listener de teclado:** el de `keydown` se registra solo con el menú abierto y se limpia al cerrar o desmontar, sin fugas.
- **Cambio de breakpoint:** si el menú queda abierto y la ventana pasa a ≥1200px, se cierra (NAV-12). Así, al volver a <1200px el panel no reaparece abierto.
- **Breakpoint fijo:** 1200px está escrito en el CSS, porque las variables CSS no funcionan dentro de `@media`. Cambiarlo obliga a editar el módulo.
- **Animaciones de entrada:** se declaran fuera del `@media`. Si no, se repiten cada vez que se cruza el breakpoint (al rotar una tablet o redimensionar la ventana).
- **Crecimiento del menú:** en escritorio los links no hacen wrap. Si se agrega un ítem (por ejemplo, "Domótica"), hay que verificar que la fila entre en 1200px.

---

## 2. `VideoBackground.jsx`

### Responsabilidad principal

Pintar el video decorativo de fondo, fijo detrás de todo el contenido, con un velo que asegura el contraste del texto.

### Prop Types (entradas)

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `dimmed` | `boolean` | No | `false` | Suma una capa oscura, con un fundido de 0.6 s, para páginas con texto largo. Cambiarla no debe afectar al `<video>`. |

La URL del video y la del poster son constantes internas (`VIDEO_SRC_HD` 1080p, `VIDEO_SRC_SD` 720p, `POSTER_SRC`). No se reciben por props (D-3).

### Estado interno (State)

Sin estado de React: nada de lo que se renderiza depende de si el video está en reproducción. Usa `videoRef` (`useRef`) para controlar el elemento.

### Comportamiento esperado (criterios de aceptación)

- **VID-01** Se monta una sola vez, dentro de `Layout` y fuera de `<Outlet />`. Al navegar entre rutas, el `<video>` DEBE ser el mismo nodo del DOM y la reproducción continúa (`currentTime` no vuelve a 0).
- **VID-02** Atributos: `muted`, `loop`, `playsInline`, `preload`, `poster` y `aria-hidden="true"`. Sin `controls`.
- **VID-03** La reproducción arranca desde un efecto después del montaje, no con `autoPlay`. El efecto fija `video.muted = true` y recién después llama a `play()`.
- **VID-04** Si `play()` es rechazado, el error se descarta sin romper la app y queda visible el poster.
- **VID-05** Con `prefers-reduced-motion: reduce` el video queda en pausa desde el inicio. Si la preferencia cambia con la página abierta, pausa o reanuda.
- **VID-06** El listener de `matchMedia` se elimina al desmontar.
- **VID-07** Cambiar `dimmed` solo alterna la clase del velo; no vuelve a crear el `<video>`.
- **VID-08** El video y el velo no capturan eventos (`pointer-events: none`) ni afectan el layout (`position: fixed`).
- **VID-09** *(D-4)* La fuente se elige una sola vez, al montar: `VIDEO_SRC_SD` (720p, ~4 MB) si `matchMedia('(max-width: 599px)')` coincide, y `VIDEO_SRC_HD` (1080p, ~10 MB) si no. Redimensionar o rotar el dispositivo NO cambia la fuente, porque cambiar `src` reinicia la descarga y la reproducción.

### Consideraciones técnicas / edge cases

- **iOS:**
  - `playsInline` es obligatorio; sin él, el video se abre a pantalla completa.
  - `muted` tiene que estar fijado como propiedad antes de `play()`. React no siempre escribe el atributo `muted` en el HTML; por eso existe **VID-03**.
- **Ahorro de energía:** iOS con Ahorro de batería y algunos Android con ahorro de datos bloquean hasta el autoplay silenciado. **VID-04** garantiza que se vea el poster.
- **Peso:** el clip en 1080p pesa unos 10 MB y `preload="auto"` lo descarga completo. Por eso en pantallas chicas se sirve la versión 720p (VID-09).
- **Primer render:** la fuente depende de `matchMedia`, así que se calcula en el cliente antes de asignar `src` (por ejemplo, con un inicializador de `useState` o una constante de módulo). El `<video>` no debe arrancar con una fuente y cambiar a la otra.
- **Dependencia externa:** el video se sirve directo desde Pexels, sin garantía de disponibilidad. Si falla, queda el color de fondo `#03060c`. Conviene alojarlo en `/public` o en un CDN propio.
- **StrictMode:** en desarrollo, React monta, desmonta y vuelve a montar. El efecto tiene que ser idempotente (hoy lo es: play/pause y el alta y baja del listener son simétricos).
- **Recorte del clip:** `scale: 1.08` saca de cuadro una franja amarilla que tiene el clip actual en pantallas 16:9 o más anchas. Si se cambia el video, revisarlo.
- **Contraste:** el velo está calibrado para el brillo del clip actual. Con otro video hay que volver a medir: el texto `#a2a9b8` debe mantener ≥ 4.5:1.

---

## 3. `HeroButton.jsx`

### Responsabilidad principal

Renderizar un llamado a la acción con estilo de vidrio que lleva a una ruta interna o a un destino externo (WhatsApp, teléfono).

### Prop Types (entradas)

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `text` | `string` | Sí | — | Etiqueta visible, que también es el nombre accesible. Recomendado: hasta 24 caracteres. |
| `url` | `string` | Sí | — | Destino, no vacío. Define qué elemento se renderiza (ver BTN-02 a BTN-05). |
| `icon` | `ReactNode` | No | `undefined` | Ícono decorativo que va después del texto (por ejemplo, `<ArrowIcon />`). Si no se pasa, no se renderiza su contenedor. |

### Estado interno (State)

Sin estado. Es un componente puro: con las mismas props, el resultado es siempre el mismo.

### Comportamiento esperado (criterios de aceptación)

- **BTN-01** Renderiza `text` y, si existe, `icon` a continuación.
- **BTN-02** Si `url` empieza con una sola `/` (ruta interna), renderiza un `<Link>` de React Router que navega sin recargar la página.
- **BTN-03** Si `url` empieza con `http://` o `https://`, renderiza un `<a>` con `target="_blank"` y `rel="noopener noreferrer"`.
- **BTN-04** Con cualquier otro esquema (`tel:`, `mailto:`, `#ancla`), renderiza un `<a>` en la misma pestaña, sin `target`.
- **BTN-05** Si `url` empieza con `//` (URL de protocolo relativo), DEBE tratarse como externa y no como ruta interna.
- **BTN-06** El contenedor del ícono lleva `aria-hidden="true"`: los lectores de pantalla anuncian solo `text`.
- **BTN-07** Estados visuales:
  - hover: el fondo se aclara un 6%, el botón sube 1px y la flecha se corre 3px a la derecha;
  - active: escala 0.985;
  - focus-visible: anillo de foco que respeta la forma de pastilla.
- **BTN-08** Con movimiento reducido no hay transiciones (lo resuelve el reset global).
- **BTN-09** No acepta `className` ni `style`: la posición y los márgenes los define el contenedor padre.
- **BTN-10** *(D-5)* Cuando abre en pestaña nueva (BTN-03), incluye el texto oculto visualmente "(se abre en una pestaña nueva)", que sí leen los lectores de pantalla.

### Consideraciones técnicas / edge cases

- **Sin estado deshabilitado:** es un enlace, así que no hay `disabled`. Si en el futuro dispara acciones (por ejemplo, enviar un formulario), corresponde un componente aparte basado en `<button>`.
- **Textos largos:** `white-space: nowrap` puede hacer desbordar un texto largo a 320px. "Solicitar Presupuesto" entra; textos más largos requieren wrap o acortarlos.
- **Ancla en otra ruta:** con algo como `/#contacto`, React Router no hace scroll al ancla por sí solo. Si se usa, hace falta manejarlo explícitamente.
- **URLs `javascript:`:** React 19 las bloquea; no son un caso soportado.
- **Pestaña nueva:** el aviso (BTN-10) va en un `<span className="visually-hidden">` dentro del link. No se usa `aria-label`, que reemplazaría al texto visible en vez de complementarlo.
- **Sin `backdrop-filter`:** en navegadores que no lo soportan, los degradados alcanzan para mantener el contraste.

---

## Diferencias con la implementación actual

El código de estos tres componentes ya existe en `web/src` (de la entrega anterior). Contra esta especificación:

| ID | Estado | Detalle |
|---|---|---|
| NAV-07 | ❌ Falta | Si se usa Atrás o Adelante con el menú abierto, el panel sigue abierto. Hoy solo se cierra al hacer clic en un link. |
| BTN-05 | ❌ Falta | `url.startsWith('/')` trata `//dominio.com` como ruta interna. |
| BTN-06 | ⚠️ Parcial | Los íconos propios traen `aria-hidden` en el `<svg>`, pero el contenedor no. Un ícono de terceros sin ese atributo se anunciaría. |
| NAV-12 | ❌ Falta | Nuevo por D-2. |
| NAV-13 | ❌ Falta | Nuevo por D-5. |
| VID-09 | ❌ Falta | Nuevo por D-4. Hoy siempre se sirve 1080p. |
| BTN-10 | ❌ Falta | Nuevo por D-5. |
| Resto | ✅ Cumple | NAV-02, NAV-04, NAV-05, NAV-08, VID-01 y VID-07 verificados en Chrome. El resto, por revisión de código. |

## Decisiones tomadas

| ID | Decisión | Impacto |
|---|---|---|
| D-1 | El estado del menú se llama `isMenuOpen`. | Sin cambios de código. |
| D-2 | El menú se cierra solo al pasar a ≥1200px. | NAV-12 |
| D-3 | `VideoBackground` no recibe `src` ni `poster` por props. | Constantes internas. |
| D-4 | Por debajo de 600px se sirve la versión 720p (~4 MB). | VID-09 |
| D-5 | Los links que abren pestaña nueva lo avisan a lectores de pantalla. | NAV-13, BTN-10, clase global `.visually-hidden` |
