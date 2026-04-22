"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted"
        >
          <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-muted/60" />
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-2xl text-base text-muted sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
