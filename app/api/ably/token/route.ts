import { NextResponse } from "next/server";
import { Rest } from "ably";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    return new NextResponse("ABLY_API_KEY not configured", { status: 500 });
  }

  const url = new URL(req.url);
  const clientId =
    url.searchParams.get("clientId") ||
    `anon-${Math.random().toString(36).slice(2, 10)}`;

  const rest = new Rest(apiKey);
  const tokenRequest = await rest.auth.createTokenRequest({ clientId });

  return NextResponse.json(tokenRequest);
}
