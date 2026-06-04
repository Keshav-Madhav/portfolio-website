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

import minecraftDesert from "@/public/minecraft-desert.png";
import minecraftMap from "@/public/minecraft-map.png";
import minecraftForest from "@/public/minecraft-forest.png";
import minecraftCherry from "@/public/minecraft-cherry.png";

import raycasterFps from "@/public/raycaster-fps.png";
import liveJinjaWeb from "@/public/live-jinja-web.png";

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
    "Building production AI systems. Custom orchestrators, retrieval pipelines, and internal tooling.",
  bio: "I build production AI systems: multi-agent orchestrators, retrieval pipelines, text-to-SQL, and the tooling my team debugs against. Started as a founding front-end engineer, now I work across the full stack from WebGL to Kubernetes.",
  extendedBio: {
    intro:
      "I'm Keshav Madhav, an AI engineer who ships full systems, not just prompts. Custom orchestrators, retrieval infra, and the tooling that makes LLM pipelines debuggable.",
    current:
      "At VerbaFlo, I own core pieces of our AI stack: a multi-agent orchestrator with parallel tool-calling, retrieval pipelines with hybrid search, text-to-SQL across MongoDB and Postgres, and a company-wide MCP debugger the team uses daily.",
    past: "Before that, I was the founding front-end engineer at PrudentBit, where I built the Immune product suite from scratch. End-to-end encrypted storage and sharing, plus a Next.js 14 migration that cut load times in half.",
    sideProjects:
      "I've shipped 90+ public repos: games, simulations, creative coding, and dev tools. Highlights are a VS Code extension for live Jinja2 rendering (10K+ installs), an N-body gravity sandbox, and a Cookie Clicker remake that got out of hand.",
    philosophy:
      "The best AI systems are the ones you can actually see thinking. That's why I spend as much time on tracing and debuggable UIs as I do on the pipelines.",
  },
  stats: [
    { label: "Years shipping", value: "3+" },
    { label: "AI pipeline stages owned", value: "6" },
    { label: "VS Code ext. installs", value: "10K+" },
    { label: "Side projects", value: "90+" },
  ],
  headline: "I build production AI systems and the tools teams debug them with.",
  proofPoints: [
    { label: "Autonomous RCA", value: "95%+", detail: "across 500k+ LOC" },
    { label: "Agent orchestrator", value: "12 agents", detail: "parallel, streaming" },
    { label: "VS Code installs", value: "10K+", detail: "Live Jinja Renderer" },
    { label: "Public repos", value: "90+", detail: "shipped" },
  ],
  capabilities: [
    {
      title: "Multi-agent orchestrators",
      detail:
        "12-agent parallel execution across MongoDB, Postgres, and Milvus. SSE streaming, semantic cache, query expansion. Custom runtime, not a framework wrapper.",
      tag: "Runtime",
    },
    {
      title: "Retrieval and RAG",
      detail:
        "Production vector stores with hybrid search, query expansion, reranking, and text-to-SQL on top.",
      tag: "Pipelines",
    },
    {
      title: "Internal tooling",
      detail:
        "A unified MCP debugger for the whole team. Hand it a ticket, it walks the codebase and traces, then RCAs the bug.",
      tag: "Tooling",
    },
    {
      title: "Full-stack surfaces",
      detail:
        "Electron apps, VS Code extensions, tracing UIs, dashboards. I own the runtime and the interfaces.",
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
    id: "copilot",
    title: "Agentic Copilot",
    subtitle: "A custom agent harness with full freedom over our data",
    description:
      "I built the agent harness from scratch — no LangGraph, no CrewAI — that drops a reasoning model into a safe, read-only sandbox and gives it real freedom: it thinks, writes its own task list, spawns parallel sub-agents, researches its own data paths, and streams a cited answer across MongoDB, Postgres, and Milvus.",
    bullets: [
      "Custom harness: extended thinking, a self-managed task plan, and a delegate tool that spawns up to 8 parallel sub-agents",
      "Read-only, tenant-isolated sandbox — ~25 tools, a scratch-workspace, and its own technical wiki it can grep",
      "Cut warm-turn LLM cost ~73% via prompt-cache placement (83–95% cache reads)",
    ],
    accent: "indigo",
  },
  {
    id: "simulation",
    title: "Conversation Simulation",
    subtitle: "Desktop replay harness for thousands of real conversations",
    description:
      "An Electron + Puppeteer replay engine that drives live widgets with LLM-powered user personas, runs conversations through our full pipeline, and catches regressions before prod. Also the team's investigation tool for customer issues.",
    bullets: [
      "Single-pool Chrome: 8 concurrent replays from ~7.9 GB → 2.5 GB RAM",
      "Built-in MCP server exposes transcripts + traces to Claude Code / Cursor for AI-assisted RCA",
      "ClickUp QA mode, S3 auto-update, and Google-OAuth admin in one shell",
    ],
    accent: "violet",
  },
  {
    id: "mcp",
    title: "Unified Debugging MCP",
    subtitle: "Autonomous RCA across 500k+ LOC",
    description:
      "An MCP server that turns any agentic IDE into an autonomous debugger. Hand it a ticket and it navigates the codebase, MongoDB, Elasticsearch traces, and metrics, then RCAs the bug. Resolves 95%+ of issues without human intervention.",
    bullets: [
      "Ticket to full RCA in one shot: code, conversation, traces, DB",
      "Works in Claude Code, Cursor, Codex, Windsurf, any MCP client",
      "Custom tool routing and guardrails for reliable agent loops",
    ],
    accent: "cyan",
  },
  {
    id: "trace",
    title: "LLM Engineering Platform",
    subtitle: "Observability, replay & evaluation for our agents",
    description:
      "An end-to-end platform for the AI team (~170K LOC, 236 API endpoints): a trace explorer over Elasticsearch, a playground that compares models side-by-side across 14 providers, a replay engine that re-fires production traffic against live deploys, Git-Sync that commits prompt edits straight to PRs, and a tool-using AI assistant that can investigate the whole system.",
    bullets: [
      "Side-by-side compare across 14 providers; bulk-replay 5–500 traces scored by an LLM judge",
      "Service Replay: up to 20,000 production traces against a live deploy in one sweep",
      "Git-Sync prompts → PR, a saved-trace Vault, and a tool-using AI assistant with its own toolset",
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
      "Own core pieces of the AI stack: orchestration, retrieval, evaluation, and the internal tooling the team debugs against.",
    highlights: [
      {
        title: "Agentic orchestrator",
        detail:
          "Built a production multi-agent system with parallel tool-calling. Text-to-SQL pulls live MongoDB analytics for business questions.",
      },
      {
        title: "Vector + RAG infra",
        detail:
          "Manage Milvus vector stores backing our RAG pipeline: chunking, embedding, hybrid search, and reranking for FAQ retrieval.",
      },
      {
        title: "Automated campaigns",
        detail:
          "Own the AI-driven campaign systems (call, WhatsApp, email) that let customers target thousands of users with personalized flows.",
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
      "Employee #1 on front-end. Built the full Immune product suite from scratch.",
    highlights: [
      {
        title: "Immune product suite",
        detail:
          "Led front-end for Immunefiles, Immunevault, and ImmuneShare: end-to-end encrypted storage, vaulting, and sharing.",
      },
      {
        title: "SSR migration",
        detail:
          "Migrated from React 18 SPA to Next.js 14 with SSR and edge caching. Cut load times in half.",
      },
      {
        title: "Live admin dashboard",
        detail:
          "Built a real-time admin console with 15+ interactive graphs and streaming data.",
      },
      {
        title: "Cross-platform integrations",
        detail:
          "Shipped apps for Microsoft Teams, Outlook, and Gmail.",
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
      "500k GPU-rendered points at 60fps with FFT audio reactivity and a desktop wallpaper mode. Cross-platform Electron + WebGL with native Swift audio capture on macOS.",
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
      "A VS Code extension that runs real Python Jinja2 templates via Pyodide (WASM Python). JSON/YAML/TOML variable binding, IntelliSense for 50+ filters, hover docs. 10K+ installs.",
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
    title: "Cookie Clicker Reimagined",
    kind: "Game · Systems · Animation",
    description:
      "A from-scratch remake that got out of hand. Physics-driven prestige tree, per-baker story modals, 30+ track music library, 15+ minigames, animated tutorial, and way too many easter eggs. Vanilla JS + Canvas, no engine.",
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
      "An N-body gravity playground that scales from a few planets to 21,000 bodies at 30fps. Space-probe mode, heatmaps, grid warping, vector fields. Pure Canvas + WebGL, no engine.",
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
    slug: "minecraft-clone",
    title: "Minecraft Clone",
    kind: "Game · 3D · Procedural",
    description:
      "An infinite Minecraft built in the browser with Three.js — 8.7M triangles and 4,000+ chunks in view. A pool of web workers generates AND greedily meshes each chunk off the main thread (deterministic ghost-cell borders, so every chunk meshes exactly once), a second worker drives a slippy-map minimap, plus fixed-timestep physics, mining/building, biomes (desert, forest, cherry-blossom, snow), and uncapped FPS via a MessageChannel scheduler.",
    stack: ["Three.js", "TypeScript", "Web Workers", "WebGL", "Vite"],
    accent: "emerald",
    featured: true,
    stat: { label: "Triangles in view", value: "8.7M" },
    image: minecraftDesert,
    gallery: [
      { src: minecraftDesert, caption: "Savanna → desert · 5.6M tris, 4,225 chunks" },
      { src: minecraftMap, caption: "Full-world slippy map · drag, zoom, click to teleport" },
      { src: minecraftForest, caption: "Dense forest biome · 8.7M triangles in view" },
      { src: minecraftCherry, caption: "Cherry-blossom grove with a stone spire" },
    ],
    links: [
      {
        label: "Live",
        href: "https://keshav-madhav.github.io/minecraft-JS/",
      },
      {
        label: "GitHub",
        href: "https://github.com/Keshav-Madhav/minecraft-JS",
      },
    ],
  },
  {
    slug: "axon",
    title: "Axon",
    kind: "Open Source · Contributor",
    description:
      "Harsh Kedia's knowledge-graph engine for codebases. Indexes a repo into a structural graph exposed via MCP + Sigma.js. I contributed physics and render improvements so large graphs stay readable.",
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
      "Real-time collaborative notes with multi-cursor presence and AI features (summarize, translate, chat). Cloudflare Workers for AI, LiveBlocks for sync.",
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
      "A 3D product landing page with ThreeJS, React Three Fiber, and GSAP scroll animations. Prismic CMS for content.",
    stack: ["Next.js", "React Three Fiber", "GSAP", "Prismic"],
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
      "Real-time chat platform with DMs, groups, file sharing, and video/audio calls via LiveKit. Convex for state, Supabase for media.",
    stack: ["Next.js", "Convex", "Supabase", "LiveKit"],
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
      "Hand-tuned Brainfuck interpreter in vanilla JS. Runs 1B ops in 6 seconds. JIT-style translation, tape prefetching, loop fusion.",
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
      "Wolfenstein-style raycast shooter in vanilla JS. Textured walls, floor/ceiling casting, a live minimap, and dynamic lighting at 120+ fps. Pure Canvas, no engine.",
    stack: ["Canvas", "Vanilla JS", "Raycasting"],
    accent: "amber",
    featured: false,
    stat: null,
    image: raycasterFps,
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
      "3D flocking + N-body gravity sim with playback, presets, color grading, and video export.",
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
      "Web version of the VS Code extension. Edit Jinja2 templates and variables side-by-side with instant rendering via Pyodide. Variable extraction, form mode, and whitespace control.",
    stack: ["TypeScript", "Pyodide", "Jinja2"],
    accent: "amber",
    featured: false,
    stat: null,
    image: liveJinjaWeb,
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
      "GPT-4o-powered merge game. Drag any two items together and the model invents what they become.",
    stack: ["Next.js", "OpenAI", "Framer Motion"],
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
      "Video-calling app with instant, scheduled, and recorded meetings. Built on stream.io.",
    stack: ["Next.js", "stream.io", "Clerk"],
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
      "Polished Tetris with piece preview and pause/resume. Clean React state machines.",
    stack: ["React", "Next.js"],
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
      "CodePen-style multi-pane HTML/CSS/JS playground with Firebase backend.",
    stack: ["React", "TypeScript", "Firebase"],
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
      "Multi-agent orchestration",
      "RAG pipelines",
      "Text-to-SQL",
      "Evals",
      "MCP",
      "LangGraph",
      "LangChain",
    ],
  },
  {
    group: "Data",
    items: [
      "MongoDB",
      "PostgreSQL",
      "Milvus",
      "Redis",
      "Elasticsearch",
      "Snowflake",
      "Kafka",
      "Supabase",
    ],
  },
  {
    group: "Observability",
    items: [
      "Prometheus",
      "Grafana",
      "Jaeger",
      "OpenTelemetry",
    ],
  },
  {
    group: "Frontend",
    items: [
      "Next.js",
      "React",
      "TypeScript",
      "Framer Motion",
      "GSAP",
      "ThreeJS",
      "WebGL",
    ],
  },
  {
    group: "Backend",
    items: [
      "Python",
      "FastAPI",
      "Django",
      "Node.js",
    ],
  },
  {
    group: "Desktop & Native",
    items: [
      "Electron",
      "Puppeteer",
      "WASM",
      "VS Code extensions",
      "Swift",
    ],
  },
  {
    group: "Infra",
    items: [
      "Docker",
      "Kubernetes",
      "AWS",
      "GCP",
    ],
  },
] as const;

export const education = {
  school: "Sushant University",
  degree: "B.Tech Computer Science, AI / ML specialization",
  period: "2021 to 2025",
  location: "Gurgaon, IN",
} as const;
