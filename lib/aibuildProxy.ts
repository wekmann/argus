import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { botAuthHeaders, getBotApiBaseUrl } from "@/lib/botApi";
import { fetchUserGuilds, hasAdminOrOwner } from "@/lib/discord";

const SNOWFLAKE = /^\d{17,20}$/;

/**
 * Checks that the visitor is logged in and is owner/Administrator of the guild.
 * Returns the user id, or a ready-made error response.
 */
export async function requireGuildAdmin(
  guildId: unknown,
): Promise<{ userId: string } | NextResponse> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!session?.accessToken || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (typeof guildId !== "string" || !SNOWFLAKE.test(guildId)) {
    return NextResponse.json({ error: "Invalid guildId" }, { status: 400 });
  }

  try {
    const guilds = await fetchUserGuilds(session.accessToken);
    const guild = guilds.find((g) => g.id === guildId);
    if (!guild || !hasAdminOrOwner(guild)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json(
      { error: "Could not verify your Discord permissions" },
      { status: 502 },
    );
  }

  return { userId };
}

/** Calls a protected bot endpoint with the shared secret and relays the JSON. */
export async function callBot(
  path: string,
  init: { method: "GET" | "POST"; body?: unknown },
): Promise<NextResponse> {
  if (!process.env.BOT_API_SECRET?.trim()) {
    return NextResponse.json(
      { error: "BOT_API_SECRET is not configured on the website" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${getBotApiBaseUrl()}${path}`, {
      method: init.method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...botAuthHeaders(),
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
      signal: AbortSignal.timeout(90_000),
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: `Bot returned HTTP ${res.status}` };
    }
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach the bot" },
      { status: 502 },
    );
  }
}