---
name: perf-bench
description: |
  Run statistically-rigorous performance benchmarks on this Next.js site:
  Lighthouse N-run page-load tests with Welch's t-test, optional A/B mode
  via git stash, Playwright runtime bench under CPU throttle, and Ably
  ghost-cursor stress. Cleans up its own background processes when done.

  Triggers when the user asks to: "benchmark", "test perf", "measure page
  load", "compare before/after performance", "run lighthouse", "stress
  test cursors / ghosts", "verify the perf changes", or anything that
  needs empirical proof of a performance change.
---

# perf-bench — empirical performance harness

Two-tier benchmark for this Next.js portfolio:

1. **Page-load (Lighthouse)** — simulated mobile + 4× CPU throttle, n=9 runs, median + Welch's t-test.
2. **Runtime (Playwright)** — real user interactions under CPU throttle, optional N parallel Ably ghost cursors blasting traffic.

Both harnesses live in `scripts/`. Everything writes to `.perf-bench-out/` at repo root by default (gitignored — add it if you haven't).

---

## Quick reference

| Task | Command |
|---|---|
| First-time setup (install rig deps) | `bash scripts/setup.sh` |
| 9-run Lighthouse on current build | `node scripts/run-perf.mjs http://localhost:3000/ ./.perf-bench-out/current 9` |
| A/B vs HEAD's last commit | `bash scripts/ab.sh` |
| Playwright runtime, CPU throttled | `node scripts/bench.mjs --url=http://localhost:3000/ --cpu=4 --scenario=mixed --duration=10000 --runs=3 --label=cpu4-mixed --out=./.perf-bench-out/runtime` |
| Stress with N ghost cursors | add `--ghosts=10` (or 50, 100) |
| Compare two Lighthouse run dirs | `node scripts/analyze.mjs <before-dir> <after-dir>` |
| **Kill everything spawned** | `bash scripts/cleanup.sh` |

---

## End-to-end workflow

When the user says "benchmark", do this exact sequence:

### 1. Setup (only if rig not yet installed)

```bash
# Idempotent — safe to re-run
bash .claude/skills/perf-bench/scripts/setup.sh
```

The script installs `lighthouse@12`, `chrome-launcher`, `playwright`, `ably`, `@ably/spaces`, and `sharp` into `.perf-bench-out/rig/node_modules`. It also `npx playwright install chromium` so the headless browser is ready.

If Chrome is at a non-default macOS path, set `CHROME_PATH` before running.

### 2. Build + start the production server

```bash
npm run build
npm run start > .perf-bench-out/server.log 2>&1 &
echo $! > .perf-bench-out/server.pid

# Wait for ready
for i in $(seq 1 30); do
  curl -sf http://localhost:3000/ -o /dev/null && break
  sleep 1
done
```

**Always benchmark a production build, never `npm run dev`** — dev mode adds React DevTools, source maps, and overhead that distorts every metric.

### 3. Lighthouse N runs (page-load benchmark)

```bash
cd .claude/skills/perf-bench/scripts
node run-perf.mjs http://localhost:3000/ ../../../.perf-bench-out/after 9
```

This:
- Launches a fresh headless Chrome per run via `chrome-launcher` (clean process state — same as `lhci` does)
- Applies Lighthouse's default mobile preset: 4× CPU slowdown, simulated 3G
- Saves full LHR JSON per run + a slim `metrics.csv`

### 4. (Optional) A/B mode — measure a perf change

When the user wants to prove a fix worked:

```bash
# Run AFTER first (we're already there)
node scripts/run-perf.mjs http://localhost:3000/ ./.perf-bench-out/after 9

# Stop server, stash, rebuild, restart
bash scripts/cleanup.sh
git stash push -u -m "perf-bench-stash"   # -u captures untracked
npm run build && npm run start > .perf-bench-out/server.log 2>&1 &
# (wait for ready)
node scripts/run-perf.mjs http://localhost:3000/ ./.perf-bench-out/before 9

# Restore
bash scripts/cleanup.sh
git stash pop
npm run build  # so subsequent dev work uses the post-fix state

# Compare
node scripts/analyze.mjs ./.perf-bench-out/before ./.perf-bench-out/after
```

The analyzer computes: median, mean, std-dev, min/max, Welch's t-statistic per metric. **|t| > 2** ≈ 95% confidence the change is real, not noise.

### 5. (Optional) Runtime benchmark with Playwright

For interactive perf — scroll FPS, long tasks, JS heap — under stress:

```bash
cd .claude/skills/perf-bench/scripts
# Pure scroll, no throttle, baseline
node bench.mjs --url=http://localhost:3000/ --cpu=1 --scenario=scroll --duration=8000 --label=baseline --out=../../../.perf-bench-out/runtime --runs=3

# Heavy mixed scenario at 4× CPU throttle
node bench.mjs --url=http://localhost:3000/ --cpu=4 --scenario=mixed --duration=10000 --label=cpu4-mixed --out=../../../.perf-bench-out/runtime --runs=3

# Multi-user stress — N ghost cursors over Ably
node bench.mjs --url=http://localhost:3000/ --cpu=4 --scenario=mixed --duration=15000 --ghosts=50 --label=cpu4-mixed-g50 --out=../../../.perf-bench-out/runtime --runs=2

# Aggregate the matrix
node runtime-summary.mjs ../../../.perf-bench-out/runtime
```

Available `--scenario` values: `idle`, `scroll`, `click`, `reactions`, `mixed`.

`--cpu` is the slowdown multiplier (1 = native, 4 = mid-range mobile, 6 = old laptop).

`--ghosts=N` spawns N parallel Ably clients in a child process that connect to the multiplayer space, stream cursor updates at ~12 Hz each, and fire occasional reactions. **Requires the page's `ABLY_API_KEY` and `NEXT_PUBLIC_MULTIPLAYER_ENABLED=1`** to be set, and may hit Ably's free-tier rate limit at >50 ghosts (600 msg/s account-wide). Rate-limited messages get nacked but don't crash the test.

### 6. **Cleanup — always run this when done**

```bash
bash .claude/skills/perf-bench/scripts/cleanup.sh
```

Kills:
- the prod server on port 3000
- any leftover `next-server` / `next start` / `next dev` / `jest-worker` processes
- `bench.mjs` / `ghosts.mjs` / `run-perf.mjs` subprocesses
- headless Chromium / chrome-launcher instances spawned by Lighthouse or Playwright

It does **NOT** touch:
- the user's IDE / language server processes
- daily-tool processes (Cursor, MongoDB Compass, Redis, Raycast)
- the `.perf-bench-out/` artifacts on disk (use `bash scripts/cleanup.sh --hard` to also delete those)

---

## Output schema

```
.perf-bench-out/
├── rig/                      ← installed deps (~150 MB, gitignored)
│   └── node_modules/
├── before/run-{0..8}.json    ← Lighthouse LHRs (BEFORE)
├── before/metrics.csv        ← slim summary
├── after/run-{0..8}.json     ← Lighthouse LHRs (AFTER)
├── after/metrics.csv
├── runtime/{label}.json      ← Playwright bench: fps, longTasks, heap, cdp metrics
├── server.log                ← prod server stdout/stderr
└── server.pid                ← PID for cleanup
```

---

## What the metrics mean

| Metric | What it measures | Good value |
|---|---|---|
| FCP (First Contentful Paint) | First text/image painted | < 1.8s on mobile sim |
| LCP (Largest Contentful Paint) | When the largest above-fold element painted | < 2.5s |
| TBT (Total Blocking Time) | Sum of long tasks (>50ms) blocking input | < 200ms |
| CLS (Cumulative Layout Shift) | Unexpected layout movement | < 0.1 |
| Speed Index | How fast the page *looks* loaded | < 3.4s |
| TTI (Time to Interactive) | When the page is fully responsive | < 3.8s |
| Main thread work | Total CPU time during the audit | < 2s on mobile |
| Bootup time | JS parse + execute time | < 1s |

Runtime bench:
| Metric | Meaning |
|---|---|
| FPS median | typical frame rate during the scenario |
| FPS p5 | 5th-percentile (worst-frame experience) |
| longTasks count | how many >50ms blocking events fired |
| heap Δ MB | JS memory growth over the scenario (leak detector) |

---

## Statistical methodology (don't skip)

- **N ≥ 9 runs** per condition. Lighthouse has high inter-run variance; medians stabilize at n≥7-9.
- **Use median, not mean.** Mean is dragged by outliers (one slow run from OS interference).
- **Welch's t-test** for unequal-variance comparison: `t = (mean_a - mean_b) / sqrt(var_a/n_a + var_b/n_b)`. The analyzer prints |t| per metric.
- **|t| > 2 ≈ 95% confidence** the populations differ; |t| > 3 ≈ 99.7%; |t| < 2 = noise. Anything that crosses 5 is overwhelming.
- **Always benchmark on localhost** to remove network noise. Vercel preview URLs add ~50-200ms TTFB jitter.
- **Same machine, no other apps.** Browser extensions, antivirus, and IDE indexing all distort metrics.

---

## When NOT to use this skill

- Looking at one Lighthouse score → use Chrome DevTools Lighthouse panel, much faster.
- Profiling a specific component → use Chrome DevTools Performance recorder.
- Measuring real-user metrics → use Vercel Web Vitals or DebugBear, not lab tests.

This skill is for **statistically-rigorous A/B comparisons** ("did my optimization actually help?") and **interactive stress tests** ("does it survive 100 simultaneous cursors?").

---

## Failure modes & recovery

- **Server fails to start**: check `.perf-bench-out/server.log`. Common: port 3000 taken (`lsof -i :3000`), missing env vars, build error.
- **Lighthouse runs return score 0 / FCP=0**: Chrome failed to launch. Check `CHROME_PATH`, ensure `npx playwright install chromium` ran, or kill any stale `Google Chrome --headless` procs.
- **Ghost ghosts stuck spawning**: Ably free tier caps connections at 200; check the `[ghosts] N/M connected` line. Rate-limit nacks (`code: 42911`) are non-fatal.
- **Stash blew up**: `git stash list` then `git stash pop --index <N>` to recover. The A/B flow always pops at the end, but if cleanup ran mid-stream you may need to do it manually.

After any failure, **always run `bash scripts/cleanup.sh`** before retrying — leftover processes are the #1 cause of bizarre re-run results.
