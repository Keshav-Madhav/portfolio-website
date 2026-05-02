"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * LenisProvider — owns the smooth-scroll loop and intercepts in-page anchor
 * clicks so hash navigation works (Lenis would otherwise swallow native scroll
 * and links would appear dead).
 *
 * Note: this component renders nothing. It's mounted via <DeferredEffects />
 * after first paint so the ~10KB Lenis JS doesn't sit in the critical bundle.
 * The first ~800ms of scrolling uses native browser scroll, then Lenis takes
 * over seamlessly.
 */
export default function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    // expose for other components (spirit interruptions, debug, etc.)
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId = 0;
    let running = true;
    const raf = (time: number) => {
      if (!running) return;
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Pause the smooth-scroll loop while the tab is hidden — saves a 60fps
    // rAF tick that does nothing useful in the background.
    const onVis = () => {
      if (document.hidden) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        rafId = requestAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    // Capture-phase interceptor for in-page anchor clicks.
    // We register BEFORE React's synthetic handlers (capture: true) so
    // we can preventDefault reliably; we don't stopPropagation so that
    // React onClick handlers (e.g. setActiveSection) still fire.
    const onAnchorClick = (e: Event) => {
      const me = e as MouseEvent;
      if (me.defaultPrevented) return;
      if (me.button !== 0) return; // left click only
      if (me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return;

      const target = me.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (!href.startsWith("#") || href.length < 2) return;

      const el = document.getElementById(href.slice(1));
      if (!el) return;

      me.preventDefault();

      lenis.scrollTo(el, {
        offset: -80, // leave room for the fixed nav
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      // Update the URL hash without triggering native scroll.
      // Do this after the scroll starts so back-button state is preserved.
      if (history.replaceState) {
        history.replaceState(null, "", href);
      }
    };

    document.addEventListener("click", onAnchorClick, true);

    // If someone lands on the page with a hash already, Lenis won't scroll
    // to it natively — nudge it once after first paint.
    if (window.location.hash.length > 1) {
      requestAnimationFrame(() => {
        const el = document.getElementById(window.location.hash.slice(1));
        if (el) lenis.scrollTo(el, { offset: -80, immediate: true });
      });
    }

    return () => {
      running = false;
      document.removeEventListener("click", onAnchorClick, true);
      document.removeEventListener("visibilitychange", onVis);
      if (rafId) cancelAnimationFrame(rafId);
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return null;
}
