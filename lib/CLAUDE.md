# lib/

Pure modules: data, types, hooks, utilities. No JSX in most files (one exception: `reaction-icons.tsx`).

## Data + types

- `data.ts` — **The single source of truth** for all rendered content: `nav`, `profile`, `experience`, `projects`, `vfInternal`, `stack`, `education`. Static images are imported here so Next can fingerprint them. Section components consume these exports — never inline content into a component.
- `types.ts` — `SectionName` (derived from `nav` via `(typeof nav)[number]["name"]`) and `AccentColor` union. Adding a new nav entry in `data.ts` automatically extends `SectionName`.

## Hooks

- `hooks.ts` — `useSectionInView(sectionName, threshold = 0.75)`. Sets `activeSection` when in view, but only if the last nav click was >1s ago (prevents the scroll detector from fighting a manual click).
- `use-in-view.ts` — Native `IntersectionObserver` hook. Returns `[ref, inView]`. Drop-in for the old `react-intersection-observer` (which was removed to trim the bundle).
- `use-cached-rect.ts` — Caches `getBoundingClientRect()` on `pointerenter`, invalidates on leave/scroll/resize. Use this for any mouse-tracking effect that would otherwise read layout on every `pointermove`.

## Utilities

- `cn.ts` — `cn()` (clsx + tailwind-merge) **and** `accentMap` — the 6-color palette shared across project cards, badges, and accent dots. New `AccentColor` values must be added to both `lib/types.ts` and `accentMap` here.
- `utils.ts` — `validateString(value, maxLength)` and `getErrorMessage(error)`. Used by API routes for form validation and error normalization.
- `cursor-identity.ts` — Generates and persists a `{name, color}` per visitor in `localStorage`. Used by the multiplayer layer.
- `reaction-icons.tsx` — Maps reaction keys (`"1"`–`"9"`) to the PNG/WebP assets in `/public/reactions/`. Exports `REACTIONS`, `REACTIONS_BY_KEY`, `ReactionIcon` (memoized), and `ReactionKey` type.

## Gotchas

- `data.ts` imports static images from `/public` — these resolve via the `@/*` alias in `tsconfig.json`. Don't change image references to plain string paths; you lose the `next/image` fingerprinting and the import-driven width/height inference.
- `use-in-view.ts` was added to replace `react-intersection-observer`. If you find yourself reaching for the old library, use this hook instead.
- `useSectionInView`'s 1-second debounce is critical — without it, clicking the nav causes a flicker as the scroll detector overrides the click. If you change the threshold logic, preserve the debounce.
