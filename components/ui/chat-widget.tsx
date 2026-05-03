"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";
import {
  MessageCircle,
  Send,
  Sparkles,
  Paperclip,
  X,
  FileText,
  Loader2,
} from "lucide-react";

// =============================================================================
// CHAT WIDGET — floating bubble bottom-left, expandable panel.
// Streams via SSE from /api/chat. Optional JD upload via /api/chat/parse-file.
// =============================================================================

type Msg = {
  role: "user" | "assistant";
  content: string;
  model?: string;
  hidden?: boolean; // true for the silent [INTRO] trigger; not rendered
};
type Attachment = { filename: string; chars: number; text: string };

const INTRO_TRIGGER = "[INTRO]";
const STORAGE_KEY = "keshav-chat-history-v1";
const STORAGE_MAX_BYTES = 200 * 1024; // 200 KB cap
const STORAGE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

const FALLBACK_QUESTIONS = [
  "What projects have you built?",
  "Tell me about your AI work",
  "What simulations have you made?",
  "What's your tech stack?",
];

type StoredHistory = { messages: Msg[]; savedAt: number };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Mount only on client + restore prior conversation from localStorage if any.
  // If we restored a non-empty history, we skip the auto-intro since the
  // visitor already has context from their previous session.
  useEffect(() => {
    setEnabled(true);
    if (typeof localStorage === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as StoredHistory;
      if (
        !stored ||
        !Array.isArray(stored.messages) ||
        Date.now() - stored.savedAt > STORAGE_MAX_AGE_MS
      ) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      // Drop any half-streamed assistant placeholder
      const restored = stored.messages.filter(
        (m, i) =>
          !(
            m.role === "assistant" &&
            !m.content &&
            i === stored.messages.length - 1
          ),
      );
      if (restored.length > 0) {
        setMessages(restored);
        introFiredRef.current = true; // already had a session
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  // Persist messages on change. Skip while streaming (avoid saving placeholder)
  // and skip the empty state. Soft-cap at 200 KB to be safe.
  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    if (streaming) return;
    if (messages.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    try {
      const payload: StoredHistory = {
        messages: messages.filter((m, i) => {
          // Strip empty trailing assistant placeholder if any
          if (
            m.role === "assistant" &&
            !m.content &&
            i === messages.length - 1
          )
            return false;
          return true;
        }),
        savedAt: Date.now(),
      };
      const serialized = JSON.stringify(payload);
      if (serialized.length > STORAGE_MAX_BYTES) {
        // Trim oldest until we fit
        let trimmed = payload.messages;
        while (trimmed.length > 4) {
          trimmed = trimmed.slice(2);
          const candidate = JSON.stringify({ ...payload, messages: trimmed });
          if (candidate.length <= STORAGE_MAX_BYTES) {
            localStorage.setItem(STORAGE_KEY, candidate);
            return;
          }
        }
      }
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch {
      /* quota exceeded or disabled — silently ignore */
    }
  }, [messages, streaming]);

  // Auto-scroll on new content
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // Forward-declared ref for the intro-fire gate — actual `useEffect` lives
  // below `sendMessage` since it depends on it.
  const introFiredRef = useRef(false);

  const sendMessage = useCallback(
    async (text: string, opts: { hidden?: boolean } = {}) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      const userMsg: Msg = {
        role: "user",
        content: trimmed,
        hidden: opts.hidden,
      };
      const baseHistory = [...messages, userMsg];
      const placeholder: Msg = { role: "assistant", content: "" };
      setMessages([...baseHistory, placeholder]);
      if (!opts.hidden) setInput("");
      setError(null);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            messages: baseHistory.map(({ role, content }) => ({ role, content })),
            jdText: attachment?.text,
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const errMsg = await res.text().catch(() => "Request failed");
          throw new Error(errMsg);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let assistantText = "";
        let assistantModel: string | undefined;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          // Parse SSE: events delimited by \n\n
          let idx;
          while ((idx = buf.indexOf("\n\n")) !== -1) {
            const event = buf.slice(0, idx);
            buf = buf.slice(idx + 2);
            const lines = event.split("\n");
            const evtName =
              lines.find((l) => l.startsWith("event: "))?.slice(7) ?? "";
            const dataLine = lines.find((l) => l.startsWith("data: "));
            if (!dataLine) continue;
            const data = JSON.parse(dataLine.slice(6));

            if (evtName === "delta") {
              assistantText += String(data);
              setMessages((curr) => {
                const next = [...curr];
                next[next.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                  model: assistantModel,
                };
                return next;
              });
            } else if (evtName === "meta") {
              if (data.model) assistantModel = data.model as string;
            } else if (evtName === "questions") {
              // Dynamic questions from the intro
              if (Array.isArray(data) && data.length > 0) {
                setSuggestedQuestions(data as string[]);
              }
            } else if (evtName === "error") {
              throw new Error(data.message ?? "Stream error");
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Something went wrong";
        setError(msg);
        setMessages((curr) => curr.slice(0, -1)); // drop the empty placeholder
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, streaming, attachment],
  );

  // Fire a fresh intro any time the chat is opened (or "New" cleared) with
  // an empty thread.
  useEffect(() => {
    if (!open) return;
    if (introFiredRef.current) return;
    if (messages.length > 0) return;
    introFiredRef.current = true;
    sendMessage(INTRO_TRIGGER, { hidden: true });
  }, [open, messages.length, sendMessage]);

  const onUploadFile = useCallback(async (file: File) => {
    setUploadingFile(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/chat/parse-file", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setAttachment({
        filename: json.filename,
        chars: json.chars,
        text: json.text,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
  }, []);

  const reset = useCallback(() => {
    if (streaming) stop();
    setMessages([]);
    setAttachment(null);
    setError(null);
    setSuggestedQuestions([]); // clear dynamic questions for fresh intro
    introFiredRef.current = false; // re-fire intro on next render
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, [streaming, stop]);

  const placeholder = useMemo(
    () =>
      attachment
        ? "Ask for a tailored pitch, or anything else…"
        : "Ask anything about Keshav…",
    [attachment],
  );

  if (!enabled || typeof document === "undefined") return null;

  // Render into <body> via a portal. The widget needs to be in the top stacking
  // context — `position: fixed` breaks if any ancestor has `transform`,
  // `filter`, or `will-change: transform`, and we have a few of those (the
  // backdrop's translate3d, framer-motion's lazy provider, etc.).
  return createPortal(
    <>
      {/* Floating launcher — plain <button> + inline style so it can't lose
          its `position: fixed` to a transformed framer ancestor or hydration
          quirk. Entrance animation done with a CSS keyframe defined inline. */}
      <style>{`
        @keyframes chat-launcher-in {
          from { opacity: 0; transform: scale(0.92) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Ask about Keshav"}
        data-spirit="button"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "1.5rem",
          zIndex: 83,
          animation: "chat-launcher-in 360ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both",
        }}
        className="flex h-12 items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/15 px-4 text-sm font-medium text-violet-200 shadow-[0_8px_24px_-8px_rgba(124,58,237,0.45)] backdrop-blur transition hover:bg-violet-500/25"
      >
        {open ? (
          <X className="h-4 w-4" />
        ) : (
          <>
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Ask about Keshav</span>
            <Sparkles className="h-3.5 w-3.5 text-violet-300/80" />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            style={{
              position: "fixed",
              bottom: "6rem",
              left: "1.5rem",
              zIndex: 83,
            }}
            className="flex h-[min(640px,80vh)] w-[min(440px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-edge bg-surface/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-edge px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-display text-sm font-semibold text-ink">
                  Ask about Keshav
                </span>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={reset}
                    className="rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted/70 transition hover:bg-canvas hover:text-ink"
                  >
                    new
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition hover:bg-canvas hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages — `overscroll-contain` traps wheel events inside the
                panel so reaching top/bottom doesn't scroll the page. */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {messages
                .filter((m) => !m.hidden)
                .map((m, i, visible) => (
                  <Message
                    key={i}
                    msg={m}
                    streaming={
                      streaming &&
                      // The currently-streaming bubble is always the last in
                      // the underlying messages array; map its index back to
                      // the visible-only filtered list.
                      i === visible.length - 1 &&
                      messages[messages.length - 1] === m
                    }
                  />
                ))}

              {/* Suggested questions — show after intro, hide once user asks */}
              {!streaming &&
                messages.filter((m) => !m.hidden).length === 1 &&
                messages.some((m) => m.role === "assistant" && m.content) && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(suggestedQuestions.length > 0
                      ? suggestedQuestions
                      : FALLBACK_QUESTIONS
                    ).map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200 transition hover:border-violet-500/50 hover:bg-violet-500/20"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

              {error && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                  {error}
                </div>
              )}
            </div>

            {/* Attachment chip */}
            {attachment && (
              <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs">
                <FileText className="h-3.5 w-3.5 text-violet-300" />
                <div className="flex-1 truncate">
                  <span className="font-mono text-violet-200">
                    {attachment.filename}
                  </span>
                  <span className="ml-2 text-muted/70">
                    {(attachment.chars / 1000).toFixed(1)}k chars
                  </span>
                </div>
                <button
                  onClick={() => setAttachment(null)}
                  aria-label="Remove attachment"
                  className="text-muted/60 transition hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (streaming) {
                  stop();
                  return;
                }
                sendMessage(input);
              }}
              className="border-t border-edge bg-canvas/40 px-3 py-2"
            >
              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.md,.markdown"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUploadFile(f);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile || streaming}
                  aria-label="Attach JD (PDF / DOCX / TXT)"
                  className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition hover:bg-canvas hover:text-ink disabled:opacity-50"
                >
                  {uploadingFile ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Paperclip className="h-4 w-4" />
                  )}
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!streaming) sendMessage(input);
                    }
                  }}
                  rows={1}
                  placeholder={placeholder}
                  className="flex-1 resize-none rounded-md bg-transparent px-2 py-2 text-sm text-ink outline-none placeholder:text-muted/50"
                  style={{ maxHeight: 120 }}
                />
                <button
                  type="submit"
                  disabled={!streaming && !input.trim()}
                  aria-label={streaming ? "Stop" : "Send"}
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-violet-500/20 text-violet-200 transition hover:bg-violet-500/30 disabled:opacity-40"
                >
                  {streaming ? (
                    <span className="h-2.5 w-2.5 rounded-sm bg-current" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>
          </m.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}

// =============================================================================
// MESSAGE BUBBLE — minimal markdown for assistant: paragraphs, bold, code
// =============================================================================

function Message({ msg, streaming }: { msg: Msg; streaming: boolean }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-violet-500/20 px-3.5 py-2 text-sm text-ink">
          {msg.content}
        </div>
      </div>
    );
  }

  const empty = !msg.content && streaming;
  return (
    <div className="flex flex-col gap-1">
      <div className="max-w-[92%] text-sm text-ink/95">
        {empty ? (
          <span className="inline-flex items-center gap-1 text-muted">
            <Loader2 className="h-3 w-3 animate-spin" /> thinking…
          </span>
        ) : (
          <RenderedMarkdown text={msg.content} />
        )}
      </div>
      {msg.model && !empty && (
        <span className="font-mono text-[10px] text-muted/50">
          via {msg.model}
        </span>
      )}
    </div>
  );
}

// =============================================================================
// MINIMAL MARKDOWN RENDERER
// Handles: headings (rendered as bold lines, no big-text), paragraphs,
// bullet + numbered lists, **bold**, `code`, [text](url), bare URLs (auto-link).
// Skips full markdown libs to keep the bundle tiny.
// =============================================================================

function RenderedMarkdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-2 leading-relaxed">
      {blocks.map((block, i) => {
        const lines = block.split("\n");

        // Heading — render as bold standalone line, not a giant heading
        const headingMatch = block.match(/^#{1,6}\s+(.*)$/);
        if (headingMatch && lines.length === 1) {
          return (
            <p key={i} className="font-semibold text-ink">
              <Inline text={headingMatch[1]} />
            </p>
          );
        }

        // Bullet list
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={i} className="ml-4 list-disc space-y-1 marker:text-muted/60">
              {lines.map((l, j) => (
                <li key={j}>
                  <Inline text={l.replace(/^\s*[-*]\s+/, "")} />
                </li>
              ))}
            </ul>
          );
        }

        // Numbered list
        if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
          return (
            <ol key={i} className="ml-5 list-decimal space-y-1 marker:text-muted/60">
              {lines.map((l, j) => (
                <li key={j}>
                  <Inline text={l.replace(/^\s*\d+\.\s+/, "")} />
                </li>
              ))}
            </ol>
          );
        }

        // Mixed plain paragraph — preserve internal newlines as spaces
        return (
          <p key={i}>
            <Inline text={block.replace(/\n/g, " ")} />
          </p>
        );
      })}
    </div>
  );
}

// Inline parser — order matters:
//   1. Code spans  (backticks) — eat first so URLs/bold inside aren't reparsed
//   2. Markdown links [text](url)
//   3. Bare URLs (http/https/mailto)
//   4. Bold (**text**)
function Inline({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let key = 0;

  // Combined regex matched in order of appearance.
  // Capture groups:
  //   g1 = code span content (between backticks, no surrounding ticks)
  //   g2 = link text, g3 = link url
  //   g4 = bare url
  //   g5 = bold content
  const re =
    /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|((?:https?:\/\/|mailto:)[^\s<>"')]+)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(
        <code
          key={key++}
          className="rounded bg-canvas/80 px-1 py-0.5 font-mono text-[12px] text-violet-200"
        >
          {m[1]}
        </code>,
      );
    } else if (m[2] !== undefined && m[3] !== undefined) {
      out.push(
        <Anchor key={key++} href={m[3]}>
          {m[2]}
        </Anchor>,
      );
    } else if (m[4] !== undefined) {
      const url = m[4];
      // Trim trailing punctuation that's likely sentence-end, not URL
      const stripped = url.replace(/[.,!?;:)]+$/, "");
      const trailing = url.slice(stripped.length);
      out.push(
        <Anchor key={key++} href={stripped}>
          {prettyUrl(stripped)}
        </Anchor>,
      );
      if (trailing) out.push(trailing);
    } else if (m[5] !== undefined) {
      out.push(
        <strong key={key++} className="font-semibold text-ink">
          {m[5]}
        </strong>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

function Anchor({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-violet-300 underline decoration-violet-400/40 underline-offset-2 transition hover:text-violet-200 hover:decoration-violet-300"
    >
      {children}
    </a>
  );
}

// Strip protocol + trailing slash for nicer in-chat display.
function prettyUrl(url: string) {
  if (url.startsWith("mailto:")) return url.slice(7);
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
