import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { fetchGuildLogs } from "@/lib/botApi";
import { fetchUserGuilds, hasAdminOrOwner } from "@/lib/discord";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const guildId = req.nextUrl.searchParams.get("guildId")?.trim();
  if (!guildId) {
    return NextResponse.json(
      { error: "Missing guildId query parameter" },
      { status: 400 },
    );
  }

  try {
    const userGuilds = await fetchUserGuilds(session.accessToken);
    const guild = userGuilds.find((g) => g.id === guildId);
    if (!guild || !hasAdminOrOwner(guild)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const logs = await fetchGuildLogs(guildId, { cache: "no-store" });
    return NextResponse.json({ logs });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch moderation logs";
    return NextResponse.json({ error: message, logs: [] }, { status: 502 });
  }
}
