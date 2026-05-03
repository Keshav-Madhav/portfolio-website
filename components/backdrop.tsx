"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Backdrop with aurora blobs that scroll WITH content.
 *
 * Four perf decisions:
 * 1. The container's parallax translate is driven imperatively via a ref-RAF
 *    that self-suspends when scroll settles (no React re-renders during scroll).
 * 2. The 8 blob breathing animations are pure CSS @keyframes — moves them off
 *    framer-motion's animation runtime onto the browser compositor (GPU). On
 *    a slow CPU this saves ~8 rAF ticks/frame doing JS interpolation.
 * 3. On small viewports we hide every other blob (`hidden sm:block`) and use
 *    a smaller blur radius. 130–160px blur over a full-screen layer is one
 *    of the most expensive things a phone GPU can be asked to do at 60fps.
 * 4. On coarse-pointer devices (phones) we hide ALL blobs via CSS and show
 *    a static gradient fallback instead. The parallax RAF loop also bails.
 */
export default function Backdrop() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    // Detect coarse pointer (touch devices) to skip the parallax loop entirely
    const mq = window.matchMedia("(pointer: coarse)");
    setIsCoarse(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsCoarse(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    if (reduce || isCoarse) return;
    const el = containerRef.current;
    if (!el) return;

    let rafId = 0;
    let running = true;
    let current = 0;
    let target = window.scrollY;

    const tick = () => {
      if (!running) return;
      current += (target - current) * 0.1;
      el.style.transform = `translate3d(0, ${-current}px, 0)`;
      if (Math.abs(target - current) < 0.5) {
        running = false;
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const ensureRunning = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      target = window.scrollY;
      ensureRunning();
    };

    const onVis = () => {
      if (document.hidden) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      } else {
        target = window.scrollY;
        ensureRunning();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    rafId = requestAnimationFrame(tick);

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce, isCoarse]);

  // CSS-driven blob animations defined as a <style> tag co-located with the
  // component so the keyframes ship with the file. `prefers-reduced-motion`
  // already nukes all animations globally in globals.css.
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <style>{`
        @keyframes blob-a { 0%,100% { transform: translateX(-50%) scale(1); } 33% { transform: translateX(-45%) scale(1.05); } 66% { transform: translateX(-55%) scale(0.98); } }
        @keyframes blob-b { 0%,100% { transform: translateY(0) scale(1); } 33% { transform: translateY(40px) scale(1.04); } 66% { transform: translateY(-20px) scale(0.98); } }
        @keyframes blob-c { 0%,100% { transform: translate(0,0) rotate(0deg); } 33% { transform: translate(30px,0) rotate(3deg); } 66% { transform: translate(-10px,0) rotate(-2deg); } }
        @keyframes blob-d { 0%,100% { transform: scale(1) translateX(0); } 33% { transform: scale(1.08) translateX(20px); } 66% { transform: scale(0.95) translateX(-15px); } }
        @keyframes blob-e { 0%,100% { transform: translateY(0) scale(1); } 33% { transform: translateY(30px) scale(1.06); } 66% { transform: translateY(-20px) scale(0.97); } }
        @keyframes blob-f { 0%,100% { transform: translate(0,0); } 33% { transform: translate(-25px,20px); } 66% { transform: translate(15px,-15px); } }
        @keyframes blob-g { 0%,100% { transform: translateX(-50%) scale(1); } 33% { transform: translateX(-50%) scale(1.05); } 66% { transform: translateX(-50%) scale(0.96); } }
        @keyframes blob-h { 0%,100% { transform: translateX(0); } 33% { transform: translateX(35px); } 66% { transform: translateX(-15px); } }
      `}</style>

      {/* Base canvas color */}
      <div className="absolute inset-0 bg-[hsl(222_25%_4%)]" />

      {/* Mobile-only static gradient fallback — much cheaper than blurred blobs */}
      <div
        aria-hidden
        data-aurora-fallback
        className="absolute inset-0 hidden opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 120% 60% at 50% 0%, hsl(258 70% 50% / 0.25), transparent 60%),
            radial-gradient(ellipse 80% 50% at 80% 50%, hsl(190 80% 45% / 0.15), transparent 50%),
            radial-gradient(ellipse 70% 40% at 20% 80%, hsl(270 70% 50% / 0.12), transparent 50%)
          `,
        }}
      />
      <style>{`
        @media (pointer: coarse) {
          [data-aurora-fallback] { display: block !important; }
        }
      `}</style>

      {/* Aurora container - transforms based on scroll (driven imperatively) */}
      <div ref={containerRef} className="absolute inset-0 will-change-transform">
        <div
          aria-hidden
          data-aurora-blob
          className="absolute -top-40 left-1/2 h-[40rem] w-[60rem] rounded-full blur-[70px] will-change-transform sm:blur-[140px]"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(258 85% 60% / 0.35), transparent 65%)",
            opacity: 0.22,
            animation: reduce ? undefined : "blob-a 20s ease-in-out infinite",
            transform: "translateX(-50%)",
          }}
        />
        <div
          aria-hidden
          data-aurora-blob
          className="absolute top-[20vh] -right-32 hidden h-[36rem] w-[48rem] rounded-full blur-[130px] will-change-transform sm:block"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(190 90% 50% / 0.30), transparent 65%)",
            opacity: 0.16,
            animation: reduce ? undefined : "blob-b 24s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          data-aurora-blob
          className="absolute top-[85vh] -left-32 h-[32rem] w-[44rem] rounded-full blur-[60px] will-change-transform sm:blur-[120px]"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(160 80% 45% / 0.28), transparent 65%)",
            opacity: 0.14,
            animation: reduce ? undefined : "blob-c 28s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          data-aurora-blob
          className="absolute top-[170vh] right-[5%] hidden h-[28rem] w-[36rem] rounded-full blur-[150px] will-change-transform sm:block"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(320 70% 55% / 0.22), transparent 70%)",
            opacity: 0.12,
            animation: reduce ? undefined : "blob-d 30s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          data-aurora-blob
          className="absolute top-[250vh] left-[10%] h-[30rem] w-[40rem] rounded-full blur-[80px] will-change-transform sm:blur-[160px]"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(240 75% 50% / 0.24), transparent 70%)",
            opacity: 0.13,
            animation: reduce ? undefined : "blob-e 32s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          data-aurora-blob
          className="absolute top-[340vh] -right-20 hidden h-[34rem] w-[46rem] rounded-full blur-[130px] will-change-transform sm:block"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(185 85% 48% / 0.26), transparent 65%)",
            opacity: 0.14,
            animation: reduce ? undefined : "blob-f 26s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          data-aurora-blob
          className="absolute top-[430vh] left-1/2 h-[36rem] w-[50rem] rounded-full blur-[70px] will-change-transform sm:blur-[140px]"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(270 80% 55% / 0.28), transparent 65%)",
            opacity: 0.15,
            animation: reduce ? undefined : "blob-g 22s ease-in-out infinite",
            transform: "translateX(-50%)",
          }}
        />
        <div
          aria-hidden
          data-aurora-blob
          className="absolute top-[520vh] -left-20 hidden h-[32rem] w-[42rem] rounded-full blur-[140px] will-change-transform sm:block"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(175 80% 45% / 0.24), transparent 65%)",
            opacity: 0.12,
            animation: reduce ? undefined : "blob-h 34s ease-in-out infinite",
          }}
        />
      </div>

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, hsl(222 30% 2% / 0.5) 100%)",
        }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 noise opacity-[0.02]" />
    </div>
  );
}
