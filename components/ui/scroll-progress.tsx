"use client";

import { m, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    mass: 0.2,
  });

  // Hidden on coarse-pointer devices — saves the spring calculation overhead
  // and the element isn't essential on mobile anyway.
  return (
    <m.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] hidden h-[2px] origin-left bg-gradient-to-r from-violet-700 via-violet-500 to-cyan-600 dark:from-violet-500 dark:via-violet-300 dark:to-cyan-300 sm:block"
    />
  );
}
