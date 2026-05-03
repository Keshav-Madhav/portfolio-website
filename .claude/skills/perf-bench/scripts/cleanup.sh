#!/usr/bin/env bash
# perf-bench: kill every process spawned by the harness. Safe to run anytime.
#
# Patterns are intentionally narrow — daily-tool processes (Cursor, MongoDB,
# Redis, Raycast) are NOT touched. We only kill things whose command line
# contains a path or marker tied to this harness or a Next.js prod server
# bound to the project port.
#
# Usage:
#   cleanup.sh              soft cleanup (kill processes only)
#   cleanup.sh --hard       also delete .perf-bench-out/ artifacts
set -euo pipefail

ROOT="$(cd "$(dirname "$0")"/../../../.. && pwd)"
PORT="${PERF_BENCH_PORT:-3000}"
HARD="${1:-}"

# 1. Kill the prod server on PORT (if any)
PID=$(lsof -i :"${PORT}" -t 2>/dev/null || true)
if [ -n "${PID}" ]; then
  echo "==> killing port ${PORT} (PIDs: ${PID})"
  echo "${PID}" | xargs kill -9 2>/dev/null || true
fi

# 2. Kill harness-spawned processes by name pattern
PATTERNS=(
  "next-server"
  "next start"
  "next dev"
  "jest-worker"
  "perf-bench-out/rig/.*node_modules"
  "bench.mjs"
  "ghosts.mjs"
  "run-perf.mjs"
  "playwright"
  "chromium-headless"
  "chrome-launcher"
)

for p in "${PATTERNS[@]}"; do
  pkill -9 -f "${p}" 2>/dev/null || true
done

# 3. Headless Chrome procs (Lighthouse spawns them)
pkill -9 -f "Google Chrome.*--headless" 2>/dev/null || true
pkill -9 -f "chrome-headless-shell" 2>/dev/null || true

# 4. Optional: delete artifacts on disk
if [ "${HARD}" = "--hard" ]; then
  echo "==> removing ${ROOT}/.perf-bench-out/"
  rm -rf "${ROOT}/.perf-bench-out"
fi

# Verify port is free
sleep 1
if lsof -i :"${PORT}" -t > /dev/null 2>&1; then
  echo "!! port ${PORT} still has a listener — manual investigation needed"
  lsof -i :"${PORT}" 2>&1 | head -5
  exit 1
fi

echo "==> cleanup done. Port ${PORT} is free."
