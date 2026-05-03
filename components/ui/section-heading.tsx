"use client";

import { m } from "framer-motion";
import { useInView } from "@/lib/use-in-view";
import { useIsMobile } from "@/lib/use-is-mobile";
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
  const [ref, inView] = useInView<HTMLHeadingElement>({
    threshold: 0.4,
    triggerOnce: true,
  });
  const isMobile = useIsMobile();

  // Skip filter: blur on mobile — it's expensive on phone GPUs
  const h2Initial = isMobile
    ? { opacity: 0, y: 24 }
    : { opacity: 0, y: 24, filter: "blur(8px)" };
  const h2Animate = isMobile
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0, filter: "blur(0)" };

  return (
    <div
      className={cn(
        "mb-10 flex flex-col sm:mb-16",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <m.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:mb-6 sm:text-[0.7rem]"
        >
          <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-muted/60 sm:w-8" />
          {eyebrow}
        </m.div>
      )}
      <m.h2
        ref={ref}
        initial={h2Initial}
        whileInView={h2Animate}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: isMobile ? 0.5 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "heading-paint font-display text-2xl font-semibold leading-[1.2] tracking-tight text-ink sm:text-4xl lg:text-5xl sm:leading-[1.15]",
          inView && "in-view"
        )}
      >
        {title}
      </m.h2>
      {description && (
        <m.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:mt-6 sm:text-base lg:text-lg"
        >
          {description}
        </m.p>
      )}
    </div>
  );
}
