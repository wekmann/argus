import { NextResponse } from "next/server";
import { fetchBotStats } from "@/lib/botApi";

export async function GET() {
  try {
    const stats = await fetchBotStats({ cache: "no-store" });
    return NextResponse.json(stats);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to reach bot API";
    return NextResponse.json(
      {
        status: "offline",
        bot: "Unavailable",
        guilds: 0,
        uptime: 0,
        error: message,
      },
      { status: 502 },
    );
  }
}
