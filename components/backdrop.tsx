"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Backdrop with aurora blobs that scroll WITH content.
 * - Uses transform to move blobs based on scroll position
 * - Creates natural scrolling feel without fixed position headache
 * - Dimmed for less distraction from foreground
 */
export default function Backdrop() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    if (reduce) return;
    
    let rafId: number;
    let currentScroll = 0;
    let targetScroll = 0;
    
    const handleScroll = () => {
      targetScroll = window.scrollY;
    };
    
    const animate = () => {
      // Smooth interpolation for buttery scroll
      currentScroll += (targetScroll - currentScroll) * 0.1;
      setScrollY(currentScroll);
      rafId = requestAnimationFrame(animate);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [reduce]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Base canvas color */}
      <div className="absolute inset-0 bg-[hsl(222_25%_4%)]" />
      
      {/* Aurora container - transforms based on scroll */}
      <div 
        ref={containerRef}
        className="absolute inset-0"
        style={{
          transform: `translateY(${-scrollY}px)`,
          willChange: "transform",
        }}
      >
        {/* Aurora blob 1 - Top violet */}
        <motion.div
          aria-hidden
          className="absolute -top-40 left-1/2 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(258 85% 60% / 0.35), transparent 65%)",
            opacity: 0.22,
          }}
          animate={
            reduce
              ? undefined
              : {
                  x: ["-50%", "-45%", "-55%", "-50%"],
                  scale: [1, 1.05, 0.98, 1],
                }
          }
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Aurora blob 2 - Cyan right (hero area) */}
        <motion.div
          aria-hidden
          className="absolute top-[20vh] -right-32 h-[36rem] w-[48rem] rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(190 90% 50% / 0.30), transparent 65%)",
            opacity: 0.16,
          }}
          animate={
            reduce ? undefined : { y: [0, 40, -20, 0], scale: [1, 1.04, 0.98, 1] }
          }
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Aurora blob 3 - Emerald (Work section ~100vh) */}
        <motion.div
          aria-hidden
          className="absolute top-[85vh] -left-32 h-[32rem] w-[44rem] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(160 80% 45% / 0.28), transparent 65%)",
            opacity: 0.14,
          }}
          animate={
            reduce ? undefined : { x: [0, 30, -10, 0], rotate: [0, 3, -2, 0] }
          }
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Aurora blob 4 - Rose accent (~170vh) */}
        <motion.div
          aria-hidden
          className="absolute top-[170vh] right-[5%] h-[28rem] w-[36rem] rounded-full blur-[150px]"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(320 70% 55% / 0.22), transparent 70%)",
            opacity: 0.12,
          }}
          animate={
            reduce ? undefined : { scale: [1, 1.08, 0.95, 1], x: [0, 20, -15, 0] }
          }
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Aurora blob 5 - Indigo (Projects ~250vh) */}
        <motion.div
          aria-hidden
          className="absolute top-[250vh] left-[10%] h-[30rem] w-[40rem] rounded-full blur-[160px]"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(240 75% 50% / 0.24), transparent 70%)",
            opacity: 0.13,
          }}
          animate={
            reduce ? undefined : { y: [0, 30, -20, 0], scale: [1, 1.06, 0.97, 1] }
          }
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Aurora blob 6 - Cyan (Stack ~340vh) */}
        <motion.div
          aria-hidden
          className="absolute top-[340vh] -right-20 h-[34rem] w-[46rem] rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(185 85% 48% / 0.26), transparent 65%)",
            opacity: 0.14,
          }}
          animate={
            reduce ? undefined : { x: [0, -25, 15, 0], y: [0, 20, -15, 0] }
          }
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Aurora blob 7 - Purple (Contact ~430vh) */}
        <motion.div
          aria-hidden
          className="absolute top-[430vh] left-1/2 -translate-x-1/2 h-[36rem] w-[50rem] rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(270 80% 55% / 0.28), transparent 65%)",
            opacity: 0.15,
          }}
          animate={
            reduce ? undefined : { scale: [1, 1.05, 0.96, 1] }
          }
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Aurora blob 8 - Teal bottom (~520vh) */}
        <motion.div
          aria-hidden
          className="absolute top-[520vh] -left-20 h-[32rem] w-[42rem] rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(175 80% 45% / 0.24), transparent 65%)",
            opacity: 0.12,
          }}
          animate={
            reduce ? undefined : { x: [0, 35, -15, 0] }
          }
          transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Fixed overlays */}
      {/* Subtle vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, hsl(222 30% 2% / 0.5) 100%)",
        }}
      />
      
      {/* Noise texture */}
      <div className="absolute inset-0 noise opacity-[0.02]" />
    </div>
  );
}
