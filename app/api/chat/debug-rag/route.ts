// =============================================================================
// /api/chat/debug-rag — inspect the RAG pipeline for a query without an LLM call.
//
// Lets us manually verify retrieval quality (what chunks get pulled, with what
// scores, which got dropped and why) without burning Groq tokens. Useful in
// dev — guarded so it can't be hit in production unless we opt in.
//
// Usage:
//   GET  /api/chat/debug-rag?q=how+was+cookie+clicker+built
//   POST /api/chat/debug-rag   body: { "query": "..." }
//
// Response shape (JSON):
//   {
//     query: "...",
//     config: { TOP_K, MIN_SCORE, SCORE_GAP, MAX_CONTEXT_TOKENS, ... },
//     index: { totalChunks, model, dimensions, builtAt },
//     retrieval: {
//       topScore, includedCount, estimatedTokens, searchMs,
//       trace: [
//         { id, section, score, preview, decision: { status, ... } },
//         ...
//       ]
//     },
//     finalContext: "..."  // the actual string that would be injected
//   }
// =============================================================================

import {
  ragSearch,
  getEmbeddingsIndex,
  RAG_CONFIG,
} from "@/lib/embeddings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// In production we lock this down — it's a dev-only inspection tool.
// Set DEBUG_RAG_ENABLED=1 in the deployment env if you want to allow it there.
const IS_PROD = process.env.NODE_ENV === "production";
const ALLOWED_IN_PROD = process.env.DEBUG_RAG_ENABLED === "1";

function gate(): Response | null {
  if (IS_PROD && !ALLOWED_IN_PROD) {
    return new Response("Debug endpoint disabled in production", {
      status: 404,
    });
  }
  return null;
}

async function handle(query: string) {
  if (!query || query.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: "Missing query" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const index = getEmbeddingsIndex();
  const retrieval = await ragSearch(query);

  const payload = {
    query,
    config: RAG_CONFIG,
    index: {
      totalChunks: index.chunks?.length ?? 0,
      model: index.model,
      dimensions: index.dimensions,
      builtAt: index.builtAt,
    },
    retrieval: {
      topScore: Number(retrieval.topScore.toFixed(4)),
      includedCount: retrieval.includedCount,
      estimatedTokens: retrieval.estimatedTokens,
      contextChars: retrieval.context.length,
      searchMs: retrieval.searchMs,
      trace: retrieval.trace.map((t) => ({
        id: t.id,
        section: t.section,
        score: Number(t.score.toFixed(4)),
        decision: t.decision,
        preview: t.preview,
      })),
    },
    finalContext: retrieval.context,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: { "content-type": "application/json" },
  });
}

export async function GET(req: Request) {
  const gateResponse = gate();
  if (gateResponse) return gateResponse;

  const url = new URL(req.url);
  const query = url.searchParams.get("q") ?? "";
  return handle(query);
}

export async function POST(req: Request) {
  const gateResponse = gate();
  if (gateResponse) return gateResponse;

  const body = (await req.json().catch(() => null)) as { query?: string } | null;
  return handle(body?.query ?? "");
}
