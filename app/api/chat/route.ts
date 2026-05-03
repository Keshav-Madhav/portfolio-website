import Groq from "groq-sdk";
import OpenAI from "openai";
import {
  buildSystemPrompt,
  buildIntroSystemPrompt,
  buildRagSystemPrompt,
} from "@/lib/keshav-context";
import {
  ragSearch,
  getEmbeddingsIndex,
  getRandomChunkSnippet,
  RAG_CONFIG,
  type RetrievalResult,
} from "@/lib/embeddings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

// =============================================================================
// MODEL ROUTING
// =============================================================================
//
// Primary Q&A model: OpenAI GPT-4o-mini
//   - Much better at following persona instructions
//   - Lower hallucination rate
//   - Better at synthesizing multiple chunks
//
// Intro model: Groq Llama 3.1 8B
//   - Fast (sub-200ms)
//   - Good enough for a scripted 1-2 sentence greeting
//   - Free tier friendly
//
// Fallback: If OpenAI fails, we fall back to Groq 70B, then 8B.

const OPENAI_MODEL = "gpt-4o-mini";
const GROQ_INTRO_MODEL = "llama-3.1-8b-instant";
const GROQ_FALLBACK_PRIMARY = "llama-3.3-70b-versatile";
const GROQ_FALLBACK_SECONDARY = "llama-3.1-8b-instant";

const INTRO_TRIGGER = "[INTRO]";

// =============================================================================
// ERROR HELPERS
// =============================================================================

type ErrorShape = {
  status?: number;
  error?: { code?: string; type?: string; message?: string };
  message?: string;
};

function asError(err: unknown): ErrorShape {
  if (err && typeof err === "object") return err as ErrorShape;
  return {};
}

function isRateLimit(err: unknown): boolean {
  const e = asError(err);
  return e.status === 429;
}

function parseRetryInSeconds(err: unknown): number | null {
  const msg = asError(err).error?.message || asError(err).message || "";
  const m = msg.match(/try again in\s+((?:\d+h)?(?:\d+m)?(?:[\d.]+s)?)/i);
  if (!m) return null;
  let total = 0;
  const h = m[1].match(/(\d+)h/);
  const mn = m[1].match(/(\d+)m/);
  const s = m[1].match(/([\d.]+)s/);
  if (h) total += parseInt(h[1], 10) * 3600;
  if (mn) total += parseInt(mn[1], 10) * 60;
  if (s) total += parseFloat(s[1]);
  return total > 0 ? Math.ceil(total) : null;
}

function humanizeSeconds(s: number): string {
  if (s < 60) return `${s} seconds`;
  const m = Math.ceil(s / 60);
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"}`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm ? `${h}h ${rm}m` : `${h} hour${h === 1 ? "" : "s"}`;
}

function friendlyError(err: unknown): string {
  if (isRateLimit(err)) {
    const s = parseRetryInSeconds(err);
    const when = s
      ? ` Try again in ~${humanizeSeconds(s)}.`
      : " Please try again in a minute.";
    return `Chat is getting a lot of traffic.${when}`;
  }
  const e = asError(err);
  if (e.status === 401 || e.status === 403) {
    return "Chat is misconfigured on the server.";
  }
  return "Chat hit a snag. Please try again shortly.";
}

/**
 * Parse the structured intro response to extract greeting and questions.
 * Expected format:
 *   GREETING: <greeting text>
 *   QUESTIONS:
 *   - question 1
 *   - question 2
 *   ...
 */
function parseIntroResponse(response: string): {
  greeting: string;
  questions: string[];
} {
  // Try to parse structured format
  const greetingMatch = response.match(/GREETING:\s*(.+?)(?=\nQUESTIONS:|$)/is);
  const questionsMatch = response.match(/QUESTIONS:\s*([\s\S]*)/i);

  let greeting = greetingMatch?.[1]?.trim() || response.trim();
  const questions: string[] = [];

  if (questionsMatch) {
    const questionsText = questionsMatch[1];
    const lines = questionsText.split("\n");
    for (const line of lines) {
      const cleaned = line.replace(/^[-•*]\s*/, "").trim();
      if (cleaned && cleaned.length > 5 && cleaned.length < 60) {
        questions.push(cleaned);
      }
    }
  }

  // If parsing failed, clean up the greeting (remove any stray format markers)
  greeting = greeting
    .replace(/^GREETING:\s*/i, "")
    .replace(/\nQUESTIONS:[\s\S]*/i, "")
    .trim();

  // Take at most 4 questions
  return { greeting, questions: questions.slice(0, 4) };
}

// =============================================================================
// RAG
// =============================================================================

function isRagAvailable(): boolean {
  try {
    const index = getEmbeddingsIndex();
    return Array.isArray(index.chunks) && index.chunks.length > 0;
  } catch {
    return false;
  }
}

// =============================================================================
// RATE LIMIT — naive in-memory IP bucket
// =============================================================================

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12; // bumped from 8 since OpenAI handles load better
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { ok: boolean; retryIn?: number } {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryIn: bucket.resetAt - now };
  }
  bucket.count++;
  return { ok: true };
}

// =============================================================================
// STREAMING HELPERS
// =============================================================================

type ChatMessage = { role: "user" | "assistant"; content: string };

interface UsageStats {
  promptTokens: number;
  completionTokens: number;
  cachedTokens: number;
  cacheHitRate: number;
}

interface StreamResult {
  stream: AsyncIterable<string>;
  model: string;
  provider: "openai" | "groq";
  getUsage: () => UsageStats | null;
}

async function streamOpenAI(
  openai: OpenAI,
  model: string,
  systemPrompt: string,
  messages: ChatMessage[],
  maxTokens: number,
): Promise<StreamResult> {
  const completion = await openai.chat.completions.create({
    model,
    stream: true,
    stream_options: { include_usage: true },
    temperature: 0.6,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
  });

  let usage: UsageStats | null = null;

  const stream = (async function* () {
    for await (const chunk of completion) {
      // Capture usage from the final chunk
      if (chunk.usage) {
        const promptTokens = chunk.usage.prompt_tokens ?? 0;
        const completionTokens = chunk.usage.completion_tokens ?? 0;
        // OpenAI returns cached tokens in prompt_tokens_details
        const details = chunk.usage as {
          prompt_tokens_details?: { cached_tokens?: number };
        };
        const cachedTokens = details.prompt_tokens_details?.cached_tokens ?? 0;
        const cacheHitRate = promptTokens > 0 ? cachedTokens / promptTokens : 0;
        
        usage = { promptTokens, completionTokens, cachedTokens, cacheHitRate };
        
        console.log(
          `[openai] usage: ${promptTokens} prompt (${cachedTokens} cached = ${(cacheHitRate * 100).toFixed(1)}%), ${completionTokens} completion`
        );
      }
      
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  })();

  return { stream, model, provider: "openai", getUsage: () => usage };
}

async function streamGroq(
  groq: Groq,
  model: string,
  systemPrompt: string,
  messages: ChatMessage[],
  maxTokens: number,
): Promise<StreamResult> {
  const completion = await groq.chat.completions.create({
    model,
    stream: true,
    temperature: 0.55,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
  });

  const stream = (async function* () {
    for await (const chunk of completion) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  })();

  // Groq doesn't support prompt caching
  return { stream, model, provider: "groq", getUsage: () => null };
}

// =============================================================================
// HANDLER
// =============================================================================

type ChatBody = {
  messages: ChatMessage[];
  jdText?: string;
};

export async function POST(req: Request) {
  const openaiKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (!openaiKey && !groqKey) {
    return new Response("No LLM API keys configured", { status: 500 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return new Response(
      JSON.stringify({
        error: `Slow down — please wait ~${Math.ceil((limit.retryIn ?? 60_000) / 1000)}s.`,
      }),
      { status: 429, headers: { "content-type": "application/json" } },
    );
  }

  const body = (await req.json().catch(() => null)) as ChatBody | null;
  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response("Bad request", { status: 400 });
  }

  const messages = body.messages
    .filter(
      (m) =>
        m &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        (m.role === "user" || m.role === "assistant"),
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return new Response("No user message", { status: 400 });

  const isIntro = lastUser.content.trim() === INTRO_TRIGGER;
  const jdText = body.jdText?.slice(0, 20_000) ?? "";
  const hasJD = jdText.trim().length > 0;

  if (hasJD && !isIntro) {
    const idx = messages.lastIndexOf(lastUser);
    messages[idx] = {
      role: "user",
      content: `[JD attached]\n\n${jdText}\n\n---\n\nVisitor question: ${lastUser.content}`,
    };
  }

  // =============================================================================
  // Build system prompt
  // =============================================================================

  let systemPrompt: string;
  let retrieval: RetrievalResult | null = null;

  if (isIntro) {
    const randomSnippet = getRandomChunkSnippet();
    systemPrompt = buildIntroSystemPrompt(randomSnippet ?? undefined);
  } else if (isRagAvailable()) {
    try {
      const recentUserMessages = messages
        .filter((m) => m.role === "user")
        .slice(-3)
        .map((m) => m.content)
        .join(" ")
        .slice(0, 500);

      retrieval = await ragSearch(recentUserMessages);
      systemPrompt = buildRagSystemPrompt(retrieval.context);
    } catch (err) {
      console.warn("[chat] RAG failed, using static prompt:", err);
      systemPrompt = await buildSystemPrompt();
    }
  } else {
    systemPrompt = await buildSystemPrompt();
  }

  const systemTokenEstimate = Math.ceil(
    systemPrompt.length / RAG_CONFIG.CHARS_PER_TOKEN,
  );

  // =============================================================================
  // Attempt streaming — intro uses Groq 8B, Q&A uses OpenAI with Groq fallback
  // =============================================================================

  const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;
  const groq = groqKey ? new Groq({ apiKey: groqKey }) : null;

  const maxTokens = isIntro ? 200 : 1024;
  let streamResult: StreamResult | null = null;
  let lastError: unknown = null;

  if (isIntro) {
    // Intro: Groq 8B only (fast, cheap, good enough for greeting)
    if (groq) {
      try {
        streamResult = await streamGroq(
          groq,
          GROQ_INTRO_MODEL,
          systemPrompt,
          messages,
          maxTokens,
        );
      } catch (err) {
        lastError = err;
        console.warn("[chat] Groq intro failed:", err);
      }
    }
  } else {
    // Q&A: OpenAI primary, Groq fallback chain
    if (openai) {
      try {
        streamResult = await streamOpenAI(
          openai,
          OPENAI_MODEL,
          systemPrompt,
          messages,
          maxTokens,
        );
      } catch (err) {
        lastError = err;
        console.warn("[chat] OpenAI failed, trying Groq fallback:", err);
      }
    }

    // Fallback to Groq if OpenAI failed or unavailable
    if (!streamResult && groq) {
      for (const model of [GROQ_FALLBACK_PRIMARY, GROQ_FALLBACK_SECONDARY]) {
        try {
          streamResult = await streamGroq(
            groq,
            model,
            systemPrompt,
            messages,
            maxTokens,
          );
          break;
        } catch (err) {
          lastError = err;
          console.warn(`[chat] Groq ${model} failed:`, err);
        }
      }
    }
  }

  // =============================================================================
  // Build SSE response
  // =============================================================================

  const encoder = new TextEncoder();

  const bodyStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      if (!streamResult) {
        const friendly = friendlyError(lastError);
        console.error("[chat] all providers failed:", lastError);
        send("meta", { model: null, provider: null, failed: true });
        send("error", { message: friendly });
        send("done", {});
        controller.close();
        return;
      }

      send("meta", {
        model: streamResult.model,
        provider: streamResult.provider,
        rag: retrieval !== null,
        systemTokens: systemTokenEstimate,
        retrieval: retrieval
          ? {
              topScore: Number(retrieval.topScore.toFixed(3)),
              included: retrieval.includedCount,
              considered: retrieval.trace.length,
              contextTokens: retrieval.estimatedTokens,
              searchMs: retrieval.searchMs,
            }
          : null,
      });

      try {
        if (isIntro) {
          // For intro, collect full response to parse greeting + questions
          let fullResponse = "";
          for await (const delta of streamResult.stream) {
            fullResponse += delta;
          }

          // Parse the structured response
          const { greeting, questions } = parseIntroResponse(fullResponse);

          // Stream the greeting as deltas (for nice typing effect)
          const words = greeting.split(" ");
          for (let i = 0; i < words.length; i++) {
            send("delta", (i > 0 ? " " : "") + words[i]);
          }

          // Send questions as separate event
          if (questions.length > 0) {
            send("questions", questions);
          }
        } else {
          // Normal Q&A: stream deltas as they come
          for await (const delta of streamResult.stream) {
            send("delta", delta);
          }
        }
        
        // Send usage stats if available (OpenAI only)
        const usage = streamResult.getUsage();
        if (usage) {
          send("usage", {
            promptTokens: usage.promptTokens,
            completionTokens: usage.completionTokens,
            cachedTokens: usage.cachedTokens,
            cacheHitRate: Number((usage.cacheHitRate * 100).toFixed(1)),
          });
        }
        
        send("done", {});
      } catch (err) {
        const friendly = friendlyError(err);
        console.error("[chat] mid-stream error:", err);
        send("error", { message: friendly });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(bodyStream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
