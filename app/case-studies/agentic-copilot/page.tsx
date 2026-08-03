import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { copilotCaseStudy as cs } from "@/lib/case-studies";

// Pure content page — no per-request data, no client JS of its own.
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `${cs.title} | Keshav Madhav`,
  description: cs.dek,
};

export default function AgenticCopilotCaseStudy() {
  return (
    <main className="relative mx-auto w-full max-w-3xl px-6 pb-24 pt-28 sm:pt-36">
      {/* Back link */}
      <Link
        href="/#work"
        className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted transition hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        Back to the work
      </Link>

      {/* Header */}
      <header className="mt-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-accent">
          <Sparkles className="h-3 w-3" />
          {cs.eyebrow}
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          {cs.title}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
          {cs.dek}
        </p>
      </header>

      {/* Headline metrics */}
      <div className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {cs.metrics.map((mtr) => (
          <div
            key={mtr.label}
            className="rounded-xl border border-edge bg-surface/40 p-3 backdrop-blur sm:rounded-2xl sm:p-4"
          >
            <div className="font-display text-xl font-semibold text-violet-300 sm:text-2xl">
              {mtr.value}
            </div>
            <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
              {mtr.label}
            </div>
            <div className="mt-1 text-[0.7rem] leading-snug text-ink/70">
              {mtr.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Body */}
      <article className="mt-14 space-y-14">
        {cs.sections.map((section, si) => (
          <section key={section.id} id={section.id}>
            <h2 className="flex items-baseline gap-3 font-display text-xl font-semibold text-ink sm:text-2xl">
              <span className="font-mono text-xs text-violet-300/80">
                {String(si + 1).padStart(2, "0")}
              </span>
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-muted sm:text-base">
              {section.body.map((paragraph, pi) => (
                <p key={pi}>{paragraph}</p>
              ))}
            </div>
            {section.bullets && (
              <ul className="mt-4 space-y-3">
                {section.bullets.map((bullet, bi) => (
                  <li
                    key={bi}
                    className="flex items-start gap-3 text-[0.92rem] leading-relaxed text-muted"
                  >
                    <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/70" />
                    <span>
                      <BoldLead text={bullet} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {section.diagram && (
              <pre className="mt-6 overflow-x-auto rounded-2xl border border-edge bg-canvas/60 p-4 font-mono text-[0.7rem] leading-relaxed text-ink/80 sm:p-5 sm:text-xs">
                {section.diagram}
              </pre>
            )}
          </section>
        ))}
      </article>

      {/* Footnote */}
      <p className="mt-14 border-l-2 border-violet-500/40 pl-4 text-sm italic leading-relaxed text-muted">
        {cs.footnote}
      </p>
    </main>
  );
}

/**
 * Bullets are written as "Lead sentence. Rest of the detail." — render the
 * first sentence in ink so each bullet scans like a labeled tradeoff.
 */
function BoldLead({ text }: { text: string }) {
  const splitAt = text.indexOf(". ");
  if (splitAt === -1) return <>{text}</>;
  return (
    <>
      <span className="text-ink/85">{text.slice(0, splitAt + 1)}</span>{" "}
      {text.slice(splitAt + 2)}
    </>
  );
}
