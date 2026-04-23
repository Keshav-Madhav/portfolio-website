"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * LenisProvider — owns the smooth-scroll loop and, crucially, intercepts
 * in-page anchor clicks so hash navigation works at all (otherwise Lenis
 * swallows the native scroll and links appear dead).
 */
export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    // expose for other components (spirit interruptions, debug, etc.)
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

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
      document.removeEventListener("click", onAnchorClick, true);
      cancelAnimationFrame(rafId);
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
