"use client";

import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useInView } from "@/lib/use-in-view";
import { useIsMobile } from "@/lib/use-is-mobile";
import { cn } from "@/lib/cn";

export type CycleImage = {
  src: StaticImageData | string;
  caption?: string;
};

export default function ImageCycler({
  images,
  interval = 2600,
  className,
  sizes,
  priority = false,
}: {
  images: CycleImage[];
  interval?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Don't waste an interval (or AnimatePresence remount + image fetch) when
  // the gallery is scrolled out of view.
  const [viewRef, inView] = useInView<HTMLDivElement>({ threshold: 0 });
  const isMobile = useIsMobile();

  // Skip filter: blur on mobile — expensive on phone GPUs
  const variants = useMemo(
    () =>
      isMobile
        ? {
            initial: { opacity: 0, scale: 1.02 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.98 },
          }
        : {
            initial: { opacity: 0, scale: 1.04, filter: "blur(8px)" },
            animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
            exit: { opacity: 0, scale: 0.98, filter: "blur(6px)" },
          },
    [isMobile]
  );

  useEffect(() => {
    if (paused || !inView || images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval, images.length, paused, inView]);

  return (
    <div
      ref={viewRef}
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <m.div
          key={index}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ duration: isMobile ? 0.4 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={images[index].src}
            alt={images[index].caption || "Project screenshot"}
            fill
            sizes={sizes}
            className="object-cover"
            priority={priority}
          />
        </m.div>
      </AnimatePresence>

      {/* Caption + dots */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3">
        <AnimatePresence mode="wait">
          {images[index].caption && (
            <m.span
              key={index + "-cap"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-full border border-edge/30 bg-surface/80 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted backdrop-blur"
            >
              {images[index].caption}
            </m.span>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                i === index
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
