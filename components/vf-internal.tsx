"use client";

import { m, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { vfInternal } from "@/lib/data";
import { accentMap, cn } from "@/lib/cn";
import type { AccentColor } from "@/lib/types";
import TiltedCard from "./ui/tilted-card";

export default function VfInternal() {
  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-accent">
          <Sparkles className="h-3 w-3" />
          Shipped at VerbaFlo · internal, not open source
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {vfInternal.map((p, i) => (
          <m.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="perspective-card"
          >
            <TiltedCard intensity={8} className="h-full">
              <InternalCard project={p} accent={p.accent as AccentColor} />
            </TiltedCard>
          </m.div>
        ))}
      </div>
    </div>
  );
}

function InternalCard({
  project,
  accent,
}: {
  project: (typeof vfInternal)[number];
  accent: AccentColor;
}) {
  const a = accentMap[accent];

  return (
    <div
      data-spirit
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-edge bg-surface/60 p-6 backdrop-blur transition hover:border-edge/0",
        a.shadow
      )}
    >
      {/* Accent glow */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br blur-3xl opacity-60 transition-opacity duration-700 group-hover:opacity-100",
          a.glow
        )}
      />

      {/* Visual header — picks a motif per card */}
      <div className="relative mb-6 h-28 w-full overflow-hidden rounded-2xl border border-edge/80 bg-canvas">
        <Visual id={project.id} accent={accent} />
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted">
          <span className={cn("h-1.5 w-1.5 rounded-full", a.dot)} />
          {project.subtitle}
        </div>
        <h3 className="mt-2 font-display text-xl font-semibold text-ink">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="mt-5 space-y-1.5">
          {project.bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs leading-relaxed text-muted"
            >
              <span
                className={cn(
                  "mt-[0.45rem] h-1 w-1 shrink-0 rounded-full",
                  a.dot
                )}
              />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Visual({
  id,
  accent,
}: {
  id: (typeof vfInternal)[number]["id"];
  accent: AccentColor;
}) {
  switch (id) {
    case "simulation":
      return <SimViz accent={accent} />;
    case "mcp":
      return <McpViz accent={accent} />;
    case "trace":
      return <TraceViz accent={accent} />;
  }
}

// ----------- Animated SVG visuals (CSS/framer-motion only) -----------

function SimViz({ accent }: { accent: AccentColor }) {
  const a = accentMap[accent];
  const reduce = useReducedMotion();
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <svg
        viewBox="0 0 320 112"
        className={cn("absolute inset-0 h-full w-full", a.text)}
      >
        {/* Two parallel waveforms (runA vs runB) */}
        {[14, 58].map((y, row) => (
          <g key={row} opacity={row === 0 ? 1 : 0.55}>
            <path
              d={buildWave(y, row)}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              strokeLinecap="round"
            />
            {/* dots along the wave */}
            {Array.from({ length: 12 }).map((_, i) => {
              const x = 12 + i * 25;
              const yy = y + Math.sin(i * 0.7 + row) * 7;
              return (
                <m.circle
                  key={i}
                  cx={x}
                  cy={yy}
                  r={1.8}
                  fill="currentColor"
                  animate={reduce ? undefined : { r: [1.6, 2.4, 1.6] }}
                  transition={{
                    duration: 1.6,
                    delay: i * 0.08 + row * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </g>
        ))}
        {/* Vertical replay cursor */}
        <m.line
          x1={30}
          x2={30}
          y1={0}
          y2={112}
          stroke="currentColor"
          strokeWidth={0.6}
          strokeDasharray="2 4"
          opacity={0.9}
          animate={reduce ? undefined : { x1: [30, 290, 30], x2: [30, 290, 30] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

function buildWave(baseY: number, seed: number) {
  const points: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const x = (i / 40) * 320;
    const y = baseY + Math.sin(i * 0.55 + seed * 1.3) * 9 + Math.cos(i * 0.22) * 3;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

function McpViz({ accent }: { accent: AccentColor }) {
  const a = accentMap[accent];
  const reduce = useReducedMotion();
  const peripherals = [
    "Claude Code",
    "Cursor",
    "Codex",
    "Windsurf",
    "Antigravity",
    "Cowork",
  ];

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <svg
        viewBox="0 0 320 112"
        className={cn("absolute inset-0 h-full w-full", a.text)}
      >
        {/* center hub */}
        <circle cx={160} cy={56} r={12} fill="currentColor" opacity={0.2} />
        <circle
          cx={160}
          cy={56}
          r={5}
          fill="currentColor"
        />
        <text
          x={160}
          y={80}
          textAnchor="middle"
          className="fill-current font-mono"
          style={{ fontSize: 6, opacity: 0.9 }}
        >
          MCP
        </text>

        {peripherals.map((label, i) => {
          const angle = (Math.PI * 2 * i) / peripherals.length - Math.PI / 2;
          const x = 160 + Math.cos(angle) * 120;
          const y = 56 + Math.sin(angle) * 38;
          return (
            <g key={label}>
              <m.line
                x1={160}
                y1={56}
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeDasharray="2 3"
                strokeWidth={0.7}
                opacity={0.45}
                animate={reduce ? undefined : { opacity: [0.25, 0.85, 0.25] }}
                transition={{
                  duration: 2.2,
                  delay: i * 0.18,
                  repeat: Infinity,
                }}
              />
              <m.circle
                cx={x}
                cy={y}
                r={2.8}
                fill="currentColor"
                animate={reduce ? undefined : { r: [2.2, 3.4, 2.2] }}
                transition={{
                  duration: 2.2,
                  delay: i * 0.18,
                  repeat: Infinity,
                }}
              />
              <text
                x={x}
                y={y - 5}
                textAnchor="middle"
                className="fill-current font-mono"
                style={{ fontSize: 5, opacity: 0.75 }}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function TraceViz({ accent }: { accent: AccentColor }) {
  const a = accentMap[accent];
  const reduce = useReducedMotion();
  const spans = [
    { y: 18, x: 6, w: 260 },
    { y: 34, x: 22, w: 120 },
    { y: 34, x: 150, w: 100 },
    { y: 50, x: 30, w: 62 },
    { y: 50, x: 100, w: 38 },
    { y: 50, x: 160, w: 50 },
    { y: 50, x: 220, w: 46 },
    { y: 66, x: 36, w: 28 },
    { y: 66, x: 172, w: 24 },
    { y: 82, x: 40, w: 18 },
  ];

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <svg
        viewBox="0 0 320 112"
        className={cn("absolute inset-0 h-full w-full", a.text)}
      >
        {spans.map((s, i) => (
          <m.rect
            key={i}
            x={s.x}
            y={s.y}
            width={s.w}
            height={6}
            rx={1.5}
            fill="currentColor"
            opacity={0.55}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.6,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformOrigin: `${s.x}px ${s.y}px` }}
          />
        ))}

        <m.line
          x1={6}
          x2={6}
          y1={10}
          y2={96}
          stroke="currentColor"
          strokeWidth={0.6}
          strokeDasharray="2 3"
          opacity={0.9}
          animate={reduce ? undefined : { x1: [6, 290, 6], x2: [6, 290, 6] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
