"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import SectionHeading from "./ui/section-heading";
import TiltedCard from "./ui/tilted-card";
import ImageCycler from "./ui/image-cycler";
import ShinyText from "./ui/shiny-text";
import { projects } from "@/lib/data";
import { accentMap, cn } from "@/lib/cn";
import { useSectionInView } from "@/lib/hooks";
import type { AccentColor } from "@/lib/types";

type Proj = (typeof projects)[number];

export default function Projects() {
  const { ref } = useSectionInView("Projects", 0.1);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section
      ref={ref}
      id="projects"
      className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-32"
    >
      <SectionHeading
        eyebrow="02 / Selected work"
        title={
          <>
            Projects I&apos;m{" "}
            <ShinyText text="proud" className="font-display" /> of.
          </>
        }
        description="A mix of things I open-sourced, simulations I couldn't stop building, and work I contributed to other people's projects. (VerbaFlo internal tools live up there ↑ with the rest of the job.)"
      />

      {/* Featured bento */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-6 sm:auto-rows-[minmax(220px,auto)]">
        {featured.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.8,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn("perspective-card", featuredLayout(i))}
          >
            <TiltedCard intensity={5} className="h-full">
              <FeaturedCard project={p} accent={p.accent as AccentColor} />
            </TiltedCard>
          </motion.div>
        ))}
      </div>

      {/* Rest grid */}
      <h3 className="mt-16 mb-4 font-mono text-[0.68rem] uppercase tracking-[0.25em] text-muted sm:mt-24 sm:mb-6 sm:text-[0.72rem]">
        More builds
      </h3>
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <CompactCard
            key={p.slug}
            project={p}
            accent={p.accent as AccentColor}
          />
        ))}
      </div>
    </section>
  );
}

// Bento layout for 5 featured slots on a 6-col grid:
//   0: Grid Math          — col-span-4 row-span-2 (big hero, top-left)
//   1: Live Jinja         — col-span-2 row-span-2 (tall stat, top-right)
//   2: Cookie Clicker     — col-span-4 row-span-2 (big hero, middle-left)
//   3: Space Sandbox      — col-span-2 row-span-2 (tall, middle-right)
//   4: Axon               — col-span-6         (wide stat at bottom)
function featuredLayout(i: number): string {
  switch (i) {
    case 0:
      return "sm:col-span-4 sm:row-span-2";
    case 1:
      return "sm:col-span-2 sm:row-span-2";
    case 2:
      return "sm:col-span-4 sm:row-span-2";
    case 3:
      return "sm:col-span-2 sm:row-span-2";
    case 4:
      return "sm:col-span-6";
    default:
      return "sm:col-span-3";
  }
}

function FeaturedCard({
  project,
  accent,
}: {
  project: Proj;
  accent: AccentColor;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const background = useMotionTemplate`radial-gradient(520px circle at ${useTransform(
    mx,
    (v) => `${v * 100}%`
  )} ${useTransform(my, (v) => `${v * 100}%`)}, hsl(var(--accent) / 0.16), transparent 55%)`;

  const a = accentMap[accent];
  const hasGallery = project.gallery && project.gallery.length > 0;
  const hasStat = !!project.stat;
  const primary = project.links[0];

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      data-spirit
      className={cn(
        "group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-edge bg-surface/40 backdrop-blur transition",
        "hover:border-edge/0",
        a.shadow
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-transparent transition",
          a.ringHover
        )}
      />

      {/* Gallery in top half for gallery projects */}
      {hasGallery && (
        <div className="relative mx-3 mt-3 aspect-[16/9] overflow-hidden rounded-xl border border-edge/80 bg-canvas sm:mx-4 sm:mt-4 sm:rounded-2xl">
          <ImageCycler
            images={[...project.gallery!]}
            className="h-full w-full"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      )}

      <div className="relative flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-canvas/50 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
            <span className={cn("h-1.5 w-1.5 rounded-full", a.dot)} />
            {project.kind}
          </span>
          {hasStat && hasGallery ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border bg-canvas/60 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-widest",
                a.text,
                "border-edge"
              )}
            >
              <span className="font-semibold">{project.stat!.value}</span>
              <span className="text-muted">{project.stat!.label}</span>
            </span>
          ) : !primary ? (
            <Sparkles className={cn("h-5 w-5", a.text)} aria-hidden />
          ) : null}
        </div>

        {/* Title — clickable to the primary link */}
        {primary ? (
          <a
            href={primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/title mt-4 inline-flex min-h-[44px] items-start gap-2 font-display text-xl font-semibold tracking-tight text-ink transition hover:text-violet-200 sm:mt-5 sm:text-2xl lg:text-3xl"
          >
            <span>{project.title}</span>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted transition group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5 group-hover/title:text-ink sm:h-5 sm:w-5" />
          </a>
        ) : (
          <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink sm:mt-5 sm:text-2xl lg:text-3xl">
            {project.title}
          </h3>
        )}

        {/* Stat callout (for Jinja / Axon text-forward cards) */}
        {hasStat && !hasGallery && (
          <StatHero accent={accent} stat={project.stat!} />
        )}

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          {project.description}
        </p>

        <div className="mt-auto pt-6">
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li
                key={s}
                className="rounded-full border border-edge/80 bg-canvas/60 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-muted"
              >
                {s}
              </li>
            ))}
          </ul>

{project.links.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {project.links.map((l, idx) => (
                                <a
                                  key={l.href}
                                  href={l.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={cn(
                                    "group/l inline-flex min-h-[44px] items-center gap-1 rounded-full border px-4 py-2 font-mono text-[0.65rem] uppercase tracking-wider transition sm:min-h-0 sm:px-3 sm:py-1",
                                    idx === 0
                                      ? "border-ink/70 bg-ink/10 text-ink hover:bg-ink/20"
                                      : "border-edge bg-canvas/40 text-muted hover:border-edge/40 hover:text-ink"
                                  )}
                                >
                                  {l.label}
                                  <ArrowUpRight className="h-3 w-3 transition group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" />
                                </a>
                              ))}
                            </div>
                          )}
        </div>

        {/* Abstract corner art for text-only cards WITHOUT a stat (rare) */}
        {!hasGallery && !hasStat && <AbstractArt accent={accent} />}
      </div>
    </div>
  );
}

function StatHero({
  accent,
  stat,
}: {
  accent: AccentColor;
  stat: { label: string; value: string };
}) {
  const a = accentMap[accent];
  return (
    <div className="mt-4 flex items-end justify-between overflow-hidden rounded-xl border border-edge bg-canvas/60 p-3 sm:mt-5 sm:rounded-2xl sm:p-4">
      <div>
        <div
          className={cn(
            "font-display text-3xl font-semibold leading-none sm:text-4xl lg:text-5xl",
            a.text
          )}
        >
          {stat.value}
        </div>
        <div className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-muted sm:mt-1.5 sm:text-[0.62rem]">
          {stat.label}
        </div>
      </div>
      <div
        aria-hidden
        className={cn(
          "h-10 w-10 rounded-full bg-gradient-to-br opacity-70 blur-md sm:h-14 sm:w-14",
          a.glow
        )}
      />
    </div>
  );
}

function CompactCard({
  project,
  accent,
}: {
  project: Proj;
  accent: AccentColor;
}) {
  const a = accentMap[accent];
  const primary = project.links[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="perspective-card"
    >
      <TiltedCard intensity={4} className="h-full">
        <div data-spirit className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-edge bg-surface/40 p-4 transition hover:border-edge/40 hover:bg-surface/60 sm:rounded-2xl sm:p-5">
          {/* Image / art — clickable if there's a primary link */}
          {primary ? (
            <a
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title}`}
              className="relative mb-4 block aspect-[16/10] overflow-hidden rounded-lg border border-edge/80 bg-canvas"
            >
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.05]"
                />
              ) : (
                <AbstractArt accent={accent} compact />
              )}
            </a>
          ) : (
            <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-lg border border-edge/80 bg-canvas">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.05]"
                />
              ) : (
                <AbstractArt accent={accent} compact />
              )}
            </div>
          )}

          <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
            <span className={cn("h-1.5 w-1.5 rounded-full", a.dot)} />
            {project.kind}
          </div>

          {primary ? (
            <a
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/title mt-1.5 flex min-h-[44px] items-start justify-between gap-2 font-display text-base font-medium text-ink transition hover:text-violet-200 sm:text-lg"
            >
              <span>{project.title}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5 group-hover/title:text-ink" />
            </a>
          ) : (
            <h4 className="mt-1.5 font-display text-base font-medium text-ink sm:text-lg">
              {project.title}
            </h4>
          )}

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
            {project.description}
          </p>

          <div className="mt-auto pt-4 flex flex-wrap gap-1">
            {project.stack.slice(0, 5).map((s) => (
              <span
                key={s}
                className="rounded-full border border-edge/80 bg-canvas/40 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-muted"
              >
                {s}
              </span>
            ))}
          </div>

          {project.links.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.links.map((l, idx) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex min-h-[40px] items-center gap-1 rounded-full border px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-wider transition sm:min-h-0 sm:px-2 sm:py-0.5",
                    idx === 0
                      ? "border-ink/60 bg-ink/10 text-ink hover:bg-ink/20"
                      : "border-edge bg-canvas/40 text-muted hover:border-edge/40 hover:text-ink"
                  )}
                >
                  {l.label}
                  <ArrowUpRight className="h-2.5 w-2.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </TiltedCard>
    </motion.div>
  );
}

function AbstractArt({
  accent,
  compact = false,
}: {
  accent: AccentColor;
  compact?: boolean;
}) {
  const a = accentMap[accent];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        compact ? "opacity-100" : "opacity-80"
      )}
    >
      <div
        className={cn(
          "absolute -bottom-20 -right-20 h-[22rem] w-[22rem] rounded-full bg-gradient-to-br blur-2xl",
          a.glow
        )}
      />
      <svg
        className="absolute right-4 bottom-4 h-32 w-32 opacity-50 ring-spin"
        viewBox="0 0 100 100"
      >
        {[18, 30, 42].map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeDasharray="2 4"
            strokeWidth="0.5"
            className={a.text}
          />
        ))}
        <circle cx="50" cy="50" r="3" className={cn("fill-current", a.text)} />
      </svg>
      <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b" />
    </div>
  );
}
