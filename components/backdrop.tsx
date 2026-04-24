"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Backdrop() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Base canvas color - since body is transparent */}
      <div className="absolute inset-0 bg-[hsl(222_20%_5%)]" />

      {/* Aurora blob top */}
      <motion.div
        aria-hidden
        className="absolute -top-40 left-1/2 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(258 90% 66% / 0.6), transparent 60%)",
        }}
        animate={
          reduce
            ? undefined
            : {
                x: ["-50%", "-45%", "-55%", "-50%"],
                scale: [1, 1.05, 0.98, 1],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Aurora blob cyan */}
      <motion.div
        aria-hidden
        className="absolute top-[40%] -right-40 h-[34rem] w-[44rem] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(190 95% 55% / 0.55), transparent 60%)",
        }}
        animate={
          reduce ? undefined : { y: [0, 40, -20, 0], scale: [1, 1.06, 0.97, 1] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Aurora blob emerald */}
      <motion.div
        aria-hidden
        className="absolute bottom-0 -left-40 h-[30rem] w-[40rem] rounded-full opacity-25 blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(160 85% 50% / 0.5), transparent 60%)",
        }}
        animate={
          reduce ? undefined : { x: [0, 30, -10, 0], y: [0, -20, 20, 0] }
        }
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Noise */}
      <div className="absolute inset-0 noise" />
    </div>
  );
}
