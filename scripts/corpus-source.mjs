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
quick intro, elevator pitch, brief summary, background summary.

Keshav Madhav is a 22-23 year old AI engineer at VerbaFlo, an AI SaaS
startup in Gurgaon, India. He builds production AI runtimes — custom
multi-agent orchestrators, retrieval pipelines, text-to-SQL, and the
desktop/IDE/observability tooling that teams debug against.

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
Madhav biography, at a glance.

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
Keshav joined VerbaFlo (https://www.verbaflo.ai/) in August 2025 as
AI Engineer, SDE-1. Based in Gurgaon, India (hybrid).

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
  personalityOptimization, personalityGaming, personalitySpace, personalityDinosaurs, personalityMusic,
  workStyle, opinionsPhilosophy, whatHeAvoids, careerOutlook,
  techAiAgents, techModels, techData, techObservability, techFrontend, techBackend, techDesktop,
  portfolioSite, portfolioChatSystem,
  urlsReference,
];
