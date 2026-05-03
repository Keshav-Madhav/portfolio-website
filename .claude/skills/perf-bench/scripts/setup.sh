#!/usr/bin/env bash
# perf-bench: install harness deps into .perf-bench-out/rig/. Idempotent.
#
# Why a separate node_modules? So the heavy test deps (lighthouse, playwright,
# sharp) don't pollute the project's package.json or get bundled into a build.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")"/../../../.. && pwd)"
RIG="${ROOT}/.perf-bench-out/rig"

mkdir -p "${RIG}"

if [ ! -f "${RIG}/package.json" ]; then
  ( cd "${RIG}" && npm init -y > /dev/null )
fi

echo "==> installing rig deps into ${RIG} (one-time, ~150 MB) …"
( cd "${RIG}" && npm install --no-audit --no-fund \
    lighthouse@12 \
    chrome-launcher \
    playwright \
    ably \
    @ably/spaces \
    sharp \
    > /dev/null )

echo "==> installing Playwright Chromium binary …"
( cd "${RIG}" && npx playwright install chromium > /dev/null )

# Make sure the artifact dir is gitignored. Add it to .gitignore if missing.
GITIGNORE="${ROOT}/.gitignore"
if [ -f "${GITIGNORE}" ] && ! grep -q "^.perf-bench-out" "${GITIGNORE}"; then
  echo "" >> "${GITIGNORE}"
  echo "# perf-bench harness output" >> "${GITIGNORE}"
  echo ".perf-bench-out/" >> "${GITIGNORE}"
  echo "==> added .perf-bench-out/ to .gitignore"
fi

echo "==> setup done."
