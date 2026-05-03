# context/

Single React context provider for the active-section state.

- `active-section-context.tsx` — Holds `activeSection: SectionName` (default `"Work"`) and `timeOfLastClick: number`. Exports `ActiveSectionContextProvider` (mounted in `app/layout.tsx`) and `useActiveSectionContext()` (throws if used outside the provider).

## Why `timeOfLastClick`

When the user clicks a nav link, `setTimeOfLastClick(Date.now())` is called. `useSectionInView` (in `lib/hooks.ts`) ignores in-view changes for 1 second after a click, so the scroll detector doesn't immediately overwrite the section the user just navigated to. Don't remove this — without it the nav highlight flickers.

## Adding new global state

Don't. Section state is the only thing global enough to belong in context. Form state, hover state, animation state, multiplayer presence — all live in their own components. If you find yourself wanting another context provider, ask whether prop drilling or a hook would do.
