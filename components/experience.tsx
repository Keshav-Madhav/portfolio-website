"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./ui/section-heading";
import VfInternal from "./vf-internal";
import { experience } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

export default function Experience() {
  const { ref } = useSectionInView("Work", 0.15);

  return (
    <section
      ref={ref}
      id="work"
      className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-32"
    >
      <SectionHeading
        eyebrow="01 / Experience"
        title={
          <>
            Where I&apos;ve shipped,
            <br />
            and what I built there.
          </>
        }
        description="A short, honest log of two roles that shaped how I build: one front-of-house, one brain-of-house."
      />

      <div className="relative">
        <div
          aria-hidden
          className="absolute left-[0.45rem] top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-edge to-transparent sm:left-[0.95rem]"
        />

        <div className="flex flex-col gap-16 sm:gap-24">
          {experience.map((exp) => (
            <ExperienceEntry key={exp.company} entry={exp} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceEntry({
  entry,
}: {
  entry: (typeof experience)[number];
}) {
  const isVerbaFlo = entry.company === "VerbaFlo";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-8 sm:pl-16"
    >
      <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full border border-edge bg-canvas sm:h-8 sm:w-8">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_18px_2px_rgba(167,139,250,0.6)] sm:h-2 sm:w-2" />
      </div>

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <a
          data-spirit="inline"
          href={entry.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-[44px] items-center gap-1 font-display text-xl font-semibold text-ink sm:text-3xl"
        >
          {entry.company}
          <ArrowUpRight className="h-5 w-5 text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
        </a>
        <span className="font-mono text-xs text-muted">{entry.period}</span>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-ink/90">{entry.role}</span>
        <span className="text-muted">·</span>
        <span className="text-muted">{entry.location}</span>
      </div>

      <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted">
        {entry.summary}
      </p>

      {/* Small highlights */}
      <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2">
        {entry.highlights.map((h, i) => (
          <motion.div
            key={h.title}
            data-spirit
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.05 * i }}
            className="group relative overflow-hidden rounded-xl border border-edge bg-surface/40 p-4 backdrop-blur transition hover:border-violet-500/40 hover:bg-surface/70 sm:rounded-2xl sm:p-5"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-[0.68rem] uppercase tracking-widest text-accent/90">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-base font-medium text-ink">
                {h.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted">{h.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* VerbaFlo internal showcase — big visual block */}
      {isVerbaFlo && <VfInternal />}
    </motion.div>
  );
}
