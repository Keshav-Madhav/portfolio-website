"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { Copy, Mail, ArrowUpRight } from "lucide-react";
import SectionHeading from "./ui/section-heading";
import SubmitBtn from "./submit-btn";
import { profile } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

// Lazy-load react-hot-toast so it stays out of the critical bundle.
// Toast only fires after a user interaction (form submit / copy-email click).
async function showToast(type: "success" | "error", msg: string) {
  const { default: toast } = await import("react-hot-toast");
  toast[type](msg);
}

async function postContact(formData: FormData) {
  const res = await fetch("/api/contact", { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Send failed" }));
    return { error: err.error ?? "Send failed" };
  }
  return res.json();
}

export default function Contact() {
  const { ref } = useSectionInView("Contact", 0.3);
  const [pending, setPending] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      showToast("success", "Email copied");
    } catch {
      showToast("error", "Copy failed, please grab it manually");
    }
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-32"
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
        <m.div
          data-spirit
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-edge bg-surface/40 p-5 backdrop-blur sm:rounded-3xl sm:p-8"
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
              className="group mt-2 flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl border border-edge bg-canvas/60 px-3 py-3 text-left transition hover:border-violet-500/40 sm:gap-4 sm:rounded-2xl sm:px-4 sm:py-3.5"
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
              className="mt-2 flex min-h-[44px] items-center gap-3 font-mono text-sm text-muted transition hover:text-ink"
            >
              {profile.altEmail}
            </a>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[48px] items-center justify-between rounded-lg border border-edge bg-canvas/40 px-3 py-2.5 text-sm transition hover:border-violet-500/40 sm:rounded-xl sm:px-4 sm:py-3"
              >
                <span className="text-ink">GitHub</span>
                <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-ink" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[48px] items-center justify-between rounded-lg border border-edge bg-canvas/40 px-3 py-2.5 text-sm transition hover:border-violet-500/40 sm:rounded-xl sm:px-4 sm:py-3"
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
        </m.div>

        {/* Right: form */}
        <m.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          action={async (formData) => {
            setPending(true);
            try {
              const { error } = await postContact(formData);
              if (error) {
                showToast("error", error);
                return;
              }
              showToast("success", "Sent! Talk soon");
            } finally {
              setPending(false);
            }
          }}
          className="rounded-2xl border border-edge bg-surface/40 p-5 backdrop-blur sm:rounded-3xl sm:p-8"
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
              className="mt-2 w-full rounded-lg border border-edge bg-canvas/60 px-3 py-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-violet-500/50 focus:bg-canvas sm:rounded-xl sm:px-4"
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
              rows={6}
              placeholder="What are you building? What's the rough shape of the problem?"
              className="mt-2 w-full resize-none rounded-lg border border-edge bg-canvas/60 px-3 py-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-violet-500/50 focus:bg-canvas sm:rounded-xl sm:px-4"
            />
          </div>
          <SubmitBtn pending={pending} />
        </m.form>
      </div>
    </section>
  );
}
