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
  { name: "Work", hash: "#work" },
  { name: "Projects", hash: "#projects" },
  { name: "Stack", hash: "#stack" },
  { name: "Contact", hash: "#contact" },
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
    "Engineering agentic systems, blazing-fast interfaces, and the glue between them.",
  bio:
    "I build production agentic pipelines — tool-calling orchestrators, text-to-SQL, retrieval over vector stores — and I care a lot about the interface humans use to watch those systems think. I moved from a founding front-end engineer role into full-stack AI, and I like living at that seam: where a well-designed UI makes an LLM system legible and debuggable.",
  stats: [
    { label: "Years shipping", value: "3+" },
    { label: "AI pipeline stages owned", value: "6" },
    { label: "VS Code ext. installs", value: "10K+" },
    { label: "Side projects", value: "30+" },
  ],
} as const;

// Highlighted, company-wide tools I shipped at VerbaFlo.
// These live INSIDE the Experience section (not the public projects grid).
export const vfInternal = [
  {
    id: "simulation",
    title: "Conversation Simulation",
    subtitle: "QA harness for real chat traffic",
    description:
      "A desktop replay engine that autonomously runs live user conversations through the current stack — Router, FAQ, Text2SQL, PMS, bot analysis — end to end. Catches regressions, diffs responses run-over-run, and surfaces per-stage latency before anything touches prod.",
    bullets: [
      "Parallel replay of thousands of real transcripts against any branch",
      "Stage-level diffs (Router / FAQ / SQL / Summary) with side-by-side outputs",
      "Metrics pane: p50/p95 latency, stage success, error clusters",
    ],
    accent: "violet",
  },
  {
    id: "mcp",
    title: "Unified Debugging MCP",
    subtitle: "One server, every agentic IDE",
    description:
      "A company-wide MCP server that plugs into Claude Code, Cursor, Codex, Windsurf, Antigravity, and Cowork. Hand it a ClickUp ticket and it walks every system we run — Kibana traces, MongoDB, Elasticsearch, span history — to debug with full context.",
    bullets: [
      "Single MCP surface across every AI-native editor the team uses",
      "ClickUp → full RCA session: ticket → conversation → trace → spans → code",
      "Custom tool routing, guardrails, and deterministic output for agent use",
    ],
    accent: "cyan",
  },
  {
    id: "trace",
    title: "In-house Tracing + LLM Playground",
    subtitle: "Our own Opik, built for our pipeline",
    description:
      "A full observability stack for our LLM pipeline — faster and purpose-built. Span-level querying, diff views across runs, and a playground that replays any trace through any model with prompt edits via a custom LiteLLM wrapper.",
    bullets: [
      "Blazing UI for span search, filtering, and run comparison",
      "Prompt-edit playground — rerun any historical call through any model",
      "Custom LiteLLM wrapper lets one surface hit every internal & public model",
    ],
    accent: "emerald",
  },
] as const;

export const experience = [
  {
    company: "VerbaFlo",
    companyUrl: "https://www.verbaflo.ai/",
    role: "AI Engineer — SDE-1",
    period: "Aug 2025 — Present",
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
          "Manage and tune Zilliz / Milvus vector stores that back a high-throughput RAG pipeline — chunking, embedding, hybrid search, and reranking — for FAQ and knowledge retrieval.",
      },
      {
        title: "Automated campaigns",
        detail:
          "Took ownership of the AI-driven campaign systems — call, WhatsApp, and email — letting customers target thousands of users with model-generated, personalized flows.",
      },
    ],
  },
  {
    company: "PrudentBit",
    companyUrl: "https://prudentbit.com/",
    role: "Founding Front-End Engineer",
    period: "Aug 2023 — Aug 2025",
    location: "Noida, IN (hybrid)",
    summary:
      "Employee #1 on the front-end. Designed and shipped the full surface area of the Immune* product suite from zero.",
    highlights: [
      {
        title: "Immune product suite",
        detail:
          "Led front-end for Immunefiles, Immunevault, and ImmuneShare — end-to-end encrypted storage, vaulting, and sharing.",
      },
      {
        title: "SSR migration, 200% faster",
        detail:
          "Migrated Immunefiles from React 18 SPA to Next.js 14 App Router with SSR, ISR, and edge caching — cut load times roughly in half and doubled perceived performance.",
      },
      {
        title: "Live admin dashboard",
        detail:
          "Built a real-time admin console with 15+ interactive graphs, partial rendering, and streaming data.",
      },
      {
        title: "Cross-platform integrations",
        detail:
          "Shipped Immunefiles apps for Microsoft Teams, Outlook, and Gmail — same core, adapted UIs.",
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
    kind: "Creative Coding · Desktop",
    description:
      "A generative math-art engine — spirals, vortexes, field equations, live audio reactivity, and a desktop wallpaper mode that puts all of it behind your icons. Native shell via Electron with a custom renderer; the web build lets you play with the same equations in-browser.",
    stack: ["Electron", "Canvas", "JavaScript"],
    accent: "violet",
    featured: true,
    stat: null,
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
    kind: "Open Source · VS Code",
    description:
      "A VS Code / Cursor extension that renders real Python Jinja2 templates live as you type — via Pyodide, with JSON / YAML / TOML variable files, context-aware highlighting, output search, and markdown + mermaid support. Crossed 10K installs on Open VSX.",
    stack: ["TypeScript", "VS Code API", "Pyodide", "Jinja2"],
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
    title: "Cookie Clicker — Reimagined",
    kind: "Game · Systems · Animation",
    description:
      "A from-scratch remake that went too far. Full prestige tree with physics + camera controls, per-baker story modals, a newspaper-statistics modal, a 30+ song music library, 15+ minigames, a fully-animated tutorial system, and a grandmapocalypse-grade pile of easter eggs and achievements.",
    stack: ["Vanilla JS", "HTML Canvas", "CSS"],
    accent: "emerald",
    featured: true,
    stat: null,
    image: cookieMain,
    gallery: [
      { src: cookieMain, caption: "Main UI — cookie, rows, shop" },
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
    kind: "Simulation · Graphics",
    description:
      "An N-body gravity playground — from a handful of planets orbiting a black hole to 21,000 bodies at 30fps. Includes a space-probe mode for exploring local gravity potential, heatmaps, grid warping, and vector fields. All Canvas + WebGL, no engine.",
    stack: ["WebGL", "Canvas", "Vanilla JS"],
    accent: "indigo",
    featured: true,
    stat: null,
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
      "Harsh Kedia's knowledge-graph engine for codebases — indexes a repo into a structural graph and exposes it via MCP + a Sigma.js dashboard. I contributed physics and render improvements on the force-directed graph so large graphs stay readable at scale.",
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
      "Real-time collaborative notes with Notion-like editing, multi-cursor presence, and built-in AI powered by Cloudflare Workers — summarize, translate, and chat over your notes.",
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
      "End-to-end chat platform — DMs, groups, typing indicators, file sharing, and LiveKit-powered video/audio calls. Convex for primary state, Supabase for media.",
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
      "Hand-tuned BrainFuck interpreter in vanilla JS — 1B ops in ~6 seconds on a single Web Worker thread. Custom JIT-style translation, tape prefetching, and loop fusion.",
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
      "A Wolfenstein-style raycast shooter in vanilla JS — custom fog-of-war, per-cell boundary maps, and a cost-aware dynamic lighting system. Built entirely on Canvas.",
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
      "3D flocking + N-body gravity sim with playback, presets, color grading, and export-to-video with aggressive compression — so the output doubles as a generative video source.",
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
      "The same real-Python Jinja2 renderer as the VS Code extension, but as a zero-install web app — edit templates and variables side-by-side, with instant rendering via Pyodide.",
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
      "Video-calling app with instant, scheduled, and recorded meetings — built on stream.io with Clerk auth.",
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
      "Tool-calling",
      "RAG",
      "Text-to-SQL",
      "Evals",
      "LiteLLM",
      "MCP",
      "Pydantic",
      "LangChain",
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
      "Elasticsearch",
      "Supabase",
      "Firebase",
      "Convex",
    ],
  },
  {
    group: "Frontend",
    items: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind",
      "Framer Motion",
      "GSAP",
      "ThreeJS / R3F",
      "ShadCN",
      "Zustand",
    ],
  },
  {
    group: "Backend",
    items: ["Python", "FastAPI", "Node.js", "Jinja2", "AppsScript", "Prisma"],
  },
  {
    group: "Tooling",
    items: [
      "Docker",
      "Kibana",
      "Grafana",
      "Git",
      "Vercel",
      "VS Code API",
      "Bun / pnpm",
    ],
  },
] as const;

export const education = {
  school: "Sushant University",
  degree: "B.Tech Computer Science — AI / ML specialization",
  period: "2021 — 2025",
  location: "Gurgaon, IN",
} as const;
