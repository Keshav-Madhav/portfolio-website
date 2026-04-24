"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * FlowField — Interactive background with:
 * - Cursor glow that follows mouse
 * - Subtle particles that drift and respond to scroll
 * - Parallax depth effect on scroll
 */

interface Particle {
  x: number;
  y: number;
  baseY: number;      // Original Y position for parallax
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  parallaxSpeed: number;  // Different speeds for depth
  twinkleSpeed: number;
  twinklePhase: number;
}

export default function FlowField() {
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
    let rafId = 0;
    let running = true;
    let scrollY = 0;
    let scrollVelocity = 0;
    let lastScrollY = 0;
    let time = 0;

    const mouse = { x: -9999, y: -9999, active: false };
    
    // Particle system
    const PARTICLE_COUNT = Math.min(60, Math.floor((W * H) / 25000));
    const particles: Particle[] = [];

    const createParticle = (x?: number, y?: number): Particle => ({
      x: x ?? Math.random() * W,
      y: y ?? Math.random() * H,
      baseY: y ?? Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      parallaxSpeed: Math.random() * 0.4 + 0.1,  // 0.1 to 0.5 - varying depths
      twinkleSpeed: Math.random() * 0.002 + 0.001,
      twinklePhase: Math.random() * Math.PI * 2,
    });

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };
    resize();

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    
    const onScroll = () => {
      const newScrollY = window.scrollY;
      scrollVelocity = newScrollY - lastScrollY;
      lastScrollY = newScrollY;
      scrollY = newScrollY;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = () => {
      if (!running) return;
      time += 16;
      
      ctx.clearRect(0, 0, W, H);
      
      // Decay scroll velocity smoothly
      scrollVelocity *= 0.95;

      // Draw particles with parallax
      for (const p of particles) {
        // Parallax offset based on scroll
        const parallaxOffset = scrollY * p.parallaxSpeed;
        const displayY = ((p.baseY - parallaxOffset) % (H + 100)) - 50;
        
        // Wrap particles vertically
        if (displayY < -50) {
          p.baseY = scrollY * p.parallaxSpeed + H + 50 + Math.random() * 100;
          p.x = Math.random() * W;
        } else if (displayY > H + 50) {
          p.baseY = scrollY * p.parallaxSpeed - 50 - Math.random() * 100;
          p.x = Math.random() * W;
        }
        
        // Slow drift
        p.x += p.vx;
        p.baseY += p.vy;
        
        // Wrap horizontally
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        
        // Scroll velocity influence - particles "rush" with fast scroll
        const scrollInfluence = scrollVelocity * p.parallaxSpeed * 0.5;
        
        // Mouse repulsion (very subtle)
        let mouseInfluenceX = 0;
        let mouseInfluenceY = 0;
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = displayY - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150 * 0.3;
            mouseInfluenceX = (dx / dist) * force;
            mouseInfluenceY = (dy / dist) * force;
          }
        }
        
        // Twinkle effect
        const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.5 + 0.5;
        const alpha = p.alpha * (0.5 + twinkle * 0.5);
        
        // Draw particle
        const finalY = displayY + scrollInfluence + mouseInfluenceY;
        const finalX = p.x + mouseInfluenceX;
        
        ctx.beginPath();
        ctx.arc(finalX, finalY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
        ctx.fill();
        
        // Subtle glow for larger particles
        if (p.size > 1) {
          ctx.beginPath();
          ctx.arc(finalX, finalY, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 200, 255, ${alpha * 0.15})`;
          ctx.fill();
        }
      }

      // Cursor glow (dimmer)
      if (mouse.active) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 200
        );
        gradient.addColorStop(0, "rgba(167, 139, 250, 0.04)");
        gradient.addColorStop(0.4, "rgba(165, 243, 252, 0.015)");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(mouse.x - 200, mouse.y - 200, 400, 400);
      }

      rafId = requestAnimationFrame(draw);
    };

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else {
        running = true;
        rafId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    rafId = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
