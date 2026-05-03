# components/ui/

Reusable atoms, decorative effects, the spirit guide companion, and the multiplayer layer. Everything here is `"use client"`. Most files use `m.*` from framer-motion (registered via `LazyMotionProvider` with the `domAnimation` bundle).

The folder breaks down into five categories:

1. **Layout atoms** used by section components (`section-heading`, `reveal`, `marquee`, `image-cycler`).
2. **Mouse-driven wrappers** (`magnetic`, `tilted-card`, `spotlight`).
3. **Text effects** (`shiny-text`, `split-text`, `decrypted-text`).
4. **Globally-mounted decorative effects** (`particle-field`, `flow-field`, `click-spark`, `velocity-tilt`, `scroll-progress`).
5. **Big interactive systems** — the spirit guide, the multiplayer layer, keyboard nav, and the Konami easter egg.

---

## Layout atoms (used inside sections)

### `section-heading.tsx`
Eyebrow + title + description block used at the top of every section. The title gets an animated underline that scales horizontally `scaleX: 0 → 1` once the heading is 40% in view. The animation is wired through an `in-view` class toggled by `useInView`; the actual transform is a CSS `::after` defined in `globals.css` (`from-accent to-cyan`, 2px thick, 1s cubic-bezier ease, 200ms delay).

### `reveal.tsx`
Wraps children in a `whileInView` fade-up + blur. Variant: `opacity 0→1, y 24→0, filter blur(8px)→blur(0)`, `0.8s` cubic-bezier `[0.22, 1, 0.36, 1]`. Stagger via `i` prop (40ms apart). Also exports `StaggerGroup` (container with `staggerChildren: 0.06`) and `StaggerItem`. Returns plain `<div>` if `useReducedMotion()` is true.

### `marquee.tsx`
Pure-CSS infinite horizontal loop. Renders two copies of children (one `aria-hidden`) and animates via `@keyframes marquee` (`translateX(0) → translateX(-50%)`). Default `speed=40s`, `reverse` prop flips direction. Edge fade is a `mask-image` linear gradient on the wrapper. No JS animation — just CSS.

### `image-cycler.tsx`
Auto-rotating image carousel with pause-on-hover, indicator dots, and optional caption. Default interval `2600ms`. Uses `useInView` from `lib/use-in-view.ts` to **stop the interval when the cycler scrolls offscreen** — saves CPU on long pages with multiple cyclers. AnimatePresence with `mode="popLayout"` for smooth swaps; transitions are `0.8s` cubic-bezier blur-in / scale-out.

---

## Mouse-driven wrappers

All three use `useCachedRect` from `lib/use-cached-rect.ts` — caches `getBoundingClientRect()` on `pointerenter`, invalidates on leave/scroll/resize. This avoids forced layout reads on every `pointermove`. They also throttle position updates with a single RAF per event (re-entry is bailed out via a `pending` flag).

### `magnetic.tsx`
Attracts the wrapped child toward the cursor. Translation is normalized: `(dx / r.width) * strength` so attraction stays bounded by element size. Spring stiffness `250`, damping `20`. `strength` prop defaults to `16` px. Used heavily in `hero.tsx` (CTAs and icon links — icon links use `strength={10}`).

### `tilted-card.tsx`
3D rotateX/rotateY on hover (max `2°` by default), optional `1.005` scale, and optional glow box-shadow that fades in over `500ms`. Spring stiffness `120/180`, damping `30`. Sets `transform-style: preserve-3d` on the root.

### `spotlight.tsx`
Radial gradient that follows the mouse within element bounds. Uses `useMotionTemplate` to build the `radial-gradient` string reactively without re-rendering. Default size `420px`, color `hsl(258 90% 66% / 0.18)`. Initial position is `(-9999, -9999)` so the gradient doesn't appear until first move.

---

## Text effects

### `shiny-text.tsx`
Sweeping gradient highlight panning left-to-right. Pure CSS animation driven by `--shiny-speed` custom property (default `4s`). Background size 250%, animates `background-position: 200% → -50%`. Globally disabled by `prefers-reduced-motion`. The hero uses it on the "Madhav." surname.

### `split-text.tsx`
Splits a string into words and animates each as a `<m.span>` with stagger `i * 0.05s`, `0.7s` cubic-bezier curve `[0.22, 1, 0.36, 1]`. Hidden state: `opacity 0, y 24, blur 8px`. Each word gets its own `overflow-hidden` wrapper so blur doesn't bleed into siblings. Reduced-motion returns plain text.

### `decrypted-text.tsx`
"Hacker text" effect: animated character substitution that decrypts random symbols into the target string. Each character has its own randomized start/end frame in a queue, so they decrypt at staggered times. Symbol pool: `"!<>-_\\/[]{}—=+*^?#________"` (line 5). Per-frame 28% chance to re-roll a symbol (creates flicker). Tunable via `speed` (default `35ms`) and `iterations` (default `14`). The hero uses it for the rotating "currently thinking about" subline; the rotation interval is gated on viewport visibility via `useInView` so the scramble loop doesn't burn CPU when the hero is offscreen.

---

## Globally-mounted decorative effects

These are mounted by `components/deferred-effects.tsx`, render `position: fixed` layers, and have no JSX hierarchy. Don't import them from sections.

### `particle-field.tsx`
Background constellation of drifting particles that connect with lines when nearby and repel from the cursor.

- Particle count: `min(60, max(24, floor(W*H/36000)))` — scales with viewport.
- Connection max distance: 150px (O(n²) pair check, ~1770 ops at n=60 — negligible).
- Mouse repulsion radius 170px, push force `0.18`, damping `0.985/frame`, speed cap `0.8`.
- Particle size `0.6–1.8px`. DPR capped at 2.
- **Theme-aware colors**: reads `document.documentElement.dataset.theme` and uses a cached gradient string per theme. A `MutationObserver` on `<html data-theme>` updates the palette without remounting.
- Pauses on `document.hidden`, bails out under `useReducedMotion()`, debounces resize at 120ms.

### `flow-field.tsx`
Parallax particle layer with a cursor-tracking radial glow.

- Particle count: `min(60, floor(W*H/25000))`. Each has a per-particle parallax depth `0.1–0.5`.
- **Cached glow gradient**: a 400×400 `CanvasGradient` is built once on resize (`flow-field.tsx:94-100`); each frame the canvas is just translated to the cursor and the pre-built gradient is drawn. Avoids allocating a fresh gradient per frame.
- Glow stops are violet/cyan with explicit alpha.
- Particles wrap edges (recycle vertically) instead of being reset — no array churn.
- Scroll velocity is read raw, decayed at `0.95/frame`, and applied as a 0.5x parallax multiplier so the field "rushes" on fast scrolls.
- Same lifecycle rules as ParticleField (DPR cap 2, visibility pause, reduced-motion bail).

### `click-spark.tsx`
Burst of ~12 short line segments on every click, decelerating and fading over 28–38 frames.

- Self-pausing RAF: the loop only runs while `particlesRef.current.length > 0`. When the array empties, `rafRef.current = null` and the loop stops. The next click resumes it.
- In-place array compaction (read pointer + write pointer) instead of `.filter()` per frame — zero allocations in the hot path.
- Alpha is encoded as a hex suffix (`alpha * 255 → "ff"`) and concatenated to the color hex string instead of allocating an `rgba()` string.
- `lineCap: "round"` for soft endpoints. Default color `#a78bfa`, lineWidth `1.4`.

### `velocity-tilt.tsx`
Invisible. Watches `window.scrollY` velocity (RAF-throttled), and when `|dy/dt| > 2200 px/s` (default), sets `data-fast-scroll="true"` on `<html>` for 180ms. CSS rules in `globals.css` (`html[data-fast-scroll="true"] main { transform: skewY(-0.35deg); transition: 500ms; }`) read this attribute to skew the page during fast scrolls and decelerate smoothly.

If you want any other element to react to fast scrolls, add a CSS rule keyed off the same attribute. **Don't add a parallel scroll listener.**

### `scroll-progress.tsx`
Fixed top progress bar (mounted **eagerly** by `app/layout.tsx`, not deferred — the framer-motion runtime is already loaded for the hero entrance, and a no-op until first scroll). Uses `useScroll()` + `useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.2 })` and applies `scaleX` to a 2px gradient bar (`from-violet-700 via-violet-500 to-cyan-600`).

---

## The spirit guide (`spirit-guide.tsx`, ~1880 lines)

The most distinctive thing in this codebase. A glowing companion orb that floats around the viewport, reacts to cursor + scroll + clicks, expresses emotions through color and faces, talks via a speech bubble, and runs a behavior tree of physics-driven movement. All in a single self-contained file with no public API beyond reading `data-spirit*` attributes from the page.

### What the visitor sees

A small (~40–60px) glowing orb fades in shortly after page load. After ~2.2s it auto-runs an "intro tour" — drifts toward whatever has `data-spirit-first` (or falls back to `[data-spirit="stats"]`) to hint at the interactive feature. From then on it reacts to the cursor: orbiting when nearby, escorting when the cursor moves, drifting when idle, getting startled by fast scrolls, and occasionally spontaneously performing tricks (bounce, wiggle, spin, hop, nuzzle). On idle, it can spawn a "grand tour" that visits up to 10 visible `[data-spirit]` elements in DOM order, ramps up "presence" at each one, and finishes with a sparkle burst.

### Emotion model

Seven emotions, each a `(hue, sat, light, intensity)` tuple driven into `--spirit-hue`, `--spirit-sat`, `--spirit-light`, `--spirit-intensity` CSS variables on the orb element:

| Emotion | Hue | Trigger |
|---|---|---|
| `calm` | 185 (cyan) | Default resting state |
| `happy` | 48 (gold) | Cursor approaching / moving with orb |
| `curious` | 280 (purple) | Exploring page elements |
| `sad` | 225 (blue) | No cursor activity for 3–8s |
| `excited` | 320 (magenta) | Arriving at a guide target |
| `startled` | 55 (white-yellow) | Fast scroll (`dy > 40px`) |
| `content` | 32 (peach) | Satisfied transition state |

Transitions are smoothed: `startled` jumps at 15%/frame for snappiness; everything else lerps at 4%/frame. The CSS halo gradient layers all three variables for a layered, breathing glow.

### Behavior state machine

Six modes, each with its own timeout and exit condition:

1. **`companion`** — slow lazy circle around the cursor, calm emotion.
2. **`drifter`** — random Perlin-noise wandering near the cursor; fallback when nothing else is happening.
3. **`explorer`** — picks a single visible `[data-spirit]`, approaches, holds, leaves. Three phases.
4. **`grand_tour`** — sequences through up to 10 visible items (sorted with `[data-spirit-first]` first, then DOM order, skipping anything within 120/100px of the viewport edges). Five phases per stop: approach → hold → fade → wait → homing back to the cursor. Triggered after ≥4.5s of idle, with ≥2 visible items, with a 4s cooldown. Sets `data-spirit-touched="true"` on each element as it arrives so CSS can intensify the halo.
5. **`escort`** — dances around the cursor in a rotating orbit when the cursor moves. Drops back to `companion` after 400ms of cursor inactivity.
6. **`startled`** — short impulse-driven escape on fast scroll. Random direction kick, lasts 800ms.

### Physics

Spring stiffness `0.0018`, damping `0.025`, velocity decay `0.965`. Tangential pull adds curved-path follow-through in companion/drifter modes. Squash/stretch is velocity-driven and lerped over ~12 frames for a Pixar-y feel. A seeded 3D Perlin-noise class (~lines 31–98) drives organic drift paths.

### Performance choices

- **Cached `DOMRect`s** in a `WeakMap` with a generation counter — invalidated only on scroll/resize, not every frame.
- RAF with `dt` clamped at 50ms (handles tab-switch glitches).
- Bails out completely under `useReducedMotion()`.
- Pauses on `visibilitychange` and clears all `data-spirit-touched` flags on resume.
- Passive scroll/resize listeners.

### Easter eggs

- **Cursor circle detection** — drawing a circle with the mouse triggers a `revolve` trick (orb spirals inward 1.5 rotations, squash-stretches in response).
- **Cursor shake** — rapid jitter triggers a `shake` trick (orb vibrates like a confused pet).
- **Spontaneous idle tricks** every 6+ seconds: `bounce`, `wiggle`, `spin`, `hop`, or `nuzzle`. Each has a 3s individual cooldown.
- **Lonely message** after ~4.5s of cursor inactivity ("I miss you!" variants with sleepy face).
- **Playful approach reactions** — 3% chance per frame when escorting + cursor approaching; shows speech bubble with affectionate text and "love" face.

### Public API for new sections

Add `data-spirit` to anything you want the orb to notice:

```tsx
<button data-spirit="button">…</button>
<a data-spirit="inline" href="…">…</a>
<div data-spirit data-spirit-first>primary CTA</div>
<div data-spirit="stats">stats grid</div>
```

The orb scans on every animation frame during a tour and every ~5s during idle. **No JS wiring is needed** — just the attribute. Glow styling for each variant is in `globals.css` (lines ~588–612).

If your element sits within 120px of the viewport top or 100px of the bottom, the grand tour will skip it as "in the safe zone." Adjust your section's padding if you want it picked up.

### Don't do

- Don't fight the orb — don't add your own `data-spirit-touched` toggling, the spirit guide owns that flag.
- Don't add a parallel "follow cursor" effect; the spirit already animates from the same cursor stream.
- Don't import the spirit guide directly into a section. It's globally mounted via `DeferredEffects`.

---

## The multiplayer layer (`multiplayer.tsx`, ~525 lines)

Live cursors and emoji reactions over Ably + `@ably/spaces`. Mounted by `DeferredEffects`. Disabled when:

- `process.env.NEXT_PUBLIC_MULTIPLAYER_ENABLED !== "1"`, or
- The device is touch-only (`window.matchMedia("(pointer: coarse)").matches`).

### Architecture

```
<AblyProvider client={Realtime}>
  <ChannelProvider channelName="portfolio-reactions">
    <SpacesProvider client={Spaces}>
      <SpaceProvider name="portfolio-home">
        <SpaceEnter />        ← joins the space with {name, color}
        <CursorLayer />        ← publishes own cursor, renders others
        <ReactionsLayer />     ← keys 1–9 spawn floating reactions
        <PresenceHint />       ← "N others here" pill, dismissable
```

### Auth flow

The browser **never sees `ABLY_API_KEY`**. The `Realtime` client is configured with `authUrl: "/api/ably/token"` which mints a short-lived token request on the server (`app/api/ably/token/route.ts`).

`clientId` is generated once per browser via `getOrCreateClientId()` and persisted to `localStorage["ably-client-id"]`. `echoMessages: false` so the local user doesn't see their own cursor.

### Identity

`getOrCreateIdentity()` (in `lib/cursor-identity.ts`) generates `{name, color}` on first load and persists it to `localStorage`. Visitors get a stable color across sessions. The space-enter call (`SpaceEnter`) passes these as `profileData` so other peers can read them via `useMembers()`.

### Cursor publishing

Cursors are published in **page coordinates** (`pageX`/`pageY`), not viewport coordinates. The `CursorLayer` and `ReactionsLayer` wrappers each get a ref from `useScrollCompensateRef`, which applies `translate3d(0, -scrollY, 0)` imperatively via RAF on every scroll — **zero React re-renders during scroll**, no matter how many remote cursors are visible.

Publishing logic (`multiplayer.tsx:161-231`):

- One RAF per `pointermove` event (re-entry bailed by an `if (!raf)` flag).
- On `scroll`, re-broadcasts the last known position with `scrollX/scrollY` added — without this, remotes see a teleport jump on the next pointermove (since `pageY = clientY + scrollY` and `pageY` changes during scroll even when the mouse hasn't moved).
- On `pointerleave`, publishes a sentinel position `(-10000, -10000)` to remove the cursor on remotes.
- `space.cursors.set()` returns a Promise that rejects with `ERR_NOT_ENTERED_SPACE` during reconnects/tab-switches; the `safeSet` wrapper swallows those rejections.

### Cursor rendering

The list of remote cursors is projected to primitives `{ id, x, y, color }` and memoized; the `<Cursor>` component is wrapped in `React.memo` so only entries whose primitives changed actually re-render. The cursor SVG has a small drop-shadow that uses the member's color.

Member presence is mapped `clientId → color` in a separate `useMemo` keyed on `others`, so it only recomputes on join/leave (not every cursor update).

### Reactions

Keyboard `1`–`9` (digits only — `e.key.length !== 1 || e.key < "1" || e.key > "9"` filters out arrows/letters which would `Number("ArrowUp") === NaN` and slip past length checks). The cursor's most recent `pageX/pageY` is the spawn point.

Reactions are published on the `"portfolio-reactions"` channel (event name `"reaction"`) and spawn locally + on remotes. Each reaction floats up 130px, drifts ±20px horizontally, rotates ±15°, fades in then out over 2.2s (opacity timeline `[0, 1, 1, 0]` at times `[0, 0.15, 0.7, 1]`), then is removed via `setTimeout`.

The reaction images live in `/public/reactions/` (`.png` and `.webp`). They're preloaded on mount via a hidden `new Image().src = …` loop — without this, the first key press has a flash of empty space while the browser fetches the asset.

Suppressed when typing in inputs/textareas (`tagName === "INPUT" || "TEXTAREA" || isContentEditable`) and when modifier keys (cmd/ctrl/alt) are held.

The `useChannel` callback is wrapped in `useCallback` — without that, every render hands `useChannel` a new function reference and triggers a re-subscribe.

### Presence hint

A bottom-right pill that shows when `others.length > 0`, lists the reaction emojis as a hint, and is dismissable. Auto-dismisses after 8s, persists dismissal in `sessionStorage["multiplayer-hint-dismissed"]` so it doesn't reappear during the visit.

### Adding a new reaction

1. Drop `.png` and `.webp` files into `/public/reactions/`.
2. Add an entry to `REACTIONS` in `lib/reaction-icons.tsx`.
3. The preload loop and 1–9 keyboard mapping pick it up automatically (max 9 — keys are digits).

### Don't do

- Don't instantiate Ably with the raw `ABLY_API_KEY` on the client; always use `authUrl: "/api/ably/token"`.
- Don't subscribe to scroll in React state to position cursors — reuse `useScrollCompensateRef`.
- Don't pass object props to `<Cursor>` or `<FloatingReactionView>`; that breaks the `React.memo` and causes cascade re-renders on every cursor update.
- Don't change cursors to viewport coordinates without removing the scroll-compensation wrapper.

---

## Keyboard nav (`keyboard-nav.tsx`)

Two-key shortcuts: `g` then one of `h/a/w/p/s/c` (home/about/work/projects/stack/contact). 1s timeout if the second key isn't pressed. `?` opens a help modal listing all shortcuts; `Escape` closes it. Suppressed in inputs/textareas. Each successful navigation flashes a toast with the shortcut label and updates `activeSection` + `timeOfLastClick` so the nav highlight syncs.

The pending-key indicator is a small bottom-center pill that shows the first key while waiting for the second.

---

## Konami easter egg (`konami.tsx`)

Sequence: `↑↑↓↓←→←→ b a`. On match: rainbow inset glow + center-screen modal with one of 5 randomized achievement messages + 12 floating emojis (🎮⭐🚀✨🎯💫) drifting upward over 2–4s. Adds `konami-active` class to `document.body` for CSS hooks. Auto-dismisses after 4s.

The match is checked by sliding a 10-key window: `[...sequence, e.key].slice(-10)` and comparing to the constant.

---

## Conventions for new effects

- `"use client"` and `default export` so `next/dynamic` can pick them up.
- Use `m.*` from framer-motion (not `motion.*`).
- Bail out under `useReducedMotion()` — return `null` for canvas effects, return plain text for text effects.
- Pause RAF on `document.visibilitychange` (`document.hidden`).
- All scroll/touch/pointer listeners get `{ passive: true }`.
- For canvas: cap DPR at 2, debounce resize at ~120ms.
- Cache anything expensive (gradients, rects, member colors) outside the hot path.
- For cursor-tracking, use `useCachedRect` from `lib/use-cached-rect.ts`.
- Cancel RAF and remove all listeners in cleanup.
- If the effect is decorative and not needed at first paint, mount it from `components/deferred-effects.tsx`, not `app/layout.tsx`.
