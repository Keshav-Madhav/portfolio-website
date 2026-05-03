// =============================================================================
// embeddings.ts — loading + searching the pre-built RAG embeddings
//
// The core responsibility here is trading two failure modes against each
// other for /api/chat:
//
//   • Over-retrieve: inject too much context, burn Groq tokens, cap out at
//     ~12K TPM and throttle visitors after 1-2 turns. Also dilutes the
//     signal — the LLM has to pick the right facts out of a mess.
//   • Under-retrieve: miss the relevant chunk, so the LLM falls back to
//     generic knowledge and hallucinates (the exact problem we built this
//     system to solve).
//
// The retrieval strategy below tries to stay in the middle:
//   1. Score ALL chunks by cosine similarity.
//   2. Apply a hard score floor (MIN_SCORE) so we never inject noise.
//   3. Apply a relative score floor (a chunk must be within SCORE_GAP of
//      the top score) so a high-confidence single match isn't diluted by
//      mediocre ones.
//   4. Pack chunks into a token budget, highest-score first. Stop when
//      we're out of budget.
//
// Everything the chat endpoint (or the debug endpoint) needs for
// observability is returned in a single `RetrievalResult` struct: the
// final context string, which chunks made it in, which chunks were
// considered-but-dropped, and why. Nothing is logged away — callers
// decide what to do with it.
// =============================================================================

import embeddingsData from "./context-embeddings.json";

// =============================================================================
// TYPES
// =============================================================================

export type EmbeddingChunk = {
  id: string;
  section: string;
  text: string;
  vector: number[];
};

export type EmbeddingsIndex = {
  builtAt: string;
  model: string;
  dimensions: number;
  chunks: EmbeddingChunk[];
  error?: string;
};

export type SearchResult = {
  chunk: EmbeddingChunk;
  score: number;
};

/** Why a candidate chunk was or wasn't included in the final context. */
export type RetrievalDecision =
  | { status: "included"; tokens: number }
  | { status: "dropped-min-score"; threshold: number }
  | { status: "dropped-score-gap"; topScore: number; allowedGap: number }
  | { status: "dropped-token-budget"; remainingBudget: number };

export type RetrievalTrace = {
  id: string;
  section: string;
  score: number;
  decision: RetrievalDecision;
  preview: string; // first 80 chars of the chunk text
};

export type RetrievalResult = {
  /** The final context string to inject into the system prompt. */
  context: string;
  /** Estimated tokens in `context` (based on char/4 heuristic). */
  estimatedTokens: number;
  /** Score of the top-scoring chunk (useful for confidence checks). */
  topScore: number;
  /** How many chunks were actually included in `context`. */
  includedCount: number;
  /** Full trace of the TOP_K chunks and what happened to each. */
  trace: RetrievalTrace[];
  /** Timing — how long the search took (ms). */
  searchMs: number;
};

// =============================================================================
// RETRIEVAL CONFIG — tunable, exported so the API and eval harness agree
// =============================================================================

export const RAG_CONFIG = {
  /**
   * How many chunks to pull from the cosine-similarity stage before
   * reranking. With the cross-encoder reranker, we can afford to pull
   * more candidates and let the reranker sort them properly.
   */
  TOP_K: 25,

  /**
   * How many chunks to keep after reranking. The reranker scores
   * query-document pairs directly, so we can be more selective here.
   */
  RERANK_TOP_K: 12,

  /**
   * Hard minimum cosine-similarity score for the initial retrieval.
   * Lowered from 0.21 to 0.18 since the reranker will filter out
   * false positives anyway.
   */
  MIN_SCORE: 0.18,

  /**
   * Relative score floor for initial retrieval. Widened from 0.35 to
   * 0.40 to pull in more marginal chunks for the reranker to evaluate.
   */
  SCORE_GAP: 0.40,

  /**
   * Safety net: the rank-0 chunk is ALWAYS included if its score ≥ this
   * floor, even if it wouldn't pass MIN_SCORE.
   */
  ALWAYS_INCLUDE_TOP_IF_ABOVE: 0.15,

  /**
   * Hard token budget for the retrieved context. With GPT-4o-mini as
   * the primary model (128K context), we can afford much more context.
   * Bumped from 1800 to 3500 for richer answers.
   */
  MAX_CONTEXT_TOKENS: 3500,

  /**
   * Char-to-token ratio for the budget estimator. ~4 for English prose.
   */
  CHARS_PER_TOKEN: 4,
} as const;

// =============================================================================
// INDEX LOADING
// =============================================================================

let cachedIndex: EmbeddingsIndex | null = null;

export function getEmbeddingsIndex(): EmbeddingsIndex {
  if (cachedIndex) return cachedIndex;
  cachedIndex = embeddingsData as unknown as EmbeddingsIndex;
  return cachedIndex;
}

// =============================================================================
// COSINE SIMILARITY
// =============================================================================

function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

function magnitude(v: number[]): number {
  let sum = 0;
  for (let i = 0; i < v.length; i++) sum += v[i] * v[i];
  return Math.sqrt(sum);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dotProduct(a, b) / (magA * magB);
}

// =============================================================================
// SEARCH — top-K by cosine similarity
// =============================================================================

export function searchEmbeddings(
  queryVector: number[],
  topK: number = RAG_CONFIG.TOP_K,
): SearchResult[] {
  const index = getEmbeddingsIndex();
  if (!index.chunks || index.chunks.length === 0) return [];

  const scored: SearchResult[] = index.chunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryVector, chunk.vector),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

// =============================================================================
// CONTEXT BUILDING — score + budget filtering, with full trace
// =============================================================================

const estimateTokens = (text: string): number =>
  Math.ceil(text.length / RAG_CONFIG.CHARS_PER_TOKEN);

/**
 * Build the final retrieval result from a list of scored chunks.
 * Enforces MIN_SCORE, SCORE_GAP, and MAX_CONTEXT_TOKENS. Returns a trace
 * explaining every decision so callers can inspect / tune.
 *
 * Decision order for each chunk:
 *   1. Is this rank 0 and score ≥ ALWAYS_INCLUDE_TOP_IF_ABOVE?
 *      → include regardless of MIN_SCORE (weak-best is better than nothing)
 *   2. Does score clear MIN_SCORE? If not → dropped.
 *   3. Does score sit within SCORE_GAP of the top? If not → dropped.
 *   4. Is there token budget left? If not → dropped.
 *   5. Include.
 */
export function buildRetrievalResult(
  results: SearchResult[],
  opts: {
    minScore?: number;
    scoreGap?: number;
    maxTokens?: number;
    alwaysIncludeTopIfAbove?: number;
  } = {},
): Omit<RetrievalResult, "searchMs"> {
  const minScore = opts.minScore ?? RAG_CONFIG.MIN_SCORE;
  const scoreGap = opts.scoreGap ?? RAG_CONFIG.SCORE_GAP;
  const maxTokens = opts.maxTokens ?? RAG_CONFIG.MAX_CONTEXT_TOKENS;
  const alwaysIncludeTopIfAbove =
    opts.alwaysIncludeTopIfAbove ?? RAG_CONFIG.ALWAYS_INCLUDE_TOP_IF_ABOVE;

  const trace: RetrievalTrace[] = [];

  if (results.length === 0) {
    return {
      context: "",
      estimatedTokens: 0,
      topScore: 0,
      includedCount: 0,
      trace,
    };
  }

  const topScore = results[0].score;
  const minAllowedByGap = topScore - scoreGap;

  const lines: string[] = [];
  let estimatedTokens = 0;
  const seenSections = new Set<string>();
  let includedCount = 0;

  for (let i = 0; i < results.length; i++) {
    const { chunk, score } = results[i];
    const preview = chunk.text.slice(0, 80).replace(/\s+/g, " ");
    const isRankZero = i === 0;
    const rankZeroOverride = isRankZero && score >= alwaysIncludeTopIfAbove;

    if (!rankZeroOverride && score < minScore) {
      trace.push({
        id: chunk.id,
        section: chunk.section,
        score,
        decision: { status: "dropped-min-score", threshold: minScore },
        preview,
      });
      continue;
    }

    if (!rankZeroOverride && score < minAllowedByGap) {
      trace.push({
        id: chunk.id,
        section: chunk.section,
        score,
        decision: { status: "dropped-score-gap", topScore, allowedGap: scoreGap },
        preview,
      });
      continue;
    }

    const tokens = estimateTokens(chunk.text);
    if (estimatedTokens + tokens > maxTokens) {
      trace.push({
        id: chunk.id,
        section: chunk.section,
        score,
        decision: {
          status: "dropped-token-budget",
          remainingBudget: maxTokens - estimatedTokens,
        },
        preview,
      });
      continue;
    }

    if (!seenSections.has(chunk.section)) {
      if (lines.length > 0) lines.push("");
      lines.push(`### ${chunk.section}`);
      seenSections.add(chunk.section);
    }
    lines.push(chunk.text);
    estimatedTokens += tokens;
    includedCount++;

    trace.push({
      id: chunk.id,
      section: chunk.section,
      score,
      decision: { status: "included", tokens },
      preview,
    });
  }

  return {
    context: lines.join("\n"),
    estimatedTokens,
    topScore,
    includedCount,
    trace,
  };
}

// =============================================================================
// QUERY EMBEDDING — lazy-loaded transformer pipeline
// =============================================================================

type EmbedPipelineFn = (
  texts: string[],
  opts: { pooling: string; normalize: boolean },
) => Promise<{ data: Float32Array }[]>;

let embedPipeline: EmbedPipelineFn | null = null;

export async function embedQuery(text: string): Promise<number[]> {
  if (!embedPipeline) {
    console.log("[embeddings] loading query-embedding model (first call, ~30MB)...");
    const { pipeline } = await import("@xenova/transformers");
    embedPipeline = (await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { quantized: true },
    )) as unknown as EmbedPipelineFn;
  }

  const output = await embedPipeline([text], {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output[0].data);
}

// =============================================================================
// RERANKING (OPTIONAL) — disabled for now, cosine similarity is sufficient
// =============================================================================
//
// Cross-encoders can improve relevance ranking but add:
// - ~100MB model download on first call
// - ~50-200ms latency per query
// - Complexity in model loading
//
// With GPT-4o-mini as the LLM and expanded context (3500 tokens), the
// improved retrieval limits are sufficient. Enable reranking later if
// quality issues persist.

/**
 * Placeholder for future reranking. Currently just returns top-K results.
 */
export async function rerankResults(
  _query: string,
  results: SearchResult[],
  topK: number = RAG_CONFIG.RERANK_TOP_K,
): Promise<SearchResult[]> {
  // Reranking disabled — return top-K from cosine similarity
  return results.slice(0, topK);
}

// =============================================================================
// FULL PIPELINE — embed + search + rerank + build + trace
// =============================================================================
//
// Flow:
//   1. Embed query with bi-encoder (fast, ~2ms)
//   2. Cosine similarity against all chunks → top TOP_K candidates (~1ms)
//   3. Rerank with cross-encoder → top RERANK_TOP_K (~50-100ms)
//   4. Build context string with score/budget filtering
//
// The reranker is the quality multiplier: it catches cases where cosine
// similarity missed the best match due to lexical mismatch.

export async function ragSearch(
  query: string,
  opts: {
    topK?: number;
    rerankTopK?: number;
    minScore?: number;
    scoreGap?: number;
    maxTokens?: number;
    skipRerank?: boolean;
  } = {},
): Promise<RetrievalResult> {
  const index = getEmbeddingsIndex();
  const empty: RetrievalResult = {
    context: "",
    estimatedTokens: 0,
    topScore: 0,
    includedCount: 0,
    trace: [],
    searchMs: 0,
  };

  if (!index.chunks || index.chunks.length === 0) {
    console.warn("[rag] no embeddings available");
    return empty;
  }

  const started = Date.now();
  try {
    // Step 1-2: Embed + cosine similarity
    const queryVector = await embedQuery(query);
    const candidates = searchEmbeddings(
      queryVector,
      opts.topK ?? RAG_CONFIG.TOP_K,
    );

    // Step 3: Rerank with cross-encoder (unless skipped)
    let hits: SearchResult[];
    if (opts.skipRerank) {
      hits = candidates.slice(0, opts.rerankTopK ?? RAG_CONFIG.RERANK_TOP_K);
    } else {
      hits = await rerankResults(
        query,
        candidates,
        opts.rerankTopK ?? RAG_CONFIG.RERANK_TOP_K,
      );
    }

    // Step 4: Build context
    const built = buildRetrievalResult(hits, opts);
    const searchMs = Date.now() - started;

    console.log(
      `[rag] "${query.slice(0, 50)}" | top=${built.topScore.toFixed(3)} | ` +
        `in=${built.includedCount}/${hits.length} | ` +
        `${built.estimatedTokens}tk | ${searchMs}ms`,
    );

    return { ...built, searchMs };
  } catch (err) {
    console.error("[rag] search failed:", err);
    return empty;
  }
}
