---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces for the **H. Ayuntamiento de Zongolica** platform. All design decisions must be rooted in the established brand system below while pushing for elevated, memorable aesthetics.

---

## Brand System — H. Ayuntamiento de Zongolica

### Colors

**Institutional primary**
```
Orange:  #ff8200   (CTAs, highlights, brand mark — site-wide)
```

**Module accent colors** (each micro-site has its own color identity)
```
Esterilización:  teal-600   #0d9488  /  teal-700  #0f766e
Vacunación:      orange-600  (shares institutional orange)
Turismo:         amber-500   #f59e0b  /  slate-950 (dark mode)
Intranet:        slate-700   #334155
Directorio:      blue-600    #2563eb
Feria Zongolica: #2B2E72 → #E94281  (purple-pink gradient)
```

**Neutrals**
```
Background (default):  #ffffff  /  #f8f9fb  /  #f5f7f3
Surface cards:         #ffffff  border: #e2e8f0
Dark accent cards:     slate-900 #0f172a  /  slate-950 #020617
Text primary:          slate-900 #0f172a
Text secondary:        slate-500 #64748b
Text muted:            slate-400 #94a3b8
```

**CSS custom properties (already defined in global.css)**
```css
--radius: 0.625rem;
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

### Typography

**Font family: Poppins** (loaded via @fontsource/poppins — latin 400/600/700)
```css
font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Weights in use: 400 (body), 600 (semibold), 700 (bold), 800 (extrabold), 900 (black headings).

For editorial/display moments use:
- Oversized black headings: `text-4xl sm:text-5xl font-black tracking-tight`
- Eyebrow labels: `text-[10px] font-black uppercase tracking-[.2em]`
- Data/numbers: `font-black tabular-nums` with a large size

Do NOT import additional Google Fonts unless the user explicitly asks. Poppins already handles all weight variations needed.

### Spacing & Radius

```
Buttons:        rounded-xl  (12px)
Small cards:    rounded-2xl (16px)
Large cards:    rounded-3xl (24px)
Hero cards:     rounded-[2rem] or rounded-[2.5rem]
Badges/pills:   rounded-full
```

Page max-widths: `max-w-5xl` (feature pages), `max-w-7xl` (full-site).
Section padding: `px-4 sm:px-6 lg:px-8` · `py-10 sm:py-14 lg:py-20`.

### Shadows & Depth

```
Cards:       shadow-sm  →  hover:shadow-xl
Buttons:     shadow-md shadow-black/20
Modals:      shadow-2xl
```

Borders: `border border-slate-200` on white cards; `border border-white/10` on dark cards.

### Buttons

```html
<!-- Primary (module accent) -->
<a class="inline-flex items-center gap-2 rounded-xl bg-[#ff8200] px-5 py-3 text-sm font-black text-white shadow-md transition hover:brightness-95 hover:-translate-y-0.5">

<!-- Outline ghost -->
<a class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">

<!-- Dark ghost (on colored/dark bg) -->
<a class="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20">
```

### Animations (already in global.css)

```css
/* Available utility classes */
.animate-fade-in-up   /* opacity 0→1 + translateY 20px→0 */
.animate-fade-scale   /* opacity 0→1 + scale 0.95→1 */
.animate-shimmer      /* loading shimmer */

/* Keyframe names to reference */
fadeIn, slideInUp, slideInDown, slideInLeft, slideInRight, scaleIn, blob, glow
```

Stagger pattern: `animation-delay: 50ms, 100ms, 150ms...` on sibling elements.

---

## Design Thinking

Before coding, commit to a **bold aesthetic direction** that is:
- **Rooted in the brand system above** — no random color choices
- **Distinctive within its module** — esterilización is teal, turismo is amber, etc.
- **Light-mode first** — the site is predominantly light; dark sections exist as selective accents

### Mode Usage Rules

**Light mode (default):** Background `#f5f7f3` or `#f8f9fb`. Cards white with `border border-slate-200`. Use for all main content areas, forms, lists.

**Dark accent cards** (selective): Use `bg-slate-900` or module-dark variants for:
- Price/stat callout cards (high visual contrast for a number)
- Hero cards within a section (not the section background)
- Decorative accent card in a bento grid (1 of 3–4 cards)

**Never:** Make the entire page or an entire section background dark on a page that's otherwise light. Dark backgrounds should appear as card-level accents, not section backgrounds — unless the page is explicitly a dedicated dark experience (e.g., turismo atractivos).

### Bento Grid Pattern

When using bento layouts:
```
- Section background: light (#f5f7f3 or white)
- Mix card types: 1 dark accent + 2 light/white + 1 gradient module-color
- The dark card highlights a key stat (price, count, date number)
- Grid: grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3
- All cards: rounded-3xl, min-height defined
- Entrance animation: CSS stagger with animation-delay
```

### Module-specific aesthetics

**Esterilización (teal)**
- Hero gradient: `from-teal-600 via-teal-700 to-[#0f766e]`
- Accent color: `teal-600` / `teal-300` on dark
- Price cards: `bg-slate-900` with `text-teal-300`
- CTA card: teal gradient
- Section background: `#f0f2f5` (slightly cooler than default)

**Vacunación (orange)**
- Hero gradient: orange institutional
- Follows same bento patterns but with orange accent

**Turismo (amber/dark)**
- Dark mode is appropriate here (the only full-dark section of the site)
- Amber `#f59e0b` as primary accent

---

## Implementation Guidelines

### Typography choices
- Display headings: large, `font-black`, `tracking-tight`, using Poppins weight 900
- Eyebrow labels: `text-[10px] font-black uppercase tracking-[.2em] text-module-color`
- Body: 14px–15px, `font-normal` or `font-semibold`, `text-slate-600`
- Monospace data (folios, codes): `font-mono font-bold`

### Motion
- Prefer CSS animations over JS-heavy solutions for page-level effects
- Use `motion/react` (already installed, v12) for interactive component transitions
- Stagger entrance: wrap grid items in sequential `animation-delay`
- Micro-interactions: `hover:-translate-y-1 hover:shadow-xl transition`

### Backgrounds & texture
- Dot pattern: `background-image: radial-gradient(circle, rgba(255,255,255,.07) 1.5px, transparent 1.5px); background-size: 26px 26px;`
- Noise on dark cards: SVG feTurbulence filter (see esterilización examples)
- Gradient orbs for depth on dark cards: absolute positioned blurred circles with `opacity-[0.15]` or less
- Paw SVG watermarks: already defined, use at `opacity-[0.05]` to `opacity-[0.08]`

### Patterns to avoid
- Full-page dark backgrounds on light-mode pages
- Generic purple/violet gradients (not in brand)
- Inter, Roboto, Arial, Space Grotesk — site uses Poppins
- Cookie-cutter card designs without textural character
- Mixing warm and cool dark backgrounds in the same section

---

## Reference Implementations (already in codebase)

- **Best bento example**: `src/pages/esterilizacion/index.astro` (teal + dark accent cards)
- **Best hero**: `src/features/turismo/components/ProfilePage.tsx` (dark, editorial, premium)
- **Best civic light**: `src/pages/esterilizacion/[folio].astro` (clean, printable comprobante)
- **Best form UX**: `src/features/esterilizacion/components/FormPreregistro.tsx`
- **Footer pattern**: `src/shared/components/Footer.astro` (gray-600 + orange split)
