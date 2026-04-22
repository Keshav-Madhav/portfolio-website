"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

export default function DecryptedText({
  text,
  speed = 35,
  iterations = 14,
  active = true,
  className,
}: {
  text: string;
  speed?: number;
  iterations?: number;
  active?: boolean;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const target = useRef(text);
  const queue = useRef<
    { from: string; to: string; start: number; end: number; char?: string }[]
  >([]);
  const rafRef = useRef<number>();
  const tickRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return;
    }
    const old = target.current;
    target.current = text;
    const length = Math.max(old.length, text.length);
    queue.current = [];
    for (let i = 0; i < length; i++) {
      const from = old[i] || "";
      const to = text[i] || "";
      const start = Math.floor(Math.random() * iterations);
      const end = start + Math.floor(Math.random() * iterations);
      queue.current.push({ from, to, start, end });
    }
    frame.current = 0;

    const update = () => {
      let output = "";
      let complete = 0;
      for (let i = 0; i < queue.current.length; i++) {
        const q = queue.current[i];
        if (frame.current >= q.end) {
          complete++;
          output += q.to;
        } else if (frame.current >= q.start) {
          if (!q.char || Math.random() < 0.28) {
            q.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          output += q.char;
        } else {
          output += q.from;
        }
      }
      setDisplay(output);
      if (complete === queue.current.length) {
        if (tickRef.current) clearInterval(tickRef.current);
        return;
      }
      frame.current++;
    };

    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(update, speed);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, speed, iterations, active]);

  return <span className={className}>{display}</span>;
}
