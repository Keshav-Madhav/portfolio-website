// Compare two directories of Lighthouse run-*.json files.
// Prints per-metric median/mean/std + Welch's t-statistic. |t|>2 ≈ 95% CL.
//
// Usage: node analyze.mjs <before-dir> <after-dir>

import fs from "node:fs";
import path from "node:path";

function readRuns(dir) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith("run-") && f.endsWith(".json"));
  return files.map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
}

function get(lhr, audit) {
  return lhr.audits?.[audit]?.numericValue ?? null;
}

function extract(lhr) {
  return {
    perf_score: (lhr.categories.performance.score ?? 0) * 100,
    fcp: get(lhr, "first-contentful-paint"),
    lcp: get(lhr, "largest-contentful-paint"),
    tbt: get(lhr, "total-blocking-time"),
    cls: get(lhr, "cumulative-layout-shift"),
    si: get(lhr, "speed-index"),
    tti: get(lhr, "interactive"),
    mainThreadWork: get(lhr, "mainthread-work-breakdown"),
    bootupTime: get(lhr, "bootup-time"),
    totalBytes: get(lhr, "total-byte-weight"),
    unusedJs: get(lhr, "unused-javascript"),
    unusedCss: get(lhr, "unused-css-rules"),
    domSize: get(lhr, "dom-size"),
  };
}

function stats(arr) {
  const valid = arr.filter((v) => Number.isFinite(v));
  const sorted = [...valid].sort((a, b) => a - b);
  const n = sorted.length;
  if (n === 0) return null;
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const median =
    n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[(n - 1) / 2];
  const variance = sorted.reduce((a, x) => a + (x - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance);
  return { n, mean, median, min: sorted[0], max: sorted[n - 1], std };
}

function welchT(a, b) {
  const sa = stats(a);
  const sb = stats(b);
  if (!sa || !sb) return 0;
  const denom = Math.sqrt(sa.std ** 2 / sa.n + sb.std ** 2 / sb.n);
  if (denom === 0) return 0;
  return (sa.mean - sb.mean) / denom;
}

const beforeDir = process.argv[2];
const afterDir = process.argv[3];
if (!beforeDir || !afterDir) {
  console.error("usage: node analyze.mjs <before-dir> <after-dir>");
  process.exit(1);
}

const beforeRuns = readRuns(beforeDir).map(extract);
const afterRuns = readRuns(afterDir).map(extract);

const metrics = [
  { key: "perf_score",     label: "Performance score (0-100)",  lower: false, fmt: (v) => v.toFixed(1) },
  { key: "fcp",            label: "First Contentful Paint (ms)", lower: true,  fmt: (v) => Math.round(v).toString() },
  { key: "lcp",            label: "Largest Contentful Paint (ms)",lower: true, fmt: (v) => Math.round(v).toString() },
  { key: "tbt",            label: "Total Blocking Time (ms)",    lower: true,  fmt: (v) => Math.round(v).toString() },
  { key: "cls",            label: "Cumulative Layout Shift",     lower: true,  fmt: (v) => v.toFixed(4) },
  { key: "si",             label: "Speed Index (ms)",            lower: true,  fmt: (v) => Math.round(v).toString() },
  { key: "tti",            label: "Time to Interactive (ms)",    lower: true,  fmt: (v) => Math.round(v).toString() },
  { key: "mainThreadWork", label: "Main thread work (ms)",       lower: true,  fmt: (v) => Math.round(v).toString() },
  { key: "bootupTime",     label: "Script bootup time (ms)",     lower: true,  fmt: (v) => Math.round(v).toString() },
  { key: "totalBytes",     label: "Total transfer (KiB)",        lower: true,  fmt: (v) => (v / 1024).toFixed(1) },
  { key: "unusedJs",       label: "Unused JS (KiB)",             lower: true,  fmt: (v) => (v / 1024).toFixed(1) },
  { key: "unusedCss",      label: "Unused CSS (KiB)",            lower: true,  fmt: (v) => (v / 1024).toFixed(1) },
  { key: "domSize",        label: "DOM nodes",                   lower: true,  fmt: (v) => Math.round(v).toString() },
];

const pad = (s, n) => String(s).padEnd(n);
const padR = (s, n) => String(s).padStart(n);

console.log(
  `\n=== Lighthouse comparison: BEFORE (n=${beforeRuns.length}) vs AFTER (n=${afterRuns.length}) ===\n`,
);
console.log(
  pad("Metric", 36) +
    padR("BEFORE median", 16) +
    padR("AFTER median", 16) +
    padR("Δ", 14) +
    padR("Δ %", 9) +
    padR("|t|", 7) +
    "  verdict",
);
console.log("-".repeat(115));

for (const m of metrics) {
  const a = beforeRuns.map((r) => r[m.key]);
  const b = afterRuns.map((r) => r[m.key]);
  const sa = stats(a);
  const sb = stats(b);
  if (!sa || !sb) continue;
  const delta = sb.median - sa.median;
  const pct = sa.median !== 0 ? (delta / sa.median) * 100 : 0;
  const better = m.lower ? delta < 0 : delta > 0;
  const t = welchT(a, b);
  const verdict =
    Math.abs(t) > 2 ? (better ? "✓ improved" : "✗ regressed") : "  ~ noise";
  console.log(
    pad(m.label, 36) +
      padR(m.fmt(sa.median), 16) +
      padR(m.fmt(sb.median), 16) +
      padR((delta >= 0 ? "+" : "") + m.fmt(delta), 14) +
      padR((pct >= 0 ? "+" : "") + pct.toFixed(1) + "%", 9) +
      padR(Math.abs(t).toFixed(2), 7) +
      "  " +
      verdict,
  );
}

console.log("\nFull stats (mean ± std, [min..max]):");
console.log("-".repeat(115));
for (const m of metrics) {
  const a = beforeRuns.map((r) => r[m.key]);
  const b = afterRuns.map((r) => r[m.key]);
  const sa = stats(a);
  const sb = stats(b);
  if (!sa || !sb) continue;
  const fmt = (v) => (v == null ? "-" : v < 1 ? v.toFixed(4) : Math.round(v));
  console.log(
    pad(m.label, 36) +
      "  before: " +
      fmt(sa.mean) +
      " ± " +
      fmt(sa.std) +
      " [" +
      fmt(sa.min) +
      ".." +
      fmt(sa.max) +
      "]   after: " +
      fmt(sb.mean) +
      " ± " +
      fmt(sb.std) +
      " [" +
      fmt(sb.min) +
      ".." +
      fmt(sb.max) +
      "]",
  );
}

console.log(
  "\n|t| > 2 ≈ 95% CL real change | |t| > 3 ≈ 99.7% | |t| < 2 = noise.\n",
);
