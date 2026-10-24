import { NextRequest, NextResponse } from "next/server";
import { callBot, requireGuildAdmin } from "@/lib/aibuildProxy";

export const maxDuration = 60;

/** Step 1: prompt + Gemini key -> validated plan. Nothing is created yet. */
export async function POST(req: NextRequest) {
  let body: { guildId?: unknown; prompt?: unknown; geminiKey?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const auth = await requireGuildAdmin(body.guildId);
  if (auth instanceof NextResponse) return auth;

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const geminiKey =
    typeof body.geminiKey === "string" ? body.geminiKey.trim() : "";

  if (!prompt || prompt.length > 1500) {
    return NextResponse.json(
      { error: "Prompt must be 1-1500 characters" },
      { status: 400 },
    );
  }
  if (!geminiKey) {
    return NextResponse.json(
      { error: "Gemini API key is required" },
      { status: 400 },
    );
  }

  return callBot("/api/aibuild/plan", {
    method: "POST",
    body: { guildId: body.guildId, userId: auth.userId, prompt, geminiKey },
  });
}