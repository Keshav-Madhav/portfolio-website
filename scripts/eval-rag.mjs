#!/usr/bin/env node
// =============================================================================
// eval-rag.mjs — offline evaluation of the RAG retrieval quality.
//
// No LLM calls, no server needed, no Groq tokens spent. Runs the
// embedding + search pipeline directly against the committed
// lib/context-embeddings.json.
//
// For each curated query:
//   • Embeds the query with the same model used at build time
//   • Runs semantic search (same code path as /api/chat)
//   • Checks whether the expected section ID appears in the TOP_K
//     and in the FINAL INCLUDED chunks (after score / budget filtering)
//   • Records the top score, included count, and injected token count
//
// Then prints:
//   • Per-query table (expected vs. retrieved, pass/fail)
//   • Aggregate stats: recall@K, recall@included, token distribution,
//     top-score distribution
//   • Flags weak queries (where expected section wasn't retrieved, or
//     top score is low enough to suggest the corpus is missing something)
//
// Usage:
//   npm run eval-rag
//
// Add new queries below when you spot retrieval gaps in real use.
// =============================================================================

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lazy-load the TS modules via the compiled JS? No — we reproduce the
// retrieval logic in plain JS here against the JSON index. This keeps the
// eval self-contained and decoupled from the Next.js build.

// =============================================================================
// RETRIEVAL CONFIG — must stay in sync with lib/embeddings.ts RAG_CONFIG
// =============================================================================

// Must stay in sync with lib/embeddings.ts RAG_CONFIG
const RAG_CONFIG = {
  TOP_K: 25,
  RERANK_TOP_K: 12,
  MIN_SCORE: 0.18,
  SCORE_GAP: 0.40,
  ALWAYS_INCLUDE_TOP_IF_ABOVE: 0.15,
  MAX_CONTEXT_TOKENS: 3500,
  CHARS_PER_TOKEN: 4,
};

// =============================================================================
// GOLDEN TEST SET — queries + expected section ID from corpus-source.mjs
//
// Aim for BROAD coverage: every major topic should have at least one query.
// If a real visitor asks something and retrieval fails, add the query here
// so the regression is caught by future runs.
// =============================================================================

// `expect` can be a string (single valid section) or an array of strings
// (multiple legitimately correct sections — any one matches). Use the array
// form when a query could reasonably be answered from several sections,
// e.g. "give me the Cookie Clicker link" is satisfied by either
// project-cookie-clicker (which contains the link) or urls-reference.
const queries = [
  // ---- Identity / contact ----
  { q: "Who is Keshav?", expect: ["identity", "contact"] },
  { q: "How can I contact you?", expect: ["contact", "identity"] },
  { q: "What is your email?", expect: ["contact", "identity"] },
  { q: "Where are you based?", expect: ["identity", "contact"] },

  // ---- Origin / learning ----
  { q: "What was your childhood like?", expect: "origin-childhood" },
  { q: "How did you start programming?", expect: ["origin-pivot", "origin-childhood"] },
  { q: "Where did you study?", expect: "origin-college" },
  { q: "What are you learning right now?", expect: "learning-approach" },

  // ---- Applied AI / vague AI queries (regression: vocabulary mismatch) ----
  // Vocab is sprinkled into overview/identity/verbaflo-overview/vf-contributions-overview
  // rather than living in a dedicated chunk — any of those is a valid retrieval hit.
  {
    q: "Applied AI",
    expect: ["overview", "identity", "verbaflo-overview", "vf-contributions-overview"],
  },
  {
    q: "Tell me about AI applied capabilities",
    expect: ["overview", "verbaflo-overview", "vf-contributions-overview"],
  },
  {
    q: "What applied AI work have you done?",
    expect: ["verbaflo-overview", "vf-contributions-overview", "overview"],
  },
  {
    q: "Applied AI bhai",
    expect: ["overview", "identity", "verbaflo-overview"],
  },

  // ---- VerbaFlo ----
  { q: "What do you do at VerbaFlo?", expect: ["verbaflo-overview", "verbaflo-copilot"] },
  { q: "Tell me about the Copilot you built", expect: "verbaflo-copilot" },
  { q: "What is the conversation simulation tool?", expect: "verbaflo-simulation" },
  { q: "How does the MCP debugger work?", expect: "verbaflo-mcp-debugger" },
  { q: "Tell me about your tracing UI", expect: "verbaflo-tracing" },
  { q: "What have you learned at VerbaFlo?", expect: "verbaflo-lessons" },

  // ---- PrudentBit ----
  { q: "What did you do at PrudentBit?", expect: ["prudentbit-overview", "prudentbit-immune-suite"] },
  { q: "Tell me about the Immune product suite", expect: "prudentbit-immune-suite" },
  { q: "How did you migrate to Next.js 14?", expect: "prudentbit-nextjs-migration" },
  { q: "What did PrudentBit teach you?", expect: "prudentbit-lessons" },

  // ---- Projects (flagship) ----
  { q: "How does Grid Math work?", expect: "project-grid-math" },
  { q: "What is the Live Jinja extension?", expect: "project-live-jinja" },
  { q: "How was Cookie Clicker built?", expect: "project-cookie-clicker" },
  { q: "Tell me about Space Sandbox", expect: "project-space-sandbox" },

  // ---- Projects (other) ----
  { q: "What is Axon?", expect: "project-axon" },
  { q: "How does the Brainfuck interpreter reach 1 billion ops?", expect: "project-brainfuck" },
  { q: "Tell me about Zen Notes", expect: "project-zen-notes" },
  { q: "What is the Fizzi project?", expect: "project-fizzi" },
  { q: "Show me the Chatter app", expect: "project-chatter" },

  // ---- Personality ----
  { q: "What makes you tick?", expect: ["personality-optimization", "work-style"] },
  { q: "What games do you play?", expect: "personality-gaming" },
  { q: "Do you like space?", expect: "personality-space" },
  { q: "What's your favorite dinosaur?", expect: "personality-dinosaurs" },
  { q: "Do you listen to music?", expect: "personality-music" },

  // ---- Work style / philosophy ----
  { q: "How do you work?", expect: ["work-style", "personality-optimization"] },
  { q: "What are your strong opinions?", expect: ["opinions-philosophy", "work-style"] },
  { q: "What do you avoid in workplaces?", expect: "career-avoids" },
  { q: "Are you open to new roles?", expect: "career-outlook" },

  // ---- Tech stack ----
  { q: "What AI frameworks do you use?", expect: "tech-ai-agents" },
  { q: "Which LLMs have you worked with?", expect: "tech-models" },
  { q: "What databases are you familiar with?", expect: "tech-data" },
  { q: "How do you handle observability?", expect: "tech-observability" },
  { q: "What frontend stack do you use?", expect: "tech-frontend" },
  { q: "What backend technologies do you know?", expect: ["tech-backend", "tech-data"] },
  { q: "Have you worked with Electron?", expect: ["tech-desktop-native", "project-zen-notes"] },

  // ---- Site / meta ----
  { q: "How was this portfolio site built?", expect: "portfolio-site" },
  { q: "How does the chat work?", expect: ["portfolio-chat-system", "portfolio-site"] },

  // ---- URLs ----
  { q: "Give me the link to Cookie Clicker", expect: ["urls-reference", "project-cookie-clicker"] },
  { q: "What is your LinkedIn?", expect: ["urls-reference", "contact", "identity"] },
];

// Normalize: string → [string]
function expectedList(expect) {
  return Array.isArray(expect) ? expect : [expect];
}

// =============================================================================
// SEARCH — re-implemented to run standalone (mirrors lib/embeddings.ts)
// =============================================================================

function cosineSimilarity(a, b) {
  let dot = 0,
    magA = 0,
    magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function searchEmbeddings(queryVec, chunks, topK) {
  return chunks
    .map((chunk) => ({ chunk, score: cosineSimilarity(queryVec, chunk.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function buildRetrievalResult(results) {
  const {
    MIN_SCORE,
    SCORE_GAP,
    ALWAYS_INCLUDE_TOP_IF_ABOVE,
    MAX_CONTEXT_TOKENS,
    CHARS_PER_TOKEN,
  } = RAG_CONFIG;
  if (results.length === 0) {
    return { included: [], topScore: 0, estimatedTokens: 0 };
  }
  const topScore = results[0].score;
  const minAllowed = topScore - SCORE_GAP;

  const included = [];
  let tokens = 0;

  for (let i = 0; i < results.length; i++) {
    const { chunk, score } = results[i];
    const rankZeroOverride = i === 0 && score >= ALWAYS_INCLUDE_TOP_IF_ABOVE;
    if (!rankZeroOverride && score < MIN_SCORE) continue;
    if (!rankZeroOverride && score < minAllowed) continue;
    const t = Math.ceil(chunk.text.length / CHARS_PER_TOKEN);
    if (tokens + t > MAX_CONTEXT_TOKENS) continue;
    included.push({ id: chunk.id, section: chunk.section, score, tokens: t });
    tokens += t;
  }

  return { included, topScore, estimatedTokens: tokens };
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  // Load the embeddings index
  const indexPath = path.join(__dirname, "../lib/context-embeddings.json");
  if (!fs.existsSync(indexPath)) {
    console.error("[eval] lib/context-embeddings.json not found — run `npm run build-embeddings` first");
    process.exit(1);
  }
  const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  console.log(
    `[eval] loaded ${index.chunks.length} chunks, model=${index.model}, ` +
      `dims=${index.dimensions}, built=${index.builtAt}`,
  );

  // Load the embedding model
  console.log("[eval] loading embedding model...");
  const { pipeline } = await import("@xenova/transformers");
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
    { quantized: true },
  );

  const embed = async (text) => {
    const out = await extractor([text], { pooling: "mean", normalize: true });
    return Array.from(out[0].data);
  };

  // =============================================================================
  // Run all queries
  // =============================================================================

  const results = [];
  console.log(`[eval] running ${queries.length} queries...\n`);

  for (const { q, expect } of queries) {
    const expectList = expectedList(expect);
    const vec = await embed(q);
    const hits = searchEmbeddings(vec, index.chunks, RAG_CONFIG.TOP_K);
    const built = buildRetrievalResult(hits);

    // ANY of the acceptable sections must appear in top-K / included.
    const sectionOf = (id) => id.replace(/-\d+$/, "");
    const inTopK = hits.some((h) =>
      expectList.includes(sectionOf(h.chunk.id)),
    );
    const inIncluded = built.included.some((c) =>
      expectList.includes(sectionOf(c.id)),
    );
    // Rank of the best acceptable section in top-K (0-indexed, -1 if none)
    const rank = hits.findIndex((h) =>
      expectList.includes(sectionOf(h.chunk.id)),
    );

    results.push({
      q,
      expect: expectList.join("|"),
      inTopK,
      inIncluded,
      rank,
      topScore: built.topScore,
      includedCount: built.included.length,
      tokens: built.estimatedTokens,
      topSectionsInjected: built.included.map((c) => c.section).slice(0, 3),
    });
  }

  // =============================================================================
  // Report
  // =============================================================================

  // Per-query table
  console.log("=".repeat(110));
  console.log("PER-QUERY RESULTS");
  console.log("=".repeat(110));
  console.log(
    pad("Q", 52) +
      pad("expect", 30) +
      pad("rank", 6) +
      pad("top", 7) +
      pad("incl", 6) +
      pad("tok", 6) +
      " ok",
  );
  console.log("-".repeat(110));

  for (const r of results) {
    const ok = r.inIncluded ? "✓" : r.inTopK ? "~" : "✗";
    console.log(
      pad(trunc(r.q, 50), 52) +
        pad(r.expect, 30) +
        pad(r.rank === -1 ? "—" : String(r.rank), 6) +
        pad(r.topScore.toFixed(3), 7) +
        pad(String(r.includedCount), 6) +
        pad(String(r.tokens), 6) +
        " " +
        ok,
    );
  }

  // Aggregate stats
  const n = results.length;
  const recallAtTopK = results.filter((r) => r.inTopK).length / n;
  const recallAtIncluded = results.filter((r) => r.inIncluded).length / n;
  const topScores = results.map((r) => r.topScore).sort((a, b) => a - b);
  const tokens = results.map((r) => r.tokens);
  const included = results.map((r) => r.includedCount);

  const median = (arr) => arr[Math.floor(arr.length / 2)];
  const p = (arr, q) => arr[Math.floor(arr.length * q)];
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

  console.log("\n" + "=".repeat(110));
  console.log("AGGREGATE STATS");
  console.log("=".repeat(110));
  console.log(`queries:                  ${n}`);
  console.log(
    `recall@top-K (K=${RAG_CONFIG.TOP_K}):        ` +
      `${(recallAtTopK * 100).toFixed(1)}%  ` +
      `(${results.filter((r) => r.inTopK).length}/${n})`,
  );
  console.log(
    `recall@included:          ` +
      `${(recallAtIncluded * 100).toFixed(1)}%  ` +
      `(${results.filter((r) => r.inIncluded).length}/${n})`,
  );
  console.log(
    `top-score distribution:   min=${topScores[0].toFixed(3)}  ` +
      `p10=${p(topScores, 0.1).toFixed(3)}  ` +
      `median=${median(topScores).toFixed(3)}  ` +
      `p90=${p(topScores, 0.9).toFixed(3)}  ` +
      `max=${topScores[topScores.length - 1].toFixed(3)}`,
  );
  console.log(
    `context tokens injected:  ` +
      `min=${Math.min(...tokens)}  ` +
      `avg=${Math.round(avg(tokens))}  ` +
      `max=${Math.max(...tokens)}  ` +
      `(budget=${RAG_CONFIG.MAX_CONTEXT_TOKENS})`,
  );
  console.log(
    `chunks included:          ` +
      `min=${Math.min(...included)}  ` +
      `avg=${avg(included).toFixed(1)}  ` +
      `max=${Math.max(...included)}`,
  );

  // Flag weak / failed queries
  const failed = results.filter((r) => !r.inIncluded);
  const weak = results.filter(
    (r) => r.inIncluded && r.topScore < 0.5,
  );

  if (failed.length > 0) {
    console.log("\n" + "=".repeat(110));
    console.log(`FAILED: ${failed.length} queries — expected section not injected`);
    console.log("=".repeat(110));
    for (const r of failed) {
      console.log(
        `  ✗ "${r.q}"  (expect=${r.expect}, rank=${r.rank}, top=${r.topScore.toFixed(3)})`,
      );
      if (r.topSectionsInjected.length > 0) {
        console.log(`      got instead: ${r.topSectionsInjected.join(" | ")}`);
      }
    }
  }

  if (weak.length > 0) {
    console.log("\n" + "=".repeat(110));
    console.log(`WEAK: ${weak.length} queries — expected section retrieved but with low confidence`);
    console.log("=".repeat(110));
    for (const r of weak) {
      console.log(
        `  ~ "${r.q}"  (top=${r.topScore.toFixed(3)}, rank=${r.rank})`,
      );
    }
  }

  // Exit non-zero if recall@included drops below 90%
  const threshold = 0.9;
  if (recallAtIncluded < threshold) {
    console.log(
      `\n[eval] ⚠️  recall@included (${(recallAtIncluded * 100).toFixed(1)}%) ` +
        `below threshold (${threshold * 100}%) — corpus may need expansion`,
    );
    process.exit(1);
  }

  console.log("\n[eval] ✅ all checks passed");
}

function pad(s, n) {
  return (s + " ".repeat(n)).slice(0, n);
}

function trunc(s, n) {
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}

main().catch((err) => {
  console.error("[eval] error:", err);
  process.exit(1);
});
