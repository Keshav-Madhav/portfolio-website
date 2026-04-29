import clonepen from "@/public/clonepen.png";
import tetris from "@/public/Tetris.png";
import yoom from "@/public/yoom.png";
import infinitecraft from "@/public/infinitecraft.png";
import zennotes from "@/public/zennotes.png";
import fizzi from "@/public/fizzi.png";
import brainfuck from "@/public/brainfuck.png";

import gridHero from "@/public/grid-math-hero.jpeg";
import gridWallpaper from "@/public/grid-math-wallpaper.jpeg";
import gridVortex from "@/public/grid-math-vortex-clock.jpeg";
import gridSpiral from "@/public/grid-math-spiral.jpeg";
import spaceOrbits from "@/public/space-sim-orbits.jpeg";
import spaceGalaxy from "@/public/space-sim-galaxy.jpeg";
import space21k from "@/public/space-sim-21k.jpeg";
import spaceProbe from "@/public/space-sim-probe.jpeg";

import cookieMain from "@/public/cookie-main.png";
import cookieBakerReturn from "@/public/cookie-baker-return.png";
import cookiePrestige from "@/public/cookie-prestige-tree.png";
import cookieNewspaper from "@/public/cookie-newspaper.png";
import cookieStory from "@/public/cookie-story-modal.png";
import cookieMusic from "@/public/cookie-music.png";
import cookieMinigames from "@/public/cookie-minigames.png";
import cookieTutorial from "@/public/cookie-tutorial.png";
import cookieEasterEgg from "@/public/cookie-easter-egg.png";

export const nav = [
  { name: "Me", hash: "/#home" },
  { name: "About", hash: "/about", isPage: true },
  { name: "Work", hash: "/#work" },
  { name: "Projects", hash: "/#projects" },
  { name: "Stack", hash: "/#stack" },
  { name: "Contact", hash: "/#contact" },
] as const;

export const profile = {
  name: "Keshav Madhav",
  handle: "@keshav-madhav",
  role: "AI Engineer",
  company: "VerbaFlo",
  location: "New Delhi / Gurgaon, IN",
  email: "keshav.madhav@verbaflo.ai",
  altEmail: "keshav2552003@gmail.com",
  phone: "+91 78272 29447",
  resume: "/Front_End_Resume.pdf",
  github: "https://github.com/Keshav-Madhav",
  linkedin: "https://www.linkedin.com/in/keshav-madhav/",
  twitter: "",
  tagline:
    "Building production AI runtimes — custom orchestrators, retrieval, and the tooling teams debug against.",
  bio: "I build production AI runtimes — custom multi-agent orchestrators, retrieval pipelines, text-to-SQL, and the desktop / IDE / observability tooling teams debug against. I moved from a founding front-end role into full-stack AI, and I'm comfortable from WebGL and Electron up through Kubernetes and trace pipelines. The interfaces and the runtime are both mine.",
  extendedBio: {
    intro:
      "I'm Keshav Madhav — an AI engineer who ships full systems, not just prompts. Custom orchestrators, retrieval and eval infra, and the desktop / IDE / observability tooling that makes LLM pipelines legible. Started as a founding front-end engineer; grew into owning the runtime.",
    current:
      "Currently at VerbaFlo, I own core pieces of the agentic AI stack: a multi-agent orchestrator with parallel tool-calling and SSE streaming, retrieval pipelines on Milvus / Zilliz with hybrid search and query expansion, Pydantic-validated text-to-SQL across MongoDB and Postgres, and the company-wide debugging surface (a unified MCP server + custom tracing + LLM playground) the rest of the team debugs against daily.",
    past: "Before that, I was the founding front-end engineer at PrudentBit, where I built the entire Immune product suite (Immunefiles, Immunevault, ImmuneShare) from scratch — end-to-end encrypted storage and sharing with a migration to Next.js 14 that cut load times in half.",
    sideProjects:
      "Outside of work, I've shipped 90+ public repositories — games, simulations, creative-coding experiments, and developer tools. Highlights include a VS Code extension for live Jinja2 rendering (10K+ installs), an N-body gravity sandbox, a Cookie Clicker remake that went too far, and contributions to Axon (a knowledge-graph engine for codebases).",
    philosophy:
      "I believe the best AI systems are the ones you can actually see thinking. That's why I spend as much time on tracing, eval harnesses, and debuggable UIs as I do on the pipelines themselves.",
  },
  stats: [
    { label: "Years shipping", value: "3+" },
    { label: "AI pipeline stages owned", value: "6" },
    { label: "VS Code ext. installs", value: "10K+" },
    { label: "Side projects", value: "90+" },
  ],
  // Scan-first one-liners. The deeper read lives in extendedBio + experience.
  headline: "I build production AI runtimes — and the tools teams debug them with.",
  proofPoints: [
    { label: "Autonomous RCA", value: "95%+", detail: "across a 500k+ LOC codebase" },
    { label: "Agent orchestrator", value: "12 agents", detail: "parallel, streaming, cached" },
    { label: "VS Code installs", value: "10K+", detail: "Live Jinja Renderer" },
    { label: "Public repos", value: "90+", detail: "shipped end-to-end" },
  ],
  capabilities: [
    {
      title: "Multi-agent orchestrators",
      detail:
        "12-agent parallel execution across MongoDB, Postgres, and Milvus with SSE streaming, semantic cache, schema pre-warming, query expansion, and clarification loops. Custom runtime — not a framework wrapper.",
      tag: "Runtime",
    },
    {
      title: "Retrieval & RAG infra",
      detail:
        "Production Milvus / Zilliz vector stores with hybrid search, 6-variant query expansion, reranking, and Pydantic-validated text-to-SQL on top.",
      tag: "Pipelines",
    },
    {
      title: "Observability that pays off",
      detail:
        "A unified MCP debugger plugged into every AI-native IDE the team uses. Hand it a ClickUp ticket, it walks the codebase, traces, spans, and DBs and RCAs the bug autonomously.",
      tag: "Tooling",
    },
    {
      title: "Interfaces & the things teams use",
      detail:
        "Electron simulators, VS Code extensions, custom tracing UIs, span-search dashboards. The runtime and the surface are both mine.",
      tag: "Full-stack",
    },
  ],
  githubStats: {
    repos: 98,
    joinedYear: 2022,
    followers: 8,
  },
} as const;

// Highlighted, company-wide tools I shipped at VerbaFlo.
// These live INSIDE the Experience section (not the public projects grid).
export const vfInternal = [
  {
    id: "simulation",
    title: "Conversation Simulation",
    subtitle: "Desktop replay harness — thousands of real conversations, every stage, every branch",
    description:
      "An Electron + Puppeteer replay engine that autonomously drives live widgets with LLM-powered user personas, runs conversations through the current stack (Router, FAQ, Text2SQL, PMS, bot analysis) end-to-end, and catches regressions before anything touches prod. Doubles as the team's CID investigation tool — full transcripts enriched with Elasticsearch traces and span history.",
    bullets: [
      "Parallel replay of thousands of real transcripts against any branch — in minutes, not hours",
      "Stage-level diffs (Router / FAQ / SQL / Summary) side-by-side with per-stage latency",
      "ClickUp QA mode + CID investigator built into the same shell",
    ],
    accent: "violet",
  },
  {
    id: "mcp",
    title: "Unified Debugging MCP",
    subtitle: "Autonomous RCA across a 500k+ LOC codebase",
    description:
      "A company-wide MCP server that turns any agentic IDE — Claude Code, Cursor, Codex, Windsurf, Antigravity, Cowork — into an autonomous debugger. Hand it a ClickUp ticket and it navigates the full 500k+ LOC repo, the live conversation in MongoDB, Elasticsearch trace indices, span history, and metrics, then RCAs the bug end-to-end. Resolves 95%+ of issues without a human stepping in.",
    bullets: [
      "ClickUp ticket → full RCA in one shot: code, conversation, traces, spans, metrics, DB",
      "Single MCP surface across every AI-native editor the team uses",
      "Custom tool routing, guardrails, and deterministic outputs tuned for agent loops",
    ],
    accent: "cyan",
  },
  {
    id: "trace",
    title: "In-house Tracing + LLM Playground",
    subtitle: "Our own Opik — purpose-built for our pipeline, faster than anything we tried",
    description:
      "A full observability stack for our LLM pipeline: span-level querying with Elasticsearch aggregations, run-over-run diff views, and a playground that replays any historical trace through any model with prompt edits. Built on a custom LiteLLM wrapper that lets one surface hit every internal and public model.",
    bullets: [
      "Span search, filtering, and run comparison — no waiting on third-party trace UIs",
      "Prompt-edit playground: rerun any production call through any model with edited inputs",
      "Custom LiteLLM wrapper unifies Claude, OpenAI, Gemini, Vertex, Cerebras, Together — one surface, every model",
    ],
    accent: "emerald",
  },
] as const;

export const experience = [
  {
    company: "VerbaFlo",
    companyUrl: "https://www.verbaflo.ai/",
    role: "AI Engineer, SDE-1",
    period: "Aug 2025 to Present",
    location: "Gurgaon, IN",
    summary:
      "Own core pieces of the agentic AI stack: orchestration, retrieval, evaluation, and the internal tooling the rest of the company debugs against.",
    highlights: [
      {
        title: "Agentic orchestrator",
        detail:
          "Led a production-ready agentic workflow with a custom parallelization orchestrator for tool-calling agents. Ships text-to-SQL with Pydantic-validated schemas that pulls live MongoDB analytics for business questions.",
      },
      {
        title: "Vector + RAG infra",
        detail:
          "Manage and tune Zilliz / Milvus vector stores that back a high-throughput RAG pipeline (chunking, embedding, hybrid search, and reranking) for FAQ and knowledge retrieval.",
      },
      {
        title: "Automated campaigns",
        detail:
          "Took ownership of the AI-driven campaign systems (call, WhatsApp, and email), letting customers target thousands of users with model-generated, personalized flows.",
      },
    ],
  },
  {
    company: "PrudentBit",
    companyUrl: "https://prudentbit.com/",
    role: "Founding Front-End Engineer",
    period: "Aug 2023 to Aug 2025",
    location: "Noida, IN (hybrid)",
    summary:
      "Employee #1 on the front-end. Designed and shipped the full surface area of the Immune* product suite from zero.",
    highlights: [
      {
        title: "Immune product suite",
        detail:
          "Led front-end for Immunefiles, Immunevault, and ImmuneShare: end-to-end encrypted storage, vaulting, and sharing.",
      },
      {
        title: "SSR migration, 200% faster",
        detail:
          "Migrated Immunefiles from React 18 SPA to Next.js 14 App Router with SSR, ISR, and edge caching. Cut load times roughly in half and doubled perceived performance.",
      },
      {
        title: "Live admin dashboard",
        detail:
          "Built a real-time admin console with 15+ interactive graphs, partial rendering, and streaming data.",
      },
      {
        title: "Cross-platform integrations",
        detail:
          "Shipped Immunefiles apps for Microsoft Teams, Outlook, and Gmail. Same core, adapted UIs.",
      },
    ],
  },
] as const;

// Public projects. No VerbaFlo internal stuff here — that lives in Experience.
// `gallery` is an ordered list of screenshots for cards that cycle through multiple shots.
export const projects = [
  {
    slug: "grid-math",
    title: "Grid Math",
    kind: "Creative Coding · Desktop · GPU",
    description:
      "500k GPU-rendered points at 60fps, FFT-driven audio reactivity, and a desktop wallpaper mode that puts the whole field equation behind your icons. Cross-platform Electron + WebGL shell with a custom renderer, native Swift audio capture on macOS, and a web build that runs the same engine in-browser.",
    stack: ["Electron", "WebGL", "Web Audio API", "Swift", "JavaScript"],
    accent: "violet",
    featured: true,
    stat: { label: "GPU points @ 60fps", value: "500k" },
    image: gridHero,
    gallery: [
      { src: gridHero, caption: "Spiral render" },
      { src: gridVortex, caption: "Vortex on desktop" },
      { src: gridWallpaper, caption: "Wallpaper mode with clock" },
      { src: gridSpiral, caption: "Pulsating rings" },
    ],
    links: [
      {
        label: "Live",
        href: "https://keshav-madhav.github.io/grid-visualizer/",
      },
      {
        label: "GitHub",
        href: "https://github.com/Keshav-Madhav/grid-visualizer",
      },
    ],
  },
  {
    slug: "live-jinja-renderer",
    title: "Live Jinja Renderer",
    kind: "Open Source · VS Code Extension",
    description:
      "A VS Code / Cursor extension that runs real Python Jinja2 templates inside the editor — via Pyodide (WASM Python), not a string-replace fake. JSON / YAML / TOML variable binding, IntelliSense for 50+ filters, hover docs, go-to-def, output search, markdown + mermaid rendering. 10K+ installs on Open VSX.",
    stack: ["TypeScript", "VS Code API", "Pyodide / WASM", "Jinja2"],
    accent: "amber",
    featured: true,
    stat: { label: "Installs on Open VSX", value: "10K+" },
    image: null,
    gallery: [],
    links: [
      {
        label: "Marketplace",
        href: "https://marketplace.visualstudio.com/items?itemName=KilloWatts.live-jinja-renderer",
      },
      {
        label: "Open VSX",
        href: "https://open-vsx.org/extension/KilloWatts/live-jinja-renderer",
      },
      {
        label: "GitHub",
        href: "https://github.com/Keshav-Madhav/live-jinja-renderer",
      },
    ],
  },
  {
    slug: "cookie-clicker",
    title: "Cookie Clicker Reimagined",
    kind: "Game · Systems · Animation",
    description:
      "A from-scratch remake that went too far. Physics-driven prestige tree with camera controls, per-baker story modals, a newspaper-statistics screen, 30+ track music library, 15+ minigames, a fully-animated tutorial, and a grandmapocalypse-grade pile of easter eggs and achievements. Vanilla JS + Canvas — no engine.",
    stack: ["Vanilla JS", "HTML Canvas", "Game Loop", "CSS"],
    accent: "emerald",
    featured: true,
    stat: { label: "Minigames + 30+ tracks", value: "15+" },
    image: cookieMain,
    gallery: [
      { src: cookieMain, caption: "Main UI: cookie, rows, shop" },
      { src: cookieBakerReturn, caption: "Baker Returns offline report" },
      { src: cookiePrestige, caption: "Prestige tree · physics + camera" },
      { src: cookieNewspaper, caption: "Newspaper statistics" },
      { src: cookieStory, caption: "Per-baker story modals" },
      { src: cookieMusic, caption: "Custom music library · 30+ songs" },
      { src: cookieMinigames, caption: "15+ minigames" },
      { src: cookieTutorial, caption: "Animated tutorial system" },
      { src: cookieEasterEgg, caption: "Easter eggs & achievements" },
    ],
    links: [
      {
        label: "Play now",
        href: "https://keshav-madhav.github.io/Cookie-Clicker/",
      },
      {
        label: "GitHub",
        href: "https://github.com/Keshav-Madhav/Cookie-Clicker",
      },
    ],
  },
  {
    slug: "space-sim",
    title: "Space Sandbox",
    kind: "Simulation · Physics · Graphics",
    description:
      "An N-body gravity playground that scales from a handful of planets around a black hole to 21,000 bodies at 30fps. Space-probe mode for exploring local gravity potential, heatmaps, grid warping, and vector fields. Pure Canvas + WebGL — no engine, no shortcuts.",
    stack: ["WebGL", "Canvas", "Physics", "Vanilla JS"],
    accent: "indigo",
    featured: true,
    stat: { label: "Bodies @ 30fps", value: "21k" },
    image: spaceOrbits,
    gallery: [
      { src: spaceOrbits, caption: "Black-hole with 145 orbiting planets" },
      { src: space21k, caption: "21,000 bodies @ 30 fps" },
      { src: spaceGalaxy, caption: "Spiral galaxy cluster" },
      { src: spaceProbe, caption: "Space probe · live gravity potential" },
    ],
    links: [
      {
        label: "Live",
        href: "https://keshav-madhav.github.io/Space-Simulation-HTML-CSS-JS/",
      },
      {
        label: "GitHub",
        href: "https://github.com/Keshav-Madhav/Space-Simulation-HTML-CSS-JS",
      },
    ],
  },
  {
    slug: "axon",
    title: "Axon",
    kind: "Open Source · Contributor",
    description:
      "Harsh Kedia's knowledge-graph engine for codebases. Indexes a repo into a structural graph and exposes it via MCP + a Sigma.js dashboard. I contributed physics and render improvements on the force-directed graph so large graphs stay readable at scale.",
    stack: ["TypeScript", "Sigma.js", "WebGL", "Python", "MCP"],
    accent: "cyan",
    featured: true,
    stat: { label: "Stars on GitHub", value: "669" },
    image: null,
    gallery: [],
    links: [
      { label: "GitHub", href: "https://github.com/harshkedia177/axon" },
      {
        label: "My commits",
        href: "https://github.com/harshkedia177/axon/commits?author=Keshav-Madhav",
      },
    ],
  },
  {
    slug: "zen-notes",
    title: "Zen Notes",
    kind: "Full-stack · AI",
    description:
      "Real-time collaborative notes with Notion-like editing, multi-cursor presence, and built-in AI powered by Cloudflare Workers. Summarize, translate, and chat over your notes.",
    stack: ["Next.js", "Cloudflare Workers", "LiveBlocks", "Clerk", "Firebase"],
    accent: "violet",
    featured: false,
    stat: null,
    image: zennotes,
    gallery: [],
    links: [
      { label: "Live", href: "https://zen-notes-keshav.vercel.app/" },
      { label: "GitHub", href: "https://github.com/Keshav-Madhav/zen-notes" },
    ],
  },
  {
    slug: "fizzi",
    title: "Fizzi Soda Landing",
    kind: "3D · Motion",
    description:
      "An immersive 3D product landing page with ThreeJS, React Three Fiber, and GSAP-driven scroll storytelling. Prismic-backed so content moves without redeploys.",
    stack: ["Next.js", "React-Fiber", "drei", "GSAP", "Prismic"],
    accent: "rose",
    featured: false,
    stat: null,
    image: fizzi,
    gallery: [],
    links: [
      { label: "Live", href: "https://fizzi-drinks.vercel.app/" },
      { label: "GitHub", href: "https://github.com/Keshav-Madhav/fizzi-drinks" },
    ],
  },
  {
    slug: "chatter",
    title: "Chatter",
    kind: "Full-stack · Realtime",
    description:
      "End-to-end chat platform: DMs, groups, typing indicators, file sharing, and LiveKit-powered video/audio calls. Convex for primary state, Supabase for media.",
    stack: ["Next.js", "Convex", "Supabase", "Pusher", "Clerk", "LiveKit"],
    accent: "cyan",
    featured: false,
    stat: null,
    image: null,
    gallery: [],
    links: [
      { label: "Live", href: "https://chatter-pink-two.vercel.app" },
      { label: "GitHub", href: "https://github.com/Keshav-Madhav/chatter" },
    ],
  },
  {
    slug: "bf-interpreter",
    title: "BF Language Interpreter",
    kind: "Performance · Compilers",
    description:
      "Hand-tuned BrainFuck interpreter in vanilla JS. Runs 1B ops in ~6 seconds on a single Web Worker thread. Custom JIT-style translation, tape prefetching, and loop fusion.",
    stack: ["Vanilla JS", "Web Workers"],
    accent: "emerald",
    featured: false,
    stat: null,
    image: brainfuck,
    gallery: [],
    links: [
      { label: "Live", href: "https://keshav-madhav.github.io/Making-BF2/" },
      { label: "GitHub", href: "https://github.com/Keshav-Madhav/Making-BF2" },
    ],
  },
  {
    slug: "fps-shooter",
    title: "Raycaster FPS",
    kind: "Game · Graphics",
    description:
      "A Wolfenstein-style raycast shooter in vanilla JS with custom fog-of-war, per-cell boundary maps, and a cost-aware dynamic lighting system. Built entirely on Canvas.",
    stack: ["Canvas", "Vanilla JS", "Raycasting"],
    accent: "amber",
    featured: false,
    stat: null,
    image: null,
    gallery: [],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Keshav-Madhav/FPS-Shooter-HTML-CSS-JS",
      },
    ],
  },
  {
    slug: "boids-nbody",
    title: "3D Spatial Sim (Boids + N-Body)",
    kind: "Simulation · 3D",
    description:
      "3D flocking + N-body gravity sim with playback, presets, color grading, and export-to-video with aggressive compression. The output doubles as a generative video source.",
    stack: ["WebGL", "Vanilla JS"],
    accent: "rose",
    featured: false,
    stat: null,
    image: null,
    gallery: [],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Keshav-Madhav/3d-spatial-sim-for-boid-and-nbody",
      },
    ],
  },
  {
    slug: "live-jinja-web",
    title: "Live Jinja (Web)",
    kind: "Open Source · Tool",
    description:
      "The same real-Python Jinja2 renderer as the VS Code extension, but as a zero-install web app. Edit templates and variables side-by-side, with instant rendering via Pyodide.",
    stack: ["TypeScript", "Pyodide", "Jinja2"],
    accent: "amber",
    featured: false,
    stat: null,
    image: null,
    gallery: [],
    links: [
      { label: "Live", href: "https://keshav-madhav.github.io/live_jinja/" },
      { label: "GitHub", href: "https://github.com/Keshav-Madhav/live_jinja" },
    ],
  },
  {
    slug: "infinite-craft",
    title: "Infinite Craft",
    kind: "AI · Game",
    description:
      "GPT-4o-powered merge game with infinite crafting. Drag any two items together, the model invents what they become, and the tree grows from there.",
    stack: ["Next.js", "OpenAI", "LangChain", "Framer"],
    accent: "amber",
    featured: false,
    stat: null,
    image: infinitecraft,
    gallery: [],
    links: [
      { label: "Live", href: "https://infinite-craft-nine.vercel.app/" },
      { label: "GitHub", href: "https://github.com/Keshav-Madhav/infinite-craft" },
    ],
  },
  {
    slug: "yoom",
    title: "Yoom Video Meetings",
    kind: "Full-stack",
    description:
      "Video-calling app with instant, scheduled, and recorded meetings. Built on stream.io with Clerk auth.",
    stack: ["Next.js", "stream.io", "Clerk", "Tailwind"],
    accent: "rose",
    featured: false,
    stat: null,
    image: yoom,
    gallery: [],
    links: [
      { label: "Live", href: "https://zoom-clone-black-sigma.vercel.app/" },
      { label: "GitHub", href: "https://github.com/Keshav-Madhav/zoom-clone" },
    ],
  },
  {
    slug: "tetris",
    title: "Tetris",
    kind: "Game",
    description:
      "A polished Tetris with piece preview, pause/resume, and clean React state machines.",
    stack: ["React", "Next.js", "Framer", "Tailwind"],
    accent: "indigo",
    featured: false,
    stat: null,
    image: tetris,
    gallery: [],
    links: [
      { label: "Live", href: "https://tetris-keshav-madhav.netlify.app/" },
      { label: "GitHub", href: "https://github.com/Keshav-Madhav/Tetris-Game-React" },
    ],
  },
  {
    slug: "clonepen",
    title: "ClonePen",
    kind: "Full-stack",
    description:
      "A CodePen-style multi-pane HTML/CSS/JS playground with Firebase-backed pens.",
    stack: ["React", "TypeScript", "Firebase", "Tailwind"],
    accent: "cyan",
    featured: false,
    stat: null,
    image: clonepen,
    gallery: [],
    links: [
      { label: "Live", href: "https://codepen-clone-dae8e.web.app/home" },
      { label: "GitHub", href: "https://github.com/Keshav-Madhav/codepen-clone" },
    ],
  },
] as const;

export const stack = [
  {
    group: "AI / Agents",
    items: [
      "Agentic orchestration",
      "Multi-agent systems",
      "Tool-calling",
      "RAG",
      "Text-to-SQL",
      "Evals",
      "LLM-as-judge",
      "LiteLLM",
      "LangGraph",
      "LangChain",
      "Instructor",
      "MCP",
      "MCP servers",
      "Pydantic",
    ],
  },
  {
    group: "Models & APIs",
    items: ["Claude", "OpenAI", "Gemini", "Vertex AI", "Cerebras", "Together AI"],
  },
  {
    group: "Data",
    items: [
      "MongoDB",
      "PostgreSQL",
      "Milvus / Zilliz",
      "Redis",
      "Snowflake",
      "Kafka",
      "asyncpg",
      "Supabase",
      "Firebase",
      "Convex",
    ],
  },
  {
    group: "Observability",
    items: [
      "Prometheus",
      "Grafana",
      "Jaeger",
      "OpenTelemetry",
      "Opik",
      "Elasticsearch",
      "Kibana",
      "Custom tracing",
    ],
  },
  {
    group: "Frontend",
    items: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind",
      "Framer Motion",
      "GSAP",
      "ThreeJS / R3F",
      "WebGL",
      "ShadCN",
      "Zustand",
    ],
  },
  {
    group: "Backend",
    items: [
      "Python",
      "FastAPI",
      "Node.js",
      "Streaming / SSE",
      "Celery",
      "APScheduler",
      "Jinja2",
      "Prisma",
      "AppsScript",
    ],
  },
  {
    group: "Desktop & Native",
    items: [
      "Electron",
      "Puppeteer",
      "Pyodide / WASM",
      "Swift (native bindings)",
      "VS Code API",
      "Web Audio API",
    ],
  },
  {
    group: "Infra & Tooling",
    items: [
      "Docker",
      "Kubernetes",
      "AWS",
      "GCP",
      "Vercel",
      "Git",
      "Makefile / IaC",
      "Bun / pnpm",
    ],
  },
] as const;

export const education = {
  school: "Sushant University",
  degree: "B.Tech Computer Science, AI / ML specialization",
  period: "2021 to 2025",
  location: "Gurgaon, IN",
} as const;
