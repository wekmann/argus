/** Discord Administrator permission bit (0x8). */
export const ADMINISTRATOR = 8n;

export type DiscordGuild = {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
};

export function hasAdminOrOwner(guild: DiscordGuild): boolean {
  if (guild.owner) return true;
  try {
    const perms = BigInt(guild.permissions);
    return (perms & ADMINISTRATOR) === ADMINISTRATOR;
  } catch {
    return false;
  }
}

export function guildIconUrl(guild: DiscordGuild, size = 128): string | null {
  if (!guild.icon) return null;
  const ext = guild.icon.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${ext}?size=${size}`;
}

export function getInviteUrl(): string {
  const clientId =
    process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID?.trim() ||
    process.env.DISCORD_CLIENT_ID?.trim() ||
    "1563494130347417722";

  return `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&integration_type=0&scope=bot`;
}

/**
 * Fetch the authenticated user's guilds from Discord.
 */
export async function fetchUserGuilds(
  accessToken: string,
): Promise<DiscordGuild[]> {
  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Discord guilds request failed (${res.status})`);
  }

  const data = (await res.json()) as DiscordGuild[];
  return Array.isArray(data) ? data : [];
}
