"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

const wordV: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0)",
    transition: {
      delay: i * 0.05,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function SplitText({
  text,
  className,
  once = true,
  as = "span",
}: {
  text: string;
  className?: string;
  once?: boolean;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const reduce = useReducedMotion();
  const Tag: any = as;

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(" ");

  return (
    <Tag className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-baseline whitespace-pre"
        >
          <motion.span
            className="inline-block"
            custom={i}
            variants={wordV}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount: 0.4 }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
