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
const FAR_OFFSCREEN = -10000;

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
        <SpacesProvider client={clients.spaces}>
          <SpaceProvider name={SPACE_NAME}>
            <SpaceEnter />
            <CursorLayer />
            <ReactionsLayer />
            <PresenceHint />
          </SpaceProvider>
        </SpacesProvider>
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

function PresenceHint() {
  const { others } = useMembers();
  const [dismissed, setDismissed] = useState(false);

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

  return (
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
          <span className="text-muted/60">·</span>
          <span>
            press{" "}
            <kbd className="rounded border border-edge bg-canvas px-1 py-0.5 text-[10px] text-ink">
              1–{REACTIONS.length}
            </kbd>{" "}
            to react
          </span>
          <span className="ml-1 flex items-center gap-1">
            {REACTIONS.map(({ key }) => (
              <ReactionIcon key={key} reactionKey={key} size={22} />
            ))}
          </span>
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
  );
}
