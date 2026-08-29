# Haris Jamil — Portfolio

> Full-Stack Developer & AI/ML Researcher — Lahore, Pakistan

A single-page portfolio for **Haris Jamil**, built around a spec-sheet motif
(mono key/value rows) that ties his dual identity — production engineer and
applied ML researcher — into one consistent visual language.

## Tech
- Pure HTML + CSS + JavaScript, no build tools, split into `css/style.css` and `js/*.js`
- [Three.js](https://threejs.org/) — a small particle/wireframe scene, scoped to the hero section only (lazy-loaded, desktop only, see below)
- Vanilla `IntersectionObserver` — scroll reveals
- Fraunces (serif, headings) + Inter (body) + IBM Plex Mono (spec-sheet labels/utility), dark theme, single amber accent

## Run locally
Serve the folder over HTTP (`python3 -m http.server`, etc.) rather than opening
`index.html` directly — `js/main.js` dynamically injects `js/bg-scene.js`,
which some browsers restrict under `file://`.

## File layout
```
index.html          markup only
css/style.css        all styles, incl. mobile/reduced-motion overrides
js/main.js           nav, mobile menu, work/research row injection,
                      scroll reveals, and the hero 3D-scene loader
js/bg-scene.js        Three.js particle/wireframe scene, scoped to #hero,
                      desktop + motion-allowed only
images/projects/*     screenshots used on the Work cards
```

## Performance & accessibility
1. **Mobile/touch detection** (`index.html`, inline `window.__FLAGS`):
   `matchMedia('(hover: none) and (pointer: coarse)')` OR
   `(max-width: 768px)` — catches touch laptops/tablets too, not just
   narrow viewports.
2. **The hero's Three.js scene** (`js/bg-scene.js`) is skipped entirely on
   mobile/touch and for `prefers-reduced-motion` — those get the static CSS
   gradient wash instead of a WebGL canvas — and is scoped to `#hero` (not a
   fixed full-page canvas), so it never competes with body-copy legibility
   elsewhere on the page. It's deferred until `window.load` so it never
   competes with first paint / LCP, and is paused via `IntersectionObserver`
   + `visibilitychange` once the hero scrolls out of view.
3. **`prefers-reduced-motion: reduce`** gets a blanket CSS override
   (`* { animation-duration: .001ms !important; ... }`) that collapses
   every keyframe/transition at once, plus a JS check that skips loading
   the Three.js scene entirely.
4. **`will-change`** is only ever set right before a reveal/entrance
   animation runs and cleared on `transitionend`/`animationend`.
5. **`backdrop-filter`** is used in exactly one place (the scrolled nav
   bar); the mobile nav panel uses a solid background instead — see the
   note in `css/style.css` about a Chromium rendering bug where
   `backdrop-filter` on a transitioning `position:fixed` panel can fail to
   composite its background correctly.
6. Project screenshots in `images/projects/` are pre-resized (~1400px wide)
   and compressed rather than served at full screenshot resolution.
7. Visible `:focus-visible` outlines throughout; no custom cursor or
   scroll-linked effects that would fight reduced-motion/mobile users.

## Contact
- Email: harisjamilpk@gmail.com
- LinkedIn: https://www.linkedin.com/in/haris-jamil-20710b309
