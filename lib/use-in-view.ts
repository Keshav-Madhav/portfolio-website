"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Drop-in replacement for `react-intersection-observer`'s `useInView` —
 * native IntersectionObserver, ~30 lines, zero dep cost.
 *
 * Returns `[ref, inView]` (different from the lib's `{ref, inView}` shape).
 */
export function useInView<T extends Element = Element>(
  options: {
    threshold?: number | number[];
    rootMargin?: string;
    triggerOnce?: boolean;
    initialInView?: boolean;
  } = {},
): [(node: T | null) => void, boolean] {
  const { threshold = 0, rootMargin, triggerOnce, initialInView = false } =
    options;
  const [inView, setInView] = useState(initialInView);
  const elRef = useRef<T | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const ref = (node: T | null) => {
    if (elRef.current === node) return;
    observerRef.current?.disconnect();
    elRef.current = node;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setInView(visible);
        if (visible && triggerOnce) {
          obs.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    obs.observe(node);
    observerRef.current = obs;
  };

  return [ref, inView];
}
