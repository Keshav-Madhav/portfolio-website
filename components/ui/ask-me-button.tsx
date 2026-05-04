"use client";

import { Sparkles } from "lucide-react";
import { askKeshav } from "@/lib/chat-trigger";
import { cn } from "@/lib/cn";

type Props = {
  /** The question to send. Phrased the way a visitor would ask it. */
  question: string;
  /**
   * Visible label on the button. Keep it short — defaults to "Ask me about this".
   * For featured cards we override to e.g. "Ask me about Cookie Clicker".
   */
  label?: string;
  /** Visual size variant. */
  size?: "sm" | "md";
  /** Extra classes. */
  className?: string;
};

/**
 * Pill-style button that opens the chat widget and immediately asks a
 * comprehensive question about the project / experience it's attached to.
 *
 * Stops propagation + prevents default so it can sit safely inside a
 * link-wrapped card without firing the parent navigation.
 */
export default function AskMeButton({
  question,
  label = "Ask me about this",
  size = "sm",
  className,
}: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        askKeshav({ question, deep: true });
      }}
      data-spirit="button"
      aria-label={label}
      className={cn(
        "group/ask inline-flex items-center gap-1.5 rounded-full border border-violet-500/40 bg-violet-500/10 font-mono uppercase tracking-wider text-violet-200 backdrop-blur transition",
        "hover:border-violet-400/70 hover:bg-violet-500/20 hover:text-violet-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60",
        size === "sm"
          ? "px-2.5 py-1 text-[0.6rem]"
          : "px-3 py-1.5 text-[0.65rem]",
        className,
      )}
    >
      <Sparkles
        className={cn(
          "transition-transform group-hover/ask:rotate-12",
          size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
        )}
        aria-hidden
      />
      {label}
    </button>
  );
}
