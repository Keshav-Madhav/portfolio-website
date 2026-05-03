"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import {
  SpacesProvider,
  SpaceProvider,
  useSpace,
  useCursors,
  useMembers,
} from "@ably/spaces/react";
import { Realtime, type Message } from "ably";
import Spaces from "@ably/spaces";
import { AnimatePresence, m } from "framer-motion";

import { getOrCreateIdentity } from "@/lib/cursor-identity";
import {
  REACTIONS,
  REACTIONS_BY_KEY,
  ReactionIcon,
  type ReactionKey,
} from "@/lib/reaction-icons";

const SPACE_NAME = "portfolio-home";
const REACTION_CHANNEL = "portfolio-reactions";
const CLICK_CHANNEL = "portfolio-clicks";
const MESSAGE_CHANNEL = "portfolio-messages";
const FAR_OFFSCREEN = -10000;

// DEBUG MODE: Set to true to see all effects following your cursor
const DEBUG_EFFECTS = false;

function getOrCreateClientId() {
  if (typeof window === "undefined") return "anon";
  let id = localStorage.getItem("ably-client-id");
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `c-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("ably-client-id", id);
  }
  return id;
}

// Imperative scroll compensation: instead of holding scrollY in React state
// (which would re-render every cursor + reaction on every scroll frame),
// we apply a translateY directly to a ref'd wrapper via rAF. Children render
// at document coords (pageX, pageY); the wrapper offsets the whole layer by
// -scrollY so children land at the correct viewport position. Net effect:
// zero React re-renders during scroll.
function useScrollCompensateRef<T extends HTMLElement>(): RefObject<T> {
  const ref = useRef<T>(null);
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      const el = ref.current;
      if (el) el.style.transform = `translate3d(0, ${-window.scrollY}px, 0)`;
      raf = 0;
    };
    apply();
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

// Preload reaction PNGs once. Without this, the first key-press has a flash
// of empty space while the browser fetches the image.
function preloadReactionAssets() {
  if (typeof window === "undefined") return;
  REACTIONS.forEach(({ src }) => {
    const img = new window.Image();
    img.src = src;
  });
}

export default function Multiplayer() {
  const [clients, setClients] = useState<{
    ably: Realtime;
    spaces: Spaces;
  } | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MULTIPLAYER_ENABLED !== "1") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    preloadReactionAssets();

    const clientId = getOrCreateClientId();
    const ably = new Realtime({
      authUrl: "/api/ably/token",
      authParams: { clientId },
      clientId,
      echoMessages: false,
    });
    const spaces = new Spaces(ably);
    setClients({ ably, spaces });

    return () => {
      ably.close();
    };
  }, []);

  if (!clients) return null;

  return (
    <AblyProvider client={clients.ably}>
      <ChannelProvider channelName={REACTION_CHANNEL}>
        <ChannelProvider channelName={CLICK_CHANNEL}>
          <ChannelProvider channelName={MESSAGE_CHANNEL}>
            <SpacesProvider client={clients.spaces}>
              <SpaceProvider name={SPACE_NAME}>
            <SpaceEnter />
            <CursorLayer />
            <ClicksLayer />
            <ReactionsLayer />
            <MessagesLayer />
            <PresenceHint />
            {DEBUG_EFFECTS && <DebugEffectsOverlay />}
              </SpaceProvider>
            </SpacesProvider>
          </ChannelProvider>
        </ChannelProvider>
      </ChannelProvider>
    </AblyProvider>
  );
}

function SpaceEnter() {
  const { space } = useSpace();

  useEffect(() => {
    if (!space) return;
    let cancelled = false;
    const ident = getOrCreateIdentity();

    space
      .enter({ name: ident.name, color: ident.color })
      .catch((err) => {
        if (!cancelled) console.warn("[multiplayer] space.enter failed", err);
      });

    return () => {
      cancelled = true;
      space.leave().catch(() => {});
    };
  }, [space]);

  return null;
}

function CursorLayer() {
  const { space, cursors } = useCursors({ returnCursors: true });
  const { self, others } = useMembers();
  const isEntered = !!self;
  const layerRef = useScrollCompensateRef<HTMLDivElement>();

  useEffect(() => {
    if (!space || !isEntered) return;
    let raf = 0;
    let clientX: number | null = null;
    let clientY: number | null = null;
    let lastX = 0;
    let lastY = 0;

    const safeSet = (position: { x: number; y: number }) => {
      try {
        const result = space.cursors.set({ position }) as unknown;
        // .set() returns a Promise that rejects with ERR_NOT_ENTERED_SPACE
        // during reconnects / tab-switches. Swallow it.
        if (
          result &&
          typeof (result as Promise<unknown>).then === "function"
        ) {
          (result as Promise<unknown>).catch(() => {});
        }
      } catch {
        /* sync throw fallback */
      }
    };

    const flush = () => {
      safeSet({ x: lastX, y: lastY });
      raf = 0;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(flush);
    };

    const onMove = (e: PointerEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;
      lastX = e.pageX;
      lastY = e.pageY;
      schedule();
    };

    // pageY = clientY + scrollY. The mouse didn't move but scroll did, so
    // pageY changed. Re-broadcast so remotes see continuous motion instead
    // of a teleport jump on the next pointermove.
    const onScroll = () => {
      if (clientX == null || clientY == null) return;
      lastX = clientX + window.scrollX;
      lastY = clientY + window.scrollY;
      schedule();
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      clientX = clientY = null;
      safeSet({ x: FAR_OFFSCREEN, y: FAR_OFFSCREEN });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [space, isEntered]);

  // Map clientId → color. Member presence rarely changes, so this Map is
  // stable across cursor updates and only recomputes on join/leave.
  const colorByClientId = useMemo(() => {
    const m = new Map<string, string>();
    others?.forEach((member) => {
      const profile = (member.profileData ?? {}) as { color?: string };
      m.set(member.clientId ?? "", profile.color ?? "#888");
    });
    return m;
  }, [others]);

  // Project Ably's cursor map into a stable list of primitives. With memo'd
  // <Cursor>, only entries whose (x,y,color) actually changed will re-render.
  const cursorList = useMemo(() => {
    if (!cursors) return [];
    const out: { id: string; x: number; y: number; color: string }[] = [];
    for (const entry of Object.values(cursors)) {
      const pos = entry.cursorUpdate?.position;
      if (!pos || pos.x < -1000) continue;
      const color = colorByClientId.get(entry.member.clientId ?? "");
      if (!color) continue;
      out.push({
        id: entry.member.connectionId,
        x: pos.x,
        y: pos.y,
        color,
      });
    }
    return out;
  }, [cursors, colorByClientId]);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-[80] will-change-transform"
    >
      <AnimatePresence>
        {cursorList.map(({ id, x, y, color }) => (
          <Cursor key={id} x={x} y={y} color={color} />
        ))}
      </AnimatePresence>
    </div>
  );
}

const Cursor = memo(function Cursor({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, x, y }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{
        x: { duration: 0.05, ease: "linear" },
        y: { duration: 0.05, ease: "linear" },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      }}
      className="absolute left-0 top-0 will-change-transform"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 22 22"
        fill="none"
        style={{ filter: `drop-shadow(0 1px 2px ${color}40)` }}
      >
        <path
          d="M3 2.5L19 9.2L10.2 12L7 19L3 2.5Z"
          fill={`${color}1f`}
          stroke={color}
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </m.div>
  );
});

type FloatingReaction = {
  id: number;
  x: number;
  y: number;
  key: ReactionKey;
  drift: number;
  rotate: number;
};

function ReactionsLayer() {
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const idRef = useRef(0);
  const layerRef = useScrollCompensateRef<HTMLDivElement>();

  // Stable across renders — refs + setState are stable, so no deps needed.
  const spawn = useCallback((x: number, y: number, key: ReactionKey) => {
    const id = ++idRef.current;
    const drift = Math.random() * 40 - 20;
    const rotate = Math.random() * 30 - 15;
    setReactions((r) => [...r, { id, x, y, key, drift, rotate }]);
    setTimeout(() => {
      setReactions((r) => r.filter((rx) => rx.id !== id));
    }, 2200);
  }, []);

  // Stable channel callback — without useCallback, every render hands
  // useChannel a new function reference and triggers a re-subscribe.
  const onReaction = useCallback(
    (msg: Message) => {
      const data = msg.data as { x: number; y: number; key: string };
      const k = data.key as ReactionKey;
      if (REACTIONS_BY_KEY[k]) spawn(data.x, data.y, k);
    },
    [spawn],
  );

  const { channel } = useChannel(REACTION_CHANNEL, "reaction", onReaction);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      cursorRef.current = { x: e.pageX, y: e.pageY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Only handle "1".."9" — any other key (arrows, letters, etc.) makes
      // Number(e.key) NaN, which would slip past `< 0 / >= length` and crash
      // on REACTIONS[NaN].
      if (e.key.length !== 1 || e.key < "1" || e.key > "9") return;
      const idx = e.key.charCodeAt(0) - 49; // '1' = 49
      if (idx >= REACTIONS.length) return;
      if (!cursorRef.current) return;

      const reactionKey = REACTIONS[idx].key;
      const { x, y } = cursorRef.current;
      spawn(x, y, reactionKey);
      channel.publish("reaction", { x, y, key: reactionKey });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [channel, spawn]);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-[81] will-change-transform"
    >
      <AnimatePresence>
        {reactions.map((r) => (
          <FloatingReactionView
            key={r.id}
            x={r.x}
            y={r.y}
            reactionKey={r.key}
            drift={r.drift}
            rotate={r.rotate}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

const FloatingReactionView = memo(function FloatingReactionView({
  x,
  y,
  reactionKey,
  drift,
  rotate,
}: {
  x: number;
  y: number;
  reactionKey: ReactionKey;
  drift: number;
  rotate: number;
}) {
  return (
    <m.div
      initial={{
        opacity: 0,
        scale: 0.3,
        x: x - 32,
        y: y - 32,
        rotate: 0,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.3, 1.25, 1, 0.85],
        y: y - 130,
        x: x - 32 + drift,
        rotate: rotate,
      }}
      transition={{
        duration: 2.2,
        ease: [0.22, 1, 0.36, 1],
        opacity: { times: [0, 0.15, 0.7, 1], duration: 2.2 },
      }}
      className="absolute left-0 top-0 select-none will-change-transform"
      style={{ filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.55))" }}
    >
      <ReactionIcon reactionKey={reactionKey} size={64} />
    </m.div>
  );
});

type ClickRipple = {
  id: number;
  x: number;
  y: number;
  color: string;
};

function ClicksLayer() {
  const [clicks, setClicks] = useState<ClickRipple[]>([]);
  const idRef = useRef(0);
  const layerRef = useScrollCompensateRef<HTMLDivElement>();

  const spawn = useCallback((x: number, y: number, color: string) => {
    const id = ++idRef.current;
    setClicks((c) => [...c, { id, x, y, color }]);
    setTimeout(() => {
      setClicks((c) => c.filter((click) => click.id !== id));
    }, 600);
  }, []);

  const onClickMsg = useCallback(
    (msg: Message) => {
      const data = msg.data as { x: number; y: number; color: string };
      spawn(data.x, data.y, data.color);
    },
    [spawn],
  );

  const { channel } = useChannel(CLICK_CHANNEL, "click", onClickMsg);

  useEffect(() => {
    const ident = getOrCreateIdentity();

    const onClick = (e: MouseEvent) => {
      const x = e.pageX;
      const y = e.pageY;
      spawn(x, y, ident.color);
      channel.publish("click", { x, y, color: ident.color });
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [channel, spawn]);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-[78] will-change-transform"
    >
      <AnimatePresence>
        {clicks.map((c) => (
          <ClickRippleView key={c.id} x={c.x} y={c.y} color={c.color} />
        ))}
      </AnimatePresence>
    </div>
  );
}

const ClickRippleView = memo(function ClickRippleView({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) {
  return (
    <m.div
      initial={{ opacity: 0.8, scale: 0 }}
      animate={{ opacity: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute rounded-full"
      style={{
        left: x - 20,
        top: y - 20,
        width: 40,
        height: 40,
        border: `2px solid ${color}`,
        boxShadow: `0 0 12px ${color}60`,
      }}
    />
  );
});

type SpeechBubble = {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
};

function MessagesLayer() {
  const [messages, setMessages] = useState<SpeechBubble[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputPos, setInputPos] = useState({ x: 0, y: 0 });
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);
  const layerRef = useScrollCompensateRef<HTMLDivElement>();

  const spawn = useCallback((x: number, y: number, text: string, color: string) => {
    const id = ++idRef.current;
    setMessages((m) => [...m, { id, x, y, text, color }]);
    setTimeout(() => {
      setMessages((m) => m.filter((msg) => msg.id !== id));
    }, 5000);
  }, []);

  const onMessage = useCallback(
    (msg: Message) => {
      const data = msg.data as { x: number; y: number; text: string; color: string };
      if (data.text?.trim()) {
        spawn(data.x, data.y, data.text, data.color);
      }
    },
    [spawn],
  );

  const { channel } = useChannel(MESSAGE_CHANNEL, "message", onMessage);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      cursorRef.current = { x: e.pageX, y: e.pageY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const sendMessage = useCallback(() => {
    if (!inputValue.trim() || !cursorRef.current) return;
    const ident = getOrCreateIdentity();
    const { x, y } = inputPos;
    const text = inputValue.trim().slice(0, 100);
    spawn(x, y, text, ident.color);
    channel.publish("message", { x, y, text, color: ident.color });
    setInputValue("");
    setIsTyping(false);
  }, [inputValue, inputPos, spawn, channel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;

      if (isTyping) {
        if (e.key === "Escape") {
          setIsTyping(false);
          setInputValue("");
        } else if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
        return;
      }

      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "Enter" && cursorRef.current) {
        e.preventDefault();
        setInputPos({ x: cursorRef.current.x, y: cursorRef.current.y });
        setIsTyping(true);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isTyping, sendMessage]);

  useEffect(() => {
    if (isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  return (
    <>
      <div
        ref={layerRef}
        className="pointer-events-none fixed inset-0 z-[83] will-change-transform"
      >
        <AnimatePresence>
          {messages.map((m) => (
            <SpeechBubbleView
              key={m.id}
              x={m.x}
              y={m.y}
              text={m.text}
              color={m.color}
            />
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isTyping && (
          <MessageInput
            x={inputPos.x}
            y={inputPos.y}
            value={inputValue}
            onChange={setInputValue}
            onSubmit={sendMessage}
            onCancel={() => {
              setIsTyping(false);
              setInputValue("");
            }}
            inputRef={inputRef}
          />
        )}
      </AnimatePresence>
    </>
  );
}

const SpeechBubbleView = memo(function SpeechBubbleView({
  x,
  y,
  text,
  color,
}: {
  x: number;
  y: number;
  text: string;
  color: string;
}) {
  const layerRef = useScrollCompensateRef<HTMLDivElement>();

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 will-change-transform"
    >
      <m.div
        initial={{ opacity: 0, scale: 0.5, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -10 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute"
        style={{ left: x - 2, top: y - 40 }}
      >
        <div
          className="relative max-w-[200px] rounded-2xl rounded-bl-sm px-3 py-1.5 text-sm shadow-lg"
          style={{
            backgroundColor: color,
            color: getContrastColor(color),
          }}
        >
          {text}
          <div
            className="absolute -bottom-1 left-0 h-3 w-3"
            style={{
              backgroundColor: color,
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
            }}
          />
        </div>
      </m.div>
    </div>
  );
});

function MessageInput({
  x,
  y,
  value,
  onChange,
  onSubmit,
  onCancel,
  inputRef,
}: {
  x: number;
  y: number;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  inputRef: RefObject<HTMLInputElement>;
}) {
  const layerRef = useScrollCompensateRef<HTMLDivElement>();
  const ident = getOrCreateIdentity();

  return (
    <div
      ref={layerRef}
      className="fixed inset-0 z-[84] will-change-transform"
      style={{ pointerEvents: "none" }}
    >
      <m.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute"
        style={{ left: x - 2, top: y - 48, pointerEvents: "auto" }}
      >
        <div
          className="flex items-center gap-1 rounded-full border-2 bg-surface/95 px-2 py-1 shadow-xl backdrop-blur"
          style={{ borderColor: ident.color }}
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              } else if (e.key === "Escape") {
                onCancel();
              }
            }}
            placeholder="Say something..."
            maxLength={100}
            className="w-40 bg-transparent text-sm text-ink outline-none placeholder:text-muted/50"
          />
          <button
            onClick={onSubmit}
            disabled={!value.trim()}
            className="rounded-full p-1 text-muted transition hover:text-ink disabled:opacity-40"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </m.div>
    </div>
  );
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000" : "#fff";
}

type HighlightedCursor = {
  id: string;
  x: number;
  y: number;
  color: string;
};

function PresenceHint() {
  const { others } = useMembers();
  const { cursors } = useCursors({ returnCursors: true });
  const [dismissed, setDismissed] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [highlighted, setHighlighted] = useState<HighlightedCursor | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("multiplayer-hint-dismissed") === "1") {
      setDismissed(true);
    }
  }, []);

  const count = others?.length ?? 0;

  useEffect(() => {
    if (count === 0 || dismissed) return;
    const t = setTimeout(() => {
      setDismissed(true);
      sessionStorage.setItem("multiplayer-hint-dismissed", "1");
    }, 8000);
    return () => clearTimeout(t);
  }, [count, dismissed]);

  const colorByClientId = useMemo(() => {
    const m = new Map<string, string>();
    others?.forEach((member) => {
      const profile = (member.profileData ?? {}) as { color?: string };
      m.set(member.clientId ?? "", profile.color ?? "#888");
    });
    return m;
  }, [others]);

  const cursorList = useMemo(() => {
    if (!cursors) return [];
    const out: { id: string; x: number; y: number; color: string }[] = [];
    for (const entry of Object.values(cursors)) {
      const pos = entry.cursorUpdate?.position;
      if (!pos || pos.x < -1000) continue;
      const color = colorByClientId.get(entry.member.clientId ?? "");
      if (!color) continue;
      out.push({
        id: entry.member.connectionId,
        x: pos.x,
        y: pos.y,
        color,
      });
    }
    return out;
  }, [cursors, colorByClientId]);

  const handleFindUser = useCallback(() => {
    if (cursorList.length === 0) return;

    const idx = cycleIndex % cursorList.length;
    const cursor = cursorList[idx];
    if (!cursor) return;

    const targetY = Math.max(0, cursor.y - window.innerHeight / 2);
    window.scrollTo({ top: targetY, behavior: "smooth" });

    setHighlighted(cursor);
    setTimeout(() => setHighlighted(null), 2000);

    setCycleIndex((i) => i + 1);
  }, [cursorList, cycleIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() !== "f") return;
      if (count === 0) return;

      e.preventDefault();
      handleFindUser();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleFindUser, count]);

  return (
    <>
      <AnimatePresence>
        {highlighted && (
          <CursorHighlight
            x={highlighted.x}
            y={highlighted.y}
            color={highlighted.color}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {count > 0 && !dismissed && (
          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="fixed bottom-6 right-6 z-[82] flex items-center gap-3 rounded-full border border-edge bg-surface/90 px-4 py-2 font-mono text-xs text-muted shadow-2xl backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-ink">
              {count} {count === 1 ? "other" : "others"} here
            </span>
            <button
              onClick={handleFindUser}
              className="flex items-center gap-1 rounded-full border border-edge bg-canvas/80 px-2 py-0.5 text-[10px] text-ink transition hover:bg-canvas hover:text-accent"
              aria-label={`Find ${count === 1 ? "user" : "users"}`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <kbd className="rounded border border-edge bg-canvas px-1 py-0.5 text-[10px] text-muted">
                F
              </kbd>
            </button>
            <button
              onClick={() => {
                setDismissed(true);
                sessionStorage.setItem("multiplayer-hint-dismissed", "1");
              }}
              className="ml-1 text-muted/60 transition hover:text-ink"
              aria-label="Dismiss"
            >
              ×
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

const CursorHighlight = memo(function CursorHighlight({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) {
  const layerRef = useScrollCompensateRef<HTMLDivElement>();

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-[79] will-change-transform"
    >
      {/* Pulsing glow */}
      <m.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute"
        style={{ left: x - 30, top: y - 30 }}
      >
        <m.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0.4, 0.8],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="rounded-full"
          style={{
            width: 60,
            height: 60,
            background: `radial-gradient(circle, ${color}40 0%, ${color}00 70%)`,
            boxShadow: `0 0 20px ${color}60, 0 0 40px ${color}30`,
          }}
        />
      </m.div>
      {/* Rotating dashed circle */}
      <m.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{
          opacity: { type: "spring", stiffness: 300, damping: 25 },
          scale: { type: "spring", stiffness: 300, damping: 25 },
          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
        }}
        className="absolute"
        style={{ left: x - 25, top: y - 25, width: 50, height: 50 }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <circle
            cx="25"
            cy="25"
            r="22"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="8 6"
            opacity="0.6"
          />
        </svg>
      </m.div>
    </div>
  );
});

function DebugEffectsOverlay() {
  const [pos, setPos] = useState({ x: 200, y: 200 });
  const ident = getOrCreateIdentity();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      // Use clientX/clientY for fixed positioning (viewport coords)
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      {/* Debug: Click Ripple - centered on cursor */}
      <div className="pointer-events-none fixed inset-0 z-[100] will-change-transform">
        <div
          className="absolute rounded-full"
          style={{
            left: pos.x - 20,
            top: pos.y - 20,
            width: 40,
            height: 40,
            border: `2px solid ${ident.color}`,
            boxShadow: `0 0 12px ${ident.color}60`,
            opacity: 0.6,
          }}
        />
      </div>

      {/* Debug: Find Highlight - centered on cursor */}
      <div className="pointer-events-none fixed inset-0 z-[99] will-change-transform">
        {/* Glow */}
        <div
          className="absolute rounded-full"
          style={{
            left: pos.x - 30,
            top: pos.y - 30,
            width: 60,
            height: 60,
            background: `radial-gradient(circle, ${ident.color}40 0%, ${ident.color}00 70%)`,
            boxShadow: `0 0 20px ${ident.color}60, 0 0 40px ${ident.color}30`,
          }}
        />
        {/* Dashed circle */}
        <div
          className="absolute animate-spin"
          style={{
            left: pos.x - 25,
            top: pos.y - 25,
            width: 50,
            height: 50,
            animationDuration: "3s",
          }}
        >
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <circle
              cx="25"
              cy="25"
              r="22"
              stroke={ident.color}
              strokeWidth="2"
              strokeDasharray="8 6"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      {/* Debug: Speech Bubble - offset from cursor tip */}
      <div className="pointer-events-none fixed inset-0 z-[101] will-change-transform">
        <div
          className="absolute"
          style={{ left: pos.x - 2, top: pos.y - 40 }}
        >
          <div
            className="relative max-w-[200px] rounded-2xl rounded-bl-sm px-3 py-1.5 text-sm shadow-lg"
            style={{
              backgroundColor: ident.color,
              color: getContrastColor(ident.color),
            }}
          >
            Debug message!
            <div
              className="absolute -bottom-1 left-0 h-3 w-3"
              style={{
                backgroundColor: ident.color,
                clipPath: "polygon(0 0, 100% 0, 0 100%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Debug label */}
      <div className="fixed left-4 top-4 z-[102] rounded bg-black/80 px-3 py-2 font-mono text-xs text-white">
        <div>DEBUG MODE ON</div>
        <div className="text-muted">
          Cursor: {Math.round(pos.x)}, {Math.round(pos.y)}
        </div>
        <div className="mt-1 text-muted">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: ident.color }} /> Your color: {ident.color}
        </div>
      </div>
    </>
  );
}
