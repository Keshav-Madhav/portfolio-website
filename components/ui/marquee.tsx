"use client";

import React from "react";

export default function Marquee({
  children,
  className,
  reverse = false,
  speed = 40,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  speed?: number;
}) {
  return (
    <div className={`relative overflow-hidden marquee-mask ${className ?? ""}`}>
      <div
        className="flex min-w-full shrink-0 gap-6 pr-6"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 gap-6">{children}</div>
        <div className="flex shrink-0 gap-6" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
