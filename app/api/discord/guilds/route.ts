import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { fetchUserGuilds, hasAdminOrOwner } from "@/lib/discord";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const guilds = await fetchUserGuilds(session.accessToken);
    const manageable = guilds.filter(hasAdminOrOwner);
    return NextResponse.json({ guilds: manageable });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch Discord guilds";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
