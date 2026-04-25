"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const MESSAGES = [
  "You found the secret! 🎮",
  "Achievement unlocked: Retro gamer",
  "30 extra lives granted... wait, wrong game",
  "Player 2 has entered the chat",
  "You're officially cool now",
];

export default function Konami() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [triggered, setTriggered] = useState(false);
  const [message, setMessage] = useState("");

  const handleSuccess = useCallback(() => {
    setTriggered(true);
    setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    
    // Create confetti burst effect via CSS class
    document.body.classList.add("konami-active");
    
    setTimeout(() => {
      setTriggered(false);
      document.body.classList.remove("konami-active");
    }, 4000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const newSequence = [...sequence, e.key].slice(-10);
      setSequence(newSequence);

      if (
        newSequence.length === KONAMI_CODE.length &&
        newSequence.every((key, i) => key === KONAMI_CODE[i])
      ) {
        handleSuccess();
        setSequence([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sequence, handleSuccess]);

  return (
    <AnimatePresence>
      {triggered && (
        <>
          {/* Rainbow border flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[100]"
            style={{
              boxShadow: "inset 0 0 100px 20px rgba(167, 139, 250, 0.3)",
            }}
          />

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="fixed left-1/2 top-1/2 z-[101] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-2xl border border-violet-500/50 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 px-8 py-6 text-center backdrop-blur-xl">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="mb-3 text-4xl"
              >
                🎮
              </motion.div>
              <p className="font-display text-xl font-semibold text-ink">
                {message}
              </p>
              <p className="mt-2 font-mono text-xs text-muted">
                ↑↑↓↓←→←→BA
              </p>
            </div>
          </motion.div>

          {/* Floating emojis */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
              }}
              animate={{
                y: -100,
                x: Math.random() * window.innerWidth,
                rotate: Math.random() * 360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
              className="pointer-events-none fixed z-[102] text-2xl"
            >
              {["🎮", "⭐", "🚀", "✨", "🎯", "💫"][i % 6]}
            </motion.div>
          ))}
        </>
      )}
    </AnimatePresence>
  );
}
