// Long-form engineering case studies. Content lives here (not in the page
// component) per the data-centralization rule. Everything below is grounded
// in the same build-log material that backs the RAG corpus
// (scripts/corpus-source.mjs — verbaflo-copilot + project-vf-copilot-deep-dive).

export type CaseStudySection = {
  id: string;
  heading: string;
  /** Paragraphs, rendered in order. */
  body: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
  /** Optional monospace diagram rendered after the bullets. */
  diagram?: string;
};

export type CaseStudy = {
  slug: string;
  eyebrow: string;
  title: string;
  dek: string;
  metrics: { value: string; label: string; detail: string }[];
  sections: CaseStudySection[];
  footnote: string;
};

export const copilotCaseStudy: CaseStudy = {
  slug: "agentic-copilot",
  eyebrow: "Case study · Shipped at VerbaFlo",
  title: "Rebuilding the Copilot as an agentic harness",
  dek: "How a hardcoded 13-agent pipeline became a single self-directing brain — and what it took to run a free-roaming agent safely on production tenant data while cutting warm-turn LLM cost by 73%.",
  metrics: [
    { value: "73%", label: "warm-turn cost cut", detail: "≈$0.139 → ≈$0.037 per turn" },
    { value: "83–95%", label: "prompt-cache reads", detail: "verified via cache-aware accounting" },
    { value: "8×", label: "parallel workers", detail: "semaphore-bounded delegate() spawns" },
    { value: "~25", label: "tools, five families", detail: "Mongo, SQL, FAQ, research, workspace" },
  ],
  sections: [
    {
      id: "problem",
      heading: "The problem",
      body: [
        "VerbaFlo's customers ask business questions in plain language: how many leads did we get last week, which FAQ fires most, compare response times across properties. The data lives in three places — MongoDB (conversations, CRM), Postgres (PMS analytics), and Milvus (FAQ vectors) — and the system that answered those questions was a fixed pipeline: a triage agent routed to a roster of specialists (eight Mongo specialists, a Milvus FAQ agent, a Postgres agent), and an analyst agent merged the results. Around 13 agents in a hardcoded state machine.",
        "It worked, but it couldn't plan. Every new data source or question shape meant more hardcoded routing. The specialists couldn't adapt mid-task, couldn't research a schema they hadn't seen, and couldn't decide that a question needed two queries instead of one. The architecture was the bottleneck — not the models.",
      ],
    },
    {
      id: "constraints",
      heading: "Constraints",
      body: [
        "Four constraints shaped everything that followed:",
      ],
      bullets: [
        "Production tenant data. Read-only access and tenant isolation are non-negotiable, and they had to be properties of the environment — not behaviors we hoped the model would follow.",
        "Cost. This is an internal tool people use all day. Per-turn LLM spend had to come down, not up, even as capability went up.",
        "No big-bang rewrite. The legacy pipeline was serving real users, so the new system had to ship additively: feature-flagged, with the old pipeline as a fallback and strictly separated session state.",
        "No framework. Owning every step boundary, timeout, and guardrail mattered more than the convenience of LangGraph or CrewAI — agent loops fail in ways you need full control to debug.",
      ],
    },
    {
      id: "architecture",
      heading: "The architecture",
      body: [
        "The rewrite replaces the state machine with a single self-directing brain, modeled on how Claude Code itself works. The brain (Claude Sonnet 4.6 by default) reasons with extended thinking, keeps a TodoWrite-style plan it rewrites mid-run, and fans work out through a delegate() tool that spawns task-scoped worker clones (Claude Haiku 4.5) in parallel. Workers aren't specialists — they're one generic agent, parameterized at spawn time for mongo, sql, or faq.",
        "Around the brain sits a small world it can act in: a RAG research tool over a ~20,000-line reference wiki (schemas, APIs, frontend docs), direct wiki_grep/wiki_read for exact lookups, a session scratch-workspace it can write intermediate results to, a compute tool for exact arithmetic, and a finalize step that produces a cited answer. Roughly 25 tools across five families.",
        "Everything streams. The brain's reasoning goes out token-by-token over SSE as typed events — plan, thinking, delegate, tool_call, research, finalize — and a React activity panel renders the run live, so users watch the system work instead of staring at a spinner.",
      ],
      diagram: `User question
     ↓
  Brain (Sonnet 4.6) — plans, reasons, streams
     ├─ delegate() ──► worker clones (Haiku 4.5), parallel ×8
     │                  · mongo · sql · faq
     ├─ research() ──► RAG over ~20K lines of reference docs
     ├─ wiki_grep / wiki_read ──► schema + API wiki
     ├─ workspace_* ──► session scratch filesystem
     ├─ compute() ──► exact arithmetic
     └─ finalize() ──► cited answer, streamed over SSE`,
    },
    {
      id: "decisions",
      heading: "Decisions and tradeoffs",
      body: [
        "The interesting parts are the things that could have gone either way:",
      ],
      bullets: [
        "Generic workers over a specialist roster. A fixed roster meant tool explosion at the planning layer and a new agent for every data source. Source-parameterized clones keep the brain's tool surface small (~25 tools) and make new data sources configuration, not architecture.",
        "Safety is environmental, not behavioral. Postgres is opened DB-level read-only with SQL validation on top; Mongo write stages ($out/$merge) are rejected; tenant filters are injected and non-bypassable. The model gets genuine freedom to roam because the environment makes destructive action impossible — no prompt pleading required.",
        "Parallel fan-out is a latency win and a token cost. Running five retrievals concurrently means waiting on the slowest, not the sum — but you pay tokens for all five. The semaphore (8 workers), per-worker/step/turn timeouts (45s / 120s / 240s), and a per-collection circuit breaker bound the worst case.",
        "Custom harness over a framework. The cost is owning the loop's correctness — cancellation, partial results, retries. The payoff is that when something misbehaves, every step boundary is mine to instrument.",
        "Provider abstraction via LiteLLM + Instructor. Brain and worker models swap with an env var (GPT, Opus 4.8) — the harness isn't married to one vendor.",
        "Additive rollout. Feature flag, legacy fallback, and separate session-memory namespaces so the two systems can never mix state. The old pipeline earned retirement; it wasn't deleted on day one.",
      ],
    },
    {
      id: "hard-parts",
      heading: "What was actually hard",
      body: [
        "None of this worked on the first try. The honest list:",
      ],
      bullets: [
        "Prompt-cache placement took multiple redesigns. Warm turns were re-paying for the same context on every request, and the fix wasn't one trick — it was reworking cache boundaries until reads consistently hit 83–95%, then building cache-aware per-turn token/cost accounting into the UI so the win was measurable instead of assumed.",
        "Long-lived SSE through Kubernetes was its own project. NGINX ingress needed tuning for streams that live for minutes, and a client disconnect mid-stream has to cancel the run and reap in-flight workers — not leak them.",
        "Cold-start latency hid its root cause for days. The system was re-reading schema docs on every cold request. The fix (pre-warming) was simple; finding it wasn't.",
        "Proving the rewrite was better, not just newer. Before the agentic brain became the default it had to pass a 121-item adversarial capability exam and a side-by-side agentic-vs-legacy harness scored by an LLM judge. Regression deltas over vibes.",
        "The agent needed knowledge nobody had written down. The ~9,900-line Postgres/PMS schema reference it relies on didn't exist — it was generated by a 14-agent documentation workflow, then indexed into 441 RAG chunks so the brain can research it semantically or grep it directly.",
      ],
    },
    {
      id: "results",
      heading: "Results",
      body: [
        "Measured warm-turn cost dropped ~73% (≈$0.139 → ≈$0.037) at 83–95% prompt-cache reads, with the accounting surfaced per-turn in the UI. The system was productized as VerbaIQ, and the legacy pipeline now exists only as a feature-flagged fallback.",
        "Two things outlived the project. A sub-second text-to-SQL spin-off from the early pipeline era runs inside VerbaFlo's primary conversational bot for Postgres-backed questions. And the harness pattern — small tool surface, environmental safety, streamed reasoning, eval-gated rollout — became the template for the team's other agent systems, including the unified debugging MCP and the platform's tool-using assistant.",
      ],
    },
  ],
  footnote:
    "Written from the build log. The numbers are internal measurements — if you want to pressure-test any of this, ask the chat on this site or email me.",
};
