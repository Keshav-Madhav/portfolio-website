// =============================================================================
// corpus-source.mjs — SOURCE OF TRUTH for the RAG corpus.
//
// Each section is a topically-coherent block of prose that the embedding
// script will chunk (~300 tokens each) and embed. Sections are intentionally
// overlapping and redundant so that multiple search queries can surface the
// same facts from different angles.
//
// Rules for writing sections:
//   1. Write in THIRD PERSON about Keshav. The chat persona translates to
//      first person at runtime.
//   2. Be specific. Numbers, names, dates, URLs. Fluff loses to facts.
//   3. Every project should be answerable at three levels: what it is, how it
//      was built, what was hard about it.
//   4. Repeat key facts (role, employer, timeline) across multiple sections.
//      Embedding search does not guarantee any one section gets retrieved.
//   5. URLs MUST be included wherever they make sense — they're the primary
//      way to prevent hallucination.
//
// Add new sections freely — each push grows the corpus. The chunker will
// handle splitting.
// =============================================================================

// ============================================================================
// BROAD OVERVIEW — for "tell me about yourself" style queries
// ============================================================================

const overview = {
  id: "overview",
  title: "Overview — tell me about yourself, introduction, summary",
  content: `
Topics covered here: tell me about yourself, give me an overview, who are
you, introduce yourself, summarize yourself, what should I know about you,
quick intro, elevator pitch, brief summary, background summary, applied AI,
applied machine learning, AI capabilities, what AI work I do, applied LLM
work, AI engineering day-to-day.

Keshav Madhav is a 22-23 year old AI engineer at VerbaFlo, an AI SaaS
startup in Gurgaon, India. He builds production AI runtimes — custom
multi-agent orchestrators, retrieval pipelines, text-to-SQL, and the
desktop/IDE/observability tooling that teams debug against. In short:
applied AI is his job — agentic systems, RAG, evals, and reliability
work for LLM calls, all in production with real customers.

CAREER TIMELINE:
- Aug 2025 – present: AI Engineer (SDE-1) at VerbaFlo
- Aug 2023 – Aug 2025: Founding Front-End Engineer at PrudentBit (his first
  full-time role, shipped the Immune product suite from scratch)
- 2021–2025: B.Tech in Computer Science with AI/ML specialization, Sushant
  University, Gurgaon

WHAT HE'S KNOWN FOR:
- Performance optimization obsession (Brainfuck interpreter: 1 billion ops
  in 6 seconds; portfolio site: 6 rounds of statistically-significant perf
  passes)
- Fast shipping — the "get it done" person at VerbaFlo
- Full-stack range: from WebGL shaders up to Kubernetes and trace pipelines
- Side projects that push technical boundaries (Space Sandbox: 21k bodies
  at 30fps; Cookie Clicker clone with dirty-flag optimization)

INTERESTS OUTSIDE WORK:
- Gaming: Subnautica (favorite), Ark, Uncharted, survival/crafting games
- Space: genuine obsession — black holes, orbital mechanics, SpaceX
- Dinosaurs: Ankylosaurus and Baryonyx are favorites, loves all prehistoric
  life and evolution
- Music: all genres, tried producing but prefers consuming
- NOT into sports at all

CONTACT:
- Email: keshav.madhav@verbaflo.ai (preferred) or keshav2552003@gmail.com
- LinkedIn: linkedin.com/in/keshav-madhav
- GitHub: github.com/Keshav-Madhav

He's currently happy at VerbaFlo but open to roles that offer deeper AI
work (fine-tuning, training, model internals). Compensation floor is ~17
LPA (his current comp). He values learning over title or stock.
`,
};

// ============================================================================
// IDENTITY & CONTACT
// ============================================================================

const identity = {
  id: "identity",
  title: "Who is Keshav Madhav",
  content: `
Topics covered here: who is Keshav, introduction, background overview,
where is Keshav based, where does Keshav live, location, nationality,
age, education, current role, basic bio, his name, his handle, Keshav
Madhav biography, at a glance, applied AI engineer, applied machine
learning, what does Keshav do, AI capabilities.

Keshav Madhav is an AI engineer at VerbaFlo (AI SaaS startup, Gurgaon, India).
His full name is Keshav Madhav. He goes by Keshav. His GitHub / online
handle is KilloWatts in some places (VS Code marketplace) but mostly
Keshav-Madhav on GitHub.

He is based in New Delhi / Gurgaon, India (NCR region). He grew up in India
and has done all of his schooling, college, and work there so far.

Current title: AI Engineer, SDE-1 at VerbaFlo (since Aug 2025).
Previous title: Founding Front-End Engineer at PrudentBit (Aug 2023 to Aug 2025 — his first full-time role).
Education: B.Tech in Computer Science with AI/ML specialization, Sushant
University, Gurgaon (2021 to 2025).

He is 22-23 years old (born 2003, inferred from altEmail keshav2552003@gmail.com).

Sentence-length self-description: "I build production AI runtimes — custom
multi-agent orchestrators, retrieval pipelines, text-to-SQL, and the
desktop / IDE / observability tooling teams debug against."

Tagline on his site: "Building production AI runtimes — custom orchestrators,
retrieval, and the tooling teams debug against."

He transitioned from a founding front-end engineer role into full-stack AI
engineering. He is comfortable from WebGL and Electron up through Kubernetes
and trace pipelines. Both the interfaces and the runtime are his.
`,
};

const contact = {
  id: "contact",
  title: "Contact info and how to reach Keshav",
  content: `
Topics covered here: how to contact Keshav, contact info, how to reach
him, his email, email address, work email, personal email, phone number,
LinkedIn profile, LinkedIn URL, GitHub profile, resume, CV, where to
find his resume, how to get in touch, availability, hiring him,
contacting, reaching out.

Primary ways to contact Keshav Madhav:

- Work email (preferred for hiring and professional inquiries): keshav.madhav@verbaflo.ai
- Personal email (also valid): keshav2552003@gmail.com
- Phone: +91 78272 29447
- LinkedIn: https://www.linkedin.com/in/keshav-madhav/
- GitHub: https://github.com/Keshav-Madhav
- Resume / CV: available at /Front_End_Resume.pdf on the portfolio site (click the "Résumé" button in the hero)

Response time: typically under 24 hours on weekdays. Weekends are slower.

Open to:
- Full-time AI engineering roles (compensation floor ~17 LPA, the current comp at VerbaFlo)
- A limited number of consulting / freelance engagements per year (selective — ask, don't assume)
- Technical discussions about AI systems, multi-agent orchestration, observability

Not currently available for:
- Public speaking engagements
- Regular mentorship slots (though happy to answer one-off questions via email)

He is actually happy at VerbaFlo right now — not actively job-hunting. The
trigger for a move would be LEARNING (deeper AI work: fine-tuning, training,
model internals), not title or stock.

He does NOT have a Twitter / X account listed publicly. The best ways to
reach him are email or LinkedIn.
`,
};

// ============================================================================
// ORIGIN STORY & LEARNING
// ============================================================================

const originChildhood = {
  id: "origin-childhood",
  title: "Childhood — the pre-programming engineer mindset",
  content: `
Keshav always had what he calls an "engineer mind" as a kid, but the early
version was civil / mechanical, not software. Building was tactile:

- Big into Lego. Not the branded sets with instructions — the freeform
  kind where you dump the whole bucket out and build something.
- Metal-plate building kits (the Indian "Mechanix"-style sets — nuts,
  bolts, perforated metal strips). Same instinct as Lego, with real bolts.
- Built structures out of ice-cream sticks. Bridges, towers, whatever
  held together.

The pattern is clear in hindsight: he was always drawn to systems made of
discrete composable pieces where you could reason about what each piece
did and how they interacted. That same instinct later translated directly
into software — components, modules, functions.

This is why he gravitates toward projects like interpreters, simulations,
and game loops even today: they're the digital version of "here's a
bucket of Lego, make something." Constraints, composability, and
feedback loops.

He wasn't into sports as a kid and still isn't. Music and gaming were
always there — more on those in other sections.
`,
};

const originPivot = {
  id: "origin-pivot",
  title: "10th grade — the pivot to programming",
  content: `
The pivot to programming happened in 10th grade (around 2018-2019) when
computer science was introduced as a subject in school. It clicked with
Keshav instantly. Felt more natural than physical building in a way that
surprised him — he hadn't expected it to.

He immediately started building stuff outside the curriculum. YouTube
tutorials were the main entry point — he picked up whatever languages
and frameworks seemed interesting and started shipping things.

Critically, this was BEFORE the modern AI wave (pre-ChatGPT, pre-Copilot
autocomplete). So he learned by:

- Reading raw docs (MDN for web, language references, framework guides)
- Watching YouTube tutorials (Traversy Media, Fireship, Net Ninja, etc.)
- Debugging by actually reading stack traces and stepping through code
- Asking on Stack Overflow when stuck (and getting told to read the docs)

This turned out to be a huge advantage later. He built strong fundamentals
BEFORE LLM autocomplete existed. He knows what an AST is, he can read a
stack trace, he can profile a hot loop — because those were the only tools
available to him when he was learning.

He's told that junior devs today who learned entirely with LLM assistance
often struggle when the LLM gives a wrong answer, because they don't have
the fallback skills to debug their way out. Keshav doesn't have that
problem — he learned the hard way.
`,
};

const originCollege = {
  id: "origin-college",
  title: "College years — Sushant University (2021-2025)",
  content: `
Keshav did his B.Tech at Sushant University in Gurgaon, India, from
September 2021 to May 2025. His specialization was Computer Science with
an AI/ML track — his formal introduction to AI as a discipline rather
than just "interesting topic."

College was where he started shipping aggressively. The side project
portfolio exploded during these years — 90+ public repositories now on
GitHub, most of them started during college.

Key moments during college:

- 2022 (1st-2nd year): First serious projects. Grid Visualizer for
  pathfinding algorithms. Started the "30+ JS games" journey. Cookie
  Clicker clone begins (becomes a multi-month obsession).
- 2023 (2nd-3rd year): Space Sandbox (n-body gravity simulation) —
  intersection of his space obsession and coding. Joined PrudentBit as
  founding front-end engineer in Aug 2023 (his first job, while still a
  student). Built and published Live Jinja Renderer VS Code extension.
- 2024 (3rd-4th year): Started building AI-powered features at
  PrudentBit. Led the Next.js 14 migration. First multi-agent
  orchestration experiments. Cookie Clicker reached feature completeness.
- 2025 (final year): Graduated in May 2025. Joined VerbaFlo in August
  2025 as AI Engineer. Side projects pivoted toward AI / creative coding.

He worked full-time at PrudentBit while finishing college — so the final
two years of B.Tech were done alongside a real job. Classic "I'll sleep
after finals" energy.

College gave him the formal AI grounding (linear algebra, probability,
ML algorithms, neural networks basics). The practical AI skills came
from work and side projects.
`,
};

const learningApproach = {
  id: "learning-approach",
  title: "Learning style and what he's learning now",
  content: `
Keshav learns best by BUILDING, not reading. His approach to picking up
a new technology:

1. Find a project he actually cares about shipping
2. Pick the tech as the tool for that project
3. Hit walls. Read docs when stuck (not preemptively).
4. Ship a working thing. THEN go back and fill in theoretical gaps.

This is why his side project list reads like a "new tech sampler" —
Electron (simulation harness), Pyodide (Live Jinja), WebGL (Space
Sandbox), Three.js (Fizzi), Convex (Chatter), Cloudflare Workers (Zen
Notes), etc. Each project was an excuse to learn something new.

He's honest about gaps. His biggest ones right now (late 2025 / 2026):

- **Model internals**: he's solid on applied AI (prompting, tooling,
  retrieval, orchestration) but hasn't gone deep into fine-tuning,
  training-time optimization, or model surgery yet. That's on his
  learn-next list. When he moves jobs eventually, this will be the
  trigger.
- **Slowing down**: he ships fast but knows "fast" sometimes outruns
  "deep." Actively working on slowing down to really inhabit the
  implementation before moving on.
- **Systems programming**: he's comfortable up to the OS layer (writing
  performance-critical JS, doing perf work, understanding V8) but hasn't
  done serious C / Rust / low-level systems work. Interested in it.

What he's actively learning in 2025-2026:
- Advanced retrieval techniques (hybrid search, query expansion, reranking,
  ColBERT, HyDE)
- Production observability patterns for LLM systems
- Deeper MCP / agentic tooling patterns
- Better evals (beyond LLM-as-judge — synthetic benchmarks, adversarial)

He's been coding for ~7-8 years at this point (10th grade → now) and is
3+ years into professional shipping.
`,
};
// ============================================================================
// VERBAFLO WORK (deeply expanded)
// ============================================================================

const verbafloOverview = {
  id: "verbaflo-overview",
  title: "VerbaFlo — role and overall scope",
  content: `
Topics covered here: VerbaFlo role, what does Keshav do at VerbaFlo,
applied AI work, applied machine learning, AI engineering, AI capabilities,
production AI work, what AI stuff has Keshav built, day-to-day at VerbaFlo.

Keshav joined VerbaFlo (https://www.verbaflo.ai/) in August 2025 as
AI Engineer, SDE-1. Based in Gurgaon, India (hybrid). This role is
**pure applied AI** — production systems with SLAs, not research or
prompt-tweaking-as-hobby.

VerbaFlo is an AI SaaS company. The core product is a conversational AI
bot for property management and real estate — a multi-stage LLM pipeline
that handles router logic, FAQ retrieval, text-to-SQL against MongoDB
and Postgres, and bot response generation.

Keshav owns core pieces of the agentic AI stack:
- Multi-agent orchestrator with parallel tool-calling and SSE streaming
- Retrieval pipelines on Milvus / Zilliz with hybrid search and query expansion
- Pydantic-validated text-to-SQL across MongoDB and Postgres
- Company-wide debugging surface: unified MCP server + custom tracing + LLM playground

Specific headline accomplishments at VerbaFlo:
- Led a production-ready agentic workflow with a custom parallelization
  orchestrator for tool-calling agents. Ships text-to-SQL with Pydantic-
  validated schemas that pulls live MongoDB analytics for business questions.
- Manages and tunes Zilliz / Milvus vector stores that back a high-throughput
  RAG pipeline (chunking, embedding, hybrid search, reranking) for FAQ and
  knowledge retrieval.
- Took ownership of the AI-driven campaign systems (call, WhatsApp, email)
  letting customers target thousands of users with model-generated,
  personalized flows.

His biggest impact at VerbaFlo has been building TOOLING — the internal
surfaces other engineers debug against daily. He calls the three main
internal tools the "VerbaFlo internal stack": Copilot, Conversation
Simulation, Unified Debugging MCP, and Tracing/LLM Playground. Details
in dedicated sections.

Current compensation at VerbaFlo: ~17 LPA (Indian Rupees, lakhs per annum).
This is his compensation floor for any future moves.
`,
};

const copilotTool = {
  id: "verbaflo-copilot",
  title: "VerbaFlo Copilot — multi-agent talk-to-any-data-source system",
  content: `
The **Copilot** is the VerbaFlo tool Keshav is most proud of. It's a
multi-agent "talk-to-any-data-source" system built on a triage-specialists-
analyst architecture.

Architecture:
- **Triage agent**: receives the user question, classifies what data
  sources are needed, and routes to the right specialists.
- **Specialist agents**: one per data source. Specialists for MongoDB,
  Milvus (vector store), SQL / Postgres, and other sources. Each specialist
  knows how to query its source efficiently.
- **Analyst agent**: stitches the specialist answers into a single coherent
  response. Handles disambiguation, contradictions, and formatting.

Up to 12 agents can run in parallel. The orchestrator handles SSE streaming
(so users see tokens as they're generated rather than waiting for full
responses), a semantic cache (for common queries, with 40%+ hit rate),
schema pre-warming (loaded at startup to avoid cold-start latency), query
expansion (one user question → 6 variant queries for retrieval), and
clarification loops (if the question is ambiguous, the Copilot asks back).

How it was built (the story):
1. Started as a tiny side experiment — Keshav wanted to prove that sub-
   second text-to-SQL was achievable. Built a single specialist for Postgres.
2. Team asked for cross-database queries. Added MongoDB specialist.
3. Realized the "triage first, then route" pattern was emerging naturally
   from the code. Formalized it into the multi-agent architecture.
4. Added streaming early because waiting for full responses killed UX.
5. Semantic cache was a LATER optimization — noticed ~40% of queries
   were repeats or near-duplicates. Added embedding-based cache lookup.
6. Schema pre-warming came after debugging cold-start latency spikes in
   production. The LLM was re-reading schema docs on every cold request.
7. Grew from "tiny experiment" into one of VerbaFlo's highest-reputation
   internal tools.

A sub-second text-to-SQL spin-off of the Copilot is now used directly
INSIDE the primary conversational bot for Postgres-backed queries.

Not a framework wrapper. Custom runtime — not LangGraph, not CrewAI.
Keshav wrote the orchestration logic himself, because off-the-shelf agent
frameworks had too much overhead for sub-second latency targets.
`,
};

const simulationTool = {
  id: "verbaflo-simulation",
  title: "VerbaFlo Conversation Simulation — replay harness",
  content: `
The **Conversation Simulation** harness is an Electron + Puppeteer replay
engine Keshav built at VerbaFlo. Primary purpose: catch regressions before
anything touches production.

What it does:
- Drives live VerbaFlo chat widgets with LLM-powered synthetic user personas
- Runs thousands of real-world conversations through the CURRENT stack
  (Router → FAQ retrieval → Text2SQL → PMS / property management → bot
  response → analysis) end-to-end
- Stage-level diffs: shows Router, FAQ, SQL, Summary side-by-side with
  per-stage latency numbers
- Parallel replay: thousands of transcripts against any branch in minutes,
  not hours
- Catches regressions before merge

Secondary purpose: CID investigation tool. Full transcripts enriched with
Elasticsearch traces and span history, for debugging production incidents.

How it was built:
1. Started as a simple replay script to test prompt changes locally
2. Added Puppeteer to drive actual widget interactions (DOM events, not
   just API calls — because the widget has its own state management that
   API-only testing misses)
3. Synthetic personas came from analyzing real conversation patterns:
   angry-user persona, confused-user persona, power-user persona, etc.
4. Stage-level diffs (Router / FAQ / SQL / Summary) were added after a
   regression slipped through that only affected FAQ retrieval — end-to-end
   tests passed, but the FAQ quality had quietly dropped.
5. ClickUp integration for QA workflow — QA team can trigger replays
   directly from a ticket and see the diff inline.
6. Became the team's primary debugging surface.

Key lesson Keshav learned building this: "Distrust 'this works for me'
and trust regression deltas." Before the simulation harness, prompt
changes shipped based on vibes. After it, every change shows a concrete
delta against thousands of replayed conversations.

Tech stack: Electron (desktop shell), Puppeteer (widget automation),
MongoDB (transcript storage), Elasticsearch (trace enrichment), custom
LiteLLM wrapper (to hit any model), React (UI).
`,
};

const mcpDebugger = {
  id: "verbaflo-mcp-debugger",
  title: "VerbaFlo Unified Debugging MCP server",
  content: `
The **Unified Debugging MCP** is a company-wide MCP (Model Context Protocol)
server that turns any agentic IDE into an autonomous debugger for
VerbaFlo's codebase.

Works inside every AI-native IDE the team uses:
- Claude Code
- Cursor
- Codex
- Windsurf
- Antigravity
- Cowork

Workflow: an engineer hands it a ClickUp ticket (just the ID). The MCP
navigates:
- The full 500k+ line VerbaFlo repo (code search, file reading, symbol
  lookup)
- Live conversation state in MongoDB (the actual user conversation that
  triggered the bug)
- Elasticsearch trace indices (what the AI pipeline actually did)
- Span history (timing, intermediate outputs, tool calls)
- Metrics dashboards
- Database schemas

Then it does autonomous RCA (root cause analysis) end-to-end. Resolves
95%+ of issues without a human stepping in — produces a structured RCA
report the engineer just reviews.

Key features:
- ClickUp ticket → full RCA in one shot: code, conversation, traces,
  spans, metrics, DB
- Single MCP surface across every AI-native editor the team uses (no
  tool duplication per IDE)
- Custom tool routing, guardrails, and deterministic outputs tuned for
  agent loops (normal MCP tools tend to be too chatty / non-deterministic
  for agent use)

Impact: gives the whole team superpowers. Before the MCP, debugging a
production bug meant an engineer manually tailing logs, grepping code,
and querying Mongo across 3-4 windows. Now it's one command.

Keshav considers this his most leveraged work at VerbaFlo. Not a feature
users see, but every engineer on the team uses it daily, and it's the
reason their bug-resolution velocity is high.

Tech: Python MCP server, custom tool definitions, Elasticsearch client,
MongoDB queries, code-search index, LiteLLM wrapper.
`,
};

const tracingTool = {
  id: "verbaflo-tracing",
  title: "VerbaFlo Tracing UI + LLM Playground",
  content: `
The **In-house Tracing + LLM Playground** is VerbaFlo's own purpose-built
observability stack for their LLM pipeline. Internally called "our own
Opik" — a reference to Comet's open-source LLM observability tool, but
purpose-built for VerbaFlo's specific pipeline and faster than anything
off-the-shelf the team tried.

Features:
- **Span-level querying**: Elasticsearch aggregations over traces. Filter
  by user, time range, pipeline stage, latency, cost, error status.
- **Run comparison**: diff views for run-over-run. Shows how a pipeline
  behaved on one input across multiple commits / prompt versions.
- **LLM Playground**: replay any historical production trace through any
  model with edited prompts. This is huge — if you want to see "would
  GPT-4 have answered this better than our current model?", you just
  replay the trace.
- **Custom LiteLLM wrapper**: one surface hits every internal and public
  model. Claude (Anthropic), OpenAI, Gemini (Google), Vertex AI, Cerebras,
  Together AI, VerbaFlo's internal models — one API surface.

Why it was built in-house instead of using Opik / LangSmith / Langfuse:
- Off-the-shelf trace tools were too slow for VerbaFlo's query patterns
  (they log hundreds of thousands of conversations per week)
- Custom data model — VerbaFlo's pipeline has specific stages (Router,
  FAQ, Text2SQL, PMS, bot) that generic tools don't understand natively
- LiteLLM wrapper needed custom logic for internal model routing

Impact: replaced "tail logs and grep" with visual span timelines. Before
this, debugging the multi-stage LLM pipeline was painful. After it, it's
a dashboard click.

Built on: Python (backend), Elasticsearch (trace storage), React (UI),
Tailwind, custom charts. Integrates with the MCP debugger (same trace
data, different surface).
`,
};

const verbafloLessons = {
  id: "verbaflo-lessons",
  title: "VerbaFlo — what Keshav has learned",
  content: `
Lessons from working at VerbaFlo:

1. **Production AI is mostly observability.** The LLM pipeline IS the
   product. Keshav's biggest impact is the tracing + simulation harness
   that lets the team see what the bot is actually doing, not the prompts
   themselves. Prompts change — the infrastructure to test them stays.

2. **Eval > vibes.** Every prompt change goes through the simulation
   harness against thousands of replayed conversations before merge.
   Keshav learned to distrust "this works for me" and trust regression
   deltas over intuition.

3. **Multi-agent orchestration tradeoffs.** Parallel tool-calling is
   great for latency (run 5 retrievals simultaneously, wait for the
   slowest) but expensive on token budget (you pay for all 5). Learned
   where streaming + early-cancellation pays off, and where it adds
   debugging hell (race conditions, partial results).

4. **Tooling unlocks team velocity.** The MCP-based RCA debugger gives
   the rest of the team superpowers (claim a ClickUp ticket → autonomous
   RCA across 500K LOC). His most leveraged work isn't features, it's
   the surfaces that make features faster to debug.

5. **Treats prompts like code.** Versioned, eval'd, A/B'd. He's the
   person on the team who notices when a model upgrade silently
   regressed an eval set by 3 points.

6. **Schema pre-warming matters.** Cold-start latency was the first
   "real" ML-infra problem he tackled. The solution (pre-warming) was
   simple; finding the root cause (re-reading schema docs on every
   cold request) took days.

7. **LiteLLM is a lifesaver.** Being able to swap Claude → GPT → Gemini
   → Cerebras with one config change, and A/B test them side-by-side,
   is invaluable when the model landscape shifts every few months.

8. **Being the "fast shipper" has costs.** Keshav is VerbaFlo's go-to
   for quick tools. He's good at it, but has to consciously slow down
   to not leave half-baked implementations behind. Still working on
   this balance.

He's deliberately careful about what's public vs. proprietary at
VerbaFlo. Architectural specifics and learnings are shareable. Specific
production numbers (revenue, user counts, model costs) are not. For
deeper specifics on his VerbaFlo work, route conversations to him
directly at keshav.madhav@verbaflo.ai.
`,
};

// ============================================================================
// PRUDENTBIT WORK
// ============================================================================

const prudentbitOverview = {
  id: "prudentbit-overview",
  title: "PrudentBit — role, timeline, scope",
  content: `
PrudentBit (https://prudentbit.com/) is a cybersecurity / privacy startup.
Keshav joined as Founding Front-End Engineer in August 2023 (his FIRST
full-time job, while he was still in college) and stayed until August 2025,
when he moved to VerbaFlo. Two full years.

Location: Noida, India (hybrid).

As Employee #1 on the front-end, he designed and shipped the full surface
area of the Immune product suite from zero. No previous front-end existed
— he set the conventions, the build pipeline, the component system, the
deployment story.

He was the SOLE front-end engineer for the first year. Full ownership.
Later, the team grew and he mentored junior engineers who joined.

Key achievements:
- Shipped the entire **Immune product suite** from a blank repo:
  Immunefiles (encrypted storage), Immunevault (encrypted vault for
  sensitive docs), ImmuneShare (encrypted file sharing).
- Led the **ReactJS 18 → Next.js 14 migration** that bumped load times
  by ~5× through SSR + caching + incremental revalidation.
- Built a **real-time admin dashboard** with 15+ interactive graphs,
  partial rendering, and live data streaming — boosted monitoring
  efficiency ~30%.
- Shipped **cross-platform integrations** for Microsoft Teams (Teams
  Toolkit), Outlook (Yeoman generator), Gmail (InboxSDK).
- Built **canvas-based redaction** tool + drag-and-drop file management
  for sensitive document workflows.

Tech: React 18 → Next.js 14, TypeScript, Tailwind, Redux → Zustand,
browser Web Crypto API, various Microsoft / Google integration APIs.

Biggest thing PrudentBit taught him: founding engineering. How to
bootstrap conventions, how to push back on underspecified product asks,
how to balance shipping speed with sustainable architecture.
`,
};

const prudentbitImmune = {
  id: "prudentbit-immune-suite",
  title: "PrudentBit — the Immune product suite in detail",
  content: `
The Immune product suite Keshav shipped at PrudentBit consists of three
related products, all built on end-to-end encryption:

**Immunefiles**: Encrypted file storage. Files uploaded by users are
encrypted in the BROWSER before being sent to the server — PrudentBit's
servers never see plaintext. Features: upload, download, share with
controlled access, folders, search, bulk operations, drag-and-drop.

**Immunevault**: A secure vault for especially sensitive documents.
Additional layer of protection above regular storage. Designed for
documents like passports, IDs, financial records. Includes canvas-based
redaction tools (draw black rectangles over sensitive fields before
sharing).

**ImmuneShare**: End-to-end encrypted file sharing. Share a file with
someone via a link where only they can decrypt it (using their key).
Handles expiring links, access revocation, download tracking without
compromising encryption.

The hard part across all three: SECURITY UX. End-to-end encryption
means the cryptography lives in the browser. Keshav had to make this
usable for non-technical users. Specific challenges:

- **Key recovery flows**: what happens if a user loses their encryption
  key? Traditional password reset doesn't work with E2E encryption.
  Required inventing UX patterns for recovery phrases, social recovery,
  device-bound keys.
- **Error states**: "your file failed to decrypt" is a terrifying error
  message. Had to design UX for the dozens of ways crypto can fail and
  communicate what the user should do.
- **Progress indicators**: encrypting / decrypting a 500MB file takes
  real time in the browser. Had to show actual progress (not fake
  spinners) and allow cancellation.
- **Explaining E2E to users**: most users don't know what "end-to-end
  encrypted" actually means. Had to design explanatory UX without
  slowing down power users.

Months of UX iteration. Keshav says the difference between "secure" and
"secure AND usable" is what made the Immune suite work. He's proud of
it.

What he'd do differently today: "Rebuild it 10× better." Still proud of
what shipped, but with everything learned since, he could push the same
products much further on UX and perf. Not a regret, more a "give me
another swing at it."
`,
};

const prudentbitMigration = {
  id: "prudentbit-nextjs-migration",
  title: "PrudentBit — the Next.js 14 migration story",
  content: `
One of Keshav's flagship accomplishments at PrudentBit was leading the
migration from ReactJS 18 SPA to Next.js 14 App Router with SSR, ISR,
and edge caching. It cut load times roughly in half and doubled perceived
performance.

Why the migration:
- SPA had poor TTI (time to interactive) — 4-6 seconds on mobile
- Sign-up funnel was losing users due to load time
- SEO was impossible (JS-heavy SPA, no server-rendered content)
- Incremental adoption of SSR was the path forward

How he did it (the discipline that made it work):
1. **No big-bang rewrite.** Incremental migration, page-by-page. Each
   page got moved to the App Router individually. Old and new coexisted.
2. **Feature flags** for risky migrations. Each migrated page was behind
   a flag; could roll back in seconds if issues emerged.
3. **Parallel routes.** Some pages needed to exist in both old and new
   forms during transition. Handled via route aliasing and redirects.
4. **Lighthouse-driven targets.** Set specific Lighthouse score targets
   (LCP < 2.5s, TBT < 200ms, CLS < 0.1) rather than "feels faster" vibes.
5. **Measured, not guessed.** Real-user monitoring before and after each
   migration step.

Results:
- Load times cut ~50% (some pages 5× faster due to aggressive ISR)
- Perceived performance doubled
- SEO traffic started growing (pages now server-rendered)
- Migration took roughly 4-6 months total

What he learned:
- **Migration discipline beats raw coding speed.** The instinct to
  "just rewrite it" always seems attractive but always fails. Incremental
  is the only way.
- **Measure everything.** "I think it's faster" doesn't survive a
  Lighthouse report.
- **Feature flags are a superpower.** Every migration should be
  one flag-flip away from rollback.
- **ISR and edge caching matter more than SSR.** Pure SSR is just a
  starting point; the real wins come from caching.

This is one of the patterns he brings to every new codebase now. If
something needs a big change, incremental migration with feature flags
is the default playbook.
`,
};

const prudentbitLessons = {
  id: "prudentbit-lessons",
  title: "PrudentBit — lessons from founding engineer role",
  content: `
What Keshav learned from his two years at PrudentBit:

1. **Ownership at zero-to-one.** Shipping the entire Immune suite from
   a blank repo taught him that setting conventions is harder than
   following them. Every decision (folder structure, naming, state
   management, routing patterns) was his. Some aged well, some he'd
   redo. Learning which is which only comes from living with the
   choices.

2. **Security UX is a skill unto itself.** Months of iteration on the
   Immune suite made him realize that "secure" and "usable" are not
   competing goals if you're willing to iterate. Error states, recovery
   flows, and explanatory UX are where the real work lives.

3. **Migration discipline.** The Next.js migration taught him that
   incremental always beats big-bang, and feature flags are a superpower.

4. **Reading specs vs. shipping.** Founding role meant a lot of "we
   don't have a spec, write the spec." Learned to push back when product
   asked for something underspecified, and to ship rough-draft
   prototypes that forced the spec to crystallize.

5. **Mentoring juniors.** Later in his tenure, PrudentBit hired more
   front-end engineers. Keshav had to transition from "sole IC" to
   "tech lead for a small team." Different skill. Teaching
   conventions is harder than inventing them.

6. **Cross-platform is messy.** Shipping Immunefiles apps for Microsoft
   Teams, Outlook, and Gmail taught him that every platform has its
   own auth flow, its own API quirks, and its own versioning pain.
   The core product logic was shared; the platform layer wasn't.

7. **Canvas is a useful superpower.** Building the canvas-based
   redaction tool gave him experience with imperative graphics
   rendering that later paid off in creative-coding side projects.

The founding front-end role was his entry into professional software
engineering. He thinks of it as his "how to ship" school. VerbaFlo
is his "what to ship" school. Both matter.

If you ask him his hardest week at PrudentBit, he'll probably route you
to email — those stories are best told firsthand. keshav.madhav@verbaflo.ai.
`,
};

// ============================================================================
// FLAGSHIP PROJECTS (deep dives)
// ============================================================================

const projectGridMath = {
  id: "project-grid-math",
  title: "Project — Grid Math (500k GPU points at 60fps)",
  content: `
**Grid Math** is Keshav's flagship creative-coding project.

Links:
- Live demo: https://keshav-madhav.github.io/grid-visualizer/
- GitHub: https://github.com/Keshav-Madhav/grid-visualizer

What it is: 500,000 GPU-rendered points at 60fps, with FFT-driven audio
reactivity and a desktop wallpaper mode that puts the entire field
equation behind your icons. Cross-platform Electron + WebGL shell with
a custom renderer, native Swift audio capture on macOS, and a web build
that runs the same engine in-browser.

Tech: Electron, WebGL, Web Audio API, Swift (for macOS native audio
capture), JavaScript. Stat: 500k GPU points @ 60fps.

(Note: the GitHub repo is called "grid-visualizer" — started as a basic
pathfinding visualizer years ago, evolved into Grid Math. Same repo,
much bigger now.)

What it actually renders: a 2D field of points driven by math equations.
The points arrange themselves into spirals, vortexes, rings, and other
emergent patterns depending on the equation and parameters. When you
hook up live audio input, the FFT data modulates the parameters in
real-time — the points pulse, ripple, and reshape in sync with the
audio.

The hard technical problem:
- Rendering 500,000 points at 60fps means 30 million point-updates per
  second. Canvas 2D won't do that. WebGL is the only option.
- Every point needs position, color, and size — that's 3 attributes.
- Per-frame update: re-compute positions based on equation + audio, push
  to GPU, draw call.

How Keshav got to 500k:
1. First version: Canvas 2D. ~2000 points before stutter.
2. Moved to WebGL with a naive implementation. ~50,000 points.
3. Discovered he was creating new GPU buffers every frame. BIG mistake.
   Refactored to reuse persistent buffers. ~200,000 points.
4. Moved all the equation math from JS to a vertex shader. ~400,000 points.
5. Packed 3 attributes into one vec4 (x, y, hue, size). Fewer attribute
   binds. ~500,000 points at 60fps.

The desktop wallpaper mode is a separate engineering challenge. On macOS,
the wallpaper is a special window layer. He had to write Swift native
bindings that Electron calls into to place the Electron window at the
correct Z-order. On Windows, different API (WorkerW injection). On
Linux, it's per-DE (GNOME, KDE, X11).

The web build runs the same engine — Electron and Web share the
rendering code. Only the audio-capture and desktop-wallpaper pieces
are platform-specific.

Audio reactivity: Web Audio API provides FFT. On macOS, Keshav wrote
Swift code to capture SYSTEM audio (not just mic input) via
ScreenCaptureKit — so the visualizer reacts to whatever music is
playing on your machine. This was non-trivial — Apple restricts
system audio capture for security reasons.
`,
};

const projectLiveJinja = {
  id: "project-live-jinja",
  title: "Project — Live Jinja Renderer (VS Code extension, 10K+ installs)",
  content: `
**Live Jinja Renderer** is Keshav's most-installed open-source project.

Links:
- VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=KilloWatts.live-jinja-renderer
- Open VSX: https://open-vsx.org/extension/KilloWatts/live-jinja-renderer
- GitHub: https://github.com/Keshav-Madhav/live-jinja-renderer
- Web version: https://keshav-madhav.github.io/live_jinja/

Installs: 10,000+ on Open VSX. Published under the "KilloWatts" publisher
ID (Keshav's personal marketplace handle).

What it is: a VS Code / Cursor extension that runs REAL Python Jinja2
templates inside the editor — via Pyodide (WebAssembly Python), not a
JavaScript reimplementation of Jinja syntax. Means you get the full
Jinja2 feature set, including filters, macros, inheritance, whitespace
control.

Features:
- Side-by-side template editor + live preview
- JSON / YAML / TOML variable binding (write variables in the format
  you prefer)
- IntelliSense for 50+ Jinja filters (length, default, join, map, select,
  groupby, etc.) with inline docs
- Hover documentation for filters, tags, tests
- Go-to-definition for user-defined macros
- Output search (Ctrl+F in the preview)
- Markdown + Mermaid rendering in preview (if the rendered output is MD)
- JSON / YAML / TOML switching without losing variable state
- Saves variable sets per template file

The hard part — incremental rendering:
Initial version was regex-based string replacement. Worked for basic
variables, completely broke on loops and control flow.

Version 2 used a full Jinja2 parser, but re-parsing on every keystroke
was slow (~200ms per keystroke killed the "live" feel).

The weekend-eating edge case: Jinja's loop variables (loop.index,
loop.first, loop.last, loop.previtem, loop.nextitem) require execution
context. You can't incrementally re-parse them without knowing the
loop state.

Solution: incremental AST diff with cached intermediate render contexts.
Track which AST nodes changed. For unchanged nodes, reuse cached
rendered output. For changed nodes, re-render only that subtree. Loop
state is cached per-iteration.

This got keystroke latency under 50ms even on large templates, which
makes the "live" feel actually live.

Why Pyodide (WASM Python) instead of a JS port of Jinja?
- Full Jinja2 compatibility (the JS ports miss edge cases)
- Can use real Jinja2 extensions (jinja2-time, etc.)
- "Pyodide is ~10MB" was the tradeoff — loads on first use, then cached
  in the extension's VS Code webview.

The web version (keshav-madhav.github.io/live_jinja) is a zero-install
browser app that runs the same engine. Good for quick-testing a template
without installing VS Code.

Why he built it:
- Was writing Jinja templates at work (config generation, email templates)
- Existing preview tools required saving the file first
- Wanted sub-100ms feedback
- Classic "scratch your own itch" project

Open source, MIT licensed. A few contributors have submitted PRs for bug
fixes and filter additions.
`,
};

const projectCookieClicker = {
  id: "project-cookie-clicker",
  title: "Project — Cookie Clicker Reimagined (full from-scratch remake)",
  content: `
**Cookie Clicker Reimagined** is Keshav's most excessive side project.
He describes it as "a remake that went too far."

Links:
- Play now: https://keshav-madhav.github.io/Cookie-Clicker/
- GitHub: https://github.com/Keshav-Madhav/Cookie-Clicker

What it is: a faithful from-scratch recreation of Orteil's Cookie Clicker,
with additions. Vanilla JS + HTML Canvas, NO game engine. Every system
built from first principles.

Features that actually shipped:
- All buildings (Cursor through Idleverse — the full Orteil tower)
- Upgrade tree with hundreds of items
- Physics-driven prestige tree with camera controls (pan / zoom / focus)
- Per-baker STORY MODALS — each building character has a story you can
  read
- Newspaper statistics screen
- Custom music library with 30+ tracks
- **15+ minigames** (hand-built — each took a full weekend)
- Fully-animated tutorial system
- Golden cookies and wrath cookies
- Prestige system (heavenly chips, ascension, prestige upgrades)
- Achievements
- Sugar lumps
- Seasons and holiday events
- Baker Returns offline report (what happened while you were away)
- Easter eggs and grandmapocalypse-grade hidden content

Stat advertised: 15+ minigames + 30+ music tracks.

The interesting engineering problem — CPU on the upgrade tree:
The upgrade tree has hundreds of items with cascading multipliers. Each
upgrade can modify buildings, other upgrades, golden cookie effects,
etc. The original game re-runs ALL multiplier calculations every frame.
At end-game with 300+ upgrades, this burns ~40% CPU.

Keshav's solution — dirty flag system:
1. Track which upgrades / buildings actually changed this frame
2. Build a dependency graph: upgrade X affects buildings Y and Z
3. Only recompute multipliers for affected branches
4. Cache intermediate values in the multiplier tree
5. Result: late-game CPU dropped from ~40% to under 3%

Commit-level build history (compressed):
1. Started with just clicking and a counter — "how hard can this be?"
2. Added first 5 buildings. Realized multiplier math gets complex fast.
3. First performance crisis at ~50 upgrades. CPU pegged.
4. Built the dependency graph for multiplier propagation.
5. Implemented dirty flags. Massive CPU drop.
6. Added golden cookies (hardest animation timing to get right — they
   need to spawn unpredictably but feel fair).
7. Prestige system. Required save / load architecture rethink (ascension
   erases progress but keeps heavenly chips; needed two save layers).
8. Minigames — each took a full weekend. 15+ weekends.
9. Music library — custom audio mixer, crossfading between tracks.
10. Seasons and holidays added later.
11. Easter eggs sprinkled throughout (some nearly impossible to find).

Time invested:
- First playable version: 2 weeks
- Feature-complete: ~3 months of evenings / weekends
- Still gets occasional updates for bugs and balance

Why he built it:
- Loved the original game. Played it for years.
- Wanted to understand how idle games work under the hood.
- Became a performance optimization playground (dirty flags, save/load,
  animation timing).
- The "just one more feature" loop kept him going. He says he has to
  force himself to NOT add more features.

What it taught him:
- Idle games look simple, are deceptively complex
- Save / load architecture should be designed upfront, not bolted on
- Dirty flags are underrated — applicable everywhere (React, game loops,
  reactive state)
- "Feature complete" is a moving target
- 60fps with no framework is possible if you respect the hot loop

This project is a key reason Keshav is the "optimization junkie" he is.
Cookie Clicker taught him the habit of profiling before optimizing.
`,
};

const projectSpaceSandbox = {
  id: "project-space-sandbox",
  title: "Project — Space Sandbox (N-body gravity sim, 21k bodies @ 30fps)",
  content: `
**Space Sandbox** is the project Keshav is most personally attached to.
It's the intersection of two of his obsessions: simulations and space.

Links:
- Live demo: https://keshav-madhav.github.io/Space-Simulation-HTML-CSS-JS/
- GitHub: https://github.com/Keshav-Madhav/Space-Simulation-HTML-CSS-JS

What it is: an N-body gravity playground. Spawn planets, stars, black
holes, asteroids, and watch them evolve under Newtonian gravity. Scales
from a handful of planets around a black hole to 21,000 bodies at 30fps.

Features:
- N-body gravity with Velocity Verlet integration (numerically stable
  over long timescales)
- Black holes with accretion disks
- Multiple render modes: orbits, velocity trails, gravity heatmaps,
  grid warping, vector fields
- **Space probe mode**: steer a tiny probe through the gravity field and
  see real-time gravitational potential as a live heatmap around you
- Spiral galaxy cluster presets (145 planets orbiting a central black
  hole is one of the showcase images)
- Time controls: play, pause, rewind
- Body spawning with custom mass, velocity, color

Stat advertised: 21k bodies @ 30fps.

The engineering story:

The OLD version (the original "Space Simulation HTML CSS JS") used pure
DOM — each body was a positioned div with computed CSS transforms. NO
canvas, NO WebGL. That version was a framework-free constraint project
to learn how far raw DOM could go. Stable up to ~120 simultaneous bodies
before paint cost became prohibitive.

The CURRENT version uses Canvas + WebGL. Different architecture entirely.
21,000 bodies means 441 million body-body gravitational interactions per
frame if you compute them all naively. That doesn't work. So Keshav
implemented:

- **Barnes-Hut approximation**: O(N log N) instead of O(N²). Group
  distant bodies into clusters; treat each cluster as a single body
  from far away.
- **Spatial hashing**: group bodies into grid cells; only compute
  pairwise forces for nearby cells.
- **GPU for rendering**: WebGL instanced rendering. Draw 21,000 bodies
  in one call.
- **Adaptive time step**: bodies near each other need smaller dt;
  distant bodies can take larger dt. Keeps numerical stability cheap.

The space probe mode is the feature he's proudest of visually. You
control a tiny probe, and around you a live heatmap visualizes the
current gravitational potential. You can feel where the gravity wells
pull you. It's educational and weirdly meditative.

Why no frameworks? Original constraint. Kept it because framework
overhead would have made 21k bodies impossible. This is a playground for
raw performance work.

Space fascination connection: Keshav is obsessed with space. The Space
Sandbox is the direct expression of that obsession in code. He'll talk
for hours about orbital mechanics, the three-body problem, n-body
numerical integration, black hole dynamics, exoplanets, Voyager, JWST,
whatever.

What it taught him:
- DOM has hard performance limits (the old version)
- Spatial data structures (quadtrees for Barnes-Hut) are beautiful
- Numerical integration choice matters (Euler drifts, Verlet is stable)
- GPU instancing is the right tool for "lots of tiny things"
- Space is really cool
`,
};

// ============================================================================
// OTHER PROJECTS (focused deep dives)
// ============================================================================

const projectAxon = {
  id: "project-axon",
  title: "Project — Axon (open source contributor)",
  content: `
**Axon** is a knowledge-graph engine for codebases, built by Harsh Kedia
(Keshav's collaborator). Keshav is a contributing engineer.

Links:
- GitHub: https://github.com/harshkedia177/axon
- Keshav's commits: https://github.com/harshkedia177/axon/commits?author=Keshav-Madhav

Star count: 669 stars on GitHub (as of the site's last update).

What Axon is: a tool that indexes a repository into a structural knowledge
graph (functions, classes, modules, call edges, imports) and exposes it
via MCP (Model Context Protocol) and a Sigma.js-based interactive
dashboard. The MCP layer lets agentic IDEs (Cursor, Claude Code) query
the graph conversationally ("what files import this function?").

Tech: TypeScript (Sigma.js for the graph viz, WebGL for large graph
rendering), Python (for code indexing), MCP protocol.

Keshav's contributions focused on making LARGE GRAPHS readable. When you
index a real-world codebase, you can get graphs with 10,000+ nodes. The
naive force-directed layout turns into a hairball.

He contributed:
- Physics improvements to the force-directed simulation (stronger
  repulsion between unrelated clusters, attraction between connected
  components)
- Render improvements: level-of-detail (LOD) for distant nodes, adaptive
  edge rendering (only draw edges near the viewport), color clustering
  (nodes in the same module get similar hues so clusters pop out visually)
- Optimistic UI updates for the dashboard — when the backend is updating
  the graph, the UI reflects changes immediately and gracefully
  reconciles when the WebSocket-backed real-time channel drops a beat.
  This was the piece he's proudest of technically.

He shipped front-end shell and auth flow for the Axon project early on
when it needed those pieces.

Working with Harsh was a good learning experience. Different collaborator
style, different opinions on front-end architecture — forced him to
consider patterns he wouldn't have picked by default.
`,
};

const projectBrainfuck = {
  id: "project-brainfuck",
  title: "Project — Brainfuck Interpreter (1 billion ops in 6 seconds)",
  content: `
**BF Language Interpreter** — a hand-tuned Brainfuck interpreter in
vanilla JavaScript.

Links:
- Live: https://keshav-madhav.github.io/Making-BF2/
- GitHub: https://github.com/Keshav-Madhav/Making-BF2

Stat: runs 1 BILLION operations in ~6 seconds on a single Web Worker
thread on an Intel i7 14650HX laptop.

The "why" is pure Keshav: he's a HUGE sucker for optimization. He sees a
piece of code and immediately starts asking "why is it like this, how
was it built, how could it be faster?" Brainfuck is the perfect
playground — the language has only 8 instructions, so there's nothing
to hide behind. Raw performance engineering.

Tech: Vanilla JS, Web Workers (to keep the UI thread free), TypedArrays
(for the memory tape).

How he got to 1B ops / 6s (iteratively):

1. **v1 — naive interpreter**: switch-case over instructions, run the
   Brainfuck program instruction by instruction. ~5M ops / sec.
2. **Optimization 1 — TypedArrays**: replaced the tape (usually a
   regular JS array) with a Uint8Array. Hidden class stability, no
   boxing. ~20M ops / sec.
3. **Optimization 2 — instruction pre-processing**: parse the BF source
   into an internal bytecode with pre-computed jump targets (so the open
   and close brackets don't re-search at runtime). ~40M ops / sec.
4. **Optimization 3 — loop fusion**: detect common patterns like
   "bracket-minus-bracket" (zero the current cell), "bracket-minus-plus"
   (move value), and copy patterns, then replace them with dedicated
   fast-path instructions. ~80M ops / sec.
5. **Optimization 4 — tape prefetching**: the hot loop reads the tape;
   explicit TypedArray reads beat the branchy fallback path. ~150M ops / sec.
6. **Optimization 5 — JIT-style translation**: translate the preprocessed
   bytecode into native JavaScript via the "new Function" constructor.
   The interpreter emits JS source and lets V8 JIT-compile it. ~167M
   ops / sec (1B / 6s).

This journey required going deep into V8 internals:
- TypedArrays vs regular arrays: how V8 stores them
- Hidden classes: why changing object shapes is slow
- Branch prediction: why predictable loops matter
- JIT tier transitions: how V8 decides to promote hot code to the
  optimizing compiler (TurboFan)

Keshav wrote this less as a practical tool and more as a performance
playground. It's not the fastest BF interpreter in the world (native C
implementations are faster), but it's among the fastest in pure JS
that he's aware of.

What it taught him:
- JIT compilers are magic, but you can help them (stable hidden classes,
  predictable types, no megamorphic call sites)
- Measurement beats intuition every single time — his intuition about
  what was slow was wrong about half the time
- Optimization is a fractal: every time you think you're done, there's
  another 2× lurking below

This project is a direct expression of Keshav's "optimization junkie"
trait. If someone asks "what makes you tick?" — this is the answer.
`,
};

const projectZenNotes = {
  id: "project-zen-notes",
  title: "Project — Zen Notes (real-time collaborative notes with AI)",
  content: `
**Zen Notes** — real-time collaborative notes with Notion-like editing,
multi-cursor presence, and built-in AI powered by Cloudflare Workers.

Links:
- Live: https://zen-notes-keshav.vercel.app/
- GitHub: https://github.com/Keshav-Madhav/zen-notes

Stack: Next.js, Cloudflare Workers (for AI), LiveBlocks (real-time
multiplayer), Clerk (auth), Firebase.

Features:
- Notion-like block editor with multi-cursor collaborative editing
- Real-time presence (see other users' cursors)
- AI built-in: summarize notes, translate (multiple languages),
  chat-with-document
- Hosted on Cloudflare's edge for low-latency AI responses
- Clerk auth with multiple providers
- Firebase for persistent storage

Why Cloudflare Workers for AI: ultra-low-latency inference at the edge.
Workers have built-in AI endpoints (Workers AI) that run models like
Llama and Mistral without leaving the edge network. Much faster than a
round-trip to a centralized LLM provider.

Built primarily as a learning project to explore real-time
collaboration (LiveBlocks) and edge AI (Cloudflare Workers). Public
and free to use.
`,
};

const projectFizzi = {
  id: "project-fizzi",
  title: "Project — Fizzi Soda Landing (3D product page)",
  content: `
**Fizzi Soda Landing** — an immersive 3D product landing page built as
a showcase of what raw front-end can pull off.

Links:
- Live: https://fizzi-drinks.vercel.app/
- GitHub: https://github.com/Keshav-Madhav/fizzi-drinks

Stack: Next.js, React Three Fiber (R3F), drei (R3F helpers), GSAP
(scroll-triggered animation), Prismic CMS (content-as-data).

Features:
- 3D soda bottle that orbits, tilts, and reveals as you scroll
- GSAP-driven scroll storytelling — each scroll section is a beat in
  the narrative
- Prismic CMS backing so content can change without redeploys
- Physically based materials (glass bottle, liquid inside, condensation
  particles)
- Responsive 3D scene that adapts to mobile

Built as:
- A portfolio showcase piece
- An excuse to learn R3F deeply
- An exploration of scroll-driven 3D narrative (a pattern common in
  high-end product sites like Apple's, but rare in smaller projects)

Fizzi is a demonstration, not a product. If a visitor wants to see what
Keshav can do in 3D for the web, Fizzi is the first link.
`,
};

const projectChatter = {
  id: "project-chatter",
  title: "Project — Chatter (full-stack real-time chat)",
  content: `
**Chatter** — end-to-end real-time chat platform.

Links:
- Live: https://chatter-pink-two.vercel.app
- GitHub: https://github.com/Keshav-Madhav/chatter

Stack: Next.js, Convex (primary state — real-time reactive database),
Supabase (for media storage), Pusher (real-time notifications), Clerk
(auth), LiveKit (video / audio calls).

Features:
- DMs (1:1 chats)
- Groups (multi-user chats)
- Typing indicators
- File sharing (images, docs, videos)
- LiveKit-powered video and audio calls
- Friend management
- Read receipts
- Online / offline status

Built as Keshav's deep-dive into the "real-time full-stack" stack.
Convex as primary state is interesting — it's a reactive database that
streams updates to clients. Unlike typical client-server where you
request data, Convex sends updates when underlying data changes. Makes
chat apps almost trivial.

LiveKit integration for video / audio calls is the feature he's proudest
of technically. WebRTC is notoriously hard; LiveKit abstracts most of
it but you still need to handle signaling, reconnection, and UX
correctly.

Not meant to compete with Discord / Slack — built as a learning project
and public portfolio piece.
`,
};

const projectsOther = {
  id: "projects-other",
  title: "Other projects — shorter summaries",
  content: `
Keshav has 90+ public GitHub repositories. Here are the other notable
ones beyond the flagships already covered:

**Raycaster FPS** (fps-shooter): a Wolfenstein-style raycast shooter in
vanilla JS with custom fog-of-war, per-cell boundary maps, and a
cost-aware dynamic lighting system. Built entirely on Canvas.
- GitHub: https://github.com/Keshav-Madhav/FPS-Shooter-HTML-CSS-JS

**3D Spatial Sim (Boids + N-Body)** (boids-nbody): 3D flocking + N-body
gravity sim with playback, presets, color grading, and export-to-video
with aggressive compression. The output doubles as a generative video
source.
- GitHub: https://github.com/Keshav-Madhav/3d-spatial-sim-for-boid-and-nbody

**Live Jinja (Web)** (live-jinja-web): the same real-Python Jinja2
renderer as the VS Code extension, but as a zero-install web app. Edit
templates and variables side-by-side, with instant rendering via
Pyodide.
- Live: https://keshav-madhav.github.io/live_jinja/
- GitHub: https://github.com/Keshav-Madhav/live_jinja

**Infinite Craft** (infinite-craft): GPT-4o-powered merge game with
infinite crafting. Drag any two items together, the model invents what
they become, and the tree grows from there.
- Live: https://infinite-craft-nine.vercel.app/
- GitHub: https://github.com/Keshav-Madhav/infinite-craft

**Yoom Video Meetings** (yoom): Zoom-clone video-calling app with
instant, scheduled, and recorded meetings. Built on stream.io with
Clerk auth.
- Live: https://zoom-clone-black-sigma.vercel.app/
- GitHub: https://github.com/Keshav-Madhav/zoom-clone

**Tetris** (tetris): a polished Tetris with piece preview, pause / resume,
and clean React state machines.
- Live: https://tetris-keshav-madhav.netlify.app/
- GitHub: https://github.com/Keshav-Madhav/Tetris-Game-React

**ClonePen** (clonepen): a CodePen-style multi-pane HTML / CSS / JS
playground with Firebase-backed pens. Resizable panes, live preview,
project sharing.
- Live: https://codepen-clone-dae8e.web.app/home
- GitHub: https://github.com/Keshav-Madhav/codepen-clone

**JS Game Dev (the 30+ games resume line)**: Space Invaders, Brick
Breaker, Physics maze, 3D Maze, Conway's Game of Life, and many more.
Each is a mix of DSA practice and performance optimization playground.
The throughline: if you can hit 60fps with no engine, you understand
your platform.

**MERN Auth**: a full RESTful auth system on Express + MongoDB —
login, email verification, password reset, account management. Not a
showcase project but a useful reference.

He ships new projects regularly. For the latest, his GitHub is
https://github.com/Keshav-Madhav.
`,
};

const projectsAI = {
  id: "projects-ai-ml",
  title: "AI & Machine Learning Projects",
  content: `
Topics covered here: AI projects, machine learning, reinforcement learning,
sentiment analysis, uno ai, ai battle, llm, draw calculator, sketchculator,
apple calculator clone, handwriting recognition, generative ai projects.

Keshav has several AI/ML side projects beyond his work at VerbaFlo:

**Uno Sim — Reinforcement Learning Agent:**
One of Keshav's most technically impressive ML projects. Built a complete
reinforcement learning pipeline to train an AI agent that learns to play
Uno through self-play. The agent starts knowing nothing about Uno strategy
and through thousands of simulated games, discovers optimal play patterns:
when to hold wild cards vs play them immediately, how to time +4s for
maximum damage, hand management to avoid getting stuck, and reading
opponent hand sizes to decide aggression levels.

Technical implementation: Python with custom game environment following
OpenAI Gym patterns. The reward function was the tricky part — raw
win/loss signal is too sparse, so Keshav designed intermediate rewards
for card reduction, successful blocks, and chain combos. Used Q-learning
initially, then experimented with policy gradient methods. The trained
agent beats random play ~85% of the time and competent human players
about 60% of the time.

What made this hard: Uno has hidden information (you don't know opponent
hands) and high variance (sometimes you just get bad draws). The agent
had to learn probabilistic reasoning without explicit modeling.
GitHub: https://github.com/Keshav-Madhav/Uno_Sim

**Draw Calculator / Sketch-Culator — Apple Calculator Clone:**
Replicates Apple's iPad Math Notes calculator feature. You sketch
handwritten math equations on a canvas and the app solves them live.
Built when Apple announced this feature — Keshav shipped a working clone
within days.

How it works: Canvas captures strokes as the user draws. On each stroke
completion, the canvas is sent to Gemini's vision API which extracts the
mathematical expression. A separate call evaluates the expression and
returns results. The UI shows the solution appearing next to your
handwriting, just like Apple's version.

Features: multiple colors for organization, text insertion for labels,
undo/redo, clear canvas, and a traditional calculator mode as fallback.
The latency is surprisingly good — ~200-400ms from stroke completion to
answer appearing.

What was hard: Getting reliable OCR for messy handwriting. Gemini is
good but not perfect — Keshav added preprocessing (contrast boost, stroke
smoothing) and prompt engineering to improve accuracy on edge cases like
distinguishing "x" (variable) from "×" (multiply).
Live: https://sketchculator.netlify.app/
GitHub: https://github.com/Keshav-Madhav/draw_calculator

**Sentiment Analysis Tool:**
A full sentiment analysis pipeline that classifies text as positive,
negative, or neutral with confidence scores. Built to understand NLP
fundamentals before transformer models made everything easy. Implements
both rule-based (lexicon scoring) and ML-based (trained classifier)
approaches.

Features: paste or type text, get instant classification with explanation
of which words drove the sentiment. Useful for analyzing reviews, tweets,
or any text where you want to gauge emotional tone.
GitHub: https://github.com/Keshav-Madhav/Sentiment-Analysis

**AI Battle JS — Emergent AI Combat:**
A simulation where multiple AI agents with simple rules compete in an
arena. Each agent has basic behaviors: seek food, avoid threats, attack
when advantageous, flee when hurt. The fun is watching complex emergent
behaviors arise from these simple rules — ambush patterns, territory
control, and even primitive cooperation.

No neural networks — just parameterized rule systems. Keshav experimented
with evolving the parameters through genetic algorithms to find optimal
strategies.
GitHub: https://github.com/Keshav-Madhav/AI-Battle-JS

**File Conversation — RAG Chat System:**
A full-stack RAG (Retrieval Augmented Generation) system for chatting
with your documents. Upload PDFs, Word docs, or text files, and ask
questions in natural language. The system chunks your documents, embeds
them, and retrieves relevant context to answer queries accurately.

This was Keshav's first RAG project before building the much more
sophisticated system at VerbaFlo. It taught him the fundamentals: chunking
strategies, embedding model selection, retrieval thresholds, and prompt
construction for grounded answers.

Frontend: TypeScript/React with drag-drop upload and chat interface.
Backend: Python with document parsing, embedding generation, vector
search, and LLM integration.
GitHub: https://github.com/Keshav-Madhav/file_conversation
Backend: https://github.com/Keshav-Madhav/file-conversation-backend

**Infinite Craft — GPT-Powered Merge Game:**
An infinitely expandable crafting game powered by GPT-4o. Start with
basic elements (water, fire, earth, air). Drag any two items together
and the AI invents what they combine into. Water + Fire = Steam. Steam
+ Earth = Mud. The possibilities are literally infinite — the game tree
grows forever.

The magic is in the prompt engineering: getting the AI to be creative
but consistent (combining the same items should give the same result),
and keeping responses short and game-appropriate. Uses caching so repeat
combinations don't cost API calls.
Live: https://infinite-craft-nine.vercel.app/
GitHub: https://github.com/Keshav-Madhav/infinite-craft
`,
};

const projectsGames = {
  id: "projects-games-complete",
  title: "Games & Interactive Projects — Complete List",
  content: `
Topics covered here: games, arcade games, puzzle games, board games,
classic games, tetris, snake, pong, chess, minesweeper, sudoku, 2048,
flappy bird, space invaders, brick breaker, doodle jump, hangman,
slide puzzle, tic tac toe, whack a mole, dinosaur game, minecraft,
3d games, platformer, parkour.

Keshav has built **30+ games**, mostly in vanilla JavaScript with no game
engine. The throughline: if you can hit 60fps without an engine, you truly
understand your platform. Each game taught specific skills:

**BOARD & PUZZLE GAMES:**

**Chess** — Full implementation with ALL rules: castling (both sides),
en passant, pawn promotion, check/checkmate detection, stalemate. The
hardest part was move validation — a move is only legal if it doesn't
leave your king in check, which means every candidate move needs a
lookahead simulation. No AI opponent yet, two-player only.
GitHub: https://github.com/Keshav-Madhav/Chess-HTML-CSS-JS

**Othello/Reversi** — Classic Othello with an AI opponent using minimax
with alpha-beta pruning. The AI looks 4-6 moves ahead depending on
difficulty. Includes move highlighting, score tracking, and valid move
indicators.
GitHub: https://github.com/Keshav-Madhav/Othello-JS

**Sudoku** — Complete Sudoku with puzzle generation, solver, and hints.
The generator creates valid puzzles with unique solutions at various
difficulty levels. The solver uses backtracking with constraint propagation.
GitHub: https://github.com/Keshav-Madhav/Sudoku-HTML-CSS-JS

**Minesweeper** — Classic minesweeper with customizable grid size and
mine count. Implements the recursive reveal algorithm for empty cells.
GitHub: https://github.com/Keshav-Madhav/MineSweeper-JS

**2048** — The sliding number puzzle. Also built a 5x5 variant that's
significantly harder. Clean state management, smooth tile animations.
GitHub: https://github.com/Keshav-Madhav/2048

**ARCADE CLASSICS:**

**Tetris (React)** — Polished Tetris with next-piece preview, hold piece,
ghost piece showing where the current piece will land, scoring with combos
and T-spins. State managed through React with careful attention to avoiding
re-renders during the game loop.
GitHub: https://github.com/Keshav-Madhav/Tetris-Game-React

**Snake** — Multiple versions, from basic to enhanced with power-ups,
obstacles, and speed ramping. Good exercise in queue-based movement and
collision detection.
GitHub: https://github.com/Keshav-Madhav/Snake-Game-Original

**Space Invaders** — Classic arcade shooter with enemy formations, shooting,
shields that degrade when hit, and progressive difficulty. 
GitHub: https://github.com/Keshav-Madhav/Space-Invaders-HTML-CSS-JS

**Brick Breaker** — Breakout clone with ball physics, paddle control,
power-ups (multi-ball, paddle size, slow-mo), and level progression.
GitHub: https://github.com/Keshav-Madhav/Brick-Breaker-HTML-CSS-JS

**Flappy Bird** — The viral game. Gravity + tap physics, pipe generation,
collision detection with rotation-aware hitboxes.
GitHub: https://github.com/Keshav-Madhav/Flappy-Bird-HTML-CSS-JS

**Doodle Jump** — Vertical endless platformer with procedural platform
generation, various platform types (moving, breaking, springs), and
tilt/keyboard controls.
GitHub: https://github.com/Keshav-Madhav/Doodle-Jump-HTML-CSS-JS

**Dinosaur Chrome Game** — Recreation of Chrome's offline T-Rex runner.
Obstacle spawning, jump physics, ducking, day/night cycle, high score.
GitHub: https://github.com/Keshav-Madhav/Dinosaur-Chrome-Game

**ACTION & PLATFORMERS:**

**Multi-Level Platformer** — Parkour-style platformer with multiple
hand-designed levels, checkpoints, hazards (spikes, moving platforms,
enemies), and level progression. Proper collision response, not just
detection. This was Keshav's deep-dive into platformer physics.
GitHub: https://github.com/Keshav-Madhav/Multi-Level-Platformer-HTML-CSS-JS

**Lazer Game** — Puzzle game where you redirect lasers using mirrors,
splitters, and filters to hit targets. Ray tracing for laser paths,
rotation mechanics for mirrors. Each level is a logic puzzle.
GitHub: https://github.com/Keshav-Madhav/Lazer-Game-HTML-JS

**Chain Reaction** — Chain reaction puzzle game where explosions trigger
adjacent cells. Strategy game with multiplayer support.
Live: https://chain-reaction-eta.vercel.app

**3D GAMES:**

**Minecraft JS** — Voxel world rendering in the browser. Procedural terrain
generation with Perlin noise, block placing/breaking, basic lighting,
infinite world (chunked loading). Uses Three.js for rendering but custom
voxel meshing for performance (greedy meshing to reduce triangle count).
Live: https://keshav-madhav.github.io/minecraft-JS/

**3D Maze** — Procedurally-generated 3D mazes with first-person navigation.
Maze generation using recursive backtracking, rendering with Canvas/WebGL.
GitHub: https://github.com/Keshav-Madhav/3D-Maze-HTML-CSS-JS

**ThreeJS RPG** — 3D exploration game built with Three.js. Character
movement, third-person camera, basic world with objects to interact with.
GitHub: https://github.com/Keshav-Madhav/ThreeJS-RPG-Game

**FPS Shooter** — First-person raycast shooter. Raycasting for rendering
(Wolfenstein-style), weapon system, enemy AI, level design.
Live: https://keshav-madhav.github.io/FPS-Shooter-HTML-CSS-JS/

All games are playable directly in the browser. Most have GitHub Pages
deployments. The collection represents Keshav's journey learning game
development fundamentals without relying on engines.
`,
};

const projectsSimulations = {
  id: "projects-simulations",
  title: "Simulation & Physics Projects — Deep Dive",
  content: `
Topics covered here: simulations, physics, n-body, gravity, particles,
falling sand, wave simulation, fourier, raycasting, conway game of life,
perlin noise, boids, fractals, ball physics, billiards, physics maze,
string physics, waves to sound, particle life.

Keshav's simulations are where he explores math, physics, and performance
optimization. Each project pushes Canvas/WebGL to its limits.

**PARTICLE LIFE** — One of the most mesmerizing projects. Colored particles
follow simple attraction/repulsion rules toward other colors. From these
rules, complex life-like behavior emerges: clusters form, move, and seem
to "hunt" each other. Red might be attracted to blue but repelled by green,
while green chases red. The emergent patterns are hypnotic — hours of
watching swarms form, collide, and reform. Based on the viral "Particle
Life" concept. Completely deterministic but looks alive.
GitHub: https://github.com/Keshav-Madhav/Particle-Life

**WAVES TO SOUND** — Interactive tool connecting visual waves to actual
audio. See a wave, hear it. Adjust frequency (pitch), amplitude (volume),
and wave type (sine sounds smooth, square sounds buzzy, sawtooth sounds
harsh). The visualization updates in real-time as you adjust sliders,
and you hear the corresponding changes. Built to truly understand the
relationship between wave math and sound perception.
Live: https://keshav-madhav.github.io/waves-to-sound/

**FALLING SAND** — Classic cellular automaton simulation. Multiple particle
types with different behaviors: sand falls and piles, water flows and
pools, fire rises and spreads, stone is static, acid destroys. Click to
spawn particles, watch physics play out. Performance challenge: updating
thousands of cells per frame without lag.
GitHub: https://github.com/Keshav-Madhav/Falling-Sand-HTML-CSS-JS

**FOURIER DRAWER** — Draw any shape, and the app decomposes it into
Fourier series. Then watch a chain of rotating circles (epicycles)
recreate your drawing, one point at a time. It's a beautiful visualization
of how ANY periodic signal can be represented as a sum of sine waves.
The more epicycles, the more accurate the reproduction.
GitHub: https://github.com/Keshav-Madhav/Fourier-Drawer-HTML-CSS-JS

**WAVE SIMULATION** — 2D wave propagation with interference and reflection.
Drop multiple wave sources and watch interference patterns form. Barriers
cause reflection. Adjustable wavelength, speed, and damping. Great for
understanding wave physics visually.
GitHub: https://github.com/Keshav-Madhav/Wave-Sim-HTML-CSS-JS

**BALL BOUNCE SIM** — Physics playground with bouncing balls. Gravity,
elasticity (bounciness), friction, ball-to-ball collisions with momentum
transfer. Spawn dozens of balls, adjust parameters, watch chaos unfold.
Proper 2D collision resolution was the learning goal.
GitHub: https://github.com/Keshav-Madhav/Ball-Bounce-Sim-HTML-CSS-JS

**PHYSICS MAZE** — Navigate a ball through a maze using tilt/keyboard.
The ball has momentum — you can't stop instantly. Ice patches (low
friction), sand (high friction), moving obstacles. Some levels require
momentum management, not just steering.
GitHub: https://github.com/Keshav-Madhav/Phyisics-maze-HTML-CSS-JS

**BILLIARDS** — Full pool game with realistic physics. Cue aiming and
power control, ball-to-ball collisions, wall bounces, pocketing. The
collision physics (angle of incidence, momentum transfer) were the
hard part.
GitHub: https://github.com/Keshav-Madhav/Billiards-Game-HTML-CSS-JS

**CONWAY'S GAME OF LIFE** — The classic cellular automaton. Draw patterns,
load presets (gliders, glider guns, spaceships), step through generations,
adjust speed. Endless fascination with emergent complexity from simple rules.
GitHub: https://github.com/Keshav-Madhav/Conways-Game-Of-Life-JavaScript

**FRACTAL GENERATOR** — Mandelbrot and Julia set explorer. Infinite zoom
(limited only by floating-point precision), customizable color palettes,
iteration count adjustment. GPU-accelerated for smooth deep zooming.
GitHub: https://github.com/Keshav-Madhav/FractalGen-HTML-CSS-JS

**PERLIN NOISE LOOP** — Procedural noise that loops seamlessly. Used for
generative art, terrain generation understanding, and as a screensaver.
GitHub: https://github.com/Keshav-Madhav/PerlinNoise-Loop-HTML-CSS-JS

**RAYCASTER FPS** — Wolfenstein 3D-style renderer using raycasting. Casts
rays from player viewpoint to render 3D-looking world from 2D map. 
Features fog-of-war (distant walls darker), texture mapping, basic
enemy sprites. All in Canvas 2D, no WebGL.
Live: https://keshav-madhav.github.io/Raycasting-HTML-CSS-JS/

**RUST PARTICLE SIM** — Rebuilt particle physics in Rust to learn the
language. Ownership model was tricky but forced good architecture.
Performance was noticeably better than JavaScript version.
GitHub: https://github.com/Keshav-Madhav/rust_particle_sim
`,
};

const projectsWebApps = {
  id: "projects-web-apps",
  title: "Web Applications & Tools",
  content: `
Topics covered here: web apps, full stack, tools, clones, zoom clone,
threads clone, spotify clone, netflix clone, youtube clone, pinterest,
uber eats, codepen clone, video call, notes app, task manager, docs app.

**FULL-STACK APPS:**
- **Chatter**: Discord-clone with real-time chat, servers, channels,
  video calls via LiveKit, Convex backend.
  Live: https://chatter-pink-two.vercel.app
- **Yoom/Zoom Clone**: Video meetings with instant, scheduled, recorded
  meetings. Stream.io + Clerk auth.
  Live: https://zoom-clone-black-sigma.vercel.app/
- **Threads/Knots**: Threads-style social app.
  Live: https://knotsapp-killos-projects.vercel.app
- **Zen Notes**: Modern note-taking app.
  Live: https://zen-notes-keshav.vercel.app
- **Docs Mini App**: Google Docs-style collaborative editing.
  Live: https://docs-mini-app-react-phi.vercel.app
- **Task Manager**: Task management app in React.
  GitHub: https://github.com/Keshav-Madhav/Task_manager-_React

**CLONES (learning projects):**
- **Netflix Clone**: Netflix UI recreation.
  GitHub: https://github.com/Keshav-Madhav/Netflix-clone--React-
- **Spotify Clone**: Spotify UI.
  GitHub: https://github.com/Keshav-Madhav/Spotify-Clone--React-
- **YouTube Clone**: YouTube UI.
  GitHub: https://github.com/Keshav-Madhav/Youtube-Clone--React-
- **Pinterest Clone**: Pinterest UI.
  GitHub: https://github.com/Keshav-Madhav/Pinterest-Clone--React-
- **UberEats Clone**: UberEats UI.
  GitHub: https://github.com/Keshav-Madhav/UberEats-Clone--React-
- **ClonePen/CodePen Clone**: Multi-pane HTML/CSS/JS playground.
  GitHub: https://github.com/Keshav-Madhav/codepen-clone

**TOOLS:**
- **Live Jinja (VS Code)**: Real-time Jinja2 preview with Pyodide.
  Marketplace: https://marketplace.visualstudio.com/items?itemName=KilloWatts.live-jinja-renderer
- **Live Jinja (Web)**: Same as above, browser-based.
  Live: https://keshav-madhav.github.io/live_jinja/
- **Grid Visualizer**: DSA visualization tool for grids/pathfinding.
  Live: https://keshav-madhav.github.io/grid-visualizer/
- **Retention Radar**: Analytics dashboard.
  Live: https://retention-radar.vercel.app
- **SplitEase**: Bill splitting app.
  GitHub: https://github.com/Keshav-Madhav/SplitEase
- **MERN Authorization**: Full auth system boilerplate.
  GitHub: https://github.com/Keshav-Madhav/mern-authorization
- **CarHub**: Next.js car showcase.
  GitHub: https://github.com/Keshav-Madhav/CarHub-Next_TS

**VIDEO:**
- **Video Call**: WebRTC video calling.
  GitHub: https://github.com/Keshav-Madhav/videocall
`,
};

const projectsExperimental = {
  id: "projects-experimental",
  title: "Experimental & Learning Projects",
  content: `
Topics covered here: experiments, learning, rust, webgl, custom formats,
image format, kesh format, kif, custom encoding, low level, systems
programming, internship analysis, valentine, animations, axon.

Keshav uses side projects to explore technologies at a deeper level than
work usually allows. These are learning-focused, often unfinished, but
represent genuine curiosity.

**KESH IMAGE FORMAT (.kif) — Custom Image Encoding:**
A from-scratch custom image format to understand how image encoding works.
Rather than just using PNG/JPEG, Keshav built his own format with:
- Custom header structure (magic bytes, dimensions, color depth)
- Run-length encoding for compression
- Custom pixel packing
- Encoder and decoder in JavaScript

The goal wasn't to beat existing formats (it doesn't) but to understand
the decisions PNG/JPEG make. Writing a format spec, implementing it,
and debugging edge cases taught more about image encoding than any
tutorial could.
GitHub: https://github.com/Keshav-Madhav/kesh-image-format

**AXON — Code Intelligence Graph Engine:**
A graph-powered code intelligence engine. Indexes codebases into a
knowledge graph exposed via MCP tools for AI agents. Still in development,
but the vision is: point it at a codebase, it builds a semantic graph
of relationships (function calls, imports, inheritance, data flow), then
exposes that graph to AI agents for intelligent code navigation and
understanding.
GitHub: https://github.com/Keshav-Madhav/axon

**WEBGL LEARNING:**
Raw WebGL experiments without Three.js or other abstractions. Shaders,
buffer management, matrix transforms, texture mapping — the hard way.
Keshav believes understanding the layer below makes you better at the
layer above. This fed into his Space Sandbox WebGL renderer.
GitHub: https://github.com/Keshav-Madhav/WebGL-Learning

**RUST LEARNING:**
Multiple Rust projects to learn the language:
- **hello_world**: First Rust project, understanding ownership
- **rust_particle_sim**: Particle physics rebuilt in Rust
The borrow checker was initially frustrating but taught better memory
management patterns that transferred back to other languages.
GitHub: https://github.com/Keshav-Madhav/rust_particle_sim

**DSA PRACTICE:**
Data structures and algorithms practice in Java. Standard interview prep
but also genuine interest in algorithm design. Includes implementations
of trees, graphs, sorting, searching, dynamic programming problems.
GitHub: https://github.com/Keshav-Madhav/DSA-Practice

**GRID VISUALIZER:**
Interactive tool for visualizing pathfinding algorithms. See BFS, DFS,
Dijkstra's, A* run step-by-step on custom grids. Draw walls, place
start/end points, watch the algorithm explore. Great for understanding
how different algorithms approach the same problem differently.
Live: https://keshav-madhav.github.io/grid-visualizer/

**FIZZI DRINKS:**
3D animated soda can landing page built with Three.js. The can rotates,
liquid sloshes, and the whole thing responds to scroll. A showcase of
3D web capabilities and scroll-driven animation.
Live: https://fizzi-drinks.vercel.app

**INTERNSHIP ANALYSIS:**
Data analysis and visualization project examining internship data.
Charts, graphs, and insights from real data.
GitHub: https://github.com/Keshav-Madhav/internship-analysis

**VALENTINE PLEASEEEE:**
A cute valentine's day request page. Button runs away when you try to
click "No", eventually you're forced to click "Yes". Built for fun.
GitHub: https://github.com/Keshav-Madhav/valentine-pleaseeee

**PORTFOLIO SITES:**
Keshav has built multiple portfolio sites over the years:
- **Portfolio (old)**: Earlier version, simpler
- **Portfolio Website (current)**: This site — Next.js 14 App Router,
  real-time multiplayer cursors (Ably), companion spirit guide orb,
  RAG-powered chat, 6 rounds of documented performance optimization.
  Live: https://portfolio-website-rust-phi.vercel.app
`,
};

// ============================================================================
// DETAILED PER-PROJECT CHUNKS
// ============================================================================

const projectAxonDeepDive = {
  id: "project-axon-deep-dive",
  title: "Axon — MCP-Powered Code Knowledge Graph (Deep Dive)",
  content: `
Topics covered here: axon, mcp, model context protocol, code intelligence,
knowledge graph, code graph, ai agent tools, codebase indexing, semantic
search, impact analysis, dead code detection, community detection, leiden
algorithm, bm25, vector search, hybrid search, call graph, execution flow.

**Axon** is Keshav's most sophisticated MCP (Model Context Protocol) project.
It's a graph-powered code intelligence engine that indexes any codebase into
a structural knowledge graph, then exposes it through smart MCP tools so AI
agents (Claude Code, Cursor) never miss code.

**The Problem Axon Solves:**
When an AI agent edits UserService.validate(), it doesn't know that 47
functions depend on that return type, 3 execution flows pass through it,
and payment_handler.py changes alongside it 80% of the time. Breaking
changes ship because AI agents work with flat text — they grep for callers,
miss indirect ones, and have no understanding of how code is *connected*.

**How Axon Works:**
A 12-phase pipeline runs once over your repo:
1. Walking files — finds all source files
2. Parsing code — builds AST for each file
3. Tracing calls — resolves 800+ call relationships
4. Analyzing types — maps type relationships
5. Detecting communities — Leiden algorithm finds clusters
6. Detecting execution flows — traces from entry points
7. Finding dead code — multi-pass unreachable symbol detection
8. Analyzing git history — finds change coupling patterns
9. Generating embeddings — 384-dim vectors for semantic search

**MCP Tools Exposed:**
- \`axon_impact("validate")\` — returns all affected symbols grouped by
  depth (will break / may break / review) with confidence scores
- \`axon_query("auth handler")\` — hybrid-ranked results grouped by
  execution flow, not flat name matches
- \`axon_context("UserService")\` — callers, callees, type refs,
  community membership, dead code status

**Technical Implementation:**
- **Hybrid Search**: BM25 + vector (BAAI/bge-small-en-v1.5) + fuzzy,
  fused with Reciprocal Rank Fusion
- **Impact Analysis**: Traces upstream through call graph, type refs,
  and git coupling history
- **Dead Code Detection**: Not just "zero callers" — understands
  framework patterns, exempts entry points, exports, decorators,
  Protocol conformance
- **Execution Flows**: Framework-aware entry point detection
  (@app.route, @click.command, test_* functions, __main__ blocks)
- **Community Detection**: Leiden algorithm via igraph finds functional
  clusters automatically

**Key Innovation:**
Most code intelligence gives agents raw files and hopes they read enough.
Axon precomputes structure at index time so every tool call returns
complete, actionable context. One tool call instead of a 10-query search
chain. Even smaller models get full architectural clarity.

**Zero Cloud Dependencies:** Everything runs locally — parsing, graph
storage, embeddings, search. No API keys, no data leaving your machine.

Usage:
\`\`\`bash
pip install axoniq
cd your-project && axon analyze .
axon serve --watch  # MCP server with live reload
axon ui             # Web UI at localhost:8420
\`\`\`

GitHub: https://github.com/Keshav-Madhav/axon
`,
};

const projectVfSimulationMcp = {
  id: "project-vf-simulation-mcp",
  title: "VerbaFlo CID MCP Server — Conversation Intelligence Tools",
  content: `
Topics covered here: vf-simulation, verbaflo mcp, mcp server, cid,
conversation intelligence, trace exploration, opik traces, elasticsearch,
model context protocol, ai debugging tools, vf-cid, widget tester.

**VerbaSuper (vf-simulation)** is Keshav's Electron desktop app at VerbaFlo
that includes a first-class **MCP Server** exposing Conversation Intelligence
Data (CID) and trace exploration tools to AI assistants.

**The MCP Server** (\`mcp/server.ts\`) uses \`@modelcontextprotocol/sdk\`:

\`\`\`typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
\`\`\`

**Tools Exposed:**

1. **cid_fetch** — Fetch a conversation by lead ID:
   - Pulls from MongoDB (vf-core conversations)
   - Returns full message history, lead data, PMS queries
   - Supports multiple environments (production, staging, testing)

2. **cid_enrich** — Enrich messages with Opik traces:
   - For each bot message, fetches the Opik trace that generated it
   - Shows router decisions, Text2SQL queries, FAQ retrieval
   - Critical for debugging "why did the bot say that?"

3. **cid_investigate** — Combined fetch + enrich:
   - One-shot fetch conversation and enrich all messages
   - Most common operation for debugging

4. **trace_search** — Search Elasticsearch traces:
   - Find traces by text, time range, client
   - Useful for finding patterns across conversations

5. **trace_spans** — Get spans within a trace:
   - Drill into trace internals
   - See individual LLM calls, retrievals, decisions

6. **trace_by_id** — Fetch specific trace:
   - Direct lookup when you have a trace ID

**Formatting Layer:**
All tools have careful output formatting (fmtTs, fmtRole, fmtLeadData,
fmtPmsData, fmtConversation) to make responses readable for both humans
and LLMs.

**Parity Constraint:**
The MCP server (mcp/server.ts) must stay in parity with the in-app HTTP
server (src/main/mcp/localMcpServer.ts). Both expose identical tool names,
schemas, and formatters so AI clients see identical behavior over either
transport.

**Setup:**
\`\`\`bash
npm run mcp:setup
npm run mcp:build
# Then add to .mcp.json or Claude/Cursor settings
\`\`\`

**Why This Matters:**
Before this MCP server, debugging a bad bot response meant:
1. Open VerbaSuper manually
2. Paste lead ID
3. Wait for enrichment
4. Read through traces
5. Manually correlate with conversation

With MCP tools, an AI agent can investigate in seconds:
"Why did the bot say X to lead abc123?" → Agent calls cid_investigate,
reads the trace, identifies the router decision that led to the response.

This is the tooling that makes VerbaFlo's AI debuggable by AI.
`,
};

const projectVfCopilotDeepDive = {
  id: "project-vf-copilot-deep-dive",
  title: "VerbaFlo Copilot — Multi-Agent Internal Tool (Deep Dive)",
  content: `
Topics covered here: vf-copilot, multi-agent, copilot, internal tool,
mongodb query, postgres query, milvus, faq search, analyst agent,
text to sql, t2s, natural language to database, verbaflo internal.

**vf-copilot** is VerbaFlo's internal multi-agent system that answers
natural-language questions by querying MongoDB, PostgreSQL, and Milvus
in parallel, then synthesizing results through an Analyst agent.

**Architecture:**
\`\`\`
User Question
     ↓
  Orchestrator
     ↓
   Triage Agent (classifies question type)
     ↓
  ┌──────────────────────────────────────┐
  │  Parallel Specialist Agents:         │
  │  • 8 Mongo Specialists (diff DBs)    │
  │  • Milvus FAQ Agent                  │
  │  • Postgres Property Agent           │
  └──────────────────────────────────────┘
     ↓
  Analyst Agent (synthesizes, streams response)
     ↓
  SSE Streaming to User
\`\`\`

**Technical Stack:**
- FastAPI with async throughout
- Motor (async MongoDB)
- asyncpg (async PostgreSQL)
- pymilvus for vector search
- OpenAI + Anthropic via LiteLLM
- Instructor for structured outputs
- Opik for tracing
- Jinja2 for prompts

**Key Features:**

1. **Schema Sampling:**
   On startup, samples schemas from MongoDB collections into context.
   LLM knows what fields exist without loading full schemas.

2. **Query Expansion:**
   For FAQ search, expands user query into multiple variations
   to improve recall.

3. **Hybrid Milvus Search:**
   Combines dense vectors with sparse (BM25-style) for FAQ retrieval.

4. **Streaming:**
   Analyst streams its response via SSE. Users see thinking in real-time.

5. **Follow-ups:**
   Session memory enables multi-turn conversations. "What about last month?"
   works because context is preserved.

**Example Queries It Handles:**
- "How many leads did client X get last week?"
- "What's the conversion rate for property Y?"
- "Show me all conversations where the bot mentioned pricing"
- "Which FAQ is triggered most often?"
- "Compare response times across clients"

**What Keshav Built:**
The Milvus FAQ agent, the schema sampling system, and the streaming
infrastructure. The parallel query pattern was his design — run all
specialists simultaneously, let the fastest inform the analyst first.

Note: The "MCP" mentioned in copilot's docs means "Multi-agent Conversation
Protocol" (agent handoffs), NOT the Anthropic Model Context Protocol.
`,
};

const projectCookieClickerDeepDive = {
  id: "project-cookie-clicker-deep-dive",
  title: "Cookie Clicker Reimagined — Full Clone (Deep Dive)",
  content: `
Topics covered here: cookie clicker, incremental game, idle game, clicker
game, grandmapocalypse, wrinklers, prestige, heavenly chips, stock market,
arbitrary precision, bignum, vanilla js game, optimization.

**Cookie Clicker Reimagined** is a complete from-scratch clone of the
original Cookie Clicker, built in vanilla JavaScript with no frameworks.

**Why This Project Matters:**
Cookie Clicker seems simple but hides incredible complexity. Keshav's clone
implements nearly every feature of the original — a 10K+ line codebase that's
a masterclass in incremental game design and JavaScript optimization.

**Features Implemented:**

**Core Mechanics:**
- Click to produce cookies
- 15+ building types (Cursor, Grandma, Farm, Mine, Factory, Bank, Temple...)
- Each building has base CPS (cookies per second)
- 200+ upgrades that modify production
- Golden cookies that spawn randomly with bonuses

**Prestige System:**
- Heavenly chips earned on reset
- Prestige upgrades that persist across runs
- Prestige multiplier that grows with each reset

**Grandmapocalypse:**
- Special event triggered by certain upgrades
- Grandmas become "Grandmatriarchs"
- Wrinklers spawn and "eat" your cookies
- Clicking wrinklers gives back 1.1x what they ate
- Elder Pledge/Covenant to appease them

**Stock Market Minigame:**
- Buy/sell goods that fluctuate
- Office upgrades affect trading
- Loans with interest

**Technical Implementation:**

**Arbitrary Precision Math:**
Cookie counts can exceed JavaScript's number precision (10^308+).
Keshav implemented a CookieNum class handling arbitrary-precision arithmetic:
\`\`\`javascript
class CookieNum {
  // Handles numbers beyond JavaScript's limits
  // Custom add, multiply, divide, format
}
\`\`\`

**Performance Optimization:**
- Particle system with caps (\_particleMaxNonAmbient)
- Throttled visual updates (not every frame)
- DOM caching for frequently accessed elements
- RequestAnimationFrame-based game loop

**Architecture:**
\`\`\`
main.js
  └── js/game.js (Game class)
        ├── Building (production)
        ├── Upgrade (modifications)
        ├── PrestigeManager
        ├── VisualEffects (particles, rain)
        ├── SoundManager
        ├── SaveLoadMixin (localStorage)
        ├── NewspaperMixin
        └── WrinklerManager
\`\`\`

**What Made This Hard:**
- Balancing the economy (numbers that feel right)
- Performance at scale (10^15 cookies/second with particles)
- State management (hundreds of upgrade interactions)
- The sheer scope — implementing 5+ years of original features

Play: https://keshav-madhav.github.io/Cookie-Clicker/
GitHub: https://github.com/Keshav-Madhav/Cookie-Clicker
`,
};

const projectFpsShooterDeepDive = {
  id: "project-fps-shooter-deep-dive",
  title: "FPS Raycaster — Wolfenstein-Style Shooter (Deep Dive)",
  content: `
Topics covered here: fps shooter, raycaster, raycasting, wolfenstein,
doom style, dda algorithm, fog of war, 3d rendering, canvas 2d, pseudo 3d,
vanilla javascript game, texture mapping.

**FPS Shooter** is a Wolfenstein 3D-style first-person shooter built
entirely in vanilla JavaScript with Canvas 2D — no WebGL, no Three.js.

**How Raycasting Works:**
The classic technique from Wolfenstein 3D: cast rays from the player's
viewpoint, one for each vertical column of the screen. When a ray hits
a wall, calculate the distance and draw that wall column proportionally
taller (closer = taller).

**Technical Implementation:**

**DDA (Digital Differential Analyzer) Algorithm:**
\`\`\`javascript
// Cast ray until it hits a wall
while (!hit) {
  if (sideDistX < sideDistY) {
    sideDistX += deltaDistX;
    mapX += stepX;
    side = 0; // NS wall
  } else {
    sideDistY += deltaDistY;
    mapY += stepY;
    side = 1; // EW wall
  }
  if (map[mapX][mapY] > 0) hit = true;
}
\`\`\`

**Z-Buffer:**
Maintains depth information for each column to properly composite
sprites and transparent surfaces.

**Fog of War:**
- Distance-based darkening (distant walls fade)
- Per-cell boundary maps track which cells are visible
- Dynamic lighting system with cost awareness

**Floor Casting:**
Renders the floor/ceiling using similar raycasting principles,
but per-pixel instead of per-column.

**Architecture:**
\`\`\`
script.js (entry)
  ├── core/
  │   ├── GameLoop.js
  │   ├── RaycastManager.js
  │   └── InputManager.js
  ├── utils/
  │   └── render3DFunction.js (main renderer)
  ├── maps/
  │   ├── testMap.js
  │   ├── mazeMap.js
  │   └── showcaseMap.js
  ├── ui/
  │   └── HUD, minimap
  └── entities/
      ├── UserClass.js (player)
      └── enemies
\`\`\`

**Performance Optimizations:**
- LOD (Level of Detail) by distance threshold
- Pre-allocated typed arrays for render caches
- Three stacked canvases (background, main, minimap)
- Column-batching for wall rendering

**Features:**
- Multiple map types (test, maze, showcase, enemy test)
- Enemy AI with basic pathfinding
- Minimap showing player position and FOV
- Weapon system
- FPS overlay

**What Made This Hard:**
- Getting the math right (fisheye correction, wall heights)
- Texture mapping without WebGL
- Performance — 60fps with hundreds of rays per frame
- The "feel" — movement speed, mouse sensitivity, collision response

Live: https://keshav-madhav.github.io/FPS-Shooter-HTML-CSS-JS/
GitHub: https://github.com/Keshav-Madhav/FPS-Shooter-HTML-CSS-JS
`,
};

const projectSpaceSandboxDeepDive = {
  id: "project-space-sandbox-deep-dive",
  title: "Space Sandbox — N-Body Gravity Simulation (Deep Dive)",
  content: `
Topics covered here: space sandbox, n-body simulation, gravity simulation,
barnes-hut, quadtree, orbital mechanics, celestial bodies, black holes,
canvas physics, webgl particles, astronomy simulation.

**Space Sandbox** is a high-performance browser-based gravitational sandbox
that simulates orbital mechanics with up to 21,000 bodies at 30fps.

**The N-Body Problem:**
Every body attracts every other body. With N bodies, that's O(N²) force
calculations per frame. At 60fps with 1000 bodies, that's 60 million
calculations per second. This doesn't scale.

**Barnes-Hut Algorithm:**
The breakthrough: distant bodies can be approximated as a single mass.
Build a quadtree (2D) or octree (3D) where each node stores:
- Center of mass of all bodies inside
- Total mass of all bodies inside

For each body, traverse the tree:
- If node is far enough (θ = node_width / distance < threshold), treat
  it as one body
- If too close, recurse into children

This reduces O(N²) to O(N log N). Keshav implemented this with an
object pool (BHNodePool, BHNode) to avoid GC pressure.

**Technical Implementation:**

**PhysicsSystem.js:**
\`\`\`javascript
class PhysicsSystem {
  constructor() {
    this.bhTree = new BarnesHutTree();
    this.nodePool = new BHNodePool(10000);
  }
  
  step(bodies, dt) {
    this.bhTree.build(bodies, this.nodePool);
    for (const body of bodies) {
      const force = this.bhTree.calculateForce(body);
      body.applyForce(force, dt);
    }
  }
}
\`\`\`

**Multi-Canvas Layering:**
\`\`\`
Canvas 1: Background stars (static, rarely redrawn)
Canvas 2: Trails (accumulated, fades slowly)
Canvas 3: Bodies (redrawn every frame)
\`\`\`

**Features:**
- Spawn different body types: planets, stars, black holes
- Presets: three-body, cluster, galaxy spiral, solar system
- Collisions and merges (conservation of momentum + mass)
- Trails showing orbital paths
- Camera: pan, zoom, follow body, follow center of mass
- Time scale control (speed up/slow down simulation)
- FPS overlay

**Body Types:**
- **Planet**: Standard mass, no special properties
- **Star**: Higher mass, glows
- **Black Hole**: Extreme mass, no visual escape radius but pulls hard

**What Made This Hard:**
- Barnes-Hut implementation (edge cases everywhere)
- Performance at scale (typed arrays, object pooling)
- Numerical stability (bodies getting too close → forces explode)
- The "feel" — making orbits look natural requires careful softening

Live: https://keshav-madhav.github.io/Space-Simulation-HTML-CSS-JS/
GitHub: https://github.com/Keshav-Madhav/Space-Simulation-HTML-CSS-JS
`,
};

const project3dNBodyDeepDive = {
  id: "project-3d-nbody-deep-dive",
  title: "3D N-Body Simulation — Canvas 2D Rendering (Deep Dive)",
  content: `
Topics covered here: 3d n-body, 3d gravity simulation, octree, barnes-hut 3d,
leapfrog integration, canvas 2d 3d, weak perspective, no webgl 3d,
gravitational softening.

**3D N-Body Sim** renders real-time 3D gravitational physics using ONLY
Canvas 2D — no WebGL, no Three.js. This was an intentional constraint to
understand projection math deeply.

**The Challenge:**
Render a true 3D simulation where bodies move in X, Y, Z space, using only
Canvas 2D's lineTo, arc, fillRect primitives.

**Weak Perspective Projection:**
\`\`\`javascript
// Project 3D point to 2D screen
function project(x, y, z, camera) {
  const dx = x - camera.x;
  const dy = y - camera.y;
  const dz = z - camera.z;
  
  // Rotate around camera
  const [rx, ry, rz] = rotatePoint(dx, dy, dz, camera.rotation);
  
  // Perspective divide
  const scale = camera.focalLength / (camera.focalLength + rz);
  return {
    screenX: rx * scale + canvas.width / 2,
    screenY: ry * scale + canvas.height / 2,
    depth: rz,
    scale: scale
  };
}
\`\`\`

**Barnes-Hut Octree (3D):**
Same principle as quadtree but in 3D. Each node has 8 children instead of 4.
Significantly more complex to implement correctly.

**Leapfrog Integration:**
More stable than Euler for orbital mechanics:
\`\`\`javascript
// Half-step velocity, full-step position, half-step velocity
v += (a * dt) / 2;
x += v * dt;
a = calculateAcceleration(x);
v += (a * dt) / 2;
\`\`\`

**Gravitational Softening:**
Prevents infinite forces when bodies get very close:
\`\`\`javascript
const force = G * m1 * m2 / (distance² + softening²);
\`\`\`

**Rendering Pipeline:**
1. Project all bodies to screen coordinates
2. Z-sort (painter's algorithm — draw far to near)
3. Frustum culling (don't draw off-screen bodies)
4. Draw with size based on projected depth

**Camera Modes:**
- Free camera (WASD + mouse look)
- Orbit around point
- Follow specific body
- Follow center of mass

**Features:**
- Same body types as 2D version (planets, stars, black holes)
- 3D trails
- 3D starfield background
- Multiple spawn presets
- Collision detection in 3D (sphere-sphere)

**What Made This Hard:**
- Matrix math for camera rotation (easy to mess up axes)
- Z-sorting performance (sort every frame)
- Depth-based sizing that looks right
- Octree implementation (8x complexity vs quadtree)

GitHub: https://github.com/Keshav-Madhav/3D_N-Body_Sim
`,
};

const projectGridVisualizerDeepDive = {
  id: "project-grid-visualizer-deep-dive",
  title: "Grid Visualizer / Grid Math — WebGL Particle System (Deep Dive)",
  content: `
Topics covered here: grid visualizer, grid math, webgl, point sprites,
particle system, audio visualization, microphone input, electron app,
creative coding, generative art, dot grid, wave modes.

**Grid Visualizer** is an Electron desktop app that renders an infinite
dot grid driven by math wave modes, mouse forces, and audio input. The
flagship creative coding project with 500K+ GPU particles.

**Technical Architecture:**

**WebGL Point Sprites:**
\`\`\`javascript
// Vertex shader
attribute vec2 a_position;
attribute float a_size;
attribute vec4 a_color;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  gl_PointSize = a_size;
}

// Fragment shader — draw circle, not square
void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  if (length(coord) > 0.5) discard;
  gl_FragColor = v_color;
}
\`\`\`

**Interleaved Float32Array:**
\`\`\`javascript
// Pack all particle data contiguously
// [x, y, vx, vy, size, r, g, b, a, ...]
const STRIDE = 9;
const particles = new Float32Array(MAX_DOTS * STRIDE);
\`\`\`

**Wave Modes:**
- Ripple: Circular waves from center or mouse
- Spiral: Particles rotate around center
- Vortex: Sucking spiral effect
- Interference: Multiple wave sources
- Gravity: Particles fall and bounce
- Noise: Perlin noise displacement
- Text: Particles arrange into text

**Physics System:**
\`\`\`javascript
for each particle:
  // Spring back to home position
  force += (home - position) * springK;
  
  // Neighbor repulsion
  for each neighbor within radius:
    force += repel(neighbor);
  
  // Mouse interaction
  force += mouseForce(mousePos, position);
  
  // Apply with damping
  velocity = velocity * damping + force * dt;
  position += velocity * dt;
  
  // Sleep optimization
  if (velocity < threshold) sleep = true;
\`\`\`

**Audio Integration:**
- Microphone input via Web Audio API
- System audio capture (macOS: requires Swift helper)
- Custom FFT length for frequency analysis
- Beat detection drives wave intensity

**Electron Features:**
- Tray behavior (minimize to tray)
- Transparent window mode (use as wallpaper)
- Fullscreen mode
- Theme system
- Auto-update via electron-updater

**Performance:**
- 50K+ particles at 60fps
- Sleep optimization: particles that aren't moving skip physics
- WebGL batching: one draw call for all particles
- Float32Array: no GC pressure from particle data

**Native Helpers:**
macOS audio capture requires native code. Keshav's Swift helpers:
- Capture system audio
- Get now-playing info
- Path to helpers in package.json build config

Live (web version): https://keshav-madhav.github.io/grid-visualizer/
GitHub: https://github.com/Keshav-Madhav/grid-visualizer
`,
};

const projectMinecraftJsDeepDive = {
  id: "project-minecraft-js-deep-dive",
  title: "Minecraft JS — Voxel Engine in the Browser (Deep Dive)",
  content: `
Topics covered here: minecraft js, voxel engine, voxel rendering, three.js,
greedy meshing, chunked world, procedural terrain, simplex noise, biomes,
block placing, infinite world, web workers, off-main-thread meshing, slippy-map
minimap, fixed-timestep physics, uncapped fps, webgl 3d.

**Minecraft JS** is a browser-based voxel world with procedural terrain, biomes,
block interaction, and infinite chunks — built with Three.js and TypeScript
(Vite). After a large optimization pass it now does most of its heavy work off
the main thread and holds steady FPS on much bigger view distances.

**The Voxel Challenge:**
A naive approach renders each block as a cube (6 faces, 12 triangles). A
16-wide, 256-tall chunk is tens of thousands of blocks = millions of triangles,
for just one chunk. With a 3×3+ ring of loaded chunks around the player, WebGL
chokes.

**Greedy Meshing (real, in a worker):**
\`chunkMesh.ts\` is a pure greedy mesher — deliberately free of Three.js and the
DOM so it runs inside a Web Worker. It merges adjacent faces of the same block
type into larger quads (a flat 16×16 stone floor becomes 1 quad, not 256), and
splits output into shadow-casters vs non-casters (leaves/clouds) so the shadow
pass stays cheap. Indices pack into Uint16 when a group fits under 65,535 verts
(half the index VRAM/upload bandwidth across thousands of streamed chunks),
falling back to Uint32 only for a pathological fully-exposed chunk.

**Off-main-thread generation + meshing (the headline optimization):**
A pool of stateless gen+mesh Web Workers each takes a chunk coordinate, runs the
deterministic Simplex-noise terrain function, AND greedily meshes the result —
all off the render thread. The trick that makes this clean: cross-chunk border
faces are culled by *sampling the neighbour's deterministic surface height* (a
1-block "ghost-cell" apron) rather than waiting for the neighbour chunk to load.
So each chunk meshes EXACTLY ONCE, correctly, with no cache and no neighbour
re-mesh. Only player-edited borders get re-meshed on the main thread (which has
the real edited data). Being stateless makes the workers trivially poolable.

**Chunked, infinite world:**
- Only chunks within view distance are loaded; far chunks are unloaded.
- Chunk-gen requests in flight to the worker pool are capped per frame, and
  finished worker results are turned into THREE meshes on a per-frame budget, so
  a teleport into fresh terrain never freezes the frame.
- Three.js frustum-culls every chunk mesh automatically (no custom culling).

**Procedural terrain + biomes:**
Seeded Simplex noise (not Perlin) drives surface height, with separate octaves
for base terrain and hills, plus resource/ore generation, trees, water level,
and clouds. Biomes apply a vertex tint and per-biome water color; biome-aware
lighting is a toggle.

**The slippy-map minimap (a second worker):**
A separate Web Worker renders minimap tiles at 128px and caches them with an LRU
cap. It uses multiple world-size "zoom levels" (128 → 16384) like a slippy map,
so the number of visible tiles stays bounded at ANY zoom — without that, zooming
out needed thousands of tiles and thrashed the cache. Tile world-size is chosen
so each tile draws ~1 tile-pixel per screen-pixel (crisp, never upscaled).

**Physics + interaction:**
- Fixed-timestep AABB-vs-voxel physics (200 Hz sim rate, gravity, accumulator)
  decoupled from the render rate.
- Raycast from the camera to find the target block; place on its face or break it.
- Pickaxe tool with a mining animation, a toolbar of block types, and save/load
  of player-edited blocks via a DataStore.

**Uncapped FPS:**
requestAnimationFrame is hard-locked to the display refresh rate, which hides FPS
differences. To render uncapped, the loop is driven by a \`MessageChannel\`
(no minimum-delay clamp the way \`setTimeout(0)\` has), toggled by an "uncap FPS"
setting in the GUI.

**What made this hard:**
- Border culling without neighbour data (solved with deterministic ghost cells).
- Keeping meshing off the main thread while edits still feel instant.
- Bounding minimap tile counts across many zoom levels.
- Water transparency and z-fighting at distance (the thin sliver above water).

Live: https://keshav-madhav.github.io/minecraft-JS/
GitHub: https://github.com/Keshav-Madhav/minecraft-JS
`,
};

const projectLiveJinjaDeepDive = {
  id: "project-live-jinja-deep-dive",
  title: "Live Jinja Renderer — VS Code Extension (Deep Dive)",
  content: `
Topics covered here: live jinja, vs code extension, jinja2, pyodide,
python in browser, template preview, real-time rendering, developer tools,
intellisense, extension development.

**Live Jinja Renderer** is a VS Code extension for real-time Jinja2 template
preview using actual Python Jinja2 via Pyodide (Python compiled to WebAssembly).

**10,000+ Installs** on the VS Code Marketplace.

**Why This Extension:**
Most Jinja preview tools use JavaScript approximations of Jinja2 syntax.
They break on advanced features (macros, custom filters, whitespace control).
Keshav's extension runs REAL Python Jinja2, so it matches production exactly.

**Technical Architecture:**

**Pyodide Integration:**
\`\`\`javascript
// In webview
const pyodide = await loadPyodide();
await pyodide.loadPackage('jinja2');

const result = pyodide.runPython(\`
import jinja2
env = jinja2.Environment()
template = env.from_string(template_str)
output = template.render(variables)
output
\`);
\`\`\`

**Extension Components:**
\`\`\`
extension.js (entry point)
  ├── jinjaRendererViewProvider (webview panel)
  ├── IntelliSense provider
  ├── Decorators (syntax highlighting)
  └── Commands
\`\`\`

**Features:**

**Real-Time Preview:**
- Edit template, see output instantly
- Variable panel (JSON/YAML/TOML input)
- Split view: template left, output right

**Jinja Features Supported:**
- Variables: {{ var }}
- Control structures: {% if %}, {% for %}, {% macro %}
- Includes and extends: {% include 'partial.jinja' %}
- Filters: {{ name | upper }}
- Custom filters: define in variables panel
- Whitespace control: {%- -%}, {{- -}}

**IntelliSense:**
- Autocomplete for variables (reads from variable panel)
- Autocomplete for Jinja keywords
- Hover documentation

**Additional Features:**
- Markdown rendering toggle (for .md.jinja templates)
- Mermaid diagram support
- Dependency graph visualization
- Variable inspector
- Preset import/export
- Detached preview window

**AI Integration Hooks:**
- Error debugging integration
- Template generation suggestions

**Development Challenges:**
- Pyodide initial load is slow (~2s). Cached after first load.
- Variable panel sync with active editor
- Handling Jinja errors gracefully (show meaningful messages)
- Template inheritance (resolving {% extends %} paths)

**Usage at VerbaFlo:**
The entire vf-prompts system uses Jinja2 templates. This extension became
essential for prompt engineers to iterate quickly without deploying.

VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=KilloWatts.live-jinja-renderer
Open VSX: https://open-vsx.org/extension/KilloWatts/live-jinja-renderer
GitHub: https://github.com/Keshav-Madhav/live-jinja-renderer
`,
};

const projectBoidsSim = {
  id: "project-boids-sim-deep-dive",
  title: "3D Boids + N-Body — Python Physics Simulation (Deep Dive)",
  content: `
Topics covered here: boids, flocking simulation, n-body python, numba,
pygame, pyopengl, spatial hashing, gpu simulation, video export,
barnes-hut python, metal backend.

**3D-boids** is actually two projects in one repo:
1. Real-time 3D boids (flocking) visualization
2. Large-scale N-body gravity with recording/playback

**3D BOIDS SIMULATION:**

**Boid Rules:**
\`\`\`python
@njit  # Numba JIT compilation
def boid_rules(positions, velocities, ...):
    for i in prange(n_boids):  # Parallel loop
        # Separation: steer away from nearby boids
        # Alignment: match velocity of neighbors
        # Cohesion: steer toward center of neighbors
        
        # Spatial hashing for neighbor lookup
        cell = get_cell(positions[i])
        neighbors = cells[cell] + adjacent_cells
\`\`\`

**Spatial Hashing:**
Instead of O(N²) neighbor checks, divide space into cells. Each boid only
checks its own cell and adjacent cells. With proper cell size (~2× boid
perception radius), this is nearly O(N).

**OpenGL VBOs:**
\`\`\`python
class Flock:
    def __init__(self):
        self.vbo = glGenBuffers(1)
        # Store positions in GPU buffer
        glBindBuffer(GL_ARRAY_BUFFER, self.vbo)
        glBufferData(GL_ARRAY_BUFFER, positions, GL_DYNAMIC_DRAW)
\`\`\`

**N-BODY GRAVITY:**

**Barnes-Hut Octree (Python):**
Python with Numba JIT. The README documents extensive optimization:
- Object pooling for tree nodes
- Parallel force calculation with prange
- GPU backends for truly large simulations

**GPU Backends:**
- CUDA backend (NVIDIA)
- Metal backend (Apple Silicon) — custom Metal shaders!

**Recording System:**
\`\`\`bash
python tools/record.py --preset galaxy --frames 3600
# Records to .npz (compressed NumPy)
# Then export to video with ffmpeg
\`\`\`

**Technical Stack:**
- Python 3
- Pygame for window management
- PyOpenGL for rendering
- NumPy + SciPy for math
- Numba for JIT compilation
- zstandard for compression

**Performance:**
- Boids: 10,000+ at 60fps with Numba
- N-body: Depends on GPU backend, but handles 100K+ bodies

**What Makes This Special:**
The combination of real-time visualization AND offline recording with
video export. Used as a generative video source — the compressed outputs
become art pieces.

GitHub: https://github.com/Keshav-Madhav/3d-spatial-sim-for-boid-and-nbody
`,
};

const projectDrawCalculatorDeepDive = {
  id: "project-draw-calculator-deep-dive",
  title: "Draw Calculator / Sketch-Culator — Gemini Vision (Deep Dive)",
  content: `
Topics covered here: draw calculator, sketchculator, apple calculator clone,
ipad math notes, handwriting recognition, gemini vision, canvas drawing,
ocr, math solver.

**Draw Calculator (Sketch-Culator)** replicates Apple's iPad Math Notes
calculator feature: sketch handwritten math equations and get live solutions.

**How It Works:**

1. **Drawing Layer:**
   \`\`\`javascript
   canvas.addEventListener('pointerdown', startStroke);
   canvas.addEventListener('pointermove', drawStroke);
   canvas.addEventListener('pointerup', endStroke);
   
   function endStroke() {
     // Debounce: wait 500ms after last stroke
     clearTimeout(recognitionTimer);
     recognitionTimer = setTimeout(recognize, 500);
   }
   \`\`\`

2. **Recognition (Gemini Vision):**
   \`\`\`javascript
   async function recognize() {
     const imageData = canvas.toDataURL('image/png');
     
     const response = await gemini.generateContent([
       {
         inlineData: {
           mimeType: 'image/png',
           data: imageData.split(',')[1]
         }
       },
       "Extract the mathematical expression from this handwriting. 
        Return ONLY the expression, nothing else."
     ]);
     
     const expression = response.text;
     const result = await evaluate(expression);
     displayResult(result);
   }
   \`\`\`

3. **Evaluation:**
   Separate API call (or local math.js) to safely evaluate the expression.

**Features:**
- **Multiple Colors**: Organize equations with different colors
- **Text Insertion**: Add typed labels alongside drawings
- **Undo/Redo**: Full stroke history
- **Clear Canvas**: Start fresh
- **Traditional Calculator**: Fallback mode with buttons

**Preprocessing:**
\`\`\`javascript
function preprocessCanvas() {
  // Increase contrast
  // Smooth strokes (Bezier interpolation)
  // Crop to content
  // Resize to optimal dimension for API
}
\`\`\`

**Prompt Engineering:**
Getting reliable OCR for messy handwriting required iteration:
- Explicit instruction to distinguish "x" (variable) from "×" (multiply)
- Examples of ambiguous symbols
- Request for structured output format

**Performance:**
- ~200-400ms from stroke completion to answer
- Debouncing prevents multiple API calls during drawing
- Canvas preprocessing improves accuracy

**What Was Hard:**
- Handwriting variability (everyone writes differently)
- Mathematical notation (fractions, exponents, roots)
- Latency management (feel instant while waiting for API)
- Edge cases: "x" vs "×", "1" vs "l", "0" vs "O"

Live: https://sketchculator.netlify.app/
GitHub: https://github.com/Keshav-Madhav/draw_calculator
`,
};

const projectChainReaction = {
  id: "project-chain-reaction",
  title: "Chain Reaction — Strategy Puzzle Game",
  content: `
Topics covered here: chain reaction, strategy game, puzzle game, multiplayer
game, cell explosion, turn based game.

**Chain Reaction** is a strategic chain reaction game where players take
turns placing orbs in cells. When a cell reaches critical mass, it explodes
and sends orbs to adjacent cells, potentially triggering cascading reactions.

**Game Rules:**
- Grid of cells, each can hold limited orbs based on position
  - Corner cells: max 2 orbs
  - Edge cells: max 3 orbs
  - Inner cells: max 4 orbs
- Players take turns placing orbs in their cells
- When a cell hits critical mass, it explodes:
  - Orbs fly to adjacent cells
  - Adjacent cells may also explode
  - Chain reactions can wipe the board
- Capture opponent's cells by exploding into them
- Last player with orbs wins

**Technical Implementation:**
\`\`\`typescript
interface Cell {
  orbs: number;
  owner: Player | null;
  criticalMass: number;  // Based on position
}

function placeOrb(x: number, y: number, player: Player) {
  const cell = grid[y][x];
  cell.orbs++;
  cell.owner = player;
  
  if (cell.orbs >= cell.criticalMass) {
    explode(x, y);
  }
}

async function explode(x: number, y: number) {
  const cell = grid[y][x];
  cell.orbs = 0;
  
  // Animate explosion
  await animateExplosion(x, y);
  
  // Send orbs to neighbors
  for (const [nx, ny] of getNeighbors(x, y)) {
    grid[ny][nx].orbs++;
    grid[ny][nx].owner = cell.owner;  // Capture!
    
    if (grid[ny][nx].orbs >= grid[ny][nx].criticalMass) {
      await explode(nx, ny);  // Chain reaction
    }
  }
}
\`\`\`

**Features:**
- 2-8 player support
- Animated explosions and chain reactions
- Board size options
- Win detection

**Strategy Depth:**
- Corner cells are safest (only 2 to explode)
- Setting up chain reactions is key
- Defensive play vs aggressive expansion
- Reading opponent's near-critical cells

Live: https://chain-reaction-eta.vercel.app
GitHub: https://github.com/Keshav-Madhav/chain_reaction
`,
};

const projectOthello = {
  id: "project-othello",
  title: "Othello / Reversi — Minimax AI",
  content: `
Topics covered here: othello, reversi, board game, minimax, alpha-beta
pruning, game ai, strategy game.

**Othello** (Reversi) implementation with an AI opponent using minimax
search with alpha-beta pruning.

**Game Rules:**
- 8×8 board, two players (black and white)
- Place disc to outflank opponent's discs
- Outflanked discs flip to your color
- Most discs at end wins

**AI Implementation:**

**Minimax with Alpha-Beta:**
\`\`\`javascript
function minimax(board, depth, alpha, beta, maximizing) {
  if (depth === 0 || gameOver(board)) {
    return evaluate(board);
  }
  
  const moves = getValidMoves(board);
  
  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = makeMove(board, move);
      const eval = minimax(newBoard, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) break;  // Prune
    }
    return maxEval;
  } else {
    // Similar for minimizing player
  }
}
\`\`\`

**Evaluation Function:**
\`\`\`javascript
function evaluate(board) {
  let score = 0;
  
  // Disc count
  score += (myDiscs - oppDiscs) * 1;
  
  // Corners (most valuable)
  score += countCorners(board, me) * 25;
  
  // Edges (valuable)
  score += countEdges(board, me) * 5;
  
  // Mobility (available moves)
  score += getValidMoves(board, me).length * 3;
  
  return score;
}
\`\`\`

**Difficulty Levels:**
- Easy: depth 2
- Medium: depth 4
- Hard: depth 6

**Features:**
- Move highlighting (show valid moves)
- Flip animation
- Score tracking
- Undo move
- Game history

GitHub: https://github.com/Keshav-Madhav/Othello-JS
`,
};

const projectVfAiBackend = {
  id: "project-vf-ai-backend",
  title: "VerbaFlo AI Backend — Main Orchestration System",
  content: `
Topics covered here: vf-ai, verbaflo backend, ai orchestration, fastapi,
rag pipeline, property search, faq retrieval, llm routing, multi-tenant,
conversation ai, student accommodation.

**vf-ai** is VerbaFlo's main FastAPI AI backend that powers prospect chat
across webchat, WhatsApp, email, SMS, voice (VAPI), and social channels.

**What It Does:**
When a prospective tenant messages a property (via any channel), vf-ai:
1. Classifies the query (FAQ? Property search? Booking? General chat?)
2. Routes to appropriate handler
3. Retrieves relevant context (property details, FAQs, conversation history)
4. Generates response via LLM
5. Tracks analytics, updates CRM

**Technical Stack:**
- **FastAPI** with async throughout
- **MongoDB** (Motor) for conversations, leads, config
- **Redis** for caching, rate limiting
- **Milvus** for vector search (FAQs, embeddings)
- **LiteLLM** for multi-provider LLM routing (OpenAI, Gemini, Claude)
- **Opik** + Elasticsearch for observability
- **Jinja2** for prompt templates (from vf-prompts)

**Architecture:**
\`\`\`
Request → Middleware Stack
  ├── Global config middleware
  ├── Client config middleware (multi-tenant)
  └── Context vars for region/industry/settings

→ Router
  ├── /client/* (client management)
  ├── /prompt/* (prompt CRUD)
  ├── /customer/* (conversation handling)
  ├── /vapi/* (voice integration)
  └── /campaign/* (outbound campaigns)

→ Flow Handlers
  ├── FAQ flow (Milvus semantic search)
  ├── PMS flow (property management query)
  ├── Lead extraction flow
  ├── Booking flow
  └── General conversation flow
\`\`\`

**Key Keshav Contributions:**
- The flow routing system
- Milvus FAQ integration
- Opik tracing integration (kibana_trace)
- Client-specific behavior system
- Prompt injection from MongoDB

**Multi-Tenant Architecture:**
Each client (property company) has their own:
- Prompts (customized tone, information)
- FAQ corpus (their specific FAQs)
- Property data (their buildings)
- Configuration (response style, features enabled)

All isolated via middleware that injects client context before handlers run.

**Observability:**
Every conversation is traced:
- Which flow was triggered
- What context was retrieved
- What the LLM saw and generated
- Performance metrics

This feeds into vf-simulation for debugging (why did the bot say X?).
`,
};

const projectVfPrompts = {
  id: "project-vf-prompts",
  title: "VerbaFlo Prompts — Prompt Management System",
  content: `
Topics covered here: vf-prompts, prompt engineering, prompt management,
jinja2 templates, mongodb sync, version control, prompt versioning.

**vf-prompts** is VerbaFlo's single source of truth for all AI prompts.
Jinja2 templates organized on disk, synced to MongoDB for runtime use.

**Why This System:**
- Prompts are code. They need version control.
- But runtime needs fast lookup from MongoDB.
- Solution: disk is source of truth, MongoDB is synced.

**Directory Structure:**
\`\`\`
prompts/
  ├── faq_response/
  │   ├── default/
  │   │   ├── system.jinja
  │   │   └── user.jinja
  │   ├── client_abc/
  │   │   └── system.jinja  # Client override
  │   └── config.json
  ├── lead_extraction/
  │   ├── default/
  │   └── config.json
  └── ...
\`\`\`

**Sync Flow:**
\`\`\`bash
python sync_prompt.py
# 1. Read all prompts from disk
# 2. Validate Jinja syntax
# 3. Validate config.json schemas
# 4. Push to MongoDB collections:
#    - default_prompts (base prompts)
#    - <client>_prompts (overrides)
\`\`\`

**Runtime Resolution (in vf-ai):**
\`\`\`python
def get_prompt(key: str, client_id: str) -> str:
    # Check client-specific first
    prompt = db[f"{client_id}_prompts"].find_one({"key": key})
    if prompt:
        return prompt["template"]
    
    # Fall back to default
    return db["default_prompts"].find_one({"key": key})["template"]
\`\`\`

**Template Variables:**
\`\`\`jinja
{# system.jinja #}
You are an assistant for {{ client_name }}.

{% if property_details %}
Property Information:
{{ property_details | tojson }}
{% endif %}

{{ conversation_history }}
\`\`\`

**Pre-commit Validation:**
- Jinja syntax check (catches template errors before deploy)
- Config schema validation
- Required fields check

**Why Keshav Built the Live Jinja Extension:**
Working on vf-prompts, he needed fast iteration on templates. The VS Code
extension lets prompt engineers see rendered output instantly without
deploying to test environment.
`,
};

// ============================================================================
// DEVELOPMENT TIMELINES & EVOLUTION STORIES
// ============================================================================

const devTimelineSpaceSim = {
  id: "dev-timeline-space-sim",
  title: "Space Sandbox Development Timeline — 2+ Years of Evolution",
  content: `
Topics covered here: space sandbox development, how space sim was built,
why barnes-hut, development process, evolution, timeline, history,
performance optimization journey.

**Space Sandbox** was developed over **2+ years** (Dec 2023 - Feb 2026), 
evolving from a basic gravity simulator to a sophisticated physics engine.

**PHASE 1: Foundation (Dec 2023)**
- Dec 15, 2023: Initial commit - basic gravity between bodies
- Dec 15: Added trails to visualize orbits
- Dec 16: Camera system with follow mode, labels for names/velocity
- Dec 17: Background stars, black holes, body interactions
- Dec 18: Improved collision handling

**PHASE 2: Core Features (2024)**
- Feb 2024: FPS display, performance improvements
- Mar 2024: Cluster spawning, toggle options
- Aug 2024: Constant FPS function, collision toggles
- Oct 2024: Major UI overhaul - added three-body spawning (T key),
  density-based weight calculation, spawning UI, camera smoothing
- Oct 23: **Major refactor** - broke code into separate files for
  maintainability, added JSDoc types
- Nov 2024: Solar system preset, camera drag, trail optimization using
  ring buffer and point elimination

**PHASE 3: Barnes-Hut Revolution (Dec 2024)**
- Dec 6, 2024: **BREAKTHROUGH** - Implemented Barnes-Hut algorithm
  "Revamped physics system for gravity calculation using barnes-hut
  SIGNIFICANT performance improvement"
- Dec 7: Moved collision detection to use Barnes-Hut for additional gains

**WHY Barnes-Hut?**
Before: O(N²) force calculations. 1000 bodies = 1 million calculations/frame.
After: O(N log N). Same bodies = ~10,000 calculations. 100x improvement.

The insight: distant bodies can be approximated as a single mass point.
A quadtree groups nearby bodies, and if a node is "far enough" (θ threshold),
treat all bodies in that node as one. This is exact same approach used by
actual astrophysics simulations.

**PHASE 4: Polish & WebGL (2025)**
- Mar-Aug 2025: Trajectory preview, time scale control, velocity optimization
- Sep 2025: Pinning, mass transfer toggle, glow effects, adaptive trail
  decimation, Path2D caching for performance
- Dec 2025: **WebGL rendering** for bodies and trails (massive perf gain)

**PHASE 5: Scientific Visualization (Feb 2026)**
- Feb 4, 2026: Added probe mode for gravity observability
- Feb 4: "Added comprehensive scientific visualisations for heatmap,
  grid warping, contours and vector arrows"

**Performance Evolution:**
- Initial: ~100 bodies before lag
- After trail optimization: ~500 bodies
- After Barnes-Hut: ~5,000 bodies at 60fps
- After WebGL: **21,000 bodies at 30fps**

**Key Technical Decisions:**
1. **Quadtree with object pooling** - Avoid GC pressure by reusing nodes
2. **Ring buffer for trails** - Constant memory regardless of simulation length
3. **Multi-canvas layering** - Separate background/trails/bodies for partial redraws
4. **Leapfrog integration** - More stable than Euler for orbital mechanics

GitHub: https://github.com/Keshav-Madhav/Space-Simulation-HTML-CSS-JS
`,
};

const devTimelineCookieClicker = {
  id: "dev-timeline-cookie-clicker",
  title: "Cookie Clicker Development Timeline — From Basic to Full Clone",
  content: `
Topics covered here: cookie clicker development, how cookie clicker was built,
development process, grandmapocalypse implementation, prestige system,
minigames, sound design.

**Cookie Clicker Reimagined** evolved over **1 year** (Mar 2025 - Mar 2026)
from a basic clicker to a feature-complete 10K+ line clone.

**PHASE 1: Core Loop (Mar 2025)**
- Mar 13: Initial mechanics - clicking, buildings, pricing
- Mar 14: Balancing, bug fixes

**PHASE 2: Feature Explosion (Feb 2026)**
This is where the project took off:

- Feb 12: Tons of upgrades, achievements, animations, milk visualization,
  middle window with baker counts
- Feb 12: Tutorial system, easter eggs with fun prompts
- Feb 12: Dynamic cookie rain (raining cookies that match click rate)
- Feb 13: Encrypted localStorage (security), offline earnings calculation
- Feb 13: Better balancing with cost acceleration
- Feb 14: **Prestige system overhaul** - late game progression,
  animated banners, stylized baker rows, custom icons

**WHY Prestige matters:**
Without prestige, incremental games hit a wall. Numbers get meaningless.
Prestige gives players a reason to reset: trade current progress for
permanent multipliers. It's the "new game+" that keeps players engaged.

Keshav's prestige system: resets all cookies but grants "heavenly chips"
based on total cookies earned. These chips unlock permanent upgrades.
Balanced so first prestige feels impactful (~2x boost) but later prestiges
have diminishing returns.

**PHASE 3: Sound & Music (Mar 2026)**
- Mar 1: Sound library, clicking symphonies, 1.5x sync bonus
- Mar 2: Ambient sounds, now-playing indicator, music player
- Mar 14: Full soundtrack with custom compositions, volume 3 music
- Mar 15: Bug fixing, balancing around music feedback

**PHASE 4: Grandmapocalypse (Mar 2026)**
- Mar 14: **Implemented Grandmapocalypse** - the major late-game event
  where grandmas become sinister, wrinklers spawn, and you must choose:
  appease them (Elder Pledge) or embrace chaos for bonuses

**HOW Grandmapocalypse works:**
1. Buy "One Mind" upgrade - grandmas start acting weird
2. Wrath cookies replace golden cookies (can be bad or good)
3. Wrinklers spawn - they drain your CPS but pay back 1.1x when popped
4. Visual transformation - grandmas change appearance

**PHASE 5: Minigames (Mar 2026)**
- Mar 21: Safe cracker (TLOU2-inspired dial puzzle)
- Mar 21: Dungeon crawl (turn-based combat with smart AI)
- Mar 21: Cookie launch (slingshot physics)
- Mar 21: Cookie wordle (baking-themed word guessing)
- Mar 22: Cookie alchemy, Cookie Chronicle newspaper
- Mar 22: Balance pass, achievement updates

**Technical Challenges Solved:**
1. **Arbitrary precision math**: CookieNum class for numbers > 10^16
2. **Particle performance**: Caps, pooling, throttled updates
3. **Save corruption**: Encrypted localStorage with validation
4. **Sound sync**: Music beats aligned with click feedback

GitHub: https://github.com/Keshav-Madhav/Cookie-Clicker
`,
};

const devTimelineFpsShooter = {
  id: "dev-timeline-fps-shooter",
  title: "FPS Raycaster Development — From Copy to Custom Engine",
  content: `
Topics covered here: fps shooter development, raycasting evolution,
how raycaster was built, fog of war, lighting system, floor casting.

**FPS Shooter** development: Aug 2024 - Mar 2026, evolved from copied
raycasting code to a custom engine with unique features.

**PHASE 1: Foundation (Aug 2024)**
- Aug 16: "Copy over existing code from raycasting project"
- Aug 16: **Critical fix** - "Removed all bloat code, completely fixed
  fish eye lens effect, added darkness mapping to texture, improved
  performance" (6-hour coding session!)
- Aug 17: Minor adjustments

**WHY fisheye correction matters:**
Raw raycasting produces a "fishbowl" effect - walls curve outward because
rays at screen edges travel further than center rays. Fix: multiply distance
by cos(angle from center). This single fix transforms unusable distortion
into a convincing 3D effect.

**PHASE 2: Code Architecture (Nov 2024)**
- Nov 16: **Major refactor** - Separated classes into files, defined
  structure, cleaned up entire codebase
- Nov 17: Added gradient background, delta time, textures class
- Nov 17: Pointer lock API for smooth camera movement
- Nov 18: Minimap system, user class restructure
- Nov 20-22: Boundary rotation, enemy class with detection and movement,
  enemy AI with turret-like auto-rotation

**PHASE 3: Advanced Features (Jan 2026)**
- Jan 8: Tiled textures, curved wall optimization
- Jan 10: **Multiple innovations in one session:**
  - Uncapped FPS mode
  - Translucent walls (alpha blending in raycaster!)
  - Map switching system
  - Maze generation algorithm
- Jan 10: Proper collision physics (not just detection)
- Jan 11: Jumping and crouching with depth perception shift
- Jan 18: Alert timer, enemy range fixes, path visualization
- Jan 21: Major code structure update, scoring system
- Jan 28: Wall collision fixes, control remapping
- Jan 31: **Floor casting** - rendering floor/ceiling (not just walls)
- Jan 31: Fog of war map, web worker offloading for better FPS

**PHASE 4: 3D Camera & Lighting (Mar 2026)**
- Mar 5: **Vertical camera movement** using y-shearing
  "Added vertical camera movement support using y-shearing to allow
  full 3D camera movement"
- Mar 5: **Advanced lighting system** (at cost of performance)
- Mar 6: Performance tracking, boundary management optimization
- Mar 7: Visual improvements, QoL features

**WHY y-shearing for vertical look:**
True vertical camera in raycasting requires recalculating every ray.
Y-shearing is a trick: keep rays horizontal, but shift the rendered
column up/down based on look angle. It's "fake" but visually convincing
and much cheaper than true 3D raymarching.

**Technical Evolution:**
- Initial: Basic Wolfenstein clone
- Final: Floor/ceiling casting, dynamic lighting, fog of war,
  vertical look, enemy AI, procedural mazes, web workers

GitHub: https://github.com/Keshav-Madhav/FPS-Shooter-HTML-CSS-JS
`,
};

const devTimelineLiveJinja = {
  id: "dev-timeline-live-jinja",
  title: "Live Jinja Extension Development — 6 Months to 10K+ Installs",
  content: `
Topics covered here: live jinja development, vs code extension evolution,
how live jinja was built, pyodide integration, intellisense implementation,
feature development timeline.

**Live Jinja Renderer** grew from a simple preview to a full IDE experience
in **6 months** (Oct 2025 - Mar 2026), reaching **10,000+ installs**.

**PHASE 1: MVP (Oct 2025)**
- Oct 17: Initial extension - basic Jinja preview
- Oct 18-19: UI improvements, variable extraction, auto-resize
- Oct 20: **v1.1.0** - Variable presets (save/load configurations)
- Oct 25-28: Bug fixes, extraction fixes, file update handling

**WHY Pyodide was chosen:**
Most Jinja preview tools use JavaScript approximations. They fail on:
- Custom filters, macros, whitespace control
- Template inheritance ({% extends %})
- Python-specific behavior

Pyodide runs REAL Python/Jinja2 in WebAssembly. Initial load is slow (~2s)
but then behavior matches production exactly. No JavaScript approximation.

**PHASE 2: Power Features (Nov 2025)**
- Nov 3: **v1.3.0** - Clickable error navigation, visual highlighting
- Nov 5-7: Ghost save (auto-save variables), context menu actions
- Nov 8: Selection-based rendering (render just a portion)
- Nov 9-10: Enhanced variable extraction (40+ filters, ternary, slices)
- Nov 11: Import/export system for variables
- Nov 12: **v1.6.0** - Jinja2 extensions support (i18n, loops, etc.)
- Nov 13: **v1.7.0** - MAJOR: Complete IntelliSense system
- Nov 22-23: **v1.8.0** - Detached output window, performance improvements
- Nov 25-29: Mermaid diagram support, template includes/extends

**HOW IntelliSense was implemented:**
1. Parse active template to find all variables, macros, blocks
2. Build completion provider with types inferred from usage
3. Hover provider shows macro signatures, filter documentation
4. Go-to-definition jumps to macro/block definitions
5. Semantic tokenization for syntax highlighting

**PHASE 3: AI Integration (Dec 2025)**
- Dec 6: **v1.10.0** - Smart data generator for test data
- Dec 6: GitHub Copilot integration for variable generation
- Dec 6: OpenAI API integration with streaming
- Dec 7: Gemini API + Anthropic Claude integration
- Dec 13: Variable inspector, dependency graph visualization
- Dec 18: **v1.11.1** - AI-powered error analysis with root cause detection

**PHASE 4: Polish (Jan-Mar 2026)**
- Jan 31: AI debugger upgrade (GPT-5.2, Claude Opus 4.5)
- Feb 7: Cursor-to-output synchronization
- Feb 15: Output search with highlighting
- Feb 22: Standard editor shortcuts for Jinja comments
- Mar 5: **v1.12.0** - Multi-format variables (JSON, YAML, TOML)

**Growth Timeline:**
- v1.0: Basic preview
- v1.5: Selection rendering, presets, import/export
- v1.7: Full IntelliSense
- v1.10: AI-powered features
- v1.12: Multi-format support, 10K+ installs

**Why it succeeded:**
1. Solves real problem (accurate Jinja preview)
2. Works with real Python, not approximation
3. Constant feature iteration based on user feedback
4. AI features make it feel modern

Marketplace: https://marketplace.visualstudio.com/items?itemName=KilloWatts.live-jinja-renderer
`,
};

const devTimelineGridVisualizer = {
  id: "dev-timeline-grid-visualizer",
  title: "Grid Visualizer Development — 4 Days of Intense Optimization",
  content: `
Topics covered here: grid visualizer development, grid math evolution,
webgl particle system, electron app development, performance optimization.

**Grid Visualizer** was built in an **intense 4-day sprint** (Apr 10-13, 2026)
with multiple major optimization passes.

**DAY 1: Initial Release (Apr 10)**
- "Initial release — audio-reactive dot grid visualizer"
- System audio sensitivity tuning
- Now-playing overlay with persistent text

**DAY 2: Features (Apr 11)**
- **v1.3.0**: Wallpaper mode (desktop background), physics toggle, tray menu
- **v1.4.0**: Dual-platform UI, app icon, Windows build
- **v1.5.0**: MAJOR optimization pass
  "66% less memory, 56% fewer GC pauses, wallpaper power mode"

**WHY these optimizations mattered:**
Running constantly as a desktop wallpaper means:
- Can't hog CPU/GPU (laptop battery, heat)
- Can't leak memory (runs for hours/days)
- Must handle minimize/focus changes gracefully

**DAY 3: Deep Optimization (Apr 12)**
- **v1.6.0**: Another optimization pass
  "51% less RAM, faster physics, occlusion pause"

Key techniques:
1. **Float32Array interleaving** - pack position, velocity, color contiguously
2. **Sleep optimization** - particles that aren't moving skip physics
3. **Occlusion pause** - stop rendering when window not visible
4. **Object pooling** - zero allocations in hot loop

**DAY 4: Stability (Apr 13)**
- **v1.6.1**: Fixed wallpaper crash loop, gated wallpaper mode to macOS

**Technical Architecture:**

**WebGL Point Sprites:**
Each particle is a GL_POINT rendered as a circle via fragment shader.
50K+ particles = 50K vertices in one draw call. No individual object overhead.

**Physics Update:**
\`\`\`javascript
for (let i = 0; i < n; i++) {
  // Springs back to home
  const dx = homeX[i] - posX[i];
  const dy = homeY[i] - posY[i];
  velX[i] += dx * springK;
  velY[i] += dy * springK;
  
  // Mouse interaction
  // ... force from mouse position
  
  // Damping
  velX[i] *= damping;
  velY[i] *= damping;
  
  // Sleep check
  if (Math.abs(velX[i]) + Math.abs(velY[i]) < sleepThreshold) {
    continue; // Skip position update
  }
  
  posX[i] += velX[i];
  posY[i] += velY[i];
}
\`\`\`

**Audio Integration:**
- Web Audio API for mic input
- Custom Swift helpers for macOS system audio capture
- FFT analysis for frequency visualization
- Beat detection drives wave intensity

**Result:** Desktop screensaver/wallpaper that runs at 60fps with 50K+
particles while using minimal resources.

GitHub: https://github.com/Keshav-Madhav/grid-visualizer
`,
};

const devTimelineVfSimMcp = {
  id: "dev-timeline-vf-sim-mcp",
  title: "VerbFlo MCP Server Development — Building AI-Debuggable Systems",
  content: `
Topics covered here: mcp development, why mcp, model context protocol,
vf-simulation mcp evolution, how mcp server was built, ai debugging tools.

**VF-Simulation MCP Server** evolved over **6 weeks** (Mar-Apr 2026) from
a basic widget tester to a full AI debugging platform.

**WHY MCP (Model Context Protocol)?**

Before MCP, debugging a VerbFlo conversation meant:
1. Open VerbaSuper app manually
2. Paste lead ID
3. Wait for MongoDB fetch
4. Wait for trace enrichment from Opik/Elasticsearch
5. Manually read through traces
6. Correlate traces with conversation messages
7. Form hypothesis about what went wrong

With MCP, an AI agent (Claude, Cursor) can:
1. Call cid_investigate(lead_id)
2. Get full conversation + enriched traces in seconds
3. Identify the issue automatically

**DEVELOPMENT TIMELINE:**

**PHASE 1: Foundation (Mar 2026)**
- Mar 23: Initial commit - basic Electron setup
- Mar 23: Sidebar, README

**PHASE 2: Core Simulator (Apr 8-13)**
- Apr 8: "Simulation stabilized" - Puppeteer-based widget replay
- Apr 8: Bot stability, Chrome tab management for RAM
- Apr 9: Simulation with evaluation metrics
- Apr 9: Node-based Electron migration complete
- Apr 10: CID integration begins
- Apr 13: Batch execution, paste mode UI
- Apr 13: Toast/notification system

**PHASE 3: ClickUp Integration (Apr 14-18)**
- Apr 14: Per-env database switching
- Apr 15: Browser detection, prefetched leads optimization
- Apr 16-17: ClickUp task management, QA status, denial reasons

**PHASE 4: MCP Server (Apr 16-20)**
- Apr 16: "feat(mcp): introduce MCP server for AI-assisted CID investigation"
- Apr 16: MCP auto-start, client configuration
- Apr 17: Lead ID scraper fixes for anonymous leads
- Apr 19: MCP verification UI, parallel client detection
- Apr 20: **Trace explorer module** - search Elasticsearch traces/spans

**HOW the MCP Server Works:**

\`\`\`typescript
// mcp/server.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

const server = new McpServer('vf-cid')

server.tool('cid_fetch', async ({ lead_id, env }) => {
  const conv = await cidFetch(lead_id, env)
  return fmtConversation(conv)
})

server.tool('cid_enrich', async ({ lead_id, env }) => {
  const enriched = await runEnrichment(lead_id, env)
  return fmtEnriched(enriched)
})

server.tool('trace_search', async ({ query, time_range }) => {
  const traces = await searchTraces(query, time_range)
  return fmtTraces(traces)
})
\`\`\`

**PARITY CONSTRAINT:**
The MCP server (mcp/server.ts) MUST stay in parity with the in-app HTTP
server (localMcpServer.ts). Both expose identical tool schemas so AI
clients behave the same regardless of transport. This was learned after
drift caused bugs.

**PHASE 5: Polish (Apr 20-29)**
- Apr 20: Theme system (light/dark/system)
- Apr 20: Translation API for non-English conversations
- Apr 22: Color palette selection, settings migration
- Apr 29: S3-based auto-update system

**What MCP Enables:**
"Why did the bot say X?" is now a 10-second answer instead of 10-minute
investigation. AI agents can self-diagnose VerbFlo issues, suggest fixes,
and even create ClickUp tickets with root cause analysis.

This is the tooling that makes VerbFlo's AI debuggable BY AI.
`,
};

const devTimelineAxon = {
  id: "dev-timeline-axon",
  title: "Axon Development — Building Code Knowledge Graphs for AI",
  content: `
Topics covered here: axon development, why axon, knowledge graph for code,
mcp tools development, how axon works, code intelligence.

**Axon** development: Feb-Mar 2026, building a code intelligence engine
that AI agents can query for deep codebase understanding.

**THE PROBLEM:**

AI agents edit code without understanding consequences. They grep for
callers, miss indirect ones, have no concept of how code connects.

Imagine an agent edits \`validate()\`. It doesn't know:
- 47 functions depend on that return type
- 3 execution flows pass through it
- \`payment_handler.py\` changes alongside it 80% of the time

Breaking changes ship.

**THE SOLUTION:**

Precompute code structure into a knowledge graph. Every query returns
complete context in a single tool call.

**DEVELOPMENT TIMELINE:**

**PHASE 1: Core Engine (Feb 21)**
- Initial version 0.2.1
- Method resolution, dead code detection
- Call relationship handling

**PHASE 2: Intelligence Features (Feb 24)**
- **6 features in one commit:**
  1. Embeddings for semantic search
  2. Noise filtering (test file down-ranking)
  3. Confidence tags on relationships
  4. Depth grouping for impact analysis
  5. Process/execution flow search
  6. Multi-repo registry

**WHY embeddings + BM25 + fuzzy?**
Each has strengths:
- BM25: Exact name matches ("UserService" finds UserService)
- Embeddings: Conceptual matches ("auth handler" finds validate_token)
- Fuzzy: Typo tolerance ("UserServce" still finds UserService)

Reciprocal Rank Fusion combines results from all three.

**PHASE 3: Stability (Feb 27-28)**
- Watcher rewrite with debounced incremental updates
- Targeted delete/upsert for live editing
- FTS index rebuilding
- File deletion tracking

**PHASE 4: Web UI (Feb 28 - Mar 4)**
- Graph visualization canvas
- Explorer sidebar, detail panel
- Cypher query console
- Analysis dashboard
- SSE live reload
- Minimap, layout modes, error states

**HOW Impact Analysis Works:**

\`\`\`python
def impact_analysis(symbol, depth=3):
    affected = {}
    
    # Direct callers (depth 1 = will break)
    callers = graph.query(f"MATCH (c)-[:CALLS]->(s) WHERE s.name = '{symbol}' RETURN c")
    affected['depth_1'] = [(c, confidence=1.0) for c in callers]
    
    # Type references (depth 1-2)
    refs = graph.query(f"MATCH (r)-[:REFERENCES_TYPE]->(s) ... RETURN r")
    affected['depth_1'].extend([(r, confidence=0.9) for r in refs])
    
    # Git coupling (any depth)
    coupled = graph.query(f"MATCH (s)-[:CHANGES_WITH]->(o) WHERE ... RETURN o")
    # Group by coupling strength
    
    # Transitive callers (depth 2-3)
    for d in range(2, depth+1):
        transitive = graph.query(f"MATCH path = (c)-[:CALLS*{d}]->(s) ...")
        affected[f'depth_{d}'] = transitive
    
    return affected
\`\`\`

**WHY Leiden for Community Detection:**

Leiden algorithm finds natural clusters in code (auth module, payment
module, etc.) without manual tagging. When an agent asks "what does this
belong to?", Axon can answer "it's part of the auth cluster, cohesion
score 0.85, related to these 12 other functions."

**Result:** AI agents get complete architectural understanding from a
single tool call. No multi-step exploration that misses code.

GitHub: https://github.com/Keshav-Madhav/axon
`,
};

const devTimelineVfCopilot = {
  id: "dev-timeline-vf-copilot",
  title: "VerbFlo Copilot Development — Multi-Agent Architecture Evolution",
  content: `
Topics covered here: vf-copilot development, text to sql, t2s, multi-agent
system development, how copilot was built, milvus integration.

**VF-Copilot** development: Jan-Apr 2026, building an internal multi-agent
system for querying VerbFlo's data across MongoDB, Postgres, and Milvus.

**THE PROBLEM:**

VerbFlo has data spread across:
- MongoDB (core): leads, conversations, clients
- MongoDB (AI): traces, enrichments
- PostgreSQL: property data (PMS)
- Milvus: FAQ vectors

Business questions need multiple data sources. "Show me conversion rates
for leads who asked about pricing" requires joining conversation data,
lead data, and property data.

**DEVELOPMENT TIMELINE:**

**PHASE 1: Text-to-SQL (Jan-Feb 2026)**
- Jan 29: Hot-swap functionality for instructor models
- Feb 2: Non-stream API with follow-ups
- Feb 5: Milvus FAQ specialist improvements
- Feb 16-17: **T2S accuracy improvements** - minified prompts,
  property identifier accuracy, academic year handling
- Feb 18: Keyword filter fixes, parenthesis issues
- Feb 24: Coupling fixes, distinct/groupby, having clauses
- Feb 27: Model migration from GPT-3.5 to GPT-4.5

**WHY Text-to-SQL is hard:**

User says: "properties with 2+ bedrooms under £500/week in London"

T2S must:
1. Identify tables: properties, rooms, pricing
2. Join correctly: property → rooms → pricing
3. Handle ambiguity: "bedrooms" = room_type='bedroom' or bed_count≥2?
4. Apply filters: price<500, city='London'
5. Avoid hallucinating columns that don't exist

**PHASE 2: Multi-Query & Retry (Mar 2026)**
- Mar 2: Walking distance/duration queries
- Mar 3: Model switch to GPT-4.1, verbose data instructions
- Mar 4: Aggregates fixes, coupled data
- Mar 5: Math queries, nested queries
- Mar 9: Nearby data handling refactored
- Mar 14: Multi-query support with retry logic
  "Added multi query and improved retry logic with descending
  number of filters to avoid null returning"

**HOW retry logic works:**

If query returns null:
1. Try removing least certain filter
2. Try simplifying aggregation
3. Try wider date range
4. Return partial results with explanation

**PHASE 3: Accuracy Push (Mar-Apr 2026)**
- Mar 16: Fixed LiteLLM version
- Apr 2: AWS Secrets Manager integration
- Apr 6: Sum post-processing
- Apr 7: Available-from range fixes
- Apr 21: Room size in property options
- Apr 27-28: Viewing slots with timezone handling

**PHASE 4: Token Optimization (Apr 2026)**
- Apr 28: JSONB EXISTS handling
- Apr 28: "Implement token-based trimming for T2S query results"
- Apr 29: Tenant isolation with join paths

**Technical Architecture:**

\`\`\`
User Question
    ↓
Triage Agent (classifies: FAQ? Property? Analytics?)
    ↓
Parallel Specialists:
├── Mongo Specialist 1 (core DB)
├── Mongo Specialist 2 (AI DB)
├── ...
├── Postgres Property Agent (PMS)
└── Milvus FAQ Agent
    ↓
Analyst Agent (synthesizes, streams response)
\`\`\`

**WHY parallel specialists?**

Latency. Sequential queries = sum of all query times.
Parallel queries = max of all query times.

If Mongo takes 500ms, Postgres 800ms, Milvus 300ms:
- Sequential: 1600ms
- Parallel: 800ms

50% faster perceived latency.

**Keshav's Contributions:**
- Milvus FAQ agent with query expansion
- Schema sampling system
- Streaming infrastructure
- T2S retry logic with filter degradation
`,
};

const devTimelineMinecraft = {
  id: "dev-timeline-minecraft-js",
  title: "Minecraft JS Development — Building a Voxel Engine from Scratch",
  content: `
Topics covered here: minecraft js development, voxel engine, three.js,
greedy meshing, infinite world, procedural terrain, how minecraft was built.

**Minecraft JS** was built in **2 weeks** (Aug 18 - Sep 4, 2024), implementing
a full voxel engine with infinite terrain from scratch.

**WEEK 1: Core Engine (Aug 18-24)**

Day 1 (Aug 18):
- Initial commit, basic setup
- "Experimentation with three js and basic cubes"
- GUI with lil-gui for debugging
- **Instancing** - key optimization for block rendering
- Simplex noise for procedural terrain
- Seed-based RNG for reproducibility
- Block types and colors
- Resource generation

Day 2 (Aug 19):
- Textures added to blocks
- Shadows and mesh optimization
- Player camera with 2-axis movement
- GUI for camera/coordinates

**WHY instancing matters:**
Without instancing: 1 draw call per block. 65K blocks = 65K draw calls = lag
With instancing: 1 draw call for ALL blocks of same type. 65K blocks = ~10 calls

Day 3-6 (Aug 22-24):
- **Collision detection** - hardest part
- Chunk-based world structure
- Infinite chunk loading based on player movement
- Async chunk loading to prevent freezes
- Fog for depth perception

**WEEK 2: Gameplay (Aug 27 - Sep 4)**

Aug 27-29:
- **Raycasting for block selection** - identify which block player is looking at
- Block highlighting on hover
- Remove block functionality
- Place block functionality
- Data persistence for placed/removed blocks

Sep 1:
- Tree generation (procedural)
- Textures for trees and sand
- Cloud layer
- Water layer
- Fixed raycasting issues
- Pickaxe tool with mining animation

Sep 4:
- Toolbar UI
- Save/load system

**Technical Challenges Solved:**

1. **Greedy Meshing:**
   Instead of 6 faces per block, merge adjacent same-type faces into quads.
   Flat ground: 256 faces → 1 face.

2. **Chunk Boundaries:**
   Faces along shared chunk borders need the neighbour's blocks to cull
   correctly. Solved deterministically with ghost-cell border sampling.

3. **Collision in Voxel World:**
   Can't use standard physics. Need to check block occupancy at player position.
   Implemented fixed-timestep AABB-vs-voxel grid collision.

4. **Procedural Trees:**
   Random but natural-looking. Trunk + layers of leaves with variance.

**THE BIG OPTIMIZATION PASS (later rework):**
The original build leaned on InstancedMesh and main-thread chunk work. A major
overhaul reworked the engine for far better FPS, rendering, and lighting:
- Moved BOTH chunk generation AND greedy meshing into a pool of stateless Web
  Workers, off the render thread, with each chunk meshed exactly once via
  deterministic ghost-cell border culling (no cache, no neighbour re-mesh).
- Packed indices into Uint16 where possible and split geometry into shadow
  casters vs non-casters to keep the shadow pass cheap.
- Added a second Web Worker driving a slippy-map minimap with an LRU tile cache
  and multiple zoom levels so visible tile count stays bounded at any zoom.
- Added biomes (vertex tint + per-biome water) and biome-aware lighting.
- Drove the render loop via a MessageChannel for genuinely uncapped FPS (rAF is
  hard-locked to the display refresh rate, which hides FPS differences).

**Result:** Playable infinite-world Minecraft in the browser with block
interaction, save/load, biomes, a minimap, and a heavily optimized,
mostly-off-main-thread rendering pipeline.

Live: https://keshav-madhav.github.io/minecraft-JS/
GitHub: https://github.com/Keshav-Madhav/minecraft-JS
`,
};

const devTimelineChainReaction = {
  id: "dev-timeline-chain-reaction",
  title: "Chain Reaction Development — Multiplayer Strategy Game",
  content: `
Topics covered here: chain reaction development, multiplayer game, peerjs,
real-time game, strategy game development.

**Chain Reaction** was built in **2 phases**: initial (Sep 2025) and
major update (Feb 2026) adding animations and reconnection.

**PHASE 1: Core Game (Sep 20-22, 2025)**

Day 1 (Sep 20):
- Initial Next.js setup
- PeerJS for P2P multiplayer

Day 2 (Sep 21):
- Basic test chat screen
- Peer manager for connections
- Proper joining workflow and room management
- Peer disconnection handling
- GameBoard and GameSidebar components
- Full game functionality with start, state tracking
- Winner modal and statistics
- Current turn display
- Chat with typing indicators, system messages
- Responsive design with mobile-first approach
- Atom rendering with SVG components

Day 3 (Sep 22):
- Framer Motion animations
- Enhanced connection handling with retry logic
- Explosion count safeguards

**WHY PeerJS for multiplayer:**
- No server needed for game state (P2P)
- Low latency (direct connection)
- Free (no hosting costs)
- Simple API for signaling

**PHASE 2: Polish (Feb 2026)**

Feb 1, 2026:
- **Proper chain reaction animations** - the core visual feedback
- Session storage for reconnection/rejoining
- Version update

**HOW Chain Reactions Work:**

\`\`\`javascript
async function explode(x, y, owner) {
  const cell = grid[y][x];
  cell.orbs = 0;
  
  // Animate explosion
  await animateExplosion(x, y, cell.color);
  
  // Orbs fly to neighbors (with animation)
  for (const [nx, ny] of getNeighbors(x, y)) {
    await animateOrbFlight(x, y, nx, ny);
    grid[ny][nx].orbs++;
    grid[ny][nx].owner = owner; // Capture!
    
    if (grid[ny][nx].orbs >= grid[ny][nx].criticalMass) {
      // Recursive chain reaction
      await explode(nx, ny, owner);
    }
  }
}
\`\`\`

**Game Balance:**
- Corners: Critical mass 2 (safest)
- Edges: Critical mass 3
- Center: Critical mass 4 (most vulnerable)

Strategic depth: Setting up chain reactions vs defensive play.

Live: https://chain-reaction-eta.vercel.app
GitHub: https://github.com/Keshav-Madhav/chain_reaction
`,
};

const devTimelineZenNotes = {
  id: "dev-timeline-zen-notes",
  title: "Zen Notes Development — Real-Time Collaborative Notes",
  content: `
Topics covered here: zen notes development, collaborative editing, liveblocks,
real-time collaboration, firebase, blocknote editor.

**Zen Notes** was built in **1 week** (Aug 6-12, 2024), implementing
Google Docs-style real-time collaboration.

**Day 1-2 (Aug 6-7):**
- Initial setup, cleanup
- Clerk authentication
- Firebase + Firebase Admin
- Header and Sidebar components
- SideBarOption for document navigation
- Database structure for users and collections
- "New document" functionality

**Day 3 (Aug 8-9):**
- Liveblocks installation (real-time collaboration engine)
- Follow pointers (see where others' cursors are)
- Basic document and live cursors
- Breadcrumbs navigation
- Document page with name editing

**Day 4 (Aug 10-11):**
- **BlockNote editor** - the rich text engine
- Inviting users functionality
- Delete document functionality
- Name updates synced to URL path
- Manage users modal
- "Currently editing" user indicators

**Day 5 (Aug 12):**
- **Chat with doc modal** - AI integration
- Translation feature via Cloudflare API
- Bug fixes

**Nov 2024:**
- Dark mode across entire app
- Firebase service key security

**WHY Liveblocks:**
- Handles conflict resolution (CRDTs)
- Presence system (who's online, cursor positions)
- Room-based collaboration
- Works with any editor (we used BlockNote)

**Architecture:**
\`\`\`
User → Clerk Auth → Firebase (user data)
                 ↓
Document → Liveblocks Room → Other Users
                 ↓
         BlockNote Editor (CRDT-synced)
\`\`\`

**Real-Time Features:**
1. Live cursors with user names
2. Selection highlighting
3. Presence indicators
4. Instant text sync
5. Conflict-free merging

Live: https://zen-notes-keshav.vercel.app
GitHub: https://github.com/Keshav-Madhav/zen-notes
`,
};

const devTimelineOthello = {
  id: "dev-timeline-othello",
  title: "Othello Development — AI with Minimax",
  content: `
Topics covered here: othello development, minimax algorithm, alpha-beta pruning,
game ai, multiplayer peerjs.

**Othello** was built in **2 days** (Mar 29-30, 2025) then polished (Apr 3).

**Day 1 (Mar 29-30):**
- Initial commit - Board UI
- Basic game logic (valid moves, flipping)
- Turn-based movement
- **Multiplayer with PeerJS**
- Connection UI for multiplayer
- Winning screen
- Player color display

**Day 2 (Mar 30):**
- **AI algorithm** - simplistic at first
- Better algorithm for computer play
- Room code from query params
- Metadata and favicon

**April Polish (Apr 3):**
- Code refactored into separate files
- **Previous move highlight** - shows opponent's last move
- Better data efficiency

**HOW the AI Works:**

\`\`\`javascript
function minimax(board, depth, isMaximizing, alpha, beta) {
  if (depth === 0 || gameOver(board)) {
    return evaluate(board);
  }
  
  const moves = getValidMoves(board, currentPlayer);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = makeMove(board, move);
      const eval = minimax(newBoard, depth - 1, false, alpha, beta);
      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  }
  // ... similar for minimizing
}

function evaluate(board) {
  let score = 0;
  // Corners are most valuable (can't be flipped)
  score += countCorners(board, AI) * 25;
  // Edges are valuable
  score += countEdges(board, AI) * 5;
  // Mobility (available moves) matters
  score += getValidMoves(board, AI).length * 3;
  // Disc count
  score += (aiDiscs - opponentDiscs);
  return score;
}
\`\`\`

**WHY Alpha-Beta Pruning:**
Minimax alone: explores ALL possible game trees
With pruning: skips branches that can't affect the outcome
Result: Same answer, 10-100x fewer nodes explored

GitHub: https://github.com/Keshav-Madhav/Othello-JS
`,
};

const devTimelineZoomClone = {
  id: "dev-timeline-zoom-clone",
  title: "Yoom (Zoom Clone) Development — Video Calling App",
  content: `
Topics covered here: zoom clone development, video calling, stream.io,
clerk auth, webrtc, meeting scheduling.

**Yoom** was built in **2 days** (Jun 15-16, 2024) using Stream.io for
video infrastructure.

**Day 1 (Jun 15):**
- Initial Next.js setup
- Basic folder structure and layout
- Sidebar and navigation
- Pages for all routes
- Top navigation
- Mobile responsive navbar
- **Clerk authentication**
- Custom sign in/sign up pages

**Day 2 (Jun 16):**
- Home page UI
- Meeting modal
- **Stream.io integration** for video
- Call setup and join meeting
- Meeting created toast notifications
- Meeting room layout
- **Meeting scheduling** (future meetings)
- Previous meetings page
- Upcoming meetings page
- **Recordings page**
- Personal room (instant meeting link)
- Join meeting modal

**WHY Stream.io instead of raw WebRTC:**
Raw WebRTC is complex:
- Signaling server needed
- STUN/TURN servers for NAT traversal
- Handling multiple participants
- Recording, screen sharing, etc.

Stream.io provides:
- Ready-made video infrastructure
- React components
- Recording built-in
- Handles all edge cases

**Features Implemented:**
1. Instant meetings (click to start)
2. Scheduled meetings (calendar integration)
3. Meeting recordings (watch later)
4. Personal meeting room (persistent link)
5. Join via link

Live: https://zoom-clone-black-sigma.vercel.app
GitHub: https://github.com/Keshav-Madhav/zoom-clone
`,
};

const devTimelineWavesToSound = {
  id: "dev-timeline-waves-to-sound",
  title: "Waves to Sound Development — Audio Visualization",
  content: `
Topics covered here: waves to sound development, audio visualization,
web audio api, wave physics, sound synthesis.

**Waves to Sound** was built in **3 days** (Jun 2-4, 2025), connecting
visual wave math to actual audio.

**Day 1 (Jun 2):**
- Initial commit
- Wave creation logic in JS
- Frequency and amplitude controls
- Wave formulas (sine, square, triangle, sawtooth)
- Code split for cleaner development
- Fixed wave visualization
- Max frequency limits

**Day 2 (Jun 3):**
- Main wave visualizer (sum of all waves)
- Multiple waves that combine
- Wave cycle visualization
- More controls, improved CSS
- Phase shift control

**Day 3 (Jun 4):**
- **Web Audio API integration** - the key feature
- AudioContext for actual sound generation
- Dynamic base frequency
- Audio syncs with visual wave
- Updates on activation and formula change
- Minor fixes

**WHY this project exists:**

Most people learn waves as abstract math:
  y = A * sin(2πft + φ)

But what does that SOUND like? This tool answers:
- Higher frequency (f) = higher pitch
- Higher amplitude (A) = louder
- Sine wave = smooth sound
- Square wave = buzzy/harsh
- Sawtooth = rich harmonics

**Technical Implementation:**

\`\`\`javascript
const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

oscillator.type = 'sine'; // or 'square', 'sawtooth', 'triangle'
oscillator.frequency.value = frequency;
gainNode.gain.value = amplitude;

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);
oscillator.start();
\`\`\`

**Educational Value:**
See a wave, hear it. Change frequency, hear pitch change.
The abstract becomes tangible.

Live: https://keshav-madhav.github.io/waves-to-sound/
GitHub: https://github.com/Keshav-Madhav/waves-to-sound
`,
};

const devTimelineParticleLife = {
  id: "dev-timeline-particle-life",
  title: "Particle Life Development — Emergent Behavior Simulation",
  content: `
Topics covered here: particle life development, emergent behavior, artificial
life, cellular automata, particle simulation.

**Particle Life** was built in **2 days** (Nov 14-15, 2024), implementing
the viral "Particle Life" concept.

**Day 1 (Nov 14):**
- Initial commit
- Basic particle class
- Particle rendering on Canvas
- World translate and scale
- Camera for world traversal
- **Force application between particles** - the core mechanic

**Day 2 (Nov 15):**
- Delta time function for stable simulation
- Balanced attraction/repulsion values
- Fixed deployment bugs

**HOW Particle Life Works:**

Each color has attraction/repulsion rules toward every other color:
\`\`\`javascript
rules = {
  red: { red: 0.1, green: -0.5, blue: 0.3 },
  green: { red: 0.2, green: -0.1, blue: -0.3 },
  blue: { red: -0.2, green: 0.4, blue: 0.1 }
}

// Positive = attraction, Negative = repulsion
\`\`\`

From these simple rules, complex behavior emerges:
- Clusters form and move together
- "Predator-prey" relationships appear
- Cells seem to "hunt" each other
- Stable structures emerge and dissolve

**WHY it looks alive:**

The rules create feedback loops:
1. Red attracts green → green clusters around red
2. Green repels blue → blue flees green
3. Blue attracts red → blue chases red
4. Result: Dynamic ecosystem with apparent "behavior"

**No AI involved** - just physics rules, yet it looks like life.

**Technical Challenge:**
O(N²) force calculations (every particle affects every other).
For 1000 particles: 1 million calculations per frame.
Optimized with spatial hashing (only check nearby particles).

GitHub: https://github.com/Keshav-Madhav/Particle-Life
`,
};

const devTimelineChess = {
  id: "dev-timeline-chess",
  title: "Chess Development — Full Rules Implementation",
  content: `
Topics covered here: chess development, chess rules, legal moves, check
detection, pawn promotion, en passant, castling.

**Chess** was built in **2 days** (Feb 10-11, 2024), implementing ALL
official chess rules.

**Day 1 (Feb 10):**
- Initial commit
- Draw board
- Piece SVG images
- Pieces drawn to board
- Moving pieces with drag/drop
- Board flip functionality
- Code documentation
- Pawn promotion
- Captures
- Legal move display
- Move restrictions (can't move wrong piece)
- Touch-to-move (mobile support)
- From/to square highlighting

**Day 2 (Feb 11):**
- **Advanced legal move checking** - the hard part
- Turn-based movement
- Board orientation correction
- Improved pawn legal moves
- **King in check highlights**
- Favicon and accessibility

**WHY Legal Move Checking is Hard:**

Simple approach: "Can this piece reach that square?"
But that's not enough. A move is only legal if:
1. Piece can physically move there
2. Path is not blocked (for sliding pieces)
3. Move doesn't leave YOUR king in check
4. Special rules: castling, en passant, promotion

For every candidate move, you must:
\`\`\`javascript
function isLegalMove(from, to) {
  // 1. Basic move validation
  if (!canPieceMoveHere(from, to)) return false;
  
  // 2. Simulate the move
  const boardCopy = copyBoard();
  makeMove(boardCopy, from, to);
  
  // 3. Check if own king is in check after move
  const kingPos = findKing(boardCopy, currentPlayer);
  if (isSquareAttacked(boardCopy, kingPos, opponent)) {
    return false; // Move leaves king in check
  }
  
  return true;
}
\`\`\`

**Special Rules Implemented:**
- **Castling**: King moves 2 squares, rook jumps over
  - Can't castle through check
  - Can't castle if king/rook has moved
- **En Passant**: Pawn captures pawn that just double-moved
- **Pawn Promotion**: Pawn reaches end → becomes queen/rook/bishop/knight
- **Check/Checkmate**: King in check with no legal moves
- **Stalemate**: No legal moves but not in check

GitHub: https://github.com/Keshav-Madhav/Chess-HTML-CSS-JS
`,
};

const devTimelineFizzi = {
  id: "dev-timeline-fizzi",
  title: "Fizzi Drinks Development — 3D Product Landing Page",
  content: `
Topics covered here: fizzi development, 3d landing page, three.js, react three
fiber, gsap animations, scroll-driven animation.

**Fizzi Drinks** was built in **3 days** (Sep 20-22, 2024), creating a
stunning 3D animated product page.

**Day 1 (Sep 20):**
- Initial commit with Prismic CMS
- Code cleanup
- Hero components

**Day 2 (Sep 21):**
- **GSAP animations** for hero text
- Three.js and React Three Fiber setup
- **Soda can 3D component** - the star of the show
- Three.js canvas rendering

**Day 3 (Sep 22):**
- Landing page with can animations
- **Bubbles effect** (particles around can)
- Performance optimizations
- Skydiving can section (can falls as you scroll)
- Choose your flavor carousel
- Alternating text sections
- Footer and final section
- Favicon

**WHY React Three Fiber:**
Three.js alone is imperative:
\`\`\`javascript
const geometry = new THREE.CylinderGeometry(...);
const material = new THREE.MeshStandardMaterial(...);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
\`\`\`

React Three Fiber is declarative:
\`\`\`jsx
<mesh>
  <cylinderGeometry args={[...]} />
  <meshStandardMaterial color="red" />
</mesh>
\`\`\`

Benefits:
- React's component model for 3D
- Hooks for animation state
- Easy integration with rest of app

**Scroll-Driven Animation:**
\`\`\`javascript
useGSAP(() => {
  gsap.to(canRef.current.rotation, {
    y: Math.PI * 2,
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});
\`\`\`

Can rotates as user scrolls. "Scrub: true" ties animation progress
to scroll position.

**Performance Tricks:**
- Instanced bubbles (one draw call for all)
- LOD (Level of Detail) for distant objects
- Lazy loading 3D assets
- Compressed textures

Live: https://fizzi-drinks.vercel.app
GitHub: https://github.com/Keshav-Madhav/fizzi-drinks
`,
};

// ============================================================================
// VERBAFLO DETAILED CONTRIBUTIONS
// ============================================================================

const vfContributionsOverview = {
  id: "vf-contributions-overview",
  title: "Keshav's VerbFlo Contributions — Overview of 6 Months of Work",
  content: `
Topics covered here: verbaflo contributions, what keshav built at verbaflo,
verbaflo experience, keshav's work, ai engineer contributions, verbaflo role,
applied AI work, applied machine learning, AI capabilities, applied LLM
work, what AI stuff has Keshav built in production.

**Keshav joined VerbaFlo in late 2025** and has made **200+ commits** across
four major codebases in 6 months. Here's the high-level impact:

**vf-ai (Main AI Backend):**
- Built the **custom tracing system (k_trace)** that replaced Opik
- Integrated **LiteLLM** with retry/fallback logic across all LLM calls
- Implemented **structured output support** for prompt-driven schemas
- Added **global config middleware** for timeouts, fallbacks, and feature flags
- Fixed dozens of production bugs in property extraction, FAQ routing, etc.

**vf-copilot (Multi-Agent Internal Tool):**
- **Built from the ground up** (Dec 2025 initial commit)
- Designed the multi-agent architecture with parallel specialists
- Implemented **PostgreSQL Text-to-SQL** system with retry logic
- Built **Milvus FAQ agent** with query expansion
- Created **streaming infrastructure** and React UI
- Added memory, caching, and follow-up question generation

**vf-simulation (MCP + Widget Tester):**
- **Built the entire Electron app** from scratch (Mar-Apr 2026)
- Implemented the **MCP server** for AI-assisted debugging
- Built CID (Conversation Intelligence Data) investigator
- Created ClickUp integration for QA workflow
- Implemented auto-update system via S3

**verbaflo-playground (Evaluation Toolkit):**
- **Built the entire system** (Mar 2026 onwards)
- Created benchmark extraction from Opik/Snowflake traces
- Built **LLM Judge system** for automated evaluation
- Implemented **Trace Explorer** with full observability UI
- Migrated to Next.js with new features (Prompt Playground, span errors)
- Added GitHub OAuth, session management, bulk operations

**Key Themes Across All Work:**
1. **Observability obsession** — every system has tracing, logging, debugging tools
2. **LLM reliability** — retry logic, fallbacks, structured outputs
3. **Developer experience** — MCP tools, eval tooling, debugging UI
4. **Performance** — caching, streaming, parallel execution
`,
};

const vfContributionsAiBackend = {
  id: "vf-contributions-ai-backend",
  title: "Keshav's vf-ai Contributions — Main AI Backend Deep Dive",
  content: `
Topics covered here: vf-ai contributions, keshav vf-ai work, ai backend,
litellm integration, k_trace, structured output, global config, faq routing.

**vf-ai** is VerbaFlo's main FastAPI AI backend. Keshav's contributions
span Jan-Apr 2026 with **80+ commits**.

**JANUARY 2026: Global Config & Middleware**

Problem: Timeouts and fallbacks were hardcoded everywhere.
Solution: Centralized global config middleware.

- Jan 12: "Added global config and updated fallbacks and timeout to use
  global config values"
- Jan 21: "Added new middleware for global config fetching and updated
  orchestrator and timeouts and fallbacks"
- Jan 21: "Move industry to config with enum and get set function"

**Impact:** Single source of truth for all LLM timeouts, fallback models,
and feature flags. No more hunting through code to change a timeout.

**FEBRUARY 2026: FAQ DB Splitting & Property Validation**

- Feb 20: "First/Second Testing PR consolidated changes for faq_db Splitting"
  Split FAQ database to improve query performance and enable per-client FAQs.

- Feb 23: "Fixed property name validation, alias mapping, and tenant_type bug"
- Feb 27: "Added faq_chunk sorting based on channel"

**MARCH 2026: Custom Tracing System (k_trace)**

Problem: Opik (the existing tracing tool) had issues — memory leaks,
missing data, hard to query.

Solution: Build a custom tracing library.

- Mar 24: "Added custom decorator logging library of k_trace to replace opik"
- Mar 25: "Updated k_trace to be optimized, have proper output and input
  and keep tags and other extra columns for searching"
- Mar 26: "Full rename: folder, class, env vars, logger name, contextvar
  names, all 66 app file imports/aliases"

**HOW k_trace Works:**
\`\`\`python
@k_trace(name="flow_router", tags=["routing"])
async def route_flow(input: str) -> FlowResult:
    # ... logic ...
    return result
# Automatically logs: input, output, duration, tags
# Sends to Elasticsearch for querying
\`\`\`

**Impact:** Custom tracing integrated with Elasticsearch. VerbaSuper
can now query traces directly.

**APRIL 2026: LiteLLM Integration & Structured Outputs**

Problem: Each agent had its own LLM client code. No unified retry logic.

- Apr 6: "Full LiteLLM integration"
- Apr 7: "Added updated retry/fallback + timeout logic living on prompt
  config basis"
- Apr 13: "Add structured_output and tool_calls support for prompt-driven
  LLM response schemas"
- Apr 14: "Enhance prompt handling by introducing active_fields and updating
  response_format across multiple agents"

**HOW Structured Output Works:**
\`\`\`python
# Before: Parse JSON from string, hope it's valid
response = llm.generate(prompt)
data = json.loads(response)  # Might fail!

# After: LLM returns validated Pydantic model
@k_trace
async def extract_lead(text: str) -> LeadData:
    return await llm.generate(
        prompt,
        response_format=LeadData,  # Pydantic model
        active_fields=["name", "email", "phone"]  # Dynamic fields
    )
\`\`\`

**Impact:** Reliable structured outputs across all agents. Failed parses
retry automatically.

**Also Added:**
- Apr 9: "Added Grok from xAI and removed deprecated models"
- Apr 22: "Implement lost reason configuration retrieval"
- Apr 30: "Refactor VapiService: streamline viewing availability processing"
`,
};

const vfContributionsCopilot = {
  id: "vf-contributions-copilot",
  title: "Keshav's vf-copilot Contributions — Built From Scratch",
  content: `
Topics covered here: vf-copilot contributions, multi-agent system, text to sql,
t2s, milvus faq, streaming, copilot architecture, keshav built copilot.

**vf-copilot** is VerbaFlo's internal multi-agent tool for querying data.
**Keshav built it from scratch** starting Dec 2025.

**DECEMBER 2025: Foundation (Initial Commits)**

- Dec 10: "Initial commit" — Keshav started the project
- Dec 10: "Add Jinja2 templating for agent system prompts"
- Dec 11: "Refactor MongoDB agent, add parallel agent calls, Opik tracing"
- Dec 11: "Add campaign execution logs agent, conversations agent"
- Dec 12: "Add viewings agent, handoffs between agents"
- Dec 15: "Add streaming response for analyst agent"
- Dec 17: "Add mermaid syntax self-fixing functionality using LLM"
- Dec 18: "Add prefetch to triage, TTL cache for schema, multi-Mongo connections"
- Dec 20: "Add Milvus and Milvus RAG querying"
- Dec 21: "Add Milvus FAQ agent"

**In 11 days, Keshav built:**
- Multi-agent orchestration
- 8+ MongoDB specialist agents
- Streaming response infrastructure
- Milvus vector search integration
- Schema caching system
- Agent handoff logic

**JANUARY 2026: PostgreSQL Text-to-SQL**

- Jan 2: "Fully integrated Postgres text-to-sql system with PMS specialist"
- Jan 3: "Add follow-up questioning as quick replies"
- Jan 4: "Add semantic caching for user queries"
- Jan 9: "Add query returning functionality with downloadable Excel"
- Jan 10: "Add React-based UI"
- Jan 13: "Add env control for base URL in React UI"
- Jan 16: "Add summarizer agent for data summaries"
- Jan 17: "Add result truncation to reduce token bloat"
- Jan 25-29: "Migrate to Instructor+LiteLLM for unified model handling"

**HOW Text-to-SQL Works:**
\`\`\`
User: "Show properties under £500/week in London"
    ↓
T2S Agent:
  1. Parse intent → property search
  2. Extract filters → price<500, city=London
  3. Generate SQL → SELECT * FROM properties WHERE ...
  4. Execute → [results]
  5. Format → table or Excel download
\`\`\`

**FEBRUARY 2026: T2S Accuracy & Milvus Improvements**

- Feb 5: "Refactored and improved Milvus FAQ specialist with custom filters"
- Feb 16-17: "Property identifier accuracy improvements using GPT-4.1 mini"
- Feb 17: "Fixed keyword as filter rejection issue"
- Feb 24: "Fixed T2S: coupling, distinct/groupby, having clauses"

**MARCH 2026: Multi-Query & Retry Logic**

- Mar 2: "Added walking distance/duration queries"
- Mar 5: "Fixed math queries, nested queries, ghost column hallucination"
- Mar 14: "Added multi-query with retry logic and descending filter removal"

**HOW Retry Logic Works:**
\`\`\`python
async def query_with_retry(user_query: str) -> Result:
    filters = extract_filters(user_query)
    
    for attempt in range(3):
        sql = generate_sql(user_query, filters)
        result = execute(sql)
        
        if result is not None:
            return result
        
        # Remove least certain filter and retry
        filters = filters[:-1]
    
    return partial_result_with_explanation()
\`\`\`

**APRIL 2026: Viewing Slots & Token Optimization**

- Apr 27: "Add viewing slot date/time handling with timezone conversion"
- Apr 28: "Implement token-based trimming for T2S results"
- Apr 28: "Implement JSONB EXISTS handling for array columns"
- Apr 29: "Refactor tenant isolation with join paths"

**Final Architecture:**
\`\`\`
User → Triage → Parallel Specialists → Analyst → Streaming Response
          ↓
   [Mongo×8, Milvus FAQ, Postgres PMS]
\`\`\`
`,
};

const vfContributionsSimulation = {
  id: "vf-contributions-simulation",
  title: "Keshav's vf-simulation Contributions — MCP Server & Widget Tester",
  content: `
Topics covered here: vf-simulation contributions, mcp server, cid, widget tester,
electron app, clickup integration, auto-update, keshav built simulation.

**vf-simulation (VerbaSuper)** is VerbaFlo's Electron desktop app.
**Keshav built the entire application** from scratch in Apr 2026.

**WEEK 1: Foundation (Apr 8-13)**

- Apr 8: "Simulation stabilized" — Puppeteer-based widget replay working
- Apr 9: "Simulation with evaluation done"
- Apr 9: "Migration to node-based Electron app successful"
- Apr 10: "Added batch ClickUp execute"
- Apr 13: "Toast/notification system, batch keeps running when unfocused"
- Apr 13: "AWS Secrets Manager + admin-password enrollment"
- Apr 13: "Fallback to deleted_conversations for missing leads"

**WEEK 2: CID & ClickUp (Apr 14-18)**

- Apr 14: "Per-env DB, Excel export, ClickUp task IDs, persona echo guard"
- Apr 15: "Browser detection, prefetched leads optimization"
- Apr 15: "Windows build support, macOS packaging"
- Apr 16: **"Introduce MCP server for AI-assisted CID investigation"**
- Apr 17: "Lead ID scraper fixes for anonymous leads"
- Apr 18: "ClickUp task management: status updates, QA status, denial reasons"

**WEEK 3: MCP & Polish (Apr 19-29)**

- Apr 19: "Google Translate integration for non-English conversations"
- Apr 19: "User-specific ClickUp key management"
- Apr 20: "Theme system (light/dark/system)"
- Apr 20: "Trace explorer module for Elasticsearch traces"
- Apr 20: "Per-client widget URL overrides"
- Apr 22: "Color palette selection, settings migration"
- Apr 29: **"S3-based auto-update functionality"**

**THE MCP SERVER:**

Keshav built a Model Context Protocol server that exposes CID tools:

\`\`\`typescript
// mcp/server.ts
server.tool('cid_fetch', async ({ lead_id, env }) => {
  const conv = await cidFetch(lead_id, env);
  return fmtConversation(conv);
});

server.tool('cid_enrich', async ({ lead_id }) => {
  const enriched = await runEnrichment(lead_id);
  return fmtEnriched(enriched);
});

server.tool('trace_search', async ({ query }) => {
  return await searchTraces(query);
});
\`\`\`

**WHY This Matters:**
Before: Debug conversation → 10 minutes of manual clicking
After: AI agent calls cid_investigate → 10 seconds

**CLICKUP INTEGRATION:**

Full workflow automation:
1. Pull tasks from ClickUp lists
2. Auto-fetch leads mentioned in task
3. Run simulation/CID investigation
4. Update task status
5. Add denial/approval reasons
6. Create bug report with RCA

**AUTO-UPDATE:**

- App checks S3 for new versions on launch
- Downloads in background
- Swaps in-place after user closes
- TOTP-authorized enrollment for credentials

**What Keshav Built in 3 Weeks:**
- Complete Electron app (React + TypeScript)
- MCP server with 6+ tools
- CID investigator with trace enrichment
- ClickUp bi-directional integration
- Widget replay engine (Puppeteer)
- Batch simulation runner
- AWS Secrets Manager integration
- S3 auto-update system
- Theme system, translation, multi-env support
`,
};

const vfContributionsPlayground = {
  id: "vf-contributions-playground",
  title: "Keshav's Playground Contributions — Evaluation Toolkit",
  content: `
Topics covered here: verbaflo playground contributions, eval toolkit, benchmark,
llm judge, trace explorer, prompt playground, keshav built playground.

**verbaflo-playground** is VerbaFlo's prompt evaluation toolkit.
**Keshav built the entire system** starting Mar 2026.

**MARCH 2026: Foundation**

- Mar 6: "Added Claude and Make files" — Initial structure
- Mar 10: "Added benchmark file manager, prompt runner pages"
- Mar 10: "Added judge system" for automated evaluation
- Mar 10: "Added multi-threading for benchmark runs"
- Mar 11: "Separated Streamlit UI code from logic code"
- Mar 11: "Added FastAPI to expose logic via API"
- Mar 12: "Added eval criteria generator page"
- Mar 13: "Added bulk client prompt extraction"
- Mar 16: "Implemented OR logic for OQL filters with parallelism"
- Mar 26: **"Add Trace Explorer — full observability UI for LLM traces"**
- Mar 27: "Massive visual update, light/dark mode, performance improvements"
- Mar 30: "Multi-environment trace fetching"
- Mar 31: "SQL filtering, cache fixes"

**THE BENCHMARK SYSTEM:**

\`\`\`
1. Extract traces from Opik/Snowflake
   ↓
2. Re-run prompts with modified templates
   ↓
3. Compare outputs using LLM Judge
   ↓
4. Generate evaluation report
\`\`\`

**HOW THE JUDGE WORKS:**

\`\`\`python
async def judge_response(original: str, new: str, criteria: List[str]) -> Score:
    prompt = f"""
    Compare these two responses:
    Original: {original}
    New: {new}
    
    Score on: {criteria}
    - Accuracy (1-5)
    - Helpfulness (1-5)
    - Tone (1-5)
    """
    return await llm.generate(prompt, response_format=Score)
\`\`\`

**APRIL 2026: Next.js Migration & New Features**

- Apr 6: "Added AWS Secret Manager"
- Apr 8: "Added batch exporting"
- Apr 11: "Major performance improvements"
- Apr 14: "Multiple updates, ghost commit"
- Apr 16: "Searching optimizations"
- Apr 17: "Merge feature/migrate-nextjs" — Full Next.js rewrite
- Apr 22: "Server-side Jinja2 rendering for playground"
- Apr 23: "Prompt Playground with URL parameter handling"
- Apr 24: "Span error handling and exploration"
- Apr 27: "Structured output schema support in Prompt Playground"
- Apr 28: "ClickUp ticket creation from span errors"
- Apr 28: "Resizable splitter in Span Errors Explorer"
- Apr 29: "GitHub OAuth authentication"
- Apr 29: "Bulk run functionality"
- May 1: "DB-backed session management replacing JWT"

**TRACE EXPLORER:**

Full observability UI:
- Search traces by text, time range, client
- Drill into individual spans
- See LLM inputs/outputs
- Filter by error status
- Export to Excel/CSV
- Create ClickUp tickets for errors

**PROMPT PLAYGROUND:**

Test prompts in browser:
- Select prompt template
- Inject variables (Jinja2)
- Choose model (GPT, Claude, Gemini, etc.)
- See response with timing
- Compare multiple runs

**What Keshav Built:**
- Streamlit-based benchmark tool
- FastAPI backend with all logic
- LLM Judge for automated evaluation
- Trace Explorer with full search
- Next.js frontend rewrite
- Prompt Playground
- Span Error Explorer
- GitHub OAuth + session management
- Multi-model support (OpenAI, Anthropic, Together, Cerebras, Azure)
`,
};

const vfContributionsTracing = {
  id: "vf-contributions-tracing",
  title: "Keshav's Observability Work — k_trace, Kibana, Trace Explorer",
  content: `
Topics covered here: k_trace, kibana tracing, observability, llm tracing,
elasticsearch, opik replacement, custom tracing library.

**Observability is a theme across all of Keshav's VerbFlo work.** He built
custom tracing infrastructure when existing tools didn't meet requirements.

**THE PROBLEM WITH OPIK:**

Opik (VerbFlo's original tracing tool) had issues:
- Memory leaks in long-running processes
- Missing data in complex async flows
- Hard to query specific traces
- No integration with Elasticsearch

**THE SOLUTION: k_trace**

Keshav built a custom tracing library in Mar 2026:

\`\`\`python
# Simple decorator-based tracing
@k_trace(name="faq_retrieval", tags=["milvus", "faq"])
async def retrieve_faqs(query: str) -> List[FAQ]:
    # Function body
    return faqs

# Automatic capture of:
# - Input arguments
# - Output (serialized)
# - Duration
# - Tags for filtering
# - Nested span hierarchy
# - Error traces
\`\`\`

**Key Commits:**
- Mar 24: "Added custom decorator logging library of k_trace to replace opik"
- Mar 25: "Updated k_trace to be optimized, have proper output and input"
- Mar 26: "Full rename across 66 app files"

**KIBANA INTEGRATION:**

k_trace sends to Elasticsearch, queryable via Kibana:

\`\`\`
trace_id: abc123
spans:
  - name: flow_router, duration: 45ms
    - name: faq_retrieval, duration: 30ms
    - name: llm_call, duration: 200ms
      input: "What is the price?"
      output: "The price is £500/week"
      model: gpt-4o-mini
      tokens: 150
\`\`\`

**Apr 2026 Kibana Improvements:**
- Apr 7: "Updated Kibana version and code"
- Apr 8: "Updated and improved Kibana tracing with tags, names, input, output"
- Apr 13: "Updated Kibana error capturing"

**TRACE EXPLORER IN PLAYGROUND:**

Not just logging — a full UI for trace analysis:

- Mar 26: "Add Trace Explorer — full observability UI"
- Mar 27: "Massive visual update, performance improvements"
- Apr 11: "Major performance improvements"
- Apr 24: "Span error handling and exploration"

**Features:**
1. Search by text across all trace fields
2. Filter by time range, client, error status
3. Drill into individual spans
4. See full LLM input/output
5. Export matching traces
6. Create ClickUp tickets for errors

**VF-SIMULATION MCP INTEGRATION:**

The MCP server queries the same Elasticsearch indices:

\`\`\`typescript
server.tool('trace_search', async ({ query, time_range }) => {
  const traces = await searchTraces(query, time_range);
  return formatTraces(traces);
});

server.tool('trace_by_id', async ({ trace_id }) => {
  return await fetchTraceById(trace_id);
});
\`\`\`

**End-to-End Observability:**
1. Code runs with @k_trace decorators
2. Traces flow to Elasticsearch
3. Kibana for dashboards
4. Trace Explorer for detailed analysis
5. MCP tools for AI-assisted debugging
6. ClickUp integration for issue tracking

**WHY This Matters:**

"The bot said something wrong" used to mean hours of debugging.
Now: search traces → find the span → see exact input/output → identify bug.

Keshav built the entire pipeline.
`,
};

const devTimelineDrawCalc = {
  id: "dev-timeline-draw-calculator",
  title: "Draw Calculator Development — Apple Math Notes Clone",
  content: `
Topics covered here: draw calculator development, handwriting recognition,
gemini vision, apple calculator clone, canvas drawing.

**Draw Calculator (Sketch-Culator)** was built in **4 days** (Sep 28 - Oct 1, 2024)
replicating Apple's iPad Math Notes feature.

**Day 1 (Sep 28):**
- Initial commit
- Basic canvas with drawing functionality
- Color changing
- Reset/clear canvas

**Day 2 (Sep 29):**
- **LaTeX processing** for math results
- Draggable LaTeX equations on screen
- Copy and remove buttons

**Day 3 (Oct 1):**
- Icon, title, download button
- Eraser tool
- UI improvements and fixes
- **Undo/redo** - stroke history
- Text insertion onto canvas
- Touch screen support

**Day 4 (Oct 1):**
- Responsiveness for all screen sizes

**HOW It Works:**

1. **Drawing Layer:**
   Canvas captures strokes via pointer events.
   Each stroke is stored for undo/redo.

2. **Debounced Recognition:**
   After 500ms of no drawing, send canvas to Gemini.

3. **Gemini Vision:**
   \`\`\`javascript
   const response = await gemini.generateContent([
     { inlineData: { mimeType: 'image/png', data: canvasData }},
     "Extract the mathematical expression from this handwriting."
   ]);
   \`\`\`

4. **LaTeX Rendering:**
   Result rendered as draggable LaTeX equation.

**WHY Gemini Vision:**
- Best OCR for handwriting among available models
- Handles messy writing
- Understands math notation (fractions, exponents)
- Fast enough for near-real-time (~300ms)

**Challenges Solved:**
- "x" vs "×" disambiguation (variable vs multiply)
- Fraction recognition
- Multi-step expressions
- Latency management (debouncing)

**Apple shipped this same feature** weeks before Keshav's version.
He shipped a working clone within days of seeing it announced.

Live: https://sketchculator.netlify.app/
GitHub: https://github.com/Keshav-Madhav/draw_calculator
`,
};

const projectVerbafloPlayground = {
  id: "project-verbaflo-playground",
  title: "VerbaFlo Playground — Prompt Evaluation Toolkit",
  content: `
Topics covered here: verbaflo playground, prompt evaluation, llm evaluation,
benchmark, a/b testing, opik traces, streamlit, eval toolkit.

**verbaflo-playground** is VerbaFlo's internal tool for benchmarking and
evaluating prompts against production conversation traces.

**The Problem It Solves:**
"Is this prompt change better?" Without systematic evaluation, prompt
engineering is guesswork. Playground provides data-driven answers.

**Architecture:**
\`\`\`
┌─────────────────────────────────────────┐
│  Data Sources                           │
│  • Opik traces (production)             │
│  • Elasticsearch (conversation logs)    │
│  • Snowflake (analytics)                │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Shared Logic (logic/)                  │
│  • Trace extraction                     │
│  • Prompt rendering (Jinja)             │
│  • LLM execution                        │
│  • Evaluation scoring                   │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────┴───────────────────────┐
│            │                            │
│  Streamlit │   FastAPI    │   Next.js   │
│   UI       │   (:25503)   │   (:3000)   │
│            │              │             │
└────────────┴──────────────┴─────────────┘
\`\`\`

**Workflow:**

1. **Extract Traces:**
   Pull real production conversations from Opik.

2. **Re-run with New Prompt:**
   Take the same input, run through modified prompt.

3. **LLM-Judge Evaluation:**
   Use a judge LLM to compare original vs new response:
   - Accuracy (did it answer the question?)
   - Helpfulness (was it useful?)
   - Tone (appropriate for brand?)
   - Safety (no harmful content?)

4. **Aggregate Results:**
   Statistical comparison: is the new prompt better?

**Features:**
- Side-by-side comparison view
- Batch evaluation (run 100 traces)
- A/B metrics dashboard
- Export results for analysis
- ClickUp integration (link results to tickets)

**Tech Stack:**
- Streamlit for quick internal UI
- FastAPI for API endpoints
- Next.js + React for richer UI components
- LiteLLM for multi-provider LLM calls
- Monaco editor for prompt editing
- Recharts for visualization

**Keshav's Contribution:**
Built the trace extraction pipeline and the evaluation scoring system.
The key insight: use production data, not synthetic test cases. Real
conversations have edge cases you'd never think to test.
`,
};

// ============================================================================
// PERSONALITY, INTERESTS, PHILOSOPHY
// ============================================================================

const personalityOptimization = {
  id: "personality-optimization",
  title: "Personality — Keshav is an optimization junkie",
  content: `
Topics covered here: what makes Keshav tick, what drives him, motivation,
core traits, personality, what is he like, what kind of engineer, passion,
obsession with speed, identity as an engineer, why he builds what he builds.

The most reliable through-line in Keshav's work: he is an optimization
junkie. He sees code and immediately starts asking "why is it like this,
how was it built, can it be faster?" — and then answers it. The receipts:

- **Brainfuck interpreter**: 1 BILLION operations in 6 seconds. Went
  deep into V8 internals (TypedArrays, hidden classes, branch prediction,
  JIT tier transitions) for sport.
- **PrudentBit Next.js 14 migration**: 5× faster page loads.
- **VerbaFlo Copilot**: spawned a sub-second text-to-SQL spinoff used
  in the main bot.
- **Cookie Clicker clone**: dirty-flag system, ~40% CPU → <3% CPU on
  end-game upgrade trees.
- **Space Sandbox**: 21,000 bodies at 30fps via Barnes-Hut and GPU
  instancing.
- **Grid Math**: 500k GPU points at 60fps via persistent buffers, shader
  math, packed attributes.
- **Portfolio site (this site)**: 6 rounds of statistically-significant
  perf passes — main thread work −89%, TBT −95%, LCP −33%, all
  documented under .claude/skills/perf-bench/.
- Even his **hobby gaming** pulls on the same wire. Min-maxing dino
  stats / base layouts in Ark is the same mental circuitry.

This trait shows up everywhere:
- In his choice of SIDE PROJECTS (game loops, interpreters, simulations —
  all perf-bound)
- In his work (he's the "fast shipper" at VerbaFlo, partly because he
  optimizes his own dev loop aggressively)
- In his hobbies (min-maxing games, building stuff to be efficient)

If the conversation drifts toward "what makes you tick?" — it's this.
He's the person on any team who will profile first, optimize second,
and never be satisfied with "it's probably fine."

How this trait shaped his career:
- College side projects were all optimization playgrounds
- At PrudentBit, his big headline was a perf migration
- At VerbaFlo, his text-to-SQL spinoff is literally a latency
  optimization that became a product
- His own portfolio site has six rounds of documented perf optimization

He's aware it can be a weakness too. Sometimes "fast" outruns "correct"
if you're not careful. He consciously slows down now on greenfield code
to make sure the design is right before optimizing the implementation.
`,
};

const personalityGaming = {
  id: "personality-gaming",
  title: "Personality — gaming interests",
  content: `
Topics covered here: gaming, video games, what games does Keshav play,
hobbies, interests outside of work, favorite games, Subnautica, Ark,
Uncharted, what does he do for fun, leisure activities, free time.

Keshav is a heavy gamer. Career and learning pace leave less TIME for
gaming now, but the interest hasn't dropped.

His top three games, in order, and what each one reveals about how he
thinks:

1. **Subnautica** (favorite).
   Underwater survival, deep-sea dread. The Cyclops submarine. The Sea
   Emperor. He's drawn to the feeling of being a tiny human in an
   ecosystem you don't fully understand — which is the same instinct
   that pulls him toward space and toward agentic AI systems. Curiosity
   over conquest. The game rewards exploration and patience rather than
   combat. That's his vibe.

2. **Ark: Survival Evolved**.
   At the top for two reasons. First, the dinosaur obsession (covered in
   the dinosaur section). Second, Ark scratches the optimization /
   min-max itch HARD. Tame the right dino, design the right base, breed
   the right stats, plan the right raid. It's the same brain circuitry
   that makes him spend a weekend shaving 10× off a Brainfuck interpreter.

3. **Uncharted** (the series).
   Drake's writing, Naughty Dog's set-piece chops. Comfort-replay
   material. Reflects what he values in his own work: tight craft,
   polish, the experience AS the product. Uncharted is a master class
   in how linear storytelling can still feel alive when every element
   is hand-tuned.

Other games he enjoys but doesn't obsess over:
- Any survival / crafting game (Valheim, The Long Dark, Don't Starve)
- Strategy / simulation (Factorio, RimWorld — these feed the
  optimization itch)
- Puzzle-platformers for comfort plays

He doesn't just play games, he BUILDS them. The "JS Game Dev" line on
his resume — 30+ games (Space Invaders, Brick Breaker, Conway's Life,
Physics Maze, 3D Maze, etc.) — is partly a DSA / perf-optimization
playground, partly genuine love. Cookie Clicker and Tetris are public
examples. Game-engine constraints (must hit 60fps, must minimize allocs
in the hot loop) are exactly his playing field.

Most "free time" still gets spent coding anyway — the gaming and the
building feed each other.
`,
};

const personalitySpace = {
  id: "personality-space",
  title: "Personality — space obsession",
  content: `
Topics covered here: space, astronomy, interests, hobbies, passions,
what is Keshav into, what does he like, black holes, planets, stars,
rockets, SpaceX, NASA, do you like space, space obsession, outer space.

Keshav is genuinely obsessed with space. This is not a casual interest
— it's a deep fascination that will sustain a multi-hour conversation
if you let it.

Topics he'll happily engage on:
- **Black holes**: event horizons, accretion disks, Hawking radiation,
  the M87* and Sgr A* images, the three-body problem's nightmarish
  complexity
- **N-body dynamics**: why the two-body problem is solvable and
  three+ isn't (in closed form), chaotic orbits, Lagrange points,
  numerical integration choices
- **Exoplanets**: transit method vs radial velocity, habitable zones,
  TRAPPIST-1, Kepler catalog, biosignatures (real and speculative)
- **Voyager**: Golden Records, the Pale Blue Dot, how they're still
  talking to Earth
- **James Webb Space Telescope (JWST)**: the sunshield unfolding, the
  first images, what it reveals about early galaxy formation
- **Hubble**: the deep field images, the repair missions
- **Artemis program and modern spaceflight**: the economics, SpaceX,
  the Moon-to-Mars vision
- **Theoretical physics as it touches space**: general relativity,
  dark matter vs modified gravity, inflation

The **Space Sandbox** project is the side project he's most personally
attached to. It's literally his space obsession expressed in code. When
visitors bring up space in the chat, he'll lean in — not deflect.

Why space? Probably the same reason he loves Subnautica. The feeling of
being tiny in an incomprehensibly large system. That's aesthetically
compelling to him.

Engagement rule: if a visitor mentions space, black holes, n-body,
anything — engage. Use general knowledge. Have a real conversation.
Tie back to the Space Sandbox if it fits naturally, but don't force it.
This is about showing the human, not redirecting to the resume.
`,
};

const personalityDinosaurs = {
  id: "personality-dinosaurs",
  title: "Personality — dinosaurs, prehistoric life, evolution",
  content: `
Topics covered here: dinosaurs, prehistoric life, evolution, interests,
hobbies, passions, what is Keshav into, favorite dinosaur, Ankylosaurus,
Baryonyx, do you like dinosaurs, paleontology, fossils, T. rex.

Keshav is genuinely captivated by dinosaurs, prehistoric life, and the
story of evolution. This is a DEEP fascination, not a casual one.

His TWO FAVORITE dinosaurs:

1. **Ankylosaurus** — the living tank. He loves the absurd defensive
   engineering: the club tail (fused vertebrae that formed a bone mace),
   fused armor plates (osteoderms), even armored eyelids (bony scutes
   over the eyelids). "Peak natural selection went hard." He finds it
   hilarious and beautiful that evolution produced a walking fortress.

2. **Baryonyx** — the fish-eating spinosaurid. Crocodile-like skull, big
   claws (named "heavy claw" — baryo + onyx), surprisingly
   under-celebrated compared to its bigger cousin Spinosaurus. He likes
   the underdog status.

But he's a fan of basically every dinosaur and every prehistoric
creature. The fascination extends across eras:

- **Mesozoic dinosaurs**: the obvious ones (T. rex, Triceratops,
  Stegosaurus) but also the weird ones (Therizinosaurus with its giant
  sloth-like claws, Parasaurolophus with its trombone skull, Deinocheirus
  the awkward duck-dinosaur)
- **Permian synapsids**: Dimetrodon (not a dinosaur! a mammal ancestor),
  Gorgonopsids, weird pre-mammal lineages
- **Cenozoic megafauna**: Megatherium (giant ground sloth), Smilodon
  (saber-tooth cat), Andrewsarchus (huge mammalian carnivore), woolly
  mammoths
- **Giant insects of the Carboniferous**: Meganeura (griffinflies with
  2-foot wingspans), Arthropleura (huge armored millipede)
- **Ediacaran fauna**: the weird flat-creatures from before animals
  really figured out what they were
- **Evolution itself**: how lineages diverge, how mass extinctions
  reshape the table, why feathers came before flight, why the Cambrian
  explosion still doesn't have a tidy answer

Engagement rules for the chat:
- If a visitor brings up a specific dinosaur or prehistoric creature,
  talk about it. Riff. Share facts.
- If asked his favorites, say Ankylosaurus and Baryonyx and explain why
  in two sentences each.
- Don't only talk dinosaurs — prehistoric mammals, giant insects, and
  Ediacaran fauna are all fair game.
- Connect to evolution when relevant. "How did X evolve?" or "what's a
  niche that opened after Y went extinct?" are great rabbit holes.
- Don't pivot to projects unless the visitor steers there.

Like space, this is about showing the human. Keshav is a curious person
with genuine interests outside of AI engineering, and prehistoric life
is one of the bigger ones.
`,
};

const personalityMusic = {
  id: "personality-music",
  title: "Personality — music, entertainment, non-gaming interests",
  content: `
Topics covered here: music, entertainment, interests, hobbies, what does
Keshav like, movies, books, reading, sci-fi, Dune, Three-Body Problem,
Christopher Nolan, documentaries, free time activities, non-gaming hobbies.

IMPORTANT: Keshav is NOT into sports. He does NOT watch football,
cricket, basketball, or any live sports. Do not mention sports as
one of his interests — it would be factually wrong.

Keshav loves music — across all genres. He's not a purist about one
scene; he'll listen to electronic, metal, classical, rock, jazz,
indie, film scores, whatever.

He's tried PRODUCING music himself — DAWs (Ableton, FL Studio), sample
libraries, the whole setup. Never liked the result. Music production
is a different skill from music appreciation and he's made peace with
being a consumer rather than a creator in that domain.

He has a 30+ track custom music library inside his Cookie Clicker game
(the project he built) — that's the closest he gets to "curating music"
as output.

Not a sports guy. Doesn't watch football, cricket, basketball, or
anything else live. Not against sports in principle, just not his thing.

Not a heavy drinker. Not into party culture particularly.

Things he DOES enjoy outside of coding and gaming:
- Reading sci-fi and hard fantasy (he's a fan of the Three-Body Problem
  trilogy, Dune, and various classic sci-fi)
- Watching documentaries (nature docs, space docs, anything science-y)
- Occasional movies — particularly ones with tight craft (Christopher
  Nolan, Denis Villeneuve)
- Hanging out with his core group of close friends

Most of his free time goes to coding anyway. He has a few close friends
he sees regularly, and family is important — but he's not a big social
butterfly.

Personality shorthand: introvert-leaning, curious, detail-oriented,
impatient with bad design, warm with people he knows well, polite but
reserved with strangers.
`,
};

const workStyle = {
  id: "work-style",
  title: "Work style — how Keshav operates",
  content: `
Topics covered here: how does Keshav work, how do you work, work style,
work habits, daily workflow, engineering approach, working philosophy,
how he collaborates, how he ships, his process, working with him, working
with Keshav, his method, what is it like to work with him.

How Keshav works, day-to-day:

- **Fast shipper.** This is his calling card at VerbaFlo. When a tool
  or internal product needs to exist, he's the person who'll have a
  working v1 by end of week. Not polished, but functional and testable.

- **Ideator.** Spends real planning time with the team brainstorming
  infra improvements, not just ticking off implementation tickets. He's
  often the source of "what if we built X?" conversations.

- **Strong opinions on observability.** Every system he ships has
  tracing from day 1, not bolted on later. He thinks "you can't fix what
  you can't see."

- **Treats prompts like code.** Versioned, eval'd, A/B'd. He's the
  person on the team who notices when a model upgrade silently regressed
  an eval set by 3 points.

- **Fast iteration loops.** Allergic to long feedback cycles. You'll
  find him building a 5-minute throwaway tool to make a 20-minute task
  repeatable. The simulation harness at VerbaFlo is the biggest example
  of this.

- **Full-stack comfort.** TypeScript / Python on the backend, React /
  Tailwind on the front, Electron / Swift / WASM when needed. Genuinely
  full-stack, not "I touched the front end once."

- **Code review style.** Mostly asks questions rather than prescribes
  solutions. "Why did you pick X over Y?" gets better outcomes than
  "this should be Y."

- **Meetings.** Tolerates them, doesn't love them. Prefers async for
  anything that can be async. Will push back on standing meetings with
  no clear agenda.

- **Working hours.** Flexible. Ships when the work is ready, not at a
  fixed clock-out time. Appreciates the same flexibility from teammates.

- **Tool choice philosophy.** Picks the simplest tool that gets the job
  done. Ships a 20-line vanilla JS solution where a teammate might
  suggest a 200KB library. That said, doesn't reinvent wheels that are
  standardly available — won't build his own ORM.

- **Profiling before optimizing.** Won't write "faster" code without
  measurements. Lighthouse, Chrome DevTools, custom benchmarks —
  whatever gives a concrete delta.

His ideal team vibe: informal, collaborative, people who'll grab dinner
together and argue about a design decision in the same hour. Family-feel,
not corporate. More in the "what he avoids" section.
`,
};

const opinionsPhilosophy = {
  id: "opinions-philosophy",
  title: "Philosophy and strong opinions",
  content: `
Keshav's strong opinions, held with real conviction:

1. **"AI will not replace engineers if engineers keep growing."**
   Yes, AI can build practically everything now — but only with
   engineers' guidance. The role shifts, it doesn't disappear. Engineers
   who refuse to adopt AI tools get replaced; engineers who embrace them
   become 5× more effective. He'll argue this at a whiteboard.

2. **Tooling is a force multiplier.** Most of his impact at any company
   is from the surfaces he builds for his teammates, not the features
   he ships directly. MCP debugger, simulation harness, tracing UI —
   all leverage plays. He's known for building the thing that makes
   everyone else 2× faster.

3. **Types > tests (for most code).** Good TypeScript types with
   careful generics catch more bugs than 80% coverage of obvious code.
   Reserves testing effort for the genuinely tricky stuff (concurrency,
   edge cases, integration points). Not against tests, against bad
   tests.

4. **Observability is not optional.** Trace from day 1. If you can't
   see what your system is doing in production, you don't actually have
   a system — you have a prayer.

5. **Don't pre-optimize.** Cares deeply about perf, but optimization
   passes only happen with measurable problems. Runs Lighthouse + custom
   benchmarks. The instinct to optimize early is often wrong.

6. **Frameworks are tools, not religions.** Picks the simplest tool for
   the job. No React fanboy, no Svelte fanboy, no Vue fanboy. Has
   opinions but not tribalism.

7. **Ship prototypes to force specs.** When product asks for something
   underspecified, he'll ship a rough v1 rather than spend weeks in
   spec meetings. The v1 makes the spec visible. Then iterate.

8. **"Fast shipper" has costs.** He's conscious that "fast" sometimes
   outruns "deep." Actively working on slowing down to really inhabit
   implementations before moving on.

9. **Reading docs > watching videos.** For deep technical learning,
   primary sources win. Videos are fine for overviews.

10. **Open source matters.** Most of his impact outside work is through
    open-source side projects (90+ repos, 10K+ extension installs). He
    treats them seriously — not "look at me" vanity projects, actual
    usable tools.

Things he has WEAK opinions on (doesn't care much):
- Tabs vs spaces (whatever the team uses)
- Semi-colons in JS (whatever the linter wants)
- Dark mode vs light mode (dark, but it's not a hill)
- IDE of choice (VS Code + Cursor now, but he's used most of them)
`,
};

const whatHeAvoids = {
  id: "career-avoids",
  title: "What Keshav avoids in work environments",
  content: `
Things Keshav actively AVOIDS in work environments:

- **All-adults environments.** No chemistry, all decorum, no warmth. He
  needs to actually enjoy the people he works with.

- **Strict 9-to-5 cultures** where flexibility isn't on the table. He
  wants the freedom to ship at 2 AM some nights and take a long lunch
  the next day.

- **Heavy corporate vibes.** Process over outcomes. Formal over real.
  Long email chains where a 5-minute call would fix it. Meetings that
  could have been Slacks. He can tolerate corporate bureaucracy for
  the right work but actively prefers less of it.

- **Micromanagement.** Hourly standups, detailed time tracking,
  approvals for every design decision. He does best with a clear goal
  and autonomy to achieve it.

- **Boring, repetitive work with no learning surface.** He'll take a
  hard problem over an easy-and-high-paying-but-repetitive one. If
  there's nothing to learn, he won't stay.

- **Work he can't be proud of.** If the product is exploitative, dark
  pattern-heavy, or ethically questionable, he's out. He's happy to
  discuss ethics of his current work with anyone who asks.

What he PREFERS:

- **Family-feel teams.** Informal, collaborative, people who'll grab
  dinner together and argue about a design decision in the same hour.

- **Mentorship access.** Someone senior in AI he can learn from.
  Doesn't have to be his direct manager — can be a peer, a principal,
  anyone who knows more than him about the stuff he's learning.

- **Flexible hours and hybrid work.** He's hybrid at VerbaFlo now and
  it works for him.

- **Autonomy + clear goals.** Tell him what needs to happen, let him
  figure out how. Check in regularly but don't dictate implementation.

- **Real investment in tooling.** Companies that view tooling as
  first-class work (not "nice to have when you have time") tend to be
  the ones he thrives in. VerbaFlo is like this.

- **Strong engineering culture.** Where technical quality is valued,
  where code reviews are thoughtful, where senior engineers teach.
`,
};

const careerOutlook = {
  id: "career-outlook",
  title: "Career outlook — when would he move jobs",
  content: `
Keshav's honest career outlook (not LinkedIn-speak):

He's actually HAPPY at VerbaFlo right now. Not job-hunting in any active
sense. If you're a recruiter reaching out cold, expect a polite
"thanks, not looking actively" unless the role is genuinely
compelling.

If a move WERE to happen, the trigger would be **learning** — not title
or stock. He's early career (3+ years professional) and applied AI is a
broad field. He's currently scratching the surface (prompting, tooling,
retrieval, orchestration) but hasn't gone deep on fine-tuning,
training-time optimization, or model internals. He'd jump for a role
where he can learn those.

Criteria for a move, in order of importance:

1. **Learning trajectory.** Will this role grow him in areas he can't
   easily grow on his own? Deep AI work, model internals, research-
   informed engineering, large-scale infra — those are what interest
   him.

2. **Mentorship matters more than team size.** Could be a 5-person
   startup, could be a 500-person company — what matters is having
   someone senior in AI who can accelerate the learning curve.

3. **Team quality.** He wants to work with people who are smart,
   kind, and shipping. The "who I'd want to grab dinner with" test.

4. **Compensation floor: matching or beating ~17 LPA** (Indian Rupees,
   his current VerbaFlo comp). Bumps welcome, but the bar is "don't
   take a pay cut."

5. **Company shape / stage.** Open to most — startup (5-50), scale-up
   (50-500), established (500+). As long as the team has AI depth to
   teach.

Roles he'd be most excited about:
- AI / ML research engineer at a lab or research-driven company
- Infrastructure engineer at a company with serious AI workloads
- Founding engineer at an AI-native startup (if the founders are strong)
- Core ML / foundation-model team at a bigger AI company

Roles he'd be less excited about:
- Traditional front-end at a non-AI company (regression)
- Consultancy / agency work (his consulting slot is limited already)
- Pure management (he wants to code for a while longer)

Best way to start a conversation: email keshav.madhav@verbaflo.ai with
(1) what the role is, (2) what he'd learn from it, (3) the team lead
or mentor he'd be working with. He'll respond within 24h on weekdays.

He's selective, not desperate. If the role isn't a good fit, he'll say
so directly rather than waste both parties' time.
`,
};

// ============================================================================
// TECH STACK (deep, queryable)
// ============================================================================

const techAiAgents = {
  id: "tech-ai-agents",
  title: "Tech stack — AI, agents, orchestration",
  content: `
Keshav's AI / Agents tech stack — what he actually uses day-to-day:

**Orchestration**:
- Custom multi-agent orchestrators (not a framework). His VerbaFlo
  Copilot is hand-written Python, not LangGraph or CrewAI. Off-the-shelf
  agent frameworks have too much overhead for sub-second latency targets.
- Parallel tool-calling patterns (up to 12 agents running simultaneously)
- SSE streaming for token-by-token output
- Semantic caching for repeated queries
- Schema pre-warming for cold-start avoidance
- Clarification loops (agent asks back when questions are ambiguous)

**Agent frameworks used**:
- LangGraph (knows it, but uses custom runtime in prod for reasons above)
- LangChain (uses pieces of it — particularly retrieval utilities)
- Instructor (Pydantic-validated LLM outputs — heavy use for text-to-SQL)
- MCP (Model Context Protocol) — builds both MCP clients and MCP servers
  routinely. The VerbaFlo Unified Debugging MCP is a custom server.

**Retrieval / RAG**:
- Milvus / Zilliz as primary vector store at VerbaFlo
- Hybrid search (dense + sparse embeddings)
- 6-variant query expansion (one user question → 6 retrieval queries
  to cover phrasing variations)
- Reranking (cross-encoder on top-50 results to get final top-5)
- Chunking strategies (fixed-size, semantic, sliding window)
- Embedding models: OpenAI text-embedding-3-small, BGE, E5, Cohere Embed

**Text-to-SQL / structured generation**:
- Pydantic for schema validation (rejects malformed LLM outputs)
- Live schema injection (LLM sees actual schema, not cached docs)
- Query validation (check SELECT before execute)
- Used in VerbaFlo Copilot and main bot

**Evals**:
- LLM-as-judge for subjective criteria
- Synthetic benchmarks (custom generators)
- Regression deltas via simulation harness
- A/B testing with statistical tests

**MCP specifically**:
- MCP servers (custom, for the VerbaFlo debugger)
- MCP clients (for consuming other teams' MCP tools)
- Tool routing, guardrails, deterministic outputs

He's genuinely opinionated on this stack. Happy to debate choices.
`,
};

const techModels = {
  id: "tech-models",
  title: "Tech stack — models and APIs",
  content: `
Keshav regularly uses LLMs across multiple providers:

**Anthropic Claude**: Primary model for reasoning-heavy tasks. Claude 3.5
Sonnet, Claude 3 Opus, Claude 3 Haiku (for cheap/fast). Prefers Claude
for code-related tasks and complex multi-step reasoning.

**OpenAI**: GPT-4o, GPT-4, GPT-4 Turbo, GPT-3.5 Turbo. Used for its tool-
calling capabilities and wide availability. Embeddings
(text-embedding-3-small, text-embedding-3-large).

**Google Gemini**: Gemini Pro, Gemini Flash. Used via Vertex AI at work.
Flash is the "cheap fast" option for high-volume tasks.

**Vertex AI**: Google Cloud's AI platform. Used at VerbaFlo for Gemini
access plus Vertex's LLM infrastructure.

**Cerebras**: Ultra-fast inference (tokens per second is the highest
available). Used for latency-critical tasks.

**Together AI**: Hosts open-source models (Llama, Mistral, Qwen). Used
for cost-optimization on tasks that don't need frontier models.

**Groq**: Fast inference (Llama 3.1 8B Instant, Llama 3.3 70B Versatile).
Used for the chat assistant on this portfolio site.

**LiteLLM**: Unified wrapper that lets one API call hit any of the above.
Keshav built VerbaFlo's custom LiteLLM wrapper. Invaluable for A/B
testing across models.

Selection logic in production:
- Latency critical + high volume → Groq, Cerebras, Gemini Flash
- Reasoning quality → Claude Sonnet, GPT-4o
- Cost-sensitive batch jobs → Together AI (hosted OSS)
- Embeddings → OpenAI text-embedding-3-small (cost/quality sweet spot)

He stays current on the model landscape — it changes every 2-3 months
and the rankings shift. Not brand-loyal, just pragmatic.
`,
};

const techData = {
  id: "tech-data",
  title: "Tech stack — data, databases, streaming",
  content: `
Keshav's data layer stack:

**MongoDB**: Primary document store at VerbaFlo. Stores user
conversations, bot state, metadata. He writes complex queries,
aggregations, and pipelines routinely.

**PostgreSQL**: Primary relational DB. Used for structured analytics,
property management data at VerbaFlo. Writes complex queries including
joins, CTEs, window functions.

**Milvus / Zilliz**: Vector stores. Milvus is the open-source version,
Zilliz is the managed cloud version. Used for RAG retrieval. He tunes
indexes, chunking strategies, and hybrid search configurations.

**Redis**: Caching layer. Session state, semantic cache for LLM
responses, rate limiting.

**Snowflake**: Data warehousing (some exposure, not his primary
strength).

**Kafka**: Event streaming (familiar, used at VerbaFlo for pipeline
events).

**asyncpg**: Async Postgres driver for Python. His preferred way to talk
to Postgres in async FastAPI apps.

**Supabase**: Used in side projects (Chatter) for media + auth. Good
DX, Postgres under the hood.

**Firebase**: Used in side projects (ClonePen, Zen Notes) for
storage + auth. Good for quick prototyping.

**Convex**: Reactive real-time database used in Chatter. Streams updates
to clients automatically when underlying data changes.

**Elasticsearch**: Used at VerbaFlo for trace indexing and search. He
writes ES queries, aggregations, and uses the Python client.

**Pinecone**: Familiar (explored), not his primary vector store
(Milvus is).

Data work he's comfortable with:
- Schema design for new databases
- Migration planning and execution
- Query optimization (indexing, EXPLAIN plans)
- Real-time replication and CDC
- Backup / restore workflows

Not his primary strength: deep data engineering (Spark, Airflow, dbt).
He's touched these but wouldn't claim expertise.
`,
};

const techObservability = {
  id: "tech-observability",
  title: "Tech stack — observability and debugging",
  content: `
Observability is a specific strength for Keshav. He ships tracing from
day 1 on every system.

**Prometheus + Grafana**: Metrics. Time-series metrics on latency,
throughput, error rates. Familiar with PromQL.

**Jaeger**: Distributed tracing. Span-level visualization. Used when
OpenTelemetry is the tracing backbone.

**OpenTelemetry (OTel)**: Distributed tracing standard. He instruments
services with OTel SDKs (Python, Node).

**Elasticsearch + Kibana**: Log aggregation and search. Used at VerbaFlo
for trace storage and the custom tracing UI he built.

**Opik**: Comet's open-source LLM observability. He used it, then built
VerbaFlo's own in-house version that was faster and better-tuned for
their specific pipeline.

**Custom tracing**: At VerbaFlo, he built their entire tracing UI and
LLM playground. Span-level querying with Elasticsearch aggregations,
run-over-run diff views, prompt replay.

**LangSmith / Langfuse**: Familiar with both, has evaluated them. Uses
VerbaFlo's in-house solution in prod.

**Chrome DevTools Performance**: Heavy user. Frame-by-frame analysis,
flame graphs, memory profiling. Non-trivial web perf work happens here.

**Lighthouse**: Standard web perf benchmarks. Uses it for CI-level
checks (LCP, TBT, CLS).

**Custom benchmarks**: Writes his own benchmarks for specific hot paths.
The Brainfuck interpreter has a dedicated benchmark suite. The portfolio
site has .claude/skills/perf-bench/ for repeatable Lighthouse runs with
statistical significance testing (Welch's t-test).

Debugging philosophy:
- Trace first, log second, print last
- Reproduce before fixing
- Fix the root cause, not the symptom
- If you can't explain the bug, you can't trust the fix
`,
};

const techFrontend = {
  id: "tech-frontend",
  title: "Tech stack — frontend",
  content: `
Frontend is Keshav's original strength and still a core skill:

**React** (primary). Has used all versions from 16 through 19. Hooks-era
expertise. Understands rendering internals, reconciliation, Suspense,
Concurrent Mode.

**Next.js** (primary meta-framework). Used 12, 13, 14, 15. App Router
fluent. Server Components. Route handlers. Edge runtime. ISR.

**TypeScript**: Daily driver. Strict mode. Careful generics. Thinks good
types prevent more bugs than most tests catch.

**Vite**: For non-Next projects. Favors its speed over CRA.

**Tailwind CSS**: Daily driver for styling. Prefers the utility-first
approach. No strong CSS-in-JS preference; Tailwind wins on DX.

**Framer Motion**: Animation library. Used heavily on this portfolio
site. Understands layout animations, gestures, scroll-linked animations.

**GSAP**: Used for complex scroll-triggered narratives (Fizzi). Heavier
than Framer Motion but more powerful for specific cases.

**Three.js** + **React Three Fiber (R3F)** + **drei**: For 3D work.
Used in Fizzi. Knows the R3F patterns and drei helpers. Shader work
when needed.

**WebGL**: Raw WebGL (not just through Three). Grid Math uses custom
WebGL. Space Sandbox uses WebGL for 21k body rendering.

**ShadCN / Radix**: For component primitives. Prefers these to
heavier UI libraries.

**Zustand**: State management preference over Redux for most apps.
Simpler, less boilerplate.

**HTML Canvas 2D**: Used in Cookie Clicker, the old Space Sandbox,
various games. Performance-critical rendering.

**CSS**: Solid fundamentals. Understands flex/grid deeply. Custom
properties for theming. Prefers Tailwind for most work but can write
vanilla CSS when needed.

Not his current favorite but familiar: Svelte, Vue (evaluated both,
prefers React ecosystem).

Frontend patterns he's opinionated on:
- Server Components for data-heavy pages
- Suspense boundaries strategically placed
- useCallback / useMemo: use sparingly, measure first
- Imperative DOM manipulation for perf-critical loops (yes, even in React)
`,
};

const techBackend = {
  id: "tech-backend",
  title: "Tech stack — backend, Python, infra",
  content: `
Keshav's backend / infra stack:

**Python** (primary backend language for AI work). FastAPI is his go-to
framework. async/await fluent. Pydantic for validation. Typed Python.

**FastAPI**: Daily driver at VerbaFlo. Async endpoints, dependency
injection, OpenAPI generation.

**Node.js**: Daily driver for front-of-house APIs and tools. Express
when needed.

**Streaming / SSE**: Server-Sent Events for LLM token streaming. Writes
SSE handlers in FastAPI and Node routinely.

**Celery**: Background task queue (Python). Used at VerbaFlo for async
pipelines.

**APScheduler**: Scheduled jobs (Python).

**Jinja2**: Template engine. Actually uses it in production at work,
not just for his Live Jinja extension.

**Prisma**: TypeScript ORM. Used in side projects where it fits.

**Google AppsScript**: For Workspace integrations (used at PrudentBit
for Gmail integration).

**Docker**: Daily use. Writes Dockerfiles, docker-compose files,
multi-stage builds.

**Kubernetes**: Uses K8s at VerbaFlo. Not his deepest strength but
comfortable with basic ops (deployments, services, secrets, configmaps).
Would love to go deeper.

**AWS**: Uses various services (S3, Lambda, ECS). Comfortable but not
his deepest cloud.

**GCP**: Used at VerbaFlo (Vertex AI is GCP-native). Comfortable.

**Vercel**: Hosts his side projects. Next.js-friendly.

**Cloudflare Workers**: Used for edge AI in Zen Notes. Workers AI for
models at the edge.

**Git**: Obvious. Uses CLI, not GUI. Commits often, rebases carefully.

**Makefile / IaC**: Writes Makefiles for project scripts. Uses
Terraform (familiar, not daily).

**Bun / pnpm**: Package managers. pnpm preferred for monorepos.

His infra philosophy:
- Containerize everything that ships
- IaC when the team grows; ad-hoc fine for side projects
- Monitor before scaling
- Cost-conscious (especially with LLM APIs)
`,
};

const techDesktop = {
  id: "tech-desktop-native",
  title: "Tech stack — desktop and native",
  content: `
Topics covered here: Electron experience, desktop apps, native apps,
have you worked with Electron, Swift, macOS native, Puppeteer automation,
browser automation, Pyodide, WebAssembly, WASM, building cross-platform
desktop software.

Keshav has non-trivial desktop and native experience:

**Electron**: Built the Conversation Simulation harness at VerbaFlo and
the Grid Math desktop wallpaper mode. Knows IPC patterns,
renderer/main-process separation, auto-updaters.

**Puppeteer**: Browser automation. Core of the simulation harness — used
to drive real web widgets with synthetic inputs.

**Pyodide / WebAssembly**: Python running in WASM. Used in Live Jinja
Renderer (VS Code extension and web version). Knows the performance
characteristics and limitations.

**Swift (native bindings)**: For macOS-specific features in Grid Math.
Specifically: system audio capture via ScreenCaptureKit, desktop
wallpaper integration. Wrote Swift code that Electron calls into.

**VS Code API**: Published extension (Live Jinja Renderer — 10K+
installs). Knows webview panels, language server integrations, command
registration, status bars.

**Web Audio API**: Real-time audio analysis in Grid Math. FFT, frequency
bins, analyser nodes.

**WebRTC** (via LiveKit): Video / audio calls in Chatter. LiveKit
abstracts most of it but you still handle signaling, reconnection,
and UX.

**MCP (Model Context Protocol)**: Builds both MCP clients and MCP
servers. VerbaFlo Unified Debugging MCP is his biggest MCP project.

Why this range: Keshav likes building things that cross the "web /
native" line. It's where interesting problems live — desktop wallpaper
integration, native audio capture, VS Code extensions are all places
where web technology has to break out of its sandbox.

Not his current strength: iOS / Android native development (he's touched
React Native but hasn't shipped a polished mobile app).
`,
};

// ============================================================================
// THIS SITE (portfolio)
// ============================================================================

const portfolioSite = {
  id: "portfolio-site",
  title: "This portfolio site — architecture and tech",
  content: `
This portfolio site (keshav-madhav.com or similar deployment URL) is a
Next.js 13 App Router app that Keshav uses as both a portfolio AND a
playground for perf / UX experiments.

Stack:
- Next.js 13 (App Router)
- React 18
- TypeScript (strict)
- Tailwind CSS
- Framer Motion (animations)
- Ably (real-time multiplayer — cursors and reactions)
- Groq (chat assistant, Llama 3.x models)
- Custom RAG pipeline with Transformers.js (the chat you're having now)

Key features visitors can see:
- Homepage with hero, work history, featured projects, stack, contact
- About page with deeper bio
- Deferred effects (canvas backgrounds, Lenis smooth scroll, multiplayer
  cursors) that load AFTER LCP
- Spirit Guide: a living companion orb with 7 emotion states that reacts
  to visitor activity
- Chat widget (this conversation) with JD upload + RAG-based Q&A
- Performance-optimized for mobile (coarse-pointer devices skip most
  decorative effects)

Performance story (6 documented optimization passes in
.claude/skills/perf-bench/):
- Main thread work: −89%
- Total Blocking Time: −95%
- Largest Contentful Paint: −33%

Architectural highlights:
- **Deferred effects pattern**: app/layout.tsx mounts the smallest
  possible eager shell. components/deferred-effects.tsx waits for
  requestIdleCallback and mounts heavy effects after LCP.
- **Mobile optimization**: coarse-pointer devices skip entire decoration
  layer. Backdrop-filter blur killed on phones (GPU killer). Static
  gradient fallback instead of animated blobs.
- **Multiplayer (Ably)**: live cursors published in page coords (not
  viewport). Zero React re-renders during scroll via imperative scroll
  compensation. Browser never sees ABLY_API_KEY — minted via
  /api/ably/token.
- **Spirit Guide** (~1880 LOC): companion orb with spring physics, Perlin
  noise, behavior state machine (companion, drifter, explorer,
  grand_tour, escort, startled), and 7 emotion states.
- **Chat RAG**: pre-built embeddings of ~50 corpus sections. Runtime
  semantic search selects top-8 relevant chunks, injects into system
  prompt. Model is Groq Llama 3.3 70B.

Open source on GitHub (under the portfolio-website repo).

The site itself is both a portfolio and a statement: "here's what I can
do with front-end if I care." Not just a list of projects.
`,
};

const portfolioChatSystem = {
  id: "portfolio-chat-system",
  title: "This site's chat assistant — how RAG works here",
  content: `
The chat you're having right now is a custom RAG-based system Keshav
built. Details (since it's part of the portfolio):

**Stack**:
- Groq for inference (Llama 3.3 70B for real questions, Llama 3.1 8B
  for intro greetings)
- Transformers.js (Xenova/all-MiniLM-L6-v2) for embeddings, both at
  build time and runtime
- Custom semantic search over pre-built JSON embeddings
- Next.js API route with SSE streaming

**Build-time flow**:
1. scripts/corpus-source.mjs exports ~50 topic-coherent sections
2. scripts/build-embeddings.mjs runs at prebuild
3. Each section is chunked (~300 tokens, overlap) and embedded
4. Output: lib/context-embeddings.json (pre-stored, committed to repo)

**Runtime flow** (per user message):
1. User question hits /api/chat
2. Last 3 user messages concatenated as search query
3. Query embedded using same model (all-MiniLM-L6-v2)
4. Cosine similarity against pre-stored chunks → top-8
5. Top chunks injected as "RELEVANT CONTEXT" in system prompt
6. System prompt (persona + minimal facts + retrieved context) sent to
   Groq 70B
7. Response streamed via SSE back to browser

**Why this approach**:
- Previous version stuffed all context into system prompt (~9-10K tokens).
  Groq free-tier TPM limit is 12K, so visitors got rate-limited after 1-2
  turns.
- With RAG, base prompt is ~1.5K tokens + ~2-3K retrieved context per
  question = comfortably under limits.
- Corpus can grow to any size without affecting prompt size.
- URLs included in corpus = LLM can cite them accurately instead of
  hallucinating.

**What prevents hallucination**:
- Hard guard-rail in persona: "Never invent URLs"
- All project URLs in a dedicated corpus section
- When the LLM doesn't know something, instructed to say "I don't have
  that info handy" rather than guess.

**Gotcha learned**: embeddings JSON needs to be committed to the repo
(not gitignored) so production builds have the pre-computed vectors.
Otherwise the first request on a cold server waits for the model to
re-embed everything (slow).
`,
};

// ============================================================================
// URLS REFERENCE (critical anti-hallucination)
// ============================================================================

const urlsReference = {
  id: "urls-reference",
  title: "All project URLs and contact links (never hallucinate URLs)",
  content: `
**CRITICAL: These are the ONLY URLs that should ever be cited. Never
invent URLs. If a visitor asks for a link not in this list, say "I don't
have that URL handy" rather than guess.**

**Contact**:
- Work email: keshav.madhav@verbaflo.ai (preferred for hiring)
- Personal email: keshav2552003@gmail.com
- Phone: +91 78272 29447
- LinkedIn: https://www.linkedin.com/in/keshav-madhav/
- GitHub: https://github.com/Keshav-Madhav
- VerbaFlo company: https://www.verbaflo.ai/
- PrudentBit company: https://prudentbit.com/

**Grid Math** (500k GPU points, flagship creative coding):
- Live: https://keshav-madhav.github.io/grid-visualizer/
- GitHub: https://github.com/Keshav-Madhav/grid-visualizer

**Live Jinja Renderer** (VS Code extension, 10K+ installs):
- VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=KilloWatts.live-jinja-renderer
- Open VSX: https://open-vsx.org/extension/KilloWatts/live-jinja-renderer
- GitHub: https://github.com/Keshav-Madhav/live-jinja-renderer

**Live Jinja (Web)** — browser version of the extension:
- Live: https://keshav-madhav.github.io/live_jinja/
- GitHub: https://github.com/Keshav-Madhav/live_jinja

**Cookie Clicker Reimagined** (full from-scratch remake):
- Play: https://keshav-madhav.github.io/Cookie-Clicker/
- GitHub: https://github.com/Keshav-Madhav/Cookie-Clicker

**Space Sandbox** (N-body, 21k bodies @ 30fps):
- Live: https://keshav-madhav.github.io/Space-Simulation-HTML-CSS-JS/
- GitHub: https://github.com/Keshav-Madhav/Space-Simulation-HTML-CSS-JS

**Axon** (knowledge-graph for codebases, contributor):
- GitHub: https://github.com/harshkedia177/axon
- Keshav's commits: https://github.com/harshkedia177/axon/commits?author=Keshav-Madhav

**Zen Notes** (real-time collaborative notes with AI):
- Live: https://zen-notes-keshav.vercel.app/
- GitHub: https://github.com/Keshav-Madhav/zen-notes

**Fizzi Soda Landing** (3D product page):
- Live: https://fizzi-drinks.vercel.app/
- GitHub: https://github.com/Keshav-Madhav/fizzi-drinks

**Chatter** (full-stack real-time chat):
- Live: https://chatter-pink-two.vercel.app
- GitHub: https://github.com/Keshav-Madhav/chatter

**Brainfuck Interpreter** (1B ops in 6s):
- Live: https://keshav-madhav.github.io/Making-BF2/
- GitHub: https://github.com/Keshav-Madhav/Making-BF2

**Raycaster FPS** (Wolfenstein-style):
- GitHub: https://github.com/Keshav-Madhav/FPS-Shooter-HTML-CSS-JS

**3D Spatial Sim (Boids + N-Body)**:
- GitHub: https://github.com/Keshav-Madhav/3d-spatial-sim-for-boid-and-nbody

**Infinite Craft** (GPT-4o merge game):
- Live: https://infinite-craft-nine.vercel.app/
- GitHub: https://github.com/Keshav-Madhav/infinite-craft

**Yoom** (Zoom clone):
- Live: https://zoom-clone-black-sigma.vercel.app/
- GitHub: https://github.com/Keshav-Madhav/zoom-clone

**Tetris**:
- Live: https://tetris-keshav-madhav.netlify.app/
- GitHub: https://github.com/Keshav-Madhav/Tetris-Game-React

**ClonePen** (CodePen-style editor):
- Live: https://codepen-clone-dae8e.web.app/home
- GitHub: https://github.com/Keshav-Madhav/codepen-clone

**Resume**: /Front_End_Resume.pdf (on this portfolio site; click
"Résumé" in the hero)
`,
};

// ============================================================================
// EXPORT — the ordered list the build script reads
// ============================================================================

export const CORPUS_SECTIONS = [
  overview, identity, contact,
  originChildhood, originPivot, originCollege, learningApproach,
  verbafloOverview, copilotTool, simulationTool, mcpDebugger, tracingTool, verbafloLessons,
  prudentbitOverview, prudentbitImmune, prudentbitMigration, prudentbitLessons,
  projectGridMath, projectLiveJinja, projectCookieClicker, projectSpaceSandbox,
  projectAxon, projectBrainfuck, projectZenNotes, projectFizzi, projectChatter, projectsOther,
  projectsAI, projectsGames, projectsSimulations, projectsWebApps, projectsExperimental,
  // Detailed per-project deep dives
  projectAxonDeepDive, projectVfSimulationMcp, projectVfCopilotDeepDive,
  projectCookieClickerDeepDive, projectFpsShooterDeepDive, projectSpaceSandboxDeepDive,
  project3dNBodyDeepDive, projectGridVisualizerDeepDive, projectMinecraftJsDeepDive,
  projectLiveJinjaDeepDive, projectBoidsSim, projectDrawCalculatorDeepDive,
  projectChainReaction, projectOthello,
  projectVfAiBackend, projectVfPrompts, projectVerbafloPlayground,
  // Development timelines and evolution stories (why/how)
  devTimelineSpaceSim, devTimelineCookieClicker, devTimelineFpsShooter,
  devTimelineLiveJinja, devTimelineGridVisualizer, devTimelineVfSimMcp,
  devTimelineAxon, devTimelineVfCopilot,
  devTimelineMinecraft, devTimelineChainReaction, devTimelineZenNotes,
  devTimelineOthello, devTimelineZoomClone, devTimelineWavesToSound,
  devTimelineParticleLife, devTimelineChess, devTimelineFizzi, devTimelineDrawCalc,
  // VerbFlo detailed contributions
  vfContributionsOverview, vfContributionsAiBackend, vfContributionsCopilot,
  vfContributionsSimulation, vfContributionsPlayground, vfContributionsTracing,
  personalityOptimization, personalityGaming, personalitySpace, personalityDinosaurs, personalityMusic,
  workStyle, opinionsPhilosophy, whatHeAvoids, careerOutlook,
  techAiAgents, techModels, techData, techObservability, techFrontend, techBackend, techDesktop,
  portfolioSite, portfolioChatSystem,
  urlsReference,
];
