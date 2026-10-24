import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { fetchBotGuildIds } from "@/lib/botApi";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const guildIds = await fetchBotGuildIds({ cache: "no-store" });
    return NextResponse.json({ guildIds });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to reach bot guilds API";
    return NextResponse.json(
      { guildIds: [], error: message },
      { status: 502 },
    );
  }
}
