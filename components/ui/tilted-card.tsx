"use client";

import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useCachedRect } from "@/lib/use-cached-rect";

/**
 * TiltedCard — very subtle 3D tilt effect with spirit-like glow on hover.
 * Tilt is intentionally minimal to avoid cheesy effects.
 */
export default function TiltedCard({
  children,
  className,
  intensity = 2, // Very subtle tilt
  scaleOnHover = 1.005, // Barely noticeable scale
  glowOnHover = true,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  scaleOnHover?: number;
  glowOnHover?: boolean;
}) {
  const reduce = useReducedMotion();
  const { ref, onEnter, onLeave, getRect } = useCachedRect<HTMLDivElement>();
  const rafRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateY = useTransform(mx, [-0.5, 0.5], [-intensity, intensity]);
  const rotateX = useTransform(my, [-0.5, 0.5], [intensity, -intensity]);
  const scale = useMotionValue(1);

  const sRotateX = useSpring(rotateX, { stiffness: 120, damping: 30 });
  const sRotateY = useSpring(rotateY, { stiffness: 120, damping: 30 });
  const sScale = useSpring(scale, { stiffness: 180, damping: 30 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = getRect();
    if (!r) return;
    const cx = e.clientX;
    const cy = e.clientY;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      mx.set((cx - r.left) / r.width - 0.5);
      my.set((cy - r.top) / r.height - 0.5);
    });
  };

  const handleEnter = () => {
    onEnter();
    if (!reduce) {
      scale.set(scaleOnHover);
      setIsHovered(true);
    }
  };

  const handleLeave = () => {
    onLeave();
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    mx.set(0);
    my.set(0);
    scale.set(1);
    setIsHovered(false);
  };

  return (
    <m.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        rotateX: reduce ? 0 : sRotateX,
        rotateY: reduce ? 0 : sRotateY,
        scale: reduce ? 1 : sScale,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative will-change-transform rounded-[inherit]", className)}
    >
      {children}
      {glowOnHover && !reduce && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500",
            "shadow-[0_0_0_1px_rgba(165,180,252,0.12),0_8px_32px_-8px_rgba(165,180,252,0.2),0_0_48px_-12px_rgba(165,243,252,0.12)]",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </m.div>
  );
}
