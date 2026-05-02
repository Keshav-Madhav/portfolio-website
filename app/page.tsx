import Hero from "@/components/hero";
import About from "@/components/about";
import Experience from "@/components/experience";
import Projects from "@/components/projects";
import Stack from "@/components/stack";
import Contact from "@/components/contact";

// Force static prerendering — page has no request-time data deps. Vercel
// will cache the HTML at the edge instead of running the server per request.
export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Stack />
      <Contact />
    </>
  );
}
