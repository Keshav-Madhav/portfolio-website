"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Caches `getBoundingClientRect()` for an element so mouse-tracking handlers
 * don't trigger a forced layout reflow on every pixel of motion.
 *
 * Usage:
 *   const { ref, onEnter, onLeave, getRect } = useCachedRect<HTMLDivElement>();
 *   <div ref={ref} onMouseEnter={onEnter} onMouseLeave={onLeave} onMouseMove={(e) => {
 *     const r = getRect();
 *     if (!r) return;
 *     ...;
 *   }} />
 *
 * The rect is captured on enter and invalidated on leave / scroll / resize.
 * If a handler fires between enter and the next layout-affecting event, the
 * cached rect is reused for free.
 */
export function useCachedRect<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const refresh = useCallback(() => {
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
  }, []);

  const onEnter = useCallback(() => {
    refresh();
  }, [refresh]);

  const onLeave = useCallback(() => {
    rectRef.current = null;
  }, []);

  // If the user is hovering when the page scrolls or window resizes, the
  // cached rect would go stale. Refresh on those events while we have one.
  useEffect(() => {
    const onChange = () => {
      if (rectRef.current) refresh();
    };
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [refresh]);

  const getRect = useCallback(() => rectRef.current, []);

  return { ref, onEnter, onLeave, getRect };
}
