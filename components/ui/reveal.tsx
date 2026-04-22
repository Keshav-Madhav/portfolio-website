"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import React from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0)",
    transition: {
      delay: i * 0.04,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function Reveal({
  children,
  i = 0,
  as: Component = "div",
  className,
  once = true,
}: {
  children: React.ReactNode;
  i?: number;
  as?: any;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <Component className={className}>{children}</Component>;
  }

  const MotionTag = motion(Component);
  return (
    <MotionTag
      className={className}
      custom={i}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerGroup({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.06, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={variants} custom={0}>
      {children}
    </motion.div>
  );
}
