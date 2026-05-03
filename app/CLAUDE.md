# app/

Next.js 13 App Router. Two pages and two API routes.

## Pages

- `layout.tsx` — Root layout. Loads three Google fonts (Inter, Space Grotesk, JetBrains Mono) with **trimmed weight subsets** — only the weights actually used. Mounts the eager shell: `Backdrop`, `ScrollProgress`, `Nav`, `Footer`, plus `LazyMotionProvider` and `ActiveSectionContextProvider`. Heavy effects come from `<DeferredEffects />`, which mounts on idle.
- `page.tsx` — Home (`/`). Composes the six sections in order. Uses `export const dynamic = "force-static"` so Vercel caches the HTML at the edge.
- `about/page.tsx` — `/about` route. Renders `<AboutIDE />`.
- `about/about-ide.tsx` — A faux IDE with a file tree, tabbed editor, raw/rendered toggle, and custom markdown renderer. **All file contents are generated at render time from `lib/data.ts`** — there are no static markdown files. If you change the content shape, update both the synthetic-file generator here and the consumers in the section components.

## API routes

Both routes use `export const dynamic = "force-dynamic"` and `export const runtime = "nodejs"` (Resend and Ably's REST client need Node, not edge).

- `api/contact/route.ts` — POST. Reads `senderEmail` and `message` from `formData`. Validates with `validateString` (500 / 5000 char limits). Sends via Resend from `onboarding@resend.dev` to the hardcoded recipient `keshav2552003@gmail.com`. Requires `RESEND_API_KEY`.
- `api/ably/token/route.ts` — GET. Mints a short-lived Ably token request for the browser. Requires `ABLY_API_KEY`. **Never expose `ABLY_API_KEY` to the client** — that's exactly what this route exists to prevent.

## globals.css

Lives at `app/globals.css`. Defines the design tokens (HSL variables: `--canvas`, `--surface`, `--ink`, `--muted`, `--edge`, `--accent`) and dark/light themes via `data-theme` on `<html>`. Tailwind config maps these tokens to class names like `bg-canvas`, `text-ink`. Also contains a chunky block of CSS for the spirit-orb companion (`components/ui/spirit-guide.tsx`) driven by custom properties.

## Conventions

- New API routes go under `app/api/<name>/route.ts` with `runtime = "nodejs"` and `dynamic = "force-dynamic"` unless a real reason exists to deviate.
- Server-only secrets are read with `process.env.X` inside the route handler (so Next doesn't try to inline them at build).
- New pages (`app/<route>/page.tsx`) should set `export const dynamic = "force-static"` if they have no per-request data — match `app/page.tsx`.
- Never add a client-only wrapper to `app/layout.tsx`. Wrappers added there cost LCP. Decorative globals belong in `components/deferred-effects.tsx`.
