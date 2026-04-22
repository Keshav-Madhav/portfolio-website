"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import React, { useRef } from "react";
import { cn } from "@/lib/cn";

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
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const bg = useMotionTemplate`radial-gradient(${size}px circle at ${mx}px ${my}px, ${color}, transparent 55%)`;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(-9999);
        my.set(-9999);
      }}
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
