"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * ParticleField — the canvas layer that makes the page feel alive.
 * ~80 particles drifting with gentle Brownian motion, connected by
 * lines when close, repelled (gently) by the cursor. O(n²) line pass
 * but n is small enough to be a rounding error on frame time.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;

    const mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onResize = () => {
      resize();
      reseed();
    };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let particles: P[] = [];

    const reseed = () => {
      const target = Math.min(
        90,
        Math.max(30, Math.floor((W * H) / 28000))
      );
      if (particles.length === target) return;
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 0.6 + Math.random() * 1.2,
      }));
    };
    reseed();

    const MAX = 150; // max connection distance
    const MAX2 = MAX * MAX;
    const MOUSE_R = 170;
    const MOUSE_R2 = MOUSE_R * MOUSE_R;

    let rafId = 0;
    let running = true;

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      // Update positions
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) {
          p.x = 0;
          p.vx = -p.vx;
        } else if (p.x > W) {
          p.x = W;
          p.vx = -p.vx;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy = -p.vy;
        } else if (p.y > H) {
          p.y = H;
          p.vy = -p.vy;
        }

        // Very gentle mouse push-away
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MOUSE_R2 && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = (1 - d / MOUSE_R) * 0.18;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }

        // Speed limit + tiny damping so mouse pushes decay
        p.vx *= 0.985;
        p.vy *= 0.985;
        const sp2 = p.vx * p.vx + p.vy * p.vy;
        if (sp2 > 0.65) {
          const sp = Math.sqrt(sp2);
          p.vx = (p.vx / sp) * 0.8;
          p.vy = (p.vy / sp) * 0.8;
        }
      }

      // Connection lines (particle ↔ particle)
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX2) {
            const alpha = (1 - d2 / MAX2) * 0.22;
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Mouse → particle lines (stronger, cyan tint)
      if (mouse.active) {
        for (const p of particles) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MOUSE_R2) {
            const alpha = (1 - d2 / MOUSE_R2) * 0.38;
            ctx.strokeStyle = `rgba(165, 243, 252, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Particle dots last (on top of lines)
      ctx.fillStyle = "rgba(196, 181, 253, 0.6)";
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    };

    // Pause when tab hidden
    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    rafId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-60"
    />
  );
}
