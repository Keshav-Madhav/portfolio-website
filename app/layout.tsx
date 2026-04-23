import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Backdrop from "@/components/backdrop";
import LenisProvider from "@/components/lenis-provider";
import ClickSpark from "@/components/ui/click-spark";
import SpiritGuide from "@/components/ui/spirit-guide";
import ParticleField from "@/components/ui/particle-field";
import ScrollProgress from "@/components/ui/scroll-progress";
import VelocityTilt from "@/components/ui/velocity-tilt";
import ActiveSectionContextProvider from "@/context/active-section-context";
import { Toaster } from "react-hot-toast";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Keshav Madhav — AI Engineer",
  description:
    "Keshav Madhav — AI Engineer at VerbaFlo. Building agentic systems, retrieval pipelines, and the interfaces that make them legible.",
  openGraph: {
    title: "Keshav Madhav — AI Engineer",
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
        <Backdrop />
        <ParticleField />
        <ScrollProgress />
        <VelocityTilt />
        <ClickSpark />
        <SpiritGuide />
        <LenisProvider>
          <ActiveSectionContextProvider>
            <Nav />
            <main>{children}</main>
            <Footer />
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
          </ActiveSectionContextProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
