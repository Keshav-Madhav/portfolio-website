import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB
const MAX_TEXT_CHARS = 30_000; // chat context cap

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const filename = (file as File).name ?? "upload";
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 4 MB)" },
        { status: 413 },
      );
    }

    const lower = filename.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    let text = "";
    let kind = "txt";

    if (lower.endsWith(".pdf")) {
      kind = "pdf";
      // pdf-parse v1 — simple function API. Imported dynamically so the heavy
      // pdfjs dep only loads when an actual PDF is uploaded.
      const pdfParse = (await import("pdf-parse")).default;
      const result = await pdfParse(buffer);
      text = result.text;
    } else if (lower.endsWith(".docx")) {
      kind = "docx";
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (
      lower.endsWith(".txt") ||
      lower.endsWith(".md") ||
      lower.endsWith(".markdown")
    ) {
      kind = lower.endsWith(".md") || lower.endsWith(".markdown") ? "md" : "txt";
      text = buffer.toString("utf8");
    } else {
      return NextResponse.json(
        {
          error:
            "Unsupported file type — please upload a .pdf, .docx, .txt, or .md",
        },
        { status: 415 },
      );
    }

    // Normalize whitespace and clamp
    text = text
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, MAX_TEXT_CHARS);

    return NextResponse.json({
      filename,
      kind,
      chars: text.length,
      text,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to parse file";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
