"use client";

import { motion } from "framer-motion";
import SectionHeading from "./ui/section-heading";
import Marquee from "./ui/marquee";
import { stack, education, profile } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { GraduationCap, MapPin } from "lucide-react";

export default function Stack() {
  const { ref } = useSectionInView("Stack", 0.15);

  const pills = stack.flatMap((g) => g.items);

  return (
    <section
      ref={ref}
      id="stack"
      className="relative mx-auto w-full max-w-6xl px-6 py-24 sm:py-32"
    >
      <SectionHeading
        eyebrow="03 / Stack"
        title={
          <>
            Tools I reach for, and the
            <br /> systems I know cold.
          </>
        }
        description="I'm not precious about the stack — I'll use whatever's right. But these are the ones I've actually shipped with."
      />

      {/* Groups */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((group, gi) => (
          <motion.div
            key={group.group}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: gi * 0.05 }}
            className="group rounded-2xl border border-edge bg-surface/40 p-5 backdrop-blur transition hover:border-violet-500/30"
          >
            <h3 className="mb-3 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted">
              <span className="h-1 w-1 rounded-full bg-violet-400" />
              {group.group}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-edge/80 bg-canvas/60 px-2.5 py-1 font-mono text-[0.68rem] text-ink/90 transition hover:border-violet-500/40 hover:text-violet-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Marquee strip */}
      <div className="mt-12 space-y-3">
        <Marquee speed={50}>
          {pills.map((p) => (
            <MarqueePill key={p}>{p}</MarqueePill>
          ))}
        </Marquee>
        <Marquee speed={60} reverse>
          {pills.slice().reverse().map((p) => (
            <MarqueePill key={p} subtle>
              {p}
            </MarqueePill>
          ))}
        </Marquee>
      </div>

      {/* Education + misc */}
      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-edge bg-surface/40 p-6 backdrop-blur">
          <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted">
            <GraduationCap className="h-3.5 w-3.5" />
            Education
          </div>
          <h4 className="mt-3 font-display text-xl font-semibold text-ink">
            {education.school}
          </h4>
          <p className="mt-1 text-sm text-muted">{education.degree}</p>
          <p className="mt-3 font-mono text-xs text-muted">
            {education.period} · {education.location}
          </p>
        </div>
        <div className="rounded-2xl border border-edge bg-surface/40 p-6 backdrop-blur">
          <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted">
            <MapPin className="h-3.5 w-3.5" />
            Based in
          </div>
          <h4 className="mt-3 font-display text-xl font-semibold text-ink">
            {profile.location}
          </h4>
          <p className="mt-1 text-sm text-muted">
            Working remote / hybrid across IST. Happy to jump on something
            ambitious.
          </p>
          <p className="mt-3 font-mono text-xs text-muted">
            Available for collaborations · {profile.phone}
          </p>
        </div>
      </div>
    </section>
  );
}

function MarqueePill({
  children,
  subtle = false,
}: {
  children: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-4 py-2 font-mono text-sm ${
        subtle
          ? "border-edge/70 bg-canvas/30 text-muted"
          : "border-edge bg-surface/60 text-ink"
      }`}
    >
      {children}
    </span>
  );
}
