# Portfolio Design Concepts

Five standalone, **dependency-free**, **framework-ready** design-concept prototypes for the
Shubham Sharma portfolio. Each is a single self-contained HTML file (inline CSS + vanilla JS,
no build step, no external CDNs) that can be lifted into Next.js/React, SvelteKit, or Astro
with Tailwind CSS or CSS Modules.

Open the **launch pad** at [`index.html`](./index.html) to browse them all.

## The five archetypes

| # | File | Archetype | Vibe |
|---|------|-----------|------|
| A | [`concept-a-brutalist.html`](./concept-a-brutalist.html) | Neo-Brutalist Cyber-Minimalism | Stark, intentional, ultra-high performance |
| B | [`concept-b-spatial.html`](./concept-b-spatial.html) | Canvas-Driven Spatial UI | Immersive, experiential, high-tech depth |
| C | [`concept-c-liquid.html`](./concept-c-liquid.html) | Liquid Generative & Kinetic UI | Fluid, alive, organic technology |
| D | [`concept-d-hud.html`](./concept-d-hud.html) | High-Density HUD & CLI | Power-user terminal, sci-fi dashboard |
| E | [`concept-e-bento.html`](./concept-e-bento.html) | Modular Bento Grid (Clean-Tech) | Perfectly organized, premium, architectural |

### A — Neo-Brutalist Cyber-Minimalism
Raw layouts, oversized industrial typography, hard-edged borders, zero gradients. Hover states
use inverse color blocks that shift abruptly. High-contrast paper/ink palette.

### B — Canvas-Driven Spatial UI
Dark sci-fi aesthetic with a persistent node/vector field (Canvas 2D) that repels around the
cursor. Headings "decrypt" with a glyph-scramble on hover/focus. Three.js-ready structure.

### C — Liquid Generative & Kinetic UI
Soft morphing glassmorphism plates over a generative, cursor-reactive gradient ripple.
Spring-physics easing pulls cards toward the pointer. Biological neon accents.

### D — High-Density HUD & CLI
Heads-up display with telemetry overlays and small data grids. A **functional** floating terminal
accepts `/help`, `/about`, `/work`, `/skills`, `/contact`, `/theme`, `/whoami`, `/clear`.
Components animate in via a boot sequence.

### E — Modular Bento Grid (Clean-Tech)
Cohesive frosted-glass card matrix (matte darks, muted emerald, zinc whites). Cards expand
inline into micro-dashboards; spans reshuffle on viewport resize.

## Guardrails satisfied

- **Performance budget** — No external libraries or web-font downloads; all animation is
  `requestAnimationFrame` with capped device-pixel-ratio. Mobile keeps particle/node counts low.
- **Framework agility** — Plain semantic HTML + scoped CSS variables; class names are
  utility-friendly so they port cleanly to Tailwind/CSS Modules in React/Svelte/Astro.
- **Accessibility** — High-contrast text, full keyboard navigability (visible focus rings,
  `Enter`/`Space` activation on interactive cards, labelled terminal input), and a
  `prefers-reduced-motion` fallback that disables heavy animation and shows static backgrounds.

## Wiring into the main site

The main `Portfolio/index.html` includes a bottom **"Concepts"** dock (see `ConceptSwitcher` in
`Portfolio/app.js`) that links to each prototype. To add or rename a concept, update the
`concepts` array in `ConceptSwitcher.build()`.
