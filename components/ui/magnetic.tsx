"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import React, { useRef } from "react";
import { useCachedRect } from "@/lib/use-cached-rect";

export default function Magnetic({
  children,
  strength = 16,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { ref, onEnter, onLeave, getRect } = useCachedRect<HTMLDivElement>();
  const rafRef = useRef<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 20 });
  const y = useSpring(my, { stiffness: 250, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = getRect();
    if (!r) return;
    const cx = e.clientX;
    const cy = e.clientY;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const dx = cx - (r.left + r.width / 2);
      const dy = cy - (r.top + r.height / 2);
      mx.set((dx / r.width) * strength);
      my.set((dy / r.height) * strength);
    });
  };

  const reset = () => {
    onLeave();
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
