// Lighthouse N-run harness. Saves full LHR JSON per run plus a slim CSV.
//
// Usage: node run-perf.mjs <url> <out-dir> <N>

import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load deps from the rig's node_modules so this script doesn't need them
// installed in the project's package.json.
const rigRoot = path.resolve(__dirname, "../../../../.perf-bench-out/rig");
const require = createRequire(path.join(rigRoot, "package.json"));
const lighthouse = (await import(
  path.join(rigRoot, "node_modules/lighthouse/core/index.js")
)).default;
const { launch } = require("chrome-launcher");

const url = process.argv[2];
const outDir = process.argv[3];
const N = parseInt(process.argv[4] || "9", 10);

if (!url || !outDir) {
  console.error("usage: node run-perf.mjs <url> <out-dir> <N>");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
const csvPath = path.join(outDir, "metrics.csv");
fs.writeFileSync(
  csvPath,
  "run,perf_score,fcp,lcp,tbt,cls,si,tti,total_byte_weight,unused_js_bytes\n",
);

const get = (lhr, audit) => lhr.audits?.[audit]?.numericValue ?? "";

for (let i = 0; i < N; i++) {
  const chrome = await launch({
    chromeFlags: [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-default-browser-check",
    ],
  });
  const result = await lighthouse(url, {
    port: chrome.port,
    output: "json",
    onlyCategories: ["performance"],
    logLevel: "error",
  });
  await chrome.kill();
  const lhr = result.lhr;

  fs.writeFileSync(
    path.join(outDir, `run-${i}.json`),
    JSON.stringify(lhr),
  );

  const score = (lhr.categories.performance.score ?? 0) * 100;
  const row = [
    i,
    score.toFixed(1),
    get(lhr, "first-contentful-paint"),
    get(lhr, "largest-contentful-paint"),
    get(lhr, "total-blocking-time"),
    get(lhr, "cumulative-layout-shift"),
    get(lhr, "speed-index"),
    get(lhr, "interactive"),
    get(lhr, "total-byte-weight"),
    get(lhr, "unused-javascript"),
  ].join(",");
  fs.appendFileSync(csvPath, row + "\n");
  console.log(
    `[${i + 1}/${N}] score=${score.toFixed(1)} fcp=${Math.round(
      get(lhr, "first-contentful-paint"),
    )} lcp=${Math.round(get(lhr, "largest-contentful-paint"))} tbt=${Math.round(
      get(lhr, "total-blocking-time"),
    )}`,
  );
}

console.log(`done → ${csvPath}`);
