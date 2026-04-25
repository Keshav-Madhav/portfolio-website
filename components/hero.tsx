"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Download, Github, Linkedin, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import Magnetic from "./ui/magnetic";
import ShinyText from "./ui/shiny-text";
import SplitText from "./ui/split-text";
import DecryptedText from "./ui/decrypted-text";
import { profile } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

const rotating = [
  "agentic orchestration",
  "text-to-SQL pipelines",
  "retrieval over vector stores",
  "LLM tracing + eval harnesses",
  "dashboards that never stutter",
];

export default function Hero() {
  const { ref } = useSectionInView("Me", 0.2);
  useReducedMotion();
  const [rotIdx, setRotIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRotIdx((i) => (i + 1) % rotating.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={ref}
      id="home"
      className="relative mx-auto flex min-h-[92vh] w-full max-w-6xl flex-col justify-center px-6 pb-24 pt-28 sm:pt-40"
    >
      {/* Status pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 inline-flex w-fit items-center gap-3 rounded-full border border-edge/80 bg-surface/60 px-3 py-1.5 font-mono text-[0.72rem] text-muted backdrop-blur"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
          <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-ink/80">
          <span className="text-muted">AI Engineer @ </span>
          <a
            href="https://www.verbaflo.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-dotted underline-offset-4 hover:text-violet-300"
          >
            VerbaFlo
          </a>
        </span>
      </motion.div>

      {/* Name — SplitText reveal */}
      <h1 className="font-display text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-tight text-ink">
        <SplitText text="Keshav" />
        <br />
        <ShinyText
          text="Madhav."
          speed={5}
          className="font-display text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-tight"
        />
      </h1>

      {/* Lede */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="mt-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
      >
        I&apos;m an AI engineer building the agentic stack at{" "}
        <span className="text-ink">VerbaFlo</span>: orchestrators, retrieval,
        tracing, and the tooling that makes all of it debuggable. Previously
        founding front-end at <span className="text-ink">PrudentBit</span>.
      </motion.p>

      {/* Decrypted rotating sub-line */}
      <div className="mt-4 flex min-h-[2rem] items-center font-mono text-sm text-muted">
        <span className="mr-2 text-violet-300/80">{">"}</span>
        <span className="mr-2">currently thinking about</span>
        <DecryptedText
          text={rotating[rotIdx]}
          className="text-ink/90"
          iterations={10}
          speed={28}
        />
        <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-violet-300/80" />
      </div>

      {/* CTA row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-10 flex flex-wrap items-center gap-3"
      >
        <Magnetic>
          <Link
            data-spirit="button"
            data-spirit-first
            href="/about"
            className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-5 py-2.5 text-sm font-medium text-violet-300 backdrop-blur transition hover:border-violet-500/60 hover:bg-violet-500/20 sm:px-6 sm:py-3"
          >
            <User className="h-4 w-4" />
            <span>About me</span>
          </Link>
        </Magnetic>

        <Magnetic>
          <Link
            data-spirit="button"
            href="/#contact"
            className="group relative inline-flex min-h-[44px] items-center gap-2 overflow-hidden rounded-full border border-edge bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition hover:scale-[1.02] sm:px-6 sm:py-3"
          >
            <span>Get in touch</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </Magnetic>

        <Magnetic>
          <a
            data-spirit="button"
            href={profile.resume}
            download
            className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-edge bg-surface/60 px-5 py-2.5 text-sm font-medium text-ink backdrop-blur transition hover:border-violet-500/40 hover:bg-surface sm:px-6 sm:py-3"
          >
            <span>Résumé</span>
            <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </a>
        </Magnetic>

        <div className="ml-1 flex items-center gap-1.5">
          <IconLink href={profile.github} label="GitHub">
            <Github className="h-4 w-4" />
          </IconLink>
          <IconLink href={profile.linkedin} label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </IconLink>
          <IconLink href={`mailto:${profile.email}`} label="Email">
            <Mail className="h-4 w-4" />
          </IconLink>
        </div>
      </motion.div>

      {/* Stat strip */}
      <motion.div
        data-spirit="stats"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.45 }}
        className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-edge bg-edge/60 sm:mt-20 sm:grid-cols-4"
      >
        {profile.stats.map((s) => (
          <div
            key={s.label}
            className="bg-canvas/80 px-3 py-4 backdrop-blur-sm sm:px-5 sm:py-5"
          >
            <div className="font-display text-xl font-semibold text-ink sm:text-3xl">
              {s.value}
            </div>
            <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-widest text-muted sm:text-[0.68rem]">
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted/60">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-8 w-5 items-start justify-center rounded-full border border-muted/30 p-1"
        >
          <motion.div 
            className="h-1.5 w-1 rounded-full bg-muted/50"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

    </section>
  );
}

function IconLink({
  children,
  href,
  label,
}: {
  children: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <Magnetic strength={10}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-edge bg-surface/60 text-muted backdrop-blur transition hover:border-violet-500/50 hover:text-ink"
      >
        {children}
      </a>
    </Magnetic>
  );
}
