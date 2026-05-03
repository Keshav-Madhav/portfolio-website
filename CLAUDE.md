# Portfolio Website

Personal portfolio for Keshav Madhav (AI Engineer at VerbaFlo). Static-prerendered Next.js 13 App Router site, but with an unusually rich interactive layer: smooth scroll, multiple canvas backgrounds, a companion "spirit guide" orb, real-time multiplayer cursors and reactions, keyboard navigation, and a Konami easter egg. The whole decorative layer mounts on `requestIdleCallback` so it doesn't fight LCP.

## What the visitor experiences

The home page is a single long scroll: Hero → About → Work → Projects → Stack → Contact. There's also `/about` which is a faux IDE that renders content from `lib/data.ts` as synthetic markdown files in a tabbed editor.

While scrolling:

- Aurora blobs drift behind the content with parallax (`components/backdrop.tsx`).
- A particle network in front renders ~24–60 connected dots that repel from the cursor (`components/ui/particle-field.tsx`).
- A second particle layer with cursor glow adds depth (`components/ui/flow-field.tsx`).
- Click anywhere → a 12-line spark burst (`components/ui/click-spark.tsx`).
- Scroll fast → the `<main>` skews subtly via a CSS transform driven by a `data-fast-scroll` attribute set by `components/ui/velocity-tilt.tsx`.
- A glowing companion orb (the **Spirit Guide**) drifts around the cursor, expresses emotions through color and faces, runs a tour of interactive elements on idle, and reacts to fast scrolls and idle gestures (`components/ui/spirit-guide.tsx`).
- If anyone else is on the site, you see their cursor and they see yours; press `1`–`9` to send floating emoji reactions (`components/ui/multiplayer.tsx`, Ably-backed).
- A floating "Ask about Keshav" chat bubble bottom-left opens a streaming first-person chat — answers as Keshav from a curated knowledge base + live GitHub data, accepts JD uploads (PDF/DOCX/TXT/MD) for tailored pitches (`components/ui/chat-widget.tsx`, Groq Llama 3.3 70B backed).
- `g h/a/w/p/s/c` are two-key keyboard shortcuts; `?` shows the help modal (`components/ui/keyboard-nav.tsx`).
- `↑↑↓↓←→←→ b a` triggers a Konami flash + emoji burst (`components/ui/konami.tsx`).

## Architecture

```
app/                        Next.js App Router
├── layout.tsx              Eager shell: fonts, Backdrop, ScrollProgress, Nav, Footer, providers, DeferredEffects
├── page.tsx                Home (force-static): Hero → About → Experience → Projects → Stack → Contact
├── about/                  /about — faux IDE rendering content from lib/data.ts as synthetic markdown
└── api/
    ├── contact/route.ts          POST — Resend email (RESEND_API_KEY)
    ├── ably/token/route.ts       GET  — mints Ably token (ABLY_API_KEY, never client-exposed)
    ├── chat/route.ts             POST — streaming chat (Groq, GROQ_API_KEY)
    └── chat/parse-file/route.ts  POST — extracts text from uploaded PDF/DOCX/TXT/MD

components/                 Sections + providers + ui/
├── deferred-effects.tsx    Mounts heavy/decorative effects on requestIdleCallback (THE perf lever)
├── lenis-provider.tsx      Smooth scroll + capture-phase anchor interception
├── backdrop.tsx            8 aurora blobs, imperative parallax, self-suspending RAF
├── lazy-motion-provider.tsx  framer-motion LazyMotion (domAnimation only — use m.*, not motion.*)
└── ui/                     Atoms, decorative effects, spirit guide, multiplayer

lib/                        data, types, hooks, utils — single source of truth for content
                            keshav-context.ts is the chat assistant's base persona + facts
                            embeddings.ts is the RAG retrieval runtime
                            context-embeddings.json is the prestored vector store (committed)
context/                    Active-section context (only global state)
email/                      React Email template for the contact form
public/                     Static images (imported into lib/data.ts for fingerprinting)
scripts/fetch-github.mjs    Prebuild step — bakes top GitHub repos into chat context
scripts/corpus-source.mjs   RAG corpus source-of-truth (45 sections, ~92K chars)
scripts/build-embeddings.mjs  Prebuild step — chunks + embeds the corpus → lib/context-embeddings.json
scripts/eval-rag.mjs        Retrieval eval harness — 47 golden queries, measures recall/tokens
```

## The deferred-effects pattern (the performance story)

The site is tuned aggressively for LCP. `app/layout.tsx` mounts the smallest possible eager shell. `components/deferred-effects.tsx` waits for `requestIdleCallback` (or 800ms `setTimeout` fallback) before dynamically importing and mounting Lenis, both canvas backgrounds, the spirit guide, the multiplayer layer, keyboard nav, Konami, click-spark, velocity-tilt, and the toaster — each as its own JS chunk (`ssr: false`).

The first ~800ms of scrolling uses native browser scroll. Then Lenis takes over seamlessly. The hero's lede paragraph deliberately renders without entrance animation so it can serve as the LCP element (the original animated entrance was costing ~1300ms on LCP audits).

**On mobile / touch-only devices** (`(pointer: coarse)`), the entire decoration layer is gated off via `useIsMobile()` from `lib/use-is-mobile.ts`. Only the chat widget and toaster mount — none of the canvas effects, the spirit guide, Lenis, multiplayer, keyboard nav, or Konami are even downloaded. Additional mobile cuts:

- **Backdrop**: all blurred blobs are hidden via `[data-aurora-blob] { display: none }` and replaced with a static gradient fallback. The parallax RAF loop bails entirely.
- **Nav backdrop-blur**: killed by a global CSS rule; nav gets a solid semi-transparent background instead.
- **`filter: blur()` in animations**: stripped from `reveal.tsx`, `section-heading.tsx`, `split-text.tsx`, and `image-cycler.tsx` on mobile. Only `opacity` + `y` remain; durations are shortened.
- **ScrollProgress**: hidden (`hidden sm:block`).

See `components/ui/CLAUDE.md` for full mobile performance rules.

**Cross-cutting rule**: never add a new globally-mounted client effect to `app/layout.tsx`. Add it to `components/deferred-effects.tsx`. The two effects mounted eagerly (`Backdrop`, `ScrollProgress`) are intentional exceptions. If the new effect should also run on phones (functional, not decorative), put it outside the `!isMobile` block.

## The `data-spirit` attribute system

The spirit guide reads attributes off the page rather than exposing a JS API. Section components mark interactive elements:

- `data-spirit` — generic interactive element; orb can target it during exploration.
- `data-spirit="button"` — CTA-style; smaller halo.
- `data-spirit="inline"` — inline link; color lift on hover.
- `data-spirit="stats"` — special; intro-tour fallback target.
- `data-spirit-first` — the hero CTA; first stop on grand tour and intro-guidance target.
- `data-spirit-touched="true"` — set/cleared by the spirit guide itself; CSS keys glow intensification off it. Don't touch it manually.

If you add a clickable card or button and want the orb to react, just add the attribute. The orb scans on every animation frame during a tour and every ~5s during idle. See `components/ui/CLAUDE.md` for the full spirit-guide behavior tree.

## The chat assistant (RAG)

The bottom-left "Ask about Keshav" widget streams from Groq (Llama 3.3 70B). Early versions shoved the entire persona + all content into the system prompt, which blew past Groq's free-tier 12K tokens-per-minute ceiling and caused the model to hallucinate URLs. The current system is RAG.

**Build time** — `scripts/build-embeddings.mjs` reads `scripts/corpus-source.mjs` (45 curated sections covering identity, learning timeline, VerbaFlo / PrudentBit work, every project in depth, personality, tech stack, and a URL reference), chunks each section at ~300 tokens with 60-token overlap, and embeds every chunk with `Xenova/all-MiniLM-L6-v2` (local, no network). Output is committed to `lib/context-embeddings.json` (~970 KB, 109 chunks) so the production runtime does not re-embed on cold start. Runs via `prebuild`, so `npm run build` always has fresh embeddings.

**Model routing** — Q&A is served by a two-model chain: `llama-3.3-70b-versatile` (primary) with `llama-3.1-8b-instant` as automatic fallback on daily-token-limit 429s. Groq's free tier caps the 70B at 100K tokens/day; the 8B has a much larger daily quota. With RAG injecting concrete facts, the 8B's old "hedging" problem is largely neutralized — it has the answer in context and just needs to paraphrase it. INTRO always uses 8B. The `meta` SSE event reports which model actually served the request and sets `fallback: true` when the primary was skipped, so the UI can show a discreet indicator if you ever want one.

**Error UX** — `friendlyError()` in `app/api/chat/route.ts` converts Groq SDK errors into short visitor-facing lines (daily quota, per-minute rate limit, 401/403 misconfig, generic) and parses Groq's "try again in Xm Ys" timestamps into a humanized ETA. The raw JSON never hits the visitor. Mid-stream failures send an `error` SSE event after partial output so the widget can show the note below the half-typed message.

**Runtime** — `/api/chat/route.ts` embeds the user's recent turn, runs cosine similarity against all 109 chunks (O(n) over 384-dim vectors, ~1-5ms), then `lib/embeddings.ts::buildRetrievalResult` filters with three rules in order:

1. **MIN_SCORE (0.22)** — hard floor for noise.
2. **SCORE_GAP (0.35)** — a chunk must sit within 0.35 of the top score. This makes retrieval adaptive: when the top match is strong (0.70+), only very-similar chunks are kept; when the top match is weak, the floor moves with it.
3. **ALWAYS_INCLUDE_TOP_IF_ABOVE (0.18)** — the rank-0 chunk is always included as long as it clears this lower floor, so low-confidence queries still get *something* instead of empty context.
4. **MAX_CONTEXT_TOKENS (1,800)** — greedy pack, highest score first.

The injected context plus the slim base prompt (persona + minimal facts) lands at roughly 3-4K tokens per request, comfortably under the 12K TPM ceiling.

**Observability + quality** — three pieces keep retrieval honest:

- `scripts/eval-rag.mjs` (`npm run eval-rag`) runs 47 golden queries against the committed index and reports recall@top-K, recall@included, and the top-score distribution. Current baseline: 100% top-K recall, 97.9% inclusion recall, median top score 0.445. Fails CI-style if recall drops below 90%. Add new queries whenever you spot a real-world miss.
- `/api/chat/debug-rag?q=...` (GET) and POST `{query}` — returns the full retrieval trace (every scored chunk, which decision was made, which were included, final context string). Dev-only by default; set `DEBUG_RAG_ENABLED=1` to expose in prod. No LLM call, so it's free to hammer.
- `/api/chat` emits a `meta` SSE event with `{topScore, included, considered, contextTokens, searchMs, systemTokens}` on every request — a debug HUD in the chat widget can render these live.

**Editing the corpus** — add or update sections in `scripts/corpus-source.mjs`, then `npm run build-embeddings`. If a real query retrieves the wrong thing, prefer adding a "Topics covered here: …" anchor line to the top of the correct section (existing precedent in `identity`, `contact`, `work-style`, `personality-optimization`, `tech-desktop-native`) — this is significantly cheaper than rewriting prose, and it directly boosts the section's embedding toward how visitors actually ask. Then re-run `npm run eval-rag` to confirm recall.

## The multiplayer layer (Ably)

`components/ui/multiplayer.tsx` hooks into Ably + `@ably/spaces` for live cursors and emoji reactions. Disabled when `NEXT_PUBLIC_MULTIPLAYER_ENABLED !== "1"` or on touch-only devices (the `deferred-effects.tsx` mobile gate now also prevents the JS chunk from being downloaded at all in that case).

- The browser **never sees `ABLY_API_KEY`** — it's gated behind `app/api/ably/token/route.ts` which mints short-lived token requests.
- Cursors are published in **page coordinates** (not viewport). The cursor/reaction layer wrappers apply `translate3d(0, -scrollY, 0)` imperatively via RAF — zero React re-renders during scroll, no matter how many remote cursors are on screen.
- Visitor identity (`{name, color}`) is generated once and persisted in `localStorage` via `lib/cursor-identity.ts` so colors are stable across sessions.
- Reactions are 1–9 keys → emoji PNGs in `/public/reactions/` (preloaded on mount to avoid first-press flash).

Full details in `components/ui/CLAUDE.md`.

## Data is centralized

All visible content (bio, projects, experience, nav, stack, internal-tools showcase) lives in `lib/data.ts`. **Never inline copy into components.** The `nav` array is `as const` and `SectionName` in `lib/types.ts` is derived from it — adding a nav entry automatically extends the type. Static images are imported (not string paths) so Next can fingerprint them and infer dimensions.

The `/about` page is a faux IDE that synthesizes "files" (`intro.md`, `now.md`, `projects.md`, `stack.json`, etc.) by interpolating `lib/data.ts` exports at render time.

## Cross-cutting rules

- `m.*` from framer-motion, **never** `motion.*` (only `domAnimation` is loaded).
- Section components must call `useSectionInView("Name", threshold)` from `lib/hooks.ts` and attach the returned ref to their outer `<section id="...">`. The hook ignores in-view changes for 1s after a nav click — without that debounce, the highlight flickers.
- New globally-mounted effects → `deferred-effects.tsx`, not `app/layout.tsx`.
- API routes set `runtime: "nodejs"` and `dynamic: "force-dynamic"`. Read secrets from `process.env` *inside* the handler.
- For mouse-tracking effects, use `useCachedRect` from `lib/use-cached-rect.ts` instead of reading `getBoundingClientRect()` per `pointermove`.
- Bail out under `useReducedMotion()` — return null for canvas effects, plain text for text effects.
- Pause RAF on `document.visibilitychange` (`document.hidden`).
- Path alias `@/*` resolves to the repo root (see `tsconfig.json`).

## Env vars

- `RESEND_API_KEY` — server-only, contact form delivery (`app/api/contact/route.ts`).
- `ABLY_API_KEY` — server-only, mints Ably tokens for the browser (`app/api/ably/token/route.ts`).
- `NEXT_PUBLIC_MULTIPLAYER_ENABLED` — `"1"` to enable the multiplayer layer. The only client-exposed env.

`.env.example` documents these.

## Dev commands

- `npm run dev` — Next dev server (default port 3000).
- `npm run build` — production build. Run before claiming a change is shipped. Auto-runs `prebuild` which fetches GitHub repos and rebuilds the RAG embeddings.
- `npm run build-embeddings` — rebuild the RAG vector store manually after editing `scripts/corpus-source.mjs`.
- `npm run eval-rag` — run the retrieval eval harness (47 golden queries). Exits non-zero if recall drops below 90%.
- `npm run lint` — `next lint`.

There are no automated tests in this repo — verify changes by running `npm run dev` and clicking through the affected sections (and ideally with reduced motion enabled to confirm the bail-outs still work).

## Where to read more

- `app/CLAUDE.md` — page + API route conventions
- `components/CLAUDE.md` — section + provider patterns, deferred-effects rules, the `data-spirit` attribute system
- `components/ui/CLAUDE.md` — every UI atom, every effect, the full spirit-guide behavior tree, the full multiplayer architecture
- `lib/CLAUDE.md` — data shape, hook semantics, accent palette
- `context/CLAUDE.md` — why active-section context exists (and why it shouldn't grow)
