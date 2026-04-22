"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import React, { useRef } from "react";
import { cn } from "@/lib/cn";

export default function TiltedCard({
  children,
  className,
  intensity = 10,
  scaleOnHover = 1.01,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  scaleOnHover?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateY = useTransform(mx, [-0.5, 0.5], [-intensity, intensity]);
  const rotateX = useTransform(my, [-0.5, 0.5], [intensity, -intensity]);
  const scale = useMotionValue(1);

  const sRotateX = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const sRotateY = useSpring(rotateY, { stiffness: 220, damping: 22 });
  const sScale = useSpring(scale, { stiffness: 260, damping: 24 });

  // Glare position
  const glareX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onEnter = () => {
    if (!reduce) scale.set(scaleOnHover);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        rotateX: reduce ? 0 : sRotateX,
        rotateY: reduce ? 0 : sRotateY,
        scale: reduce ? 1 : sScale,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 hover:opacity-100"
          style={{
            background: `radial-gradient(240px circle at ${glareX.get?.() ?? "50%"} ${glareY.get?.() ?? "50%"}, rgba(255,255,255,0.08), transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  );
}
