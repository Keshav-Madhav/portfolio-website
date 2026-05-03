"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Code-split the heavy decorative components into their own JS chunks and
// defer their mount until the browser is idle (or after 800ms fallback).
// This lets LCP, hydration, and first interaction land before any canvas
// loops or DOM-watching effects start eating frame budget.

const FlowField = dynamic(() => import("./ui/flow-field"), { ssr: false });
const ParticleField = dynamic(() => import("./ui/particle-field"), {
  ssr: false,
});
const ClickSpark = dynamic(() => import("./ui/click-spark"), { ssr: false });
const SpiritGuide = dynamic(() => import("./ui/spirit-guide"), { ssr: false });
const VelocityTilt = dynamic(() => import("./ui/velocity-tilt"), {
  ssr: false,
});
const KeyboardNav = dynamic(() => import("./ui/keyboard-nav"), { ssr: false });
const Konami = dynamic(() => import("./ui/konami"), { ssr: false });
const Multiplayer = dynamic(() => import("./ui/multiplayer"), { ssr: false });
const ChatWidget = dynamic(() => import("./ui/chat-widget"), { ssr: false });
// Toaster is rarely needed in the first frame (only fires after a contact
// form submit / copy-email click). Pull it out of the critical bundle.
const Toaster = dynamic(
  () => import("react-hot-toast").then((m) => m.Toaster),
  { ssr: false },
);
const LenisProvider = dynamic(() => import("./lenis-provider"), { ssr: false });

export default function DeferredEffects() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout?: number },
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return null;

  return (
    <>
      <LenisProvider />
      <FlowField />
      <ParticleField />
      <VelocityTilt />
      <ClickSpark />
      <SpiritGuide />
      <KeyboardNav />
      <Konami />
      <Multiplayer />
      <ChatWidget />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "hsl(222 18% 8%)",
            color: "hsl(220 15% 96%)",
            border: "1px solid hsl(220 13% 18%)",
          },
        }}
      />
    </>
  );
}
