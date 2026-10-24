import { NextRequest, NextResponse } from "next/server";
import { callBot, requireGuildAdmin } from "@/lib/aibuildProxy";

/** Step 2: approved plan -> the bot starts building. */
export async function POST(req: NextRequest) {
  let body: { guildId?: unknown; plan?: unknown; prompt?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const auth = await requireGuildAdmin(body.guildId);
  if (auth instanceof NextResponse) return auth;

  if (!body.plan || typeof body.plan !== "object") {
    return NextResponse.json({ error: "plan is required" }, { status: 400 });
  }

  return callBot("/api/aibuild/execute", {
    method: "POST",
    body: {
      guildId: body.guildId,
      userId: auth.userId,
      plan: body.plan,
      prompt: typeof body.prompt === "string" ? body.prompt : undefined,
    },
  });
}