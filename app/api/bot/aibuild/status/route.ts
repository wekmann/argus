import { NextRequest, NextResponse } from "next/server";
import { callBot, requireGuildAdmin } from "@/lib/aibuildProxy";

/** Step 3: build progress. GET /api/bot/aibuild/status?id=1&guildId=123... */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const guildId = req.nextUrl.searchParams.get("guildId");

  if (!/^\d{1,12}$/.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const auth = await requireGuildAdmin(guildId);
  if (auth instanceof NextResponse) return auth;

  return callBot(
    `/api/aibuild/${id}?userId=${encodeURIComponent(auth.userId)}`,
    { method: "GET" },
  );
}