# Zongolica ¡Vive el Mundial! — Pantalla del Mundialito 2026

App de **pantalla grande** para el día del Torneo de Futbolito de Mesa 2026 en el
Domo Municipal de Zongolica. Pensada para proyectarse en la pantalla inflable:
cronómetro de 7 minutos visible para todos, mesa de futbolito en 3D, estado de
las 9 mesas/estadios y la llave eliminatoria.

Hecha con **Astro SSR + React + Tailwind CSS v4**, modelo 3D con
**react-three-fiber / three.js** y animaciones con **motion**.

---

## 🚀 Cómo correrla

```bash
npm install        # solo la primera vez
npm run dev        # servidor de desarrollo → http://localhost:4321
```

Para producción (en la compu que estará conectada a la pantalla):

```bash
npm run build      # genera dist/
npm run preview    # sirve la versión final en http://localhost:4321
```

> Para verla a pantalla completa: presiona **F** (o el botón ⛶ arriba a la
> derecha). En la compu del evento abre Chrome en modo kiosco apuntando a la URL.

---

## 🖥️ Las 4 vistas (y atajos de teclado)

| Tecla | Vista | Qué muestra |
|:---:|---|---|
| **1** | **Cronómetro** (`/`) | Contador gigante de 7 min, **compartido para las 9 mesas** (todas juegan a la vez), sobre el fondo del estadio. Patrocinadores Oro a los lados y carrusel de Plata/Bronce abajo. **No se reinicia al cambiar de vista** (sigue corriendo). |
| **2** | **Estadios 3D** (`/estadios`) | Mesa de futbolito en 3D girando, con el nombre del estadio, su patrocinador y el partido de esa mesa. |
| **3** | **Mesas** (`/mesas`) | Las 9 mesas en cuadrícula 3×3: quién juega en cada una y su estado. |
| **4** | **Llave** (`/llave`) | Camino al campeón: octavos → cuartos → semifinal → final. |

**Controles del cronómetro** (vista 1):

- **Espacio** — iniciar / pausar
- **R** — reiniciar a 7:00
- **P** — modo penales
- **S** — silenciar / activar sonido

El cronómetro avisa con pitidos en los últimos 10 segundos y una bocina al
terminar. Es un reloj **único compartido** para las 9 mesas (todas juegan a la
vez) y **se guarda solo**: si cambias de vista o recargas la página, sigue
corriendo desde donde iba (no se reinicia). Para ponerlo en cero usa **Reiniciar**.

---

## ✏️ Cómo editar el torneo

**Todo el contenido del torneo vive en un solo archivo:**
[`src/data/torneo.ts`](src/data/torneo.ts). No necesitas tocar nada más.

- **Equipos (parejas):** edita el arreglo `EQUIPOS` (nombre, jugadores, color).
- **Partidos y marcadores:** edita `PARTIDOS` (marcador, `estado`:
  `"proximo" | "jugando" | "finalizado"`, y `ganador`: `"A" | "B"`).
- **Qué partido se ve en el cronómetro:** cambia `PARTIDO_EN_PANTALLA` (ej. `"P1"`).
- **Estadios / mesas:** edita `ESTADIOS` (nombre, ciudad, bandera, color de acento).
- **Reglas y premios:** `REGLAS`.

### Logos de patrocinadores (cuando lleguen)

1. Guarda cada logo en `public/brand/sponsors/` (PNG con fondo transparente).
2. En `src/data/torneo.ts`, dentro de `PATROCINADORES`, agrega la ruta:

   ```ts
   { id: "cafe-sierra", nombre: "Café de la Sierra", tier: "oro",
     color: "#6f4e37", iniciales: "CS",
     logo: "/brand/sponsors/cafe-sierra.png" },   // ← agrega esta línea
   ```

Mientras no haya logo se muestra un monograma de color, así que el carrusel y las
tarjetas se ven bien desde ahora. Los patrocinadores se dividen en `oro` (uno por
mesa), `plata` y `bronce`.

---

## 🎨 Marca

- Tipografía **Poppins**. Naranja institucional **`#ff8200`** + verde/neón del
  Mundial. Estética de estadio nocturno (apropiada para proyección).
- Logos y mascota en `public/brand/`. El modelo 3D en `public/models/`.

## 🗂️ Estructura

```
src/
  data/torneo.ts          ← ÚNICA fuente de datos (edita aquí)
  layouts/Screen.astro    ← marco común: header, reloj, navegación, atajos
  pages/
    index.astro           ← Cronómetro
    estadios.astro        ← Estadios 3D
    mesas.astro           ← Las 9 mesas
    llave.astro           ← Llave eliminatoria
  components/
    TimerScreen.tsx        ← cronómetro persistente (se guarda en el navegador)
    Stadium3D.tsx          ← escena 3D de la mesa de futbolito
    SponsorCarousel.astro  ← carrusel animado de patrocinadores
    SponsorCard.astro      ← tarjeta de patrocinador (lados del cronómetro)
    BracketNode.astro      ← nodo recursivo de la llave
public/
  models/foosball_table.glb
  brand/                   ← logos, mascota, fondo
```
