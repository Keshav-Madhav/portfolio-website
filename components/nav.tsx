"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { nav } from "@/lib/data";
import { useActiveSectionContext } from "@/context/active-section-context";
import { cn } from "@/lib/cn";

export default function Nav() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
      {/* SVG filter for liquid glass effect */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "nav-glass relative flex items-center gap-2 rounded-full p-1.5 transition-all",
          // Crystal clear glass - minimal blur, almost invisible
          "border border-white/[0.06]",
          "bg-transparent",
          "backdrop-blur-[2px]",
          // When scrolled, very subtle tint appears
          scrolled && "bg-black/[0.02] border-white/[0.08] backdrop-blur-[4px] shadow-[0_2px_16px_-4px_rgba(0,0,0,0.2)]"
        )}
      >
        <Link
          href="#home"
          onClick={() => {
            setActiveSection("Work");
            setTimeOfLastClick(Date.now());
          }}
          className="group ml-2 mr-1 flex items-center gap-2 pr-2 font-display text-sm font-semibold text-ink"
        >
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.08]">
            <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
          </span>
          <span className="hidden sm:inline">km.</span>
        </Link>

        <nav>
          <ul className="flex items-center gap-0.5">
            {nav.map((link) => {
              const isActive = activeSection === link.name;
              return (
                <li key={link.hash} className="relative">
                  <Link
                    href={link.hash}
                    onClick={() => {
                      setActiveSection(link.name);
                      setTimeOfLastClick(Date.now());
                    }}
                    className={cn(
                      "relative z-10 block rounded-full px-3 py-1.5 text-xs font-medium transition sm:px-4 sm:text-sm",
                      isActive
                        ? "text-ink"
                        : "text-muted hover:text-ink"
                    )}
                  >
                    {link.name}
                  </Link>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-full bg-white/[0.05]"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </motion.div>
    </header>
  );
}
