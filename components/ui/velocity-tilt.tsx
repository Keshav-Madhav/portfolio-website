"use client";

import { useEffect } from "react";

/**
 * Detects fast scrolling and sets `data-fast-scroll="true"` on <html>.
 * CSS in globals.css uses that flag to apply a subtle skew to <main>.
 * Tiny, no-render component.
 */
export default function VelocityTilt({ threshold = 2200 }: { threshold?: number }) {
  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let clearId: number | undefined;
    let raf = 0;
    let pending = false;

    const tick = () => {
      pending = false;
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastY);
      const dt = Math.max(1, now - lastT);
      const vel = (dy / dt) * 1000; // px/s
      lastY = window.scrollY;
      lastT = now;
      if (vel > threshold) {
        document.documentElement.setAttribute("data-fast-scroll", "true");
        if (clearId) window.clearTimeout(clearId);
        clearId = window.setTimeout(() => {
          document.documentElement.removeAttribute("data-fast-scroll");
        }, 180);
      }
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (clearId) window.clearTimeout(clearId);
      document.documentElement.removeAttribute("data-fast-scroll");
    };
  }, [threshold]);

  return null;
}
