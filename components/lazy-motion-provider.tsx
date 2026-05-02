"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * LazyMotion strips the heavy `motion` component from the critical bundle
 * and async-loads the animation features. We import `domAnimation`
 * synchronously here because Lighthouse's lantern simulator penalizes the
 * extra network round-trip for an async features chunk more than it rewards
 * the smaller initial bundle. Real-world impact is similar either way.
 */
export default function LazyMotionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
