// Aggregate runtime bench JSONs into a single summary table.
//
// Usage: node runtime-summary.mjs <runtime-dir>

import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
if (!dir) {
  console.error("usage: node runtime-summary.mjs <runtime-dir>");
  process.exit(1);
}

const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".json") && !f.startsWith("smoke") && !f.startsWith("test"));

function median(arr) {
  if (arr.length === 0) return 0;
  const s = [...arr].sort((a, b) => a - b);
  return s.length % 2 === 0
    ? (s[s.length / 2 - 1] + s[s.length / 2]) / 2
    : s[(s.length - 1) / 2];
}

const rows = [];
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const runs = data.runs || [];
  if (runs.length === 0) continue;
  const fpsMedians = runs.map((r) => r.fps.median);
  const fpsP5s = runs.map((r) => r.fps.p5);
  const longTaskCounts = runs.map((r) => r.longTasks.count);
  const longTaskMs = runs.map((r) => r.longTasks.totalMs);
  const heapDeltas = runs.map((r) => r.heap.deltaMB);

  rows.push({
    label: data.label,
    cpu: data.cpu,
    scenario: data.scenario,
    ghosts: data.ghosts,
    durationMs: data.duration,
    nRuns: runs.length,
    fpsMedian: median(fpsMedians),
    fpsP5: median(fpsP5s),
    longTaskCount: median(longTaskCounts),
    longTaskMs: median(longTaskMs),
    heapDeltaMB: median(heapDeltas),
  });
}

rows.sort((a, b) => {
  if (a.ghosts !== b.ghosts) return a.ghosts - b.ghosts;
  if (a.cpu !== b.cpu) return a.cpu - b.cpu;
  return a.scenario.localeCompare(b.scenario);
});

const pad = (s, n) => String(s).padEnd(n);
const padR = (s, n) => String(s).padStart(n);

console.log("\n=== Runtime perf matrix (Playwright, prod build) ===\n");
console.log(
  pad("config", 30) +
    padR("FPS median", 12) +
    padR("FPS p5", 9) +
    padR("longTasks", 11) +
    padR("blocked ms", 11) +
    padR("heap Δ MB", 11),
);
console.log("-".repeat(84));
for (const r of rows) {
  const config = `cpu${r.cpu}× ${r.scenario.padEnd(8)} ghosts=${r.ghosts}`;
  console.log(
    pad(config, 30) +
      padR(r.fpsMedian.toFixed(1), 12) +
      padR(r.fpsP5.toFixed(1), 9) +
      padR(r.longTaskCount.toFixed(0), 11) +
      padR(r.longTaskMs.toFixed(0), 11) +
      padR(r.heapDeltaMB.toFixed(1), 11),
  );
}
console.log(
  "\nFPS p5 = 5th-percentile (worst-frame). longTasks = >50ms blocking events.",
);
console.log(
  "ghosts = N parallel Ably clients streaming cursor + reaction traffic.\n",
);
