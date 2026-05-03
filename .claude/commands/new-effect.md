Add a new globally-mounted decorative effect: $ARGUMENTS

The argument is the effect's name (e.g., "ConfettiTrail", "AmbientHum"). All globally-mounted effects belong in `components/deferred-effects.tsx`, never in `app/layout.tsx`.

Steps:
1. Read `components/deferred-effects.tsx` to see the existing dynamic-import pattern.
2. Read `components/ui/click-spark.tsx` as a reference for a self-contained canvas/RAF effect that respects `useReducedMotion`, pauses on `visibilitychange`, and cleans up listeners.
3. Create `components/ui/{kebab-name}.tsx`:
   - `"use client"` at top
   - `default export` (so the dynamic import in `deferred-effects.tsx` works)
   - Use `useReducedMotion()` and bail out of animation work when true
   - Pause RAF when `document.hidden` is true (visibilitychange listener)
   - Add `passive: true` to any scroll/pointer listeners
   - For mouse-tracking effects, use `useCachedRect` from `lib/use-cached-rect.ts`
4. In `components/deferred-effects.tsx`:
   - Add `const {Name} = dynamic(() => import("./ui/{kebab-name}"), { ssr: false });`
   - Render `<{Name} />` inside the existing fragment after `if (!ready) return null;`
5. Run `npm run dev`, scroll the page, and verify the effect mounts after first paint (you should see a brief delay — that's `requestIdleCallback` working as intended).

Do NOT add the effect to `app/layout.tsx` — that costs LCP and hydration time.
