import type { Metadata } from "next";
import AboutIDE from "./about-ide";

export const metadata: Metadata = {
  title: "About | Keshav Madhav",
  description:
    "AI Engineer at VerbaFlo. Building agentic systems, retrieval pipelines, and the interfaces that make them legible. Previously founding front-end at PrudentBit.",
};

export default function AboutPage() {
  return <AboutIDE />;
}
