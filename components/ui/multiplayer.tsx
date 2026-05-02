"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import {
  SpacesProvider,
  SpaceProvider,
  useSpace,
  useCursors,
  useMembers,
} from "@ably/spaces/react";
import * as Ably from "ably";
import Spaces from "@ably/spaces";
import { AnimatePresence, motion } from "framer-motion";

import { getOrCreateIdentity } from "@/lib/cursor-identity";
import {
  REACTIONS,
  REACTIONS_BY_KEY,
  ReactionIcon,
  type ReactionKey,
} from "@/lib/reaction-icons";

const SPACE_NAME = "portfolio-home";
const REACTION_CHANNEL = "portfolio-reactions";

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

export default function Multiplayer() {
  const [clients, setClients] = useState<{
    ably: Ably.Realtime;
    spaces: Spaces;
  } | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MULTIPLAYER_ENABLED !== "1") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const clientId = getOrCreateClientId();
    const ably = new Ably.Realtime({
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

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

function CursorLayer() {
  const { space, cursors } = useCursors({ returnCursors: true });
  const { self, others } = useMembers();
  const scrollY = useScrollY();
  const isEntered = !!self;

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
        // set() returns a Promise that rejects with ERR_NOT_ENTERED_SPACE
        // during reconnects / tab-switches / brief membership lapses.
        if (result && typeof (result as Promise<unknown>).then === "function") {
          (result as Promise<unknown>).catch(() => {});
        }
      } catch {
        // sync throw fallback
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

    // Recompute pageX/Y from last known viewport coords on scroll. The mouse
    // didn't move but the document did, so pageY = clientY + scrollY changed
    // — without this, remote viewers see a stale position until our next
    // pointermove, causing a teleport jump.
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
      safeSet({ x: -10000, y: -10000 });
    };

    window.addEventListener("pointermove", onMove);
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

  const memberLookup = useMemo(() => {
    const m = new Map<string, { name: string; color: string }>();
    others?.forEach((member) => {
      const profile = (member.profileData ?? {}) as {
        name?: string;
        color?: string;
      };
      m.set(member.clientId ?? "", {
        name: profile.name ?? "Anon",
        color: profile.color ?? "#888",
      });
    });
    return m;
  }, [others]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      <AnimatePresence>
        {cursors &&
          Object.values(cursors).map((entry) => {
            const { member, cursorUpdate } = entry;
            const pos = cursorUpdate?.position;
            if (!pos || pos.x < -1000) return null;
            const profile = memberLookup.get(member.clientId ?? "");
            if (!profile) return null;
            return (
              <Cursor
                key={member.connectionId}
                x={pos.x}
                y={pos.y - scrollY}
                color={profile.color}
              />
            );
          })}
      </AnimatePresence>
    </div>
  );
}

function Cursor({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) {
  return (
    <motion.div
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
    </motion.div>
  );
}

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
  const scrollY = useScrollY();

  function spawn(x: number, y: number, key: ReactionKey) {
    const id = ++idRef.current;
    const drift = Math.random() * 40 - 20;
    const rotate = Math.random() * 30 - 15;
    setReactions((r) => [...r, { id, x, y, key, drift, rotate }]);
    setTimeout(() => {
      setReactions((r) => r.filter((rx) => rx.id !== id));
    }, 2200);
  }

  const { channel } = useChannel(REACTION_CHANNEL, "reaction", (msg) => {
    const data = msg.data as { x: number; y: number; key: string };
    const k = data.key as ReactionKey;
    if (REACTIONS_BY_KEY[k]) spawn(data.x, data.y, k);
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      cursorRef.current = { x: e.pageX, y: e.pageY };
    };
    window.addEventListener("pointermove", onMove);
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

      const idx = Number(e.key) - 1;
      if (idx < 0 || idx >= REACTIONS.length) return;
      if (!cursorRef.current) return;

      const reactionKey = REACTIONS[idx].key;
      const { x, y } = cursorRef.current;
      spawn(x, y, reactionKey);
      channel.publish("reaction", { x, y, key: reactionKey });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [channel]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[81] overflow-hidden">
      <AnimatePresence>
        {reactions.map((r) => (
          <motion.div
            key={r.id}
            initial={{
              opacity: 0,
              scale: 0.3,
              x: r.x - 32,
              y: r.y - scrollY - 32,
              rotate: 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.3, 1.25, 1, 0.85],
              y: r.y - scrollY - 130,
              x: r.x - 32 + r.drift,
              rotate: r.rotate,
            }}
            transition={{
              duration: 2.2,
              ease: [0.22, 1, 0.36, 1],
              opacity: { times: [0, 0.15, 0.7, 1], duration: 2.2 },
            }}
            className="absolute left-0 top-0 select-none"
            style={{
              filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.55))",
            }}
          >
            <ReactionIcon reactionKey={r.key} size={64} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

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
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          className="fixed bottom-6 right-6 z-[82] flex items-center gap-3 rounded-full border border-edge bg-surface/90 px-4 py-2 font-mono text-xs text-muted shadow-2xl backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
