---
paths:
  - "app/api/**"
---

# API route rules

- New routes MUST set `export const runtime = "nodejs"` — Resend and Ably's REST client don't run on the edge runtime.
- Routes that read request data or env vars MUST set `export const dynamic = "force-dynamic"` so Next doesn't try to prerender them at build time.
- Server-only secrets (`ABLY_API_KEY`, `RESEND_API_KEY`) MUST be read via `process.env.X` **inside** the route handler, not at module top-level. Reading at top-level can fail builds when the var is unset locally.
- `ABLY_API_KEY` MUST NEVER be exposed to the client. The whole point of `app/api/ably/token/route.ts` is to mint short-lived token requests so the browser never sees the root key.
- Validate all form/body input with `validateString` from `lib/utils.ts` (or equivalent) before using it. Return 400 on invalid input, NOT 500.
- Wrap unknown errors with `getErrorMessage` from `lib/utils.ts` when surfacing to the client. Don't leak raw error objects.
- Return JSON responses via `NextResponse.json(...)` with explicit status codes.
- Don't introduce client-fetched secrets via `NEXT_PUBLIC_*` unless the value is genuinely public. The only existing one is `NEXT_PUBLIC_MULTIPLAYER_ENABLED` (a boolean feature flag).
