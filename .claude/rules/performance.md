---
paths:
  - "app/layout.tsx"
  - "components/deferred-effects.tsx"
  - "components/backdrop.tsx"
  - "components/ui/**"
---

# Performance rules

The site is tuned aggressively for LCP and TTI. Most of the rules below exist to keep that tuning intact.

- `app/layout.tsx` mounts the smallest possible eager shell. NEVER add a new globally-mounted client effect there. Add it to `components/deferred-effects.tsx` instead, where it's dynamically imported (`ssr: false`) and gated on `requestIdleCallback`.
- The two effects mounted eagerly in layout (`Backdrop`, `ScrollProgress`) are intentional. Don't add more.
- For decorative scroll-driven transforms (parallax, etc.), prefer imperative RAF + `transform: translate3d(...)` over React state. See `components/backdrop.tsx` for the pattern.
- Heavy imports (Lenis, Ably, react-hot-toast, framer-motion features) should be loaded via `next/dynamic` with `ssr: false`, not statically imported into the critical path.
- LCP-critical text (hero headline, about lede) renders without entrance animations so it can serve as the LCP element. Don't wrap them in `whileInView` reveals.
- Google fonts (Inter, Space Grotesk, JetBrains Mono) load only the weight subsets that the design uses — don't pull in additional weights without a real need; each weight is a separate woff2.
- `app/page.tsx` uses `export const dynamic = "force-static"`. Don't introduce request-time data dependencies that would force it dynamic.
- Subscribe to `scroll` and `pointermove` listeners with `{ passive: true }`.
- Cancel RAF and remove listeners in cleanup. Pause loops on `document.visibilitychange` (`document.hidden`).
