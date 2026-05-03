"use client";

import { useEffect, useState } from "react";

/**
 * `useIsMobile` — true on touch-only / coarse-pointer devices (phones,
 * most tablets). SSR-safe: returns `false` on the first render and updates
 * on the client after mount, which is fine for everything we use it for
 * (deferred decorative effects).
 *
 * Why `(pointer: coarse)` and not `max-width`?
 * - Cursor-driven effects (spirit guide, particle/flow field cursor glow,
 *   click sparks, multiplayer cursors, keyboard nav) have no meaning on a
 *   touch device regardless of viewport width — phablets and small laptops
 *   shouldn't be confused.
 * - Battery/CPU on phones is the other concern; coarse-pointer correlates
 *   with that closely enough for our purposes.
 *
 * The result is also broadcast to `<html data-coarse="true">` so CSS can
 * dial back blur-heavy backdrops without a JS round-trip.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: coarse)");
    const apply = () => {
      setIsMobile(mq.matches);
      document.documentElement.toggleAttribute("data-coarse", mq.matches);
    };
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  return isMobile;
}
