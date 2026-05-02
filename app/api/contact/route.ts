import React from "react";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateString, getErrorMessage } from "@/lib/utils";
import ContactFormEmail from "@/email/contact-form-email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 },
    );
  }

  const formData = await req.formData();
  const senderEmail = formData.get("senderEmail");
  const message = formData.get("message");

  if (!validateString(senderEmail, 500)) {
    return NextResponse.json({ error: "Invalid sender email" }, { status: 400 });
  }
  if (!validateString(message, 5000)) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  try {
    const data = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "keshav2552003@gmail.com",
      subject: "Message from contact form",
      reply_to: senderEmail as string,
      react: React.createElement(ContactFormEmail, {
        message: message as string,
        senderEmail: senderEmail as string,
      }),
    });
    return NextResponse.json({ data });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
