#!/usr/bin/env bash
# perf-bench: A/B Lighthouse comparison via git stash. Captures the AFTER
# state first (current working tree), stashes everything (including untracked),
# captures BEFORE, restores, and prints a paired comparison.
#
# Usage:
#   bash ab.sh                       # 9 runs each, default URL
#   N=15 bash ab.sh                  # 15 runs each
#   URL=http://localhost:3000/ N=9 bash ab.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")"/../../../.. && pwd)"
SCRIPTS="$(cd "$(dirname "$0")" && pwd)"
OUT="${ROOT}/.perf-bench-out"
URL="${URL:-http://localhost:3000/}"
N="${N:-9}"

mkdir -p "${OUT}"

start_server () {
  ( cd "${ROOT}" && npm run start > "${OUT}/server.log" 2>&1 & echo $! > "${OUT}/server.pid" )
  for i in $(seq 1 30); do
    if curl -sf "${URL}" -o /dev/null 2>/dev/null; then
      echo "==> server ready"
      return 0
    fi
    sleep 1
  done
  echo "!! server failed to start. tail of server.log:"
  tail -20 "${OUT}/server.log"
  exit 1
}

stop_server () {
  bash "${SCRIPTS}/cleanup.sh" >/dev/null 2>&1 || true
  sleep 1
}

# ---------- AFTER (current working tree) ----------
echo "==> [1/3] building AFTER state"
( cd "${ROOT}" && npm run build > "${OUT}/build-after.log" 2>&1 )
start_server
echo "==> [1/3] running ${N} Lighthouse passes against AFTER"
node "${SCRIPTS}/run-perf.mjs" "${URL}" "${OUT}/after" "${N}"
stop_server

# ---------- stash + BEFORE ----------
echo "==> [2/3] stashing working tree (including untracked)"
git -C "${ROOT}" stash push -u -m "perf-bench-stash" > /dev/null

trap 'echo "==> restoring stash"; git -C "${ROOT}" stash pop > /dev/null 2>&1 || true; ( cd "${ROOT}" && npm run build > "${OUT}/build-restore.log" 2>&1 )' EXIT

echo "==> [2/3] building BEFORE state"
( cd "${ROOT}" && npm run build > "${OUT}/build-before.log" 2>&1 )
start_server
echo "==> [2/3] running ${N} Lighthouse passes against BEFORE"
node "${SCRIPTS}/run-perf.mjs" "${URL}" "${OUT}/before" "${N}"
stop_server

# ---------- restore (via trap) + analyze ----------
echo "==> [3/3] analysis"
node "${SCRIPTS}/analyze.mjs" "${OUT}/before" "${OUT}/after"

echo
echo "==> done. Reports in ${OUT}/before/ and ${OUT}/after/."
