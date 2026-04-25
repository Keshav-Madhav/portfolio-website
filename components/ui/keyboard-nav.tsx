"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveSectionContext } from "@/context/active-section-context";

const shortcuts = [
  { keys: ["g", "h"], label: "Go home", action: "/#home" },
  { keys: ["g", "a"], label: "About", action: "/about" },
  { keys: ["g", "w"], label: "Work", action: "/#work" },
  { keys: ["g", "p"], label: "Projects", action: "/#projects" },
  { keys: ["g", "s"], label: "Stack", action: "/#stack" },
  { keys: ["g", "c"], label: "Contact", action: "/#contact" },
];

export default function KeyboardNav() {
  const router = useRouter();
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const [showHelp, setShowHelp] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const navigate = useCallback((action: string) => {
    router.push(action);
    
    // Set active section based on hash
    const hash = action.split("#")[1];
    if (hash === "home") setActiveSection("Me");
    else if (hash === "work") setActiveSection("Work");
    else if (hash === "projects") setActiveSection("Projects");
    else if (hash === "stack") setActiveSection("Stack");
    else if (hash === "contact") setActiveSection("Contact");
    
    setTimeOfLastClick(Date.now());
  }, [router, setActiveSection, setTimeOfLastClick]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // ? shows help
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // Escape closes help
      if (e.key === "Escape") {
        setShowHelp(false);
        setPendingKey(null);
        return;
      }

      // Handle two-key shortcuts
      if (pendingKey === "g") {
        const shortcut = shortcuts.find((s) => s.keys[1] === e.key);
        if (shortcut) {
          e.preventDefault();
          navigate(shortcut.action);
          setToast(shortcut.label);
          setTimeout(() => setToast(null), 1500);
        }
        setPendingKey(null);
        return;
      }

      // Start sequence with 'g'
      if (e.key === "g") {
        setPendingKey("g");
        timeout = setTimeout(() => setPendingKey(null), 1000);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeout);
    };
  }, [pendingKey, navigate]);

  return (
    <>
      {/* Pending key indicator */}
      <AnimatePresence>
        {pendingKey && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2"
          >
            <div className="flex items-center gap-2 rounded-lg border border-edge bg-surface/95 px-3 py-2 font-mono text-xs text-muted backdrop-blur">
              <kbd className="rounded border border-edge bg-canvas px-1.5 py-0.5 text-ink">
                {pendingKey}
              </kbd>
              <span className="text-muted/60">then...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2"
          >
            <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 font-mono text-xs text-violet-300 backdrop-blur">
              → {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help modal */}
      <AnimatePresence>
        {showHelp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed left-1/2 top-1/2 z-[71] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-edge bg-surface/95 p-6 shadow-2xl backdrop-blur"
            >
              <h3 className="font-display text-lg font-semibold text-ink">
                Keyboard shortcuts
              </h3>
              <p className="mt-1 text-sm text-muted">
                Navigate quickly with your keyboard
              </p>

              <div className="mt-5 space-y-2">
                {shortcuts.map((s) => (
                  <div
                    key={s.action}
                    className="flex items-center justify-between rounded-lg bg-canvas/50 px-3 py-2"
                  >
                    <span className="text-sm text-muted">{s.label}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((k, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <kbd className="rounded border border-edge bg-surface px-1.5 py-0.5 font-mono text-xs text-ink">
                            {k}
                          </kbd>
                          {i < s.keys.length - 1 && (
                            <span className="text-xs text-muted/50">then</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between border-t border-edge pt-4">
                <span className="text-xs text-muted">Press ? to toggle</span>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-xs text-muted hover:text-ink"
                >
                  Close · Esc
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
