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
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "flex items-center gap-2 rounded-full border border-edge bg-canvas/60 p-1.5 backdrop-blur-xl transition-all",
          scrolled && "shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)]"
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
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full border border-edge bg-surface">
            <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />
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
                      className="absolute inset-0 rounded-full bg-surface"
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
