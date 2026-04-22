"use client";

import React from "react";
import { Loader2, Send } from "lucide-react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function SubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex h-11 items-center gap-2 rounded-full border border-edge bg-ink px-6 text-sm font-medium text-canvas transition hover:scale-[1.02] disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Sending
        </>
      ) : (
        <>
          Send message
          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </>
      )}
    </button>
  );
}
