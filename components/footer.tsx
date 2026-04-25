"use client";

import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mx-auto mt-16 w-full max-w-6xl px-4 pb-8 sm:mt-20 sm:px-6 sm:pb-10">
      <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-edge to-transparent" />

      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/#home"
            className="inline-flex min-h-[44px] items-center gap-2 font-display text-lg font-semibold text-ink sm:text-xl"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-edge bg-surface sm:h-7 sm:w-7">
              <span className="h-2 w-2 rounded-full bg-violet-400" />
            </span>
            Keshav Madhav
          </Link>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            {profile.tagline}
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 sm:items-end">
          <div className="flex items-center gap-1.5">
            <FootLink href={profile.github} label="GitHub">
              <Github className="h-4 w-4" />
            </FootLink>
            <FootLink href={profile.linkedin} label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </FootLink>
            <FootLink href={`mailto:${profile.email}`} label="Email">
              <Mail className="h-4 w-4" />
            </FootLink>
          </div>
          <p className="font-mono text-xs text-muted">
            {profile.location} · IST
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-edge pt-5 text-xs text-muted sm:mt-10 sm:flex-row sm:items-center sm:gap-2 sm:pt-6">
        <p>
          © {year} Keshav Madhav. Built with Next.js, Framer Motion, Lenis and
          spite for bad dashboards.
        </p>
        <div className="flex items-center gap-3 font-mono">
          <span className="hidden items-center gap-1.5 text-muted/60 sm:flex">
            <kbd className="rounded border border-edge/60 bg-surface/50 px-1 py-0.5 text-[0.65rem]">?</kbd>
            <span className="text-[0.65rem]">shortcuts</span>
          </span>
          <span className="text-muted/40">·</span>
          <span>v2.0</span>
          <span className="text-muted/40">·</span>
          <span className="flex items-center gap-1">
            <span className="text-emerald-400">◉</span> online
          </span>
        </div>
      </div>
    </footer>
  );
}

function FootLink({
  href,
  children,
  label,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-edge bg-surface/60 text-muted transition hover:border-violet-500/40 hover:text-ink"
    >
      {children}
    </a>
  );
}
