"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
};

export default function ClickSpark({
  color = "#a78bfa",
  count = 12,
  radius = 26,
  lineWidth = 1.4,
}: {
  color?: string;
  count?: number;
  radius?: number;
  lineWidth?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cap DPR at 2 — retina/3x backing stores triple the pixel work for
    // visually imperceptible gain in particle effects.
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const applySize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const resize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applySize, 100);
    };
    applySize();
    window.addEventListener("resize", resize);

    // rAF only runs while there are live particles. Idle = no work.
    const ensureLoop = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea")) return;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.15;
        const speed = 1.6 + Math.random() * 1.8;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          ttl: 28 + Math.random() * 10,
        });
      }
      ensureLoop();
    };
    window.addEventListener("click", onClick);

    const tick = () => {
      const particles = particlesRef.current;
      if (particles.length === 0) {
        // Nothing to draw — clear once and pause until next click.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rafRef.current = null;
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineWidth = lineWidth;
      // In-place compaction avoids allocating a new array each frame.
      let write = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 1;
        const t = p.life / p.ttl;
        if (t >= 1) continue;
        const ease = 1 - t * t;
        p.x += p.vx * ease;
        p.y += p.vy * ease;
        const alpha = 1 - t;
        ctx.strokeStyle = `${color}${Math.round(alpha * 255)
          .toString(16)
          .padStart(2, "0")}`;
        const len = radius * (1 - t);
        const nx = p.x - p.vx * len * 0.14;
        const ny = p.y - p.vy * len * 0.14;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        particles[write++] = p;
      }
      particles.length = write;
      rafRef.current = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden && rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVis);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [color, count, radius, lineWidth]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}
