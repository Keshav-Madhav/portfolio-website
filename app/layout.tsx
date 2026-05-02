import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Backdrop from "@/components/backdrop";
import LazyMotionProvider from "@/components/lazy-motion-provider";
import ScrollProgress from "@/components/ui/scroll-progress";
import DeferredEffects from "@/components/deferred-effects";
import ActiveSectionContextProvider from "@/context/active-section-context";

// Trimmed weight sets — only what the design actually uses. Each weight is a
// separate woff2 file in the bundle; loading just what's needed roughly
// halves the font payload.
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Keshav Madhav | AI Engineer",
  description:
    "Keshav Madhav, AI Engineer at VerbaFlo. Building agentic systems, retrieval pipelines, and the interfaces that make them legible.",
  openGraph: {
    title: "Keshav Madhav | AI Engineer",
    description:
      "AI Engineer at VerbaFlo. Agentic systems, retrieval, evals, and blazing-fast tooling.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <body className="font-sans antialiased selection:bg-accent/40 relative">
        {/* Eager: visible from first paint */}
        <Backdrop />
        <ScrollProgress />
        <LazyMotionProvider>
          <ActiveSectionContextProvider>
            <Nav />
            <main>{children}</main>
            <Footer />
            {/* Deferred: Lenis, Toaster, all decorative + interactive effects.
                Code-split into a separate chunk and mounted on idle, so they
                don't compete with hydration / LCP. */}
            <DeferredEffects />
          </ActiveSectionContextProvider>
        </LazyMotionProvider>
      </body>
    </html>
  );
}
