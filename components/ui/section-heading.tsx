"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
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
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: true });

  return (
    <div
      className={cn(
        "mb-10 flex flex-col sm:mb-16",
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
          className="mb-4 inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:mb-6 sm:text-[0.7rem]"
        >
          <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-muted/60 sm:w-8" />
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        ref={ref}
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "heading-paint font-display text-2xl font-semibold leading-[1.2] tracking-tight text-ink sm:text-4xl lg:text-5xl sm:leading-[1.15]",
          inView && "in-view"
        )}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:mt-6 sm:text-base lg:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
