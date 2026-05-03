---
paths:
  - "components/ui/multiplayer.tsx"
  - "lib/cursor-identity.ts"
  - "lib/reaction-icons.tsx"
  - "app/api/ably/token/**"
---

# Multiplayer (Ably) rules

- The browser MUST authenticate via `/api/ably/token?clientId=…` — NEVER instantiate Ably with the raw `ABLY_API_KEY` on the client.
- The whole multiplayer layer is gated on `NEXT_PUBLIC_MULTIPLAYER_ENABLED === "1"`. If you add new multiplayer features, gate them behind the same flag so the site still works without an Ably account.
- Cursor positions MUST be published in **page coordinates** (`pageX`, `pageY`), not viewport coordinates. The wrapper applies a `translate3d(0, -scrollY, 0)` via the `useScrollCompensateRef` hook to land them in the right place.
- For any new layer that tracks page coords during scroll, reuse `useScrollCompensateRef` rather than subscribing to `scroll` in React state. The whole point is zero React re-renders during scroll.
- New reactions: add the entry to `REACTIONS` in `lib/reaction-icons.tsx` AND drop matching `.png` and `.webp` files into `/public/reactions/`. The preload loop picks up new keys automatically; missing assets cause a flash on first use.
- Visitor identity comes from `getOrCreateIdentity()` in `lib/cursor-identity.ts` and is persisted to `localStorage`. Don't regenerate or overwrite it on every mount — visitors expect stable colors/names across sessions.
- Cursor and reaction render components MUST stay wrapped in `React.memo` with primitive props. Adding object props will cause cascade re-renders on every cursor move.
