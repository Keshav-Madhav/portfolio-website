"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import SectionHeading from "./ui/section-heading";
import { profile } from "@/lib/data";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section
      id="about"
      ref={ref}
      className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
    >
      <SectionHeading
        eyebrow="00 / About"
        title={
          <>
            What I actually
            <br /> build.
          </>
        }
        description="Read it in 5 seconds. Or 5 minutes. Both work."
      />

      {/* Headline + proof-point strip — the 5-second read */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 sm:mb-14"
      >
        <p className="font-display text-2xl font-semibold leading-[1.2] tracking-tight text-ink sm:text-4xl lg:text-5xl">
          {profile.headline}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-4 sm:gap-3">
          {profile.proofPoints.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
              data-spirit
              className="rounded-xl border border-edge bg-surface/40 p-3 backdrop-blur sm:rounded-2xl sm:p-4"
            >
              <div className="font-display text-xl font-semibold text-violet-300 sm:text-2xl lg:text-3xl">
                {p.value}
              </div>
              <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted sm:text-[0.65rem]">
                {p.label}
              </div>
              <div className="mt-1 text-[0.7rem] leading-snug text-ink/70 sm:text-xs">
                {p.detail}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Capability cards — the 30-second read */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        {profile.capabilities.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            data-spirit
            className="group relative overflow-hidden rounded-xl border border-edge bg-surface/40 p-5 backdrop-blur transition hover:border-violet-500/40 sm:rounded-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">
                {c.title}
              </h3>
              <span className="shrink-0 rounded-full border border-edge bg-canvas/60 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
                {c.tag}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[0.95rem]">
              {c.detail}
            </p>
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-violet-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />
          </motion.div>
        ))}
      </div>

      {/* Deep-read prose — always visible, the 1-minute read */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-[1fr_auto] lg:items-start"
      >
        <div className="space-y-4 text-base leading-relaxed text-ink/85 sm:text-lg">
          <p>{profile.extendedBio.intro}</p>
          <p>{profile.extendedBio.current}</p>
          <p className="text-muted">{profile.extendedBio.past}</p>
          <p className="border-l-2 border-violet-500/40 pl-4 text-muted italic">
            {profile.extendedBio.philosophy}
          </p>
        </div>
        <div className="hidden lg:flex lg:flex-col lg:items-end lg:gap-2">
          <Quote tone="accent">Agent-centric</Quote>
          <Quote>UI-sharp</Quote>
          <Quote tone="accent">Infra-curious</Quote>
        </div>
      </motion.div>

      {/* Keep-scrolling cue — pill, not a button */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:mt-14">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
          Want a longer read? Keep scrolling.
        </p>
        <span
          aria-hidden
          className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface/40 px-4 py-1.5 font-mono text-xs text-muted backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-violet-300" />
          <span>experience · projects · stack</span>
          <ArrowDown className="h-3.5 w-3.5 animate-bounce text-violet-300" />
        </span>
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
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-edge bg-surface/40 text-muted"
      }`}
    >
      {children}
    </span>
  );
}
