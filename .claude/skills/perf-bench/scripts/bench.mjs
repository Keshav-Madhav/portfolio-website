// Runtime perf benchmark using Playwright. Measures FPS, long tasks, JS heap,
// scripting time during a scripted scenario, optionally with N parallel Ably
// "ghost" clients producing cursor + reaction traffic.
//
// Usage:
//   node bench.mjs --url=<url> --cpu=<rate> --scenario=<name> \
//                  --duration=<ms> --ghosts=<n> --label=<name> \
//                  --runs=<n> --out=<dir>

import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rigRoot = path.resolve(__dirname, "../../../../.perf-bench-out/rig");
const require = createRequire(path.join(rigRoot, "package.json"));
const { chromium } = require("playwright");

const argv = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);

const URL = argv.url || "http://localhost:3000/";
const CPU = parseFloat(argv.cpu || "1");
const SCENARIO = argv.scenario || "idle"; // idle | scroll | click | reactions | mixed
const DURATION = parseInt(argv.duration || "10000", 10);
const GHOSTS = parseInt(argv.ghosts || "0", 10);
const LABEL = argv.label || "run";
const RUNS = parseInt(argv.runs || "3", 10);
const OUT =
  argv.out ||
  path.resolve(__dirname, "../../../../.perf-bench-out/runtime");

fs.mkdirSync(OUT, { recursive: true });

function spawnGhosts(count) {
  if (count <= 0) return null;
  const proc = spawn(
    "node",
    [
      path.join(__dirname, "ghosts.mjs"),
      String(count),
      String(DURATION + 5000),
      `${URL.replace(/\/$/, "")}/api/ably/token`,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  proc.stdout.on("data", (d) => process.stdout.write(`[ghosts] ${d}`));
  proc.stderr.on("data", (d) => process.stderr.write(`[ghosts] ${d}`));
  return proc;
}

async function runScenario(page, scenario, durationMs) {
  const start = Date.now();
  if (scenario === "idle") {
    await page.waitForTimeout(durationMs);
  } else if (scenario === "scroll") {
    while (Date.now() - start < durationMs) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(33);
    }
  } else if (scenario === "click") {
    while (Date.now() - start < durationMs) {
      const x = 200 + Math.random() * 800;
      const y = 200 + Math.random() * 400;
      await page.mouse.click(x, y);
      await page.waitForTimeout(150);
    }
  } else if (scenario === "reactions") {
    while (Date.now() - start < durationMs) {
      const k = String(1 + Math.floor(Math.random() * 8));
      await page.keyboard.press(k);
      await page.waitForTimeout(120);
    }
  } else if (scenario === "mixed") {
    let lastClick = 0;
    let lastReact = 0;
    while (Date.now() - start < durationMs) {
      await page.mouse.wheel(0, 250);
      const elapsed = Date.now() - start;
      if (elapsed - lastClick > 800) {
        await page.mouse.move(
          200 + Math.random() * 800,
          200 + Math.random() * 400,
        );
        lastClick = elapsed;
      }
      if (elapsed - lastReact > 600) {
        await page.keyboard.press(String(1 + Math.floor(Math.random() * 8)));
        lastReact = elapsed;
      }
      await page.waitForTimeout(33);
    }
  }
}

async function singleRun() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-renderer-backgrounding",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--enable-precise-memory-info",
      "--js-flags=--expose-gc",
      "--no-sandbox",
    ],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);

  if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });

  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });

  await page.evaluate(() => {
    window.__m = { longTasks: [], frameDeltas: [], heapStart: 0, heapEnd: 0 };
    try {
      const obs = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          window.__m.longTasks.push({ start: e.startTime, duration: e.duration });
        }
      });
      obs.observe({ type: "longtask", buffered: true });
    } catch {}
    let last = performance.now();
    const onFrame = (t) => {
      window.__m.frameDeltas.push(t - last);
      last = t;
      requestAnimationFrame(onFrame);
    };
    requestAnimationFrame(onFrame);
    if (performance.memory) {
      window.__m.heapStart = performance.memory.usedJSHeapSize;
    }
  });

  await page.waitForTimeout(2000);

  const t0 = Date.now();
  await runScenario(page, SCENARIO, DURATION);
  const elapsed = Date.now() - t0;

  const cdpMetrics = await cdp.send("Performance.getMetrics");
  const map = Object.fromEntries(
    cdpMetrics.metrics.map((m) => [m.name, m.value]),
  );

  const pageData = await page.evaluate(() => {
    if (performance.memory) {
      window.__m.heapEnd = performance.memory.usedJSHeapSize;
    }
    return window.__m;
  });

  await browser.close();

  const frames = pageData.frameDeltas.slice(20).filter((d) => d < 200);
  const fpsList = frames.map((d) => 1000 / d);
  const longTasks = pageData.longTasks;
  const longTaskMs = longTasks.reduce((a, b) => a + b.duration, 0);
  const longTasksAbove50 = longTasks.length;
  const longTasksAbove200 = longTasks.filter((t) => t.duration > 200).length;

  const median = (a) => {
    if (a.length === 0) return 0;
    const s = [...a].sort((x, y) => x - y);
    return s.length % 2 === 0
      ? (s[s.length / 2 - 1] + s[s.length / 2]) / 2
      : s[(s.length - 1) / 2];
  };
  const percentile = (a, p) => {
    if (a.length === 0) return 0;
    const s = [...a].sort((x, y) => x - y);
    return s[Math.floor((p / 100) * s.length)];
  };

  return {
    elapsedMs: elapsed,
    fps: {
      n: fpsList.length,
      mean: fpsList.reduce((a, b) => a + b, 0) / (fpsList.length || 1),
      median: median(fpsList),
      p5: percentile(fpsList, 5),
      min: fpsList.length ? Math.min(...fpsList) : 0,
    },
    longTasks: {
      count: longTasksAbove50,
      countAbove200ms: longTasksAbove200,
      totalMs: longTaskMs,
    },
    heap: {
      startMB: pageData.heapStart / 1024 / 1024,
      endMB: pageData.heapEnd / 1024 / 1024,
      deltaMB: (pageData.heapEnd - pageData.heapStart) / 1024 / 1024,
    },
    cdp: {
      ScriptDuration: map.ScriptDuration,
      LayoutDuration: map.LayoutDuration,
      RecalcStyleDuration: map.RecalcStyleDuration,
      Nodes: map.Nodes,
      JSHeapUsedSize: map.JSHeapUsedSize,
    },
  };
}

const allRuns = [];
console.log(
  `\n=== bench: ${LABEL}  cpu=${CPU}× scenario=${SCENARIO} duration=${DURATION}ms ghosts=${GHOSTS} runs=${RUNS} ===\n`,
);

for (let i = 0; i < RUNS; i++) {
  console.log(`run ${i + 1}/${RUNS}…`);
  const ghostProc = spawnGhosts(GHOSTS);
  if (ghostProc) await new Promise((r) => setTimeout(r, 3000));
  const result = await singleRun();
  allRuns.push(result);
  console.log(
    `  fps median=${result.fps.median.toFixed(1)} p5=${result.fps.p5.toFixed(
      1,
    )}  longTasks=${result.longTasks.count} (${
      result.longTasks.totalMs.toFixed(0)
    }ms)  heap +${result.heap.deltaMB.toFixed(1)}MB`,
  );
  if (ghostProc) {
    try {
      ghostProc.kill("SIGTERM");
    } catch {}
    await new Promise((r) => setTimeout(r, 1500));
  }
}

const outFile = path.join(OUT, `${LABEL}.json`);
fs.writeFileSync(
  outFile,
  JSON.stringify(
    {
      label: LABEL,
      url: URL,
      cpu: CPU,
      scenario: SCENARIO,
      duration: DURATION,
      ghosts: GHOSTS,
      runs: allRuns,
    },
    null,
    2,
  ),
);
console.log(`saved → ${outFile}\n`);
