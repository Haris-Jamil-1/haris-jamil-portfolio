# Haris Jamil — Portfolio

> Smart Solutions Built for Your Success
> Your Vision. My Technology. Unlimited Possibilities.

A single-page, modern portfolio for **Haris Jamil** — BSCS student at the University of Central Punjab, Pakistan.

## Tech
- Pure HTML + CSS + JavaScript, no build tools, split into `css/style.css` and `js/*.js`
- [Three.js](https://threejs.org/) — animated 3D background (lazy-loaded, see below)
- Custom canvas — floating code symbols
- Vanilla `IntersectionObserver` — scroll reveals & counters (GSAP/ScrollTrigger removed, see below)
- Glassmorphism UI, neon glow, Orbitron + Inter fonts

## Run locally
Just open `index.html` in a browser (or serve the folder — `js/main.js` dynamically injects other `<script>` tags, which some browsers restrict under `file://`).

## File layout
```
index.html          markup only
css/style.css        all styles, incl. mobile/reduced-motion overrides
js/main.js           nav, mobile menu, typing effect, service cards,
                      scroll reveals, counters, and the loader that
                      injects the optional scripts below
js/cursor.js          custom cursor + 3D card tilt — desktop pointer only
js/bg-scene.js        Three.js particle/wireframe background
js/code-canvas.js     floating code-symbol canvas
```

## Mobile performance — what changed and why

The original single-file version ran GSAP+ScrollTrigger, a custom
`requestAnimationFrame` cursor loop, a Three.js particle scene, and
~15 `backdrop-filter: blur()` elements unconditionally on every device,
which was janky on mid/low-end phones. Changes:

1. **Mobile/touch detection** (`index.html`, inline `window.__FLAGS`):
   `matchMedia('(hover: none) and (pointer: coarse)')` OR
   `(max-width: 768px)` — catches touch laptops/tablets too, not just
   narrow viewports.
2. **Custom cursor** (`js/cursor.js`) is only ever loaded on desktop
   pointer devices with motion allowed; it's skipped (never
   downloaded, never started) on touch or `prefers-reduced-motion`.
3. **Canvas particle/draw loops** (`js/bg-scene.js`, `js/code-canvas.js`):
   ~70% fewer particles on mobile (270 vs 900), symbol count reduced
   similarly, frame rate capped to 24fps on mobile, and both are
   paused via `IntersectionObserver` + `visibilitychange` when
   off-screen or the tab is hidden.
4. **`.portrait-ring` spin** and the reverse-spin portrait image are
   disabled on mobile/touch (`css/style.css`) — kept as a static
   gradient ring instead of a continuously-rotating one.
5. **`backdrop-filter: blur()`** is reduced or removed on mobile/touch
   across nav, cards, badges, and footer — it's one of the most
   expensive properties on mobile GPUs.
6. **`prefers-reduced-motion: reduce`** gets a blanket CSS override
   (`* { animation-duration: .001ms !important; ... }`) that collapses
   every keyframe/transition at once, plus JS checks that skip the
   typing effect, scroll reveals, hero entrance, counters, and the
   Three.js/canvas render loops.
7. **`will-change`** is no longer set permanently on `.card`; it's
   toggled on right before a reveal/tilt/entrance animation runs and
   cleared on `transitionend`/`animationend`.
8. **GSAP + ScrollTrigger were removed entirely** (~120KB, plus
   ScrollTrigger's scroll listeners) in favor of a small
   `IntersectionObserver`-based reveal/counter implementation in
   `js/main.js` — same visual effect, less payload and no scroll-linked
   recalculation on either mobile or desktop.
9. **Script loading**: Three.js loads with `defer`; `cursor.js`,
   `bg-scene.js`, and `code-canvas.js` are injected dynamically after
   `window.load` (cursor.js) or on `load` (the two canvases) so none
   of them block first paint / LCP.
10. **Layout audit at 320/375/768px**: the hero portrait's floating
    tech badges (`.fb1`–`.fb4`) used negative `left`/`right` offsets
    sized off the portrait column, which pushed `fb2`/`fb4` past the
    viewport edge on narrow phones — clamped to the column edge under
    480px. `.edu-card` padding was also tightened at that width.

Desktop visuals/behavior are unchanged — every optimization above is
gated behind the mobile/touch or reduced-motion checks.

## Services
Software Development · Web Development · Android Apps · Flutter Apps · AI Systems · Machine Learning · UI/UX · APIs & Cloud

## Contact
- WhatsApp: +92 344 0766838
- LinkedIn: https://www.linkedin.com/in/haris-jamil-20710b309
