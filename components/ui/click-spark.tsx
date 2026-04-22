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
  const rafRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onClick = (e: MouseEvent) => {
      // Don't spark on nav / buttons that interrupt — let them through
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
    };
    window.addEventListener("click", onClick);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineWidth = lineWidth;
      const next: Particle[] = [];
      for (const p of particlesRef.current) {
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
        next.push(p);
      }
      particlesRef.current = next;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
