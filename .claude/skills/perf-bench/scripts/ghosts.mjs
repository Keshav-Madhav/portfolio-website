// Spawn N "ghost" Ably clients that join the multiplayer space and emit
// cursor + reaction traffic. Simulates real co-visitors hitting the page
// for stress-testing the receive-side rendering pipeline.
//
// Usage: node ghosts.mjs <count> <durationMs> <tokenUrl>
//
// Exits cleanly when duration elapses. Suppresses noisy Ably errors that
// happen during connection teardown / rate-limit nacks.

process.on("uncaughtException", () => {});
process.on("unhandledRejection", () => {});

import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rigRoot = path.resolve(__dirname, "../../../../.perf-bench-out/rig");
const require = createRequire(path.join(rigRoot, "package.json"));
const Ably = require("ably");
const SpacesModule = require("@ably/spaces");
const Spaces = SpacesModule.default ?? SpacesModule;

const N = parseInt(process.argv[2] || "0", 10);
const durationMs = parseInt(process.argv[3] || "20000", 10);
const tokenUrl = process.argv[4] || "http://localhost:3000/api/ably/token";

if (N <= 0) {
  console.log("ghosts: no count, exiting");
  process.exit(0);
}

console.log(`ghosts: spawning ${N} clients for ${durationMs}ms`);

const SPACE_NAME = "portfolio-home";
const REACTION_CHANNEL = "portfolio-reactions";
const REACTION_KEYS = [
  "otter",
  "goblin",
  "mushroom",
  "sloth",
  "yoyo",
  "crystal",
  "mate",
  "wilted",
];

const clients = [];
const spacesList = [];

for (let i = 0; i < N; i++) {
  const cid = `ghost-${i}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
  const ably = new Ably.Realtime({
    authUrl: tokenUrl,
    authParams: { clientId: cid },
    clientId: cid,
    autoConnect: true,
    echoMessages: false,
  });
  const spaces = new Spaces(ably);
  clients.push(ably);
  spacesList.push(spaces);
}

async function waitForConnected() {
  const start = Date.now();
  while (Date.now() - start < 15000) {
    const connected = clients.filter(
      (c) => c.connection.state === "connected",
    ).length;
    if (connected >= Math.floor(N * 0.8)) {
      console.log(
        `ghosts: ${connected}/${N} connected (${Date.now() - start}ms)`,
      );
      return connected;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  const connected = clients.filter(
    (c) => c.connection.state === "connected",
  ).length;
  console.log(
    `ghosts: only ${connected}/${N} connected after 15s, continuing`,
  );
  return connected;
}

await waitForConnected();

const intervals = [];

for (let i = 0; i < N; i++) {
  const spaces = spacesList[i];
  const ably = clients[i];
  try {
    const space = await spaces.get(SPACE_NAME);
    await space.enter({
      name: `ghost-${i}`,
      color: `hsl(${(i * 31) % 360} 70% 60%)`,
    });

    let x = Math.random() * 1200;
    let y = Math.random() * 800;

    // ~12 Hz per ghost. 100 ghosts × 12 Hz ≈ 1200 msg/s, near Ably free-tier
    // ceiling. Lower this for higher counts; raise for stress at low counts.
    const cursorIv = setInterval(async () => {
      x += (Math.random() - 0.5) * 60;
      y += (Math.random() - 0.5) * 60;
      try {
        await space.cursors.set({ position: { x, y } });
      } catch {}
    }, 80);
    intervals.push(cursorIv);

    const reactionIv = setInterval(() => {
      const channel = ably.channels.get(REACTION_CHANNEL);
      const k = REACTION_KEYS[Math.floor(Math.random() * REACTION_KEYS.length)];
      channel.publish("reaction", {
        x: Math.random() * 1200,
        y: Math.random() * 600,
        key: k,
      });
    }, 4000 + Math.random() * 3000);
    intervals.push(reactionIv);
  } catch (err) {
    console.warn(`ghost ${i} failed to enter space:`, err.message);
  }
}

console.log(`ghosts: streaming for ${durationMs}ms`);

await new Promise((r) => setTimeout(r, durationMs));

console.log("ghosts: tearing down");
for (const iv of intervals) clearInterval(iv);
for (const c of clients) {
  try {
    c.close();
  } catch {}
}

await new Promise((r) => setTimeout(r, 500));
process.exit(0);
