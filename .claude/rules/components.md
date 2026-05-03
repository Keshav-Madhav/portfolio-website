---
paths:
  - "components/**"
  - "app/**/*.tsx"
---

# Component rules

- All interactive components MUST start with `"use client"`. Section components and anything using hooks, refs, framer-motion, or browser APIs is interactive.
- Use `m.*` from `framer-motion` — NEVER `motion.*`. Only `domAnimation` is loaded via `LazyMotionProvider`; `motion.*` will warn or fail.
- For entrance animations on scroll, use `whileInView` with `viewport={{ once: true }}` so they don't replay on scroll-back.
- Section components MUST call `useSectionInView("SectionName", threshold)` from `lib/hooks.ts` and attach the returned `ref` to the outer `<section>` with a matching `id`. Without this, the nav highlight won't track the section.
- Section content MUST come from `lib/data.ts` exports — NEVER inline copy, project lists, or experience entries into a component.
- New globally-mounted decorative or interactive effects (canvas, smooth scroll, multiplayer-style overlays, listeners that watch `window`) MUST be added to `components/deferred-effects.tsx`, NOT `app/layout.tsx`. Adding them to layout costs LCP and hydration time.
- For mouse-tracking effects, use `useCachedRect` from `lib/use-cached-rect.ts` instead of calling `getBoundingClientRect()` on every `pointermove`.
- Respect `useReducedMotion()` in any canvas/RAF effect — bail out early when true.
- Pause RAF loops on `document.visibilitychange` (when `document.hidden`).
- Use `passive: true` on all scroll/touch listeners.
- Static images MUST be imported (not referenced as string paths) so Next can fingerprint them and infer dimensions.
