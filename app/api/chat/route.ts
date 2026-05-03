import Groq from "groq-sdk";
import {
  buildSystemPrompt,
  buildIntroSystemPrompt,
} from "@/lib/keshav-context";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

// =============================================================================
// MODEL ROUTING — simple now
// =============================================================================
//
// Default model is the 70B. The 8B kept hedging like a generic LLM ("I don't
// have personal preferences or emotions") and breaking the first-person
// Keshav persona, so we no longer use it for real Q&A.
//
// The ONE exception is the [INTRO] greeting on chat-open: 1-2 sentences of
// scripted hello where speed matters more than nuance, and the persona is
// simple enough that 8B can't stray.

const FAST_MODEL = "llama-3.1-8b-instant";       // intro only
const QUALITY_MODEL = "llama-3.3-70b-versatile"; // everything else

const INTRO_TRIGGER = "[INTRO]";

// =============================================================================
// RATE LIMIT — naive in-memory IP bucket, fine for a portfolio
// =============================================================================

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 8; // 8 messages per minute per IP
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
// HANDLER
// =============================================================================

type ChatMessage = { role: "user" | "assistant"; content: string };
type ChatBody = {
  messages: ChatMessage[];
  jdText?: string;
};

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response("GROQ_API_KEY not configured", { status: 500 });
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

  // Validate + clamp message sizes
  const messages = body.messages
    .filter(
      (m) =>
        m && typeof m.content === "string" && m.content.length > 0 &&
        (m.role === "user" || m.role === "assistant"),
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return new Response("No user message", { status: 400 });

  const isIntro = lastUser.content.trim() === INTRO_TRIGGER;
  const jdText = body.jdText?.slice(0, 20_000) ?? "";
  const hasJD = jdText.trim().length > 0;

  // If the user has uploaded a JD, prepend it to their last message so the
  // model sees both the JD and the visitor's question in the same turn.
  if (hasJD && !isIntro) {
    const idx = messages.lastIndexOf(lastUser);
    messages[idx] = {
      role: "user",
      content: `[JD attached]\n\n${jdText}\n\n---\n\nVisitor question: ${lastUser.content}`,
    };
  }

  // Pick model + system prompt:
  //   • intro greeting → 8B + tiny intro-only prompt (under 1K tokens, fits
  //     8B's 6K TPM cap with room for the response)
  //   • everything else → 70B + full context (persona + structured profile
  //     + deep notes + live GitHub)
  const model = isIntro ? FAST_MODEL : QUALITY_MODEL;
  const systemPrompt = isIntro
    ? buildIntroSystemPrompt()
    : await buildSystemPrompt();

  const groq = new Groq({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      send("meta", { model });

      try {
        const completion = await groq.chat.completions.create({
          model,
          stream: true,
          temperature: 0.55,
          max_tokens: isIntro ? 200 : 1024,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
        });

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) send("delta", delta);
        }
        send("done", {});
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        send("error", { message: msg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
