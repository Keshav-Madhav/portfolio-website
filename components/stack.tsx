"use client";

import { m } from "framer-motion";
import SectionHeading from "./ui/section-heading";
import Marquee from "./ui/marquee";
import { stack, coreAreas, education, profile } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { GraduationCap, MapPin } from "lucide-react";

export default function Stack() {
  const { ref } = useSectionInView("Stack", 0.15);

  const pills = stack.flatMap((g) => g.items);

  return (
    <section
      ref={ref}
      id="stack"
      className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-32"
    >
      <SectionHeading
        eyebrow="03 / Stack"
        title={
          <>
            Six areas, one
            <br /> concise toolbox.
          </>
        }
        description="I'm not precious about the stack. I'll use whatever's right. These are the areas I work in and the tools I've actually shipped with."
      />

      {/* Core areas — the six things the work above is made of */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {coreAreas.map((area, ai) => (
          <m.div
            key={area.title}
            data-spirit
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: ai * 0.05 }}
            className="group rounded-xl border border-edge bg-surface/40 p-4 backdrop-blur transition hover:border-violet-500/30 sm:rounded-2xl sm:p-5"
          >
            <h3 className="flex items-center gap-2 font-display text-base font-semibold text-ink sm:text-lg">
              <span className="h-1 w-1 rounded-full bg-violet-400" />
              {area.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
              {area.detail}
            </p>
          </m.div>
        ))}
      </div>

      {/* Technologies — one concise list, not seven walls of pills */}
      <m.div
        data-spirit
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-4 rounded-xl border border-edge bg-surface/40 p-4 backdrop-blur sm:rounded-2xl sm:p-5"
      >
        <h3 className="mb-3 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted">
          <span className="h-1 w-1 rounded-full bg-violet-400" />
          Technologies
        </h3>
        <ul className="flex flex-wrap gap-1.5 sm:gap-2">
          {pills.map((item) => (
            <li
              key={item}
              className="rounded-full border border-edge/80 bg-canvas/60 px-3 py-1.5 font-mono text-[0.65rem] text-ink/90 transition hover:border-accent/40 hover:text-accent sm:px-2.5 sm:py-1 sm:text-[0.68rem]"
            >
              {item}
            </li>
          ))}
        </ul>
      </m.div>

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
      <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2">
        <div
          data-spirit
          className="rounded-xl border border-edge bg-surface/40 p-5 backdrop-blur sm:rounded-2xl sm:p-6"
        >
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
        <div
          data-spirit
          className="rounded-xl border border-edge bg-surface/40 p-5 backdrop-blur sm:rounded-2xl sm:p-6"
        >
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
      className={`inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-xs sm:px-4 sm:py-2 sm:text-sm ${
        subtle
          ? "border-edge/70 bg-canvas/30 text-muted"
          : "border-edge bg-surface/60 text-ink"
      }`}
    >
      {children}
    </span>
  );
}
