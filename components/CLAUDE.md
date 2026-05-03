# components/

All components are React. Almost all are `"use client"` — sections need scroll hooks, the providers wrap browser-only effects, and the entire `ui/` layer is interactive. The only files that aren't client are `app/page.tsx` and `app/layout.tsx`.

This folder is split three ways:

1. **Page sections** — one per fold of the home page. They consume static content from `lib/data.ts` and participate in active-nav highlighting via `useSectionInView`.
2. **Providers / shells** — small client wrappers that own a single concern (smooth scroll, lazy motion, deferred mount, parallax backdrop, top nav, footer).
3. **`ui/` atoms and effects** — see `ui/CLAUDE.md`.

---

## The performance philosophy

The site is a static-prerendered Next.js page (`force-static` on `app/page.tsx`) with an aggressively-deferred decoration layer. The pattern is:

- `app/layout.tsx` mounts the smallest possible eager shell: `Backdrop`, `ScrollProgress`, `Nav`, `Footer`, `LazyMotionProvider`, and `ActiveSectionContextProvider`.
- `components/deferred-effects.tsx` waits for `requestIdleCallback` (or 800ms `setTimeout` fallback) and then mounts everything heavy: Lenis smooth scroll, two canvas backgrounds, click sparks, the spirit-guide companion orb, keyboard nav, the Konami easter egg, the Ably multiplayer layer, and the toaster.
- The first ~800ms of scrolling uses native browser scroll, then Lenis seamlessly takes over.
- Entrance animations on LCP-critical text (hero headline, lede) are deliberately omitted so those paragraphs can serve as the LCP element. The original animated entrance was costing ~1300ms on LCP audits.

**The single most important rule in this folder:** if you're adding a new globally-mounted effect (canvas, listener that watches `window`, smooth-scroll layer, multiplayer-style overlay), it goes in `deferred-effects.tsx`, *not* `app/layout.tsx`.

---

## Page sections (rendered by `app/page.tsx` in this order)

| File | Section name | Active-section threshold | Notable details |
|---|---|---|---|
| `hero.tsx` | `"Me"` | 0.2 | LCP fold. Status pill ("AI Engineer @ VerbaFlo"), animated `SplitText` name, `ShinyText` surname, plain-text lede (no entrance — LCP), `DecryptedText` rotating subline that gates its 2.8s interval on viewport visibility, three magnetic CTAs (`<Magnetic>` wrappers), `IconLink` row, `profile.stats` grid, scroll indicator. Marks the primary CTA with `data-spirit-first` so the spirit guide intro-tour targets it. |
| `about.tsx` | `"About"` | 0.5 | Bio + capability grid driven by `profile.extendedBio` and `profile.capabilities` from `lib/data.ts`. Marks key paragraphs with `data-spirit`. |
| `experience.tsx` | `"Work"` | 0.5 | Timeline of `experience` entries. Inline links use `data-spirit="inline"` for the spirit's text-style hover effect. |
| `projects.tsx` | `"Projects"` | 0.4 | Largest section file (~476 lines). Project cards from `projects` array. Color-coded via `accentMap` in `lib/cn.ts` — must be one of the 6 `AccentColor` values. Each card carries `data-spirit`. |
| `stack.tsx` | `"Stack"` | 0.5 | Tech stack grid from `stack` array. Category groupings (each with `data-spirit`). |
| `contact.tsx` | `"Contact"` | 0.3 | Two-column: info card + form. Form posts `FormData` to `/api/contact`. **Lazy-imports** `react-hot-toast` only on first interaction (`async function showToast` in `contact.tsx:13-16`) — keeps the toast lib out of the critical bundle. |

`vf-internal.tsx` renders the VerbaFlo internal-tools showcase strip (Conversation Simulation, MCP debugger, Tracing UI) using the `vfInternal` array in `lib/data.ts`. It's mounted from inside one of the sections, not directly by `app/page.tsx`.

`footer.tsx` carries the version display and back-link.

### Adding a new section

1. Add a `nav` entry in `lib/data.ts` (keep the `as const` annotation — `SectionName` is derived from it).
2. Create `components/{name}.tsx` with `"use client"`, call `useSectionInView("Name", threshold)`, attach the returned `ref` to a `<section id="name-lowercased">`.
3. Pull all content from `lib/data.ts`. No inline copy.
4. Use `m.*` from `framer-motion` (never `motion.*` — only `domAnimation` is loaded).
5. For animated-on-scroll content, use `whileInView={{ once: true }}` with `viewport={{ once: true, amount: 0.3 }}`.
6. Mark interactive elements with `data-spirit` so the spirit guide can react to them (see `ui/CLAUDE.md`).
7. Render the new component in `app/page.tsx`.

---

## Providers / shells

### `lazy-motion-provider.tsx`

Wraps the app in framer-motion's `LazyMotion` with the `domAnimation` feature bundle (not `domMax`). This roughly halves the framer-motion runtime by stripping out exit animations on layout, drag, and other features the site doesn't use.

**Consequence**: components must use `m.div` etc., not `motion.div`. Using `motion.*` will warn at runtime and animations won't apply.

### `lenis-provider.tsx`

Owns the Lenis smooth-scroll loop. Mounted by `DeferredEffects`, so the ~10KB Lenis JS doesn't sit in the critical bundle.

Key behaviors (`lenis-provider.tsx:18-103`):

- Lenis options: `duration: 1.15`, easing curve `t => min(1, 1.001 - 2^(-10t))`, `smoothWheel: true`, `touchMultiplier: 1.4`.
- Exposes the instance on `window.__lenis` for other components (spirit interruptions, debugging).
- Pauses its RAF loop on `visibilitychange` (`document.hidden`) — saves a 60fps tick that does nothing useful in the background.
- **Capture-phase** click interceptor on `document` for in-page anchors (`href^="#"`). Calls `preventDefault` + `lenis.scrollTo(el, { offset: -80, duration: 1.2 })`. Registered with `capture: true` so it runs *before* React's synthetic handlers but does NOT `stopPropagation` — so React `onClick` handlers (`setActiveSection`) still fire.
- 80px scroll offset accounts for the fixed nav.
- On mount, if `window.location.hash` is non-empty, schedules a `lenis.scrollTo(el, { immediate: true })` after first paint — handles deep links.
- Cleanup tears down the RAF, listener, instance, and clears `window.__lenis`.

### `backdrop.tsx`

Fixed full-viewport aurora layer mounted eagerly in `app/layout.tsx` (one of only two eager visual effects, alongside `ScrollProgress`).

What it does:

- 8 blurred radial-gradient "blobs" at varying scroll-depths (`top: -40, 20vh, 85vh, 170vh, …, 520vh`), each animated with its own pure-CSS `@keyframes` (blob-a through blob-h, 20–34s cycles) — moves the breathing animations onto the GPU compositor instead of framer-motion's JS runtime.
- The container's vertical translate is driven imperatively (`backdrop.tsx:25-66`): a single ref-RAF lerps `current → target` (`current += (target - current) * 0.1`), updates `el.style.transform = translate3d(0, -current, 0)`, and **self-suspends** when scroll settles (`Math.abs(target - current) < 0.5`). Zero React state.
- Pauses entirely on `visibilitychange`.
- Bails out completely when `useReducedMotion()` is true.
- Final layer is a noise texture at 2% opacity for grain.

If you want a new background element to scroll-with-content, add it inside `containerRef`'s div. The lerp pattern handles parallax for free.

### `nav.tsx`

Fixed top nav. Reads `activeSection` from context and renders a `<m.span layoutId="nav-pill">` so the active pill animates between links via framer-motion's shared layout. Sets `setTimeOfLastClick(Date.now())` on every click so `useSectionInView` knows to ignore the next 1s of scroll updates.

Includes an `<svg>` with a `<filter id="liquid-glass">` (fractal noise + displacement map) — referenced by the `nav-glass` CSS class in `globals.css` for a subtle glass distortion. Backdrop blur ramps from 2px to 4px when `scrollY > 40`.

Distinguishes between "page" entries (e.g. About, marked `isPage: true` in `nav`) and section anchors. Pages activate based on `usePathname()`; sections activate based on `activeSection` from context — but only when `pathname === "/"`.

### `deferred-effects.tsx`

The orchestration point for everything heavy. Already covered above. The exact mount order in the rendered fragment is:

```
{!isMobile && (
  <LenisProvider />     ← takes over native scroll
  <FlowField />         ← canvas: parallax particles + cursor glow
  <ParticleField />     ← canvas: particle network with O(n²) connections
  <VelocityTilt />      ← invisible; sets data-fast-scroll on <html>
  <ClickSpark />        ← canvas: burst on every click
  <SpiritGuide />       ← the companion orb
  <KeyboardNav />       ← g-prefix shortcuts + ? help modal
  <Konami />            ← ↑↑↓↓←→←→BA easter egg
  <Multiplayer />       ← Ably cursors + reactions
)}
<ChatWidget />          ← floating "Ask about Keshav" chat (always on)
<Toaster />             ← react-hot-toast (always on, lazy-imported)
```

Each is `dynamic(..., { ssr: false })` so it gets its own JS chunk. Order matters only for z-index stacking; the multiplayer layer uses `z-[80]/[81]/[82]` to sit on top.

`isMobile` comes from `useIsMobile()` in `lib/use-is-mobile.ts` — true on `(pointer: coarse)` devices (phones, most tablets). On those devices the entire decoration layer is skipped: the chunks are never even fetched. **Only the chat widget and the toaster mount on phones**. Rationale:

- Cursor-driven effects (spirit guide, particle/flow field cursor glow, click sparks, multiplayer cursors) have nothing to track on a touch device.
- Keyboard-driven effects (keyboard nav, Konami, multiplayer reactions) are unreachable.
- Lenis smooth-scroll and the fixed-position canvases burn battery and main-thread time on phones for marginal visual gain — native scroll is smoother on iOS WebKit anyway.
- `Backdrop` (eager) drops down to 4 of its 8 blobs and uses smaller blur radii on `< sm` viewports via Tailwind classes.

If you add a new always-on functional widget (e.g. a future feedback prompt), put it outside the `!isMobile` block. Anything decorative goes inside.

### `submit-btn.tsx`

Tiny pending-state button used by the contact form. Marked `data-spirit="button"`.

---

## The `data-spirit` attribute system

Sections all over this folder mark interactive elements with `data-spirit*` attributes. This is the public API for the spirit guide (`ui/spirit-guide.tsx`):

- `data-spirit` — generic interactive element. The orb can target it during exploration / grand tour. Hover gets a halo glow via `globals.css`.
- `data-spirit="button"` — CTA-style; smaller ring, subtler glow.
- `data-spirit="inline"` — inline text link; color lift + text-shadow on hover (used in `experience.tsx:68`).
- `data-spirit="stats"` — special; fallback target for the page-load intro tour if no `[data-spirit-first]` exists.
- `data-spirit-first` — attribute (no value); prioritized as the first stop on grand tour and as the intro-guidance target on page load. Currently set on the primary "About me" CTA in the hero.
- `data-spirit-touched="true"` — set/cleared by the spirit guide itself when the orb arrives at an element. Don't touch it manually; CSS rules on this selector intensify the glow.

If you add a new clickable card/button/link and want the spirit to react to it, just add `data-spirit` (or one of the variants). The orb picks it up on its next scan (~every frame during tour, every 5s during idle).

See `ui/CLAUDE.md` for the full spirit-guide behavior tree.

---

## Conventions enforced across this folder

- `"use client"` at the top of every component file (the section/provider/UI files all need browser APIs).
- `m.*` for animated elements, never `motion.*`.
- `useSectionInView("Name", threshold)` for sections; the returned ref goes on the outermost `<section id="...">`.
- `whileInView` with `viewport={{ once: true }}` for scroll-triggered animations — never replay-on-scroll-back.
- Fetch-on-demand for any non-critical lib (`react-hot-toast`, etc.) using `await import(...)` inside the handler that needs it.
- Static images come from `lib/data.ts` (which imports them from `/public`) so Next can fingerprint them. Don't pass string paths to `next/image`.
- Pull copy from `lib/data.ts`; never hardcode prose into a component.
