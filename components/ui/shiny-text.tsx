"use client";

import { cn } from "@/lib/cn";

export default function ShinyText({
  text,
  speed = 4,
  disabled = false,
  className,
}: {
  text: string;
  speed?: number;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("shiny-text", disabled && "shiny-text-off", className)}
      style={{
        // @ts-ignore
        "--shiny-speed": `${speed}s`,
      }}
    >
      {text}
    </span>
  );
}
