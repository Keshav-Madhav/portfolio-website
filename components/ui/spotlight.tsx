"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import React, { useRef } from "react";
import { cn } from "@/lib/cn";
import { useCachedRect } from "@/lib/use-cached-rect";

export default function Spotlight({
  children,
  className,
  color = "hsl(258 90% 66% / 0.18)",
  size = 420,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  size?: number;
}) {
  const { ref, onEnter, onLeave, getRect } = useCachedRect<HTMLDivElement>();
  const rafRef = useRef<number | null>(null);
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);

  const onMove = (e: React.MouseEvent) => {
    const r = getRect();
    if (!r) return;
    const cx = e.clientX;
    const cy = e.clientY;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      mx.set(cx - r.left);
      my.set(cy - r.top);
    });
  };

  const handleLeave = () => {
    onLeave();
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    mx.set(-9999);
    my.set(-9999);
  };

  const bg = useMotionTemplate`radial-gradient(${size}px circle at ${mx}px ${my}px, ${color}, transparent 55%)`;

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={handleLeave}
      className={cn("relative isolate", className)}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 hover:opacity-100 [@media(hover:hover)]:group-hover:opacity-100"
        style={{ background: bg }}
      />
      {children}
    </div>
  );
}
