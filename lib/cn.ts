import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const accentMap = {
  violet: {
    text: "text-violet-300",
    glow: "from-violet-500/40 via-violet-500/10 to-transparent",
    ringHover: "group-hover:ring-violet-500/30",
    dot: "bg-violet-400",
    shadow:
      "group-hover:shadow-[0_20px_80px_-30px_rgba(167,139,250,0.55)]",
  },
  cyan: {
    text: "text-cyan-300",
    glow: "from-cyan-500/40 via-cyan-500/10 to-transparent",
    ringHover: "group-hover:ring-cyan-500/30",
    dot: "bg-cyan-400",
    shadow:
      "group-hover:shadow-[0_20px_80px_-30px_rgba(34,211,238,0.55)]",
  },
  emerald: {
    text: "text-emerald-300",
    glow: "from-emerald-500/40 via-emerald-500/10 to-transparent",
    ringHover: "group-hover:ring-emerald-500/30",
    dot: "bg-emerald-400",
    shadow:
      "group-hover:shadow-[0_20px_80px_-30px_rgba(52,211,153,0.55)]",
  },
  amber: {
    text: "text-amber-300",
    glow: "from-amber-500/40 via-amber-500/10 to-transparent",
    ringHover: "group-hover:ring-amber-500/30",
    dot: "bg-amber-400",
    shadow:
      "group-hover:shadow-[0_20px_80px_-30px_rgba(251,191,36,0.55)]",
  },
  rose: {
    text: "text-rose-300",
    glow: "from-rose-500/40 via-rose-500/10 to-transparent",
    ringHover: "group-hover:ring-rose-500/30",
    dot: "bg-rose-400",
    shadow:
      "group-hover:shadow-[0_20px_80px_-30px_rgba(251,113,133,0.55)]",
  },
  indigo: {
    text: "text-indigo-300",
    glow: "from-indigo-500/40 via-indigo-500/10 to-transparent",
    ringHover: "group-hover:ring-indigo-500/30",
    dot: "bg-indigo-400",
    shadow:
      "group-hover:shadow-[0_20px_80px_-30px_rgba(129,140,248,0.55)]",
  },
} as const;
