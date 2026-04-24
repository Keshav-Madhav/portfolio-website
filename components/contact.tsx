"use client";

import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Copy, Mail, ArrowUpRight } from "lucide-react";
import SectionHeading from "./ui/section-heading";
import SubmitBtn from "./submit-btn";
import { sendEmail } from "@/actions/sendEmail";
import { profile } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

export default function Contact() {
  const { ref } = useSectionInView("Contact", 0.3);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast.success("Email copied");
    } catch {
      toast.error("Copy failed, please grab it manually");
    }
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="relative mx-auto w-full max-w-6xl px-6 py-24 sm:py-32"
    >
      <SectionHeading
        eyebrow="04 / Let's build"
        title={
          <>
            Have a problem that
            <br />
            <span className="text-gradient">smells interesting?</span>
          </>
        }
        description="I'm always up for a conversation about agentic systems, retrieval infra, or building real products on top of LLMs. The faster path is email."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left: info card */}
        <motion.div
          data-spirit
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-edge bg-surface/40 p-8 backdrop-blur"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/40 to-transparent blur-3xl"
          />
          <div className="relative">
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              Direct
            </div>
            <button
              onClick={copyEmail}
              className="group mt-2 flex w-full items-center justify-between gap-4 rounded-2xl border border-edge bg-canvas/60 px-4 py-3.5 text-left transition hover:border-violet-500/40"
            >
              <span className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted" />
                <span className="font-mono text-sm text-ink">
                  {profile.email}
                </span>
              </span>
              <Copy className="h-4 w-4 text-muted transition group-hover:text-ink" />
            </button>

            <div className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              Alternate
            </div>
            <a
              href={`mailto:${profile.altEmail}`}
              className="mt-2 flex items-center gap-3 font-mono text-sm text-muted transition hover:text-ink"
            >
              {profile.altEmail}
            </a>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-edge bg-canvas/40 px-4 py-3 text-sm transition hover:border-violet-500/40"
              >
                <span className="text-ink">GitHub</span>
                <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-ink" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-edge bg-canvas/40 px-4 py-3 text-sm transition hover:border-violet-500/40"
              >
                <span className="text-ink">LinkedIn</span>
                <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-ink" />
              </a>
            </div>

            <div className="mt-8 border-t border-edge pt-6">
              <p className="text-xs leading-relaxed text-muted">
                Based in {profile.location}. Typical response within 24h.
                I take on a small number of outside projects each year, so ping
                me and let&apos;s see.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          action={async (formData) => {
            const { error } = await sendEmail(formData);
            if (error) {
              toast.error(error);
              return;
            }
            toast.success("Sent! Talk soon");
          }}
          className="rounded-3xl border border-edge bg-surface/40 p-6 backdrop-blur sm:p-8"
        >
          <div className="mb-5">
            <label className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              Your email
            </label>
            <input
              name="senderEmail"
              type="email"
              required
              maxLength={500}
              placeholder="you@domain.com"
              className="mt-2 w-full rounded-xl border border-edge bg-canvas/60 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-violet-500/50 focus:bg-canvas"
            />
          </div>
          <div className="mb-5">
            <label className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              Message
            </label>
            <textarea
              name="message"
              required
              maxLength={5000}
              rows={7}
              placeholder="What are you building? What's the rough shape of the problem?"
              className="mt-2 w-full resize-none rounded-xl border border-edge bg-canvas/60 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-violet-500/50 focus:bg-canvas"
            />
          </div>
          <SubmitBtn />
        </motion.form>
      </div>
    </section>
  );
}
