"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { profile } from "@/lib/data";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative mx-auto w-full max-w-6xl px-6 py-16 sm:py-24"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-2xl font-medium leading-[1.35] tracking-tight text-ink/90 sm:text-3xl lg:text-4xl"
        >
          {profile.bio.split(". ").map((sentence, i, arr) => (
            <span key={i} className="block sm:inline">
              <motion.span
                initial={{ opacity: 0.35 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, delay: i * 0.12 }}
              >
                {sentence}
                {i < arr.length - 1 ? ". " : ""}
              </motion.span>
            </span>
          ))}
        </motion.p>

        <motion.div
          style={{ y }}
          className="hidden lg:flex lg:flex-col lg:items-end lg:gap-2"
        >
          <Quote tone="accent">Agent-centric</Quote>
          <Quote>UI-sharp</Quote>
          <Quote tone="accent">Infra-curious</Quote>
        </motion.div>
      </div>
    </section>
  );
}

function Quote({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "accent";
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] ${
        tone === "accent"
          ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
          : "border-edge bg-surface/40 text-muted"
      }`}
    >
      {children}
    </span>
  );
}
