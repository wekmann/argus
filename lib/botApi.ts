export type BotStats = {
  status: string;
  bot: string;
  guilds: number;
  uptime: number;
};

export type ModLogEntry = {
  id: number;
  guild_id: string;
  action: string;
  target_id: string | null;
  target_tag: string | null;
  moderator_id: string | null;
  moderator_tag: string | null;
  reason: string | null;
  details: string | null;
  created_at: string;
};

export const FALLBACK_BOT_API_URL =
  "https://azcicro5jq.apps.bot-hosting.cloud";

export function getBotApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BOT_API_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return FALLBACK_BOT_API_URL;
}

export function getBotStatsUrl(): string {
  return `${getBotApiBaseUrl()}/api/stats`;
}

/**
 * Authorization header for protected bot endpoints.
 * Server-side only: BOT_API_SECRET must NOT be a NEXT_PUBLIC_ variable.
 */
export function botAuthHeaders(): Record<string, string> {
  const secret = process.env.BOT_API_SECRET?.trim();
  return secret ? { Authorization: `Bearer ${secret}` } : {};
}

export function isBotOnline(status: string | undefined | null): boolean {
  return (
    String(status ?? "")
      .trim()
      .toLowerCase() === "online"
  );
}

/**
 * Formats uptime seconds into a readable string, e.g. "4h 2m" or "12m 5s".
 */
export function formatUptime(secondsRaw: number): string {
  if (!Number.isFinite(secondsRaw) || secondsRaw < 0) {
    return "—";
  }

  const totalSeconds = Math.floor(secondsRaw);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (days === 0 && hours === 0 && (seconds > 0 || parts.length === 0)) {
    parts.push(`${seconds}s`);
  }

  return parts.join(" ");
}

export async function fetchBotStats(init?: RequestInit): Promise<BotStats> {
  const res = await fetch(getBotStatsUrl(), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Bot API returned ${res.status}`);
  }

  const data = (await res.json()) as Partial<BotStats>;

  return {
    status: typeof data.status === "string" ? data.status : "offline",
    bot: typeof data.bot === "string" ? data.bot : "Unknown",
    guilds: typeof data.guilds === "number" ? data.guilds : 0,
    uptime: typeof data.uptime === "number" ? data.uptime : 0,
  };
}

/**
 * Guild IDs where Argus is currently present.
 * Accepts several common response shapes from the bot API.
 */
export async function fetchBotGuildIds(init?: RequestInit): Promise<string[]> {
  const res = await fetch(`${getBotApiBaseUrl()}/api/guilds`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...botAuthHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Bot guilds API returned ${res.status}`);
  }

  const data = (await res.json()) as unknown;

  if (Array.isArray(data)) {
    return data.map(String);
  }

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.guildIds)) return obj.guildIds.map(String);
    if (Array.isArray(obj.guilds)) {
      return obj.guilds.map((g) => {
        if (typeof g === "string" || typeof g === "number") return String(g);
        if (g && typeof g === "object" && "id" in g) {
          return String((g as { id: unknown }).id);
        }
        return "";
      }).filter(Boolean);
    }
  }

  return [];
}

export async function fetchGuildLogs(
  guildId: string,
  init?: RequestInit,
): Promise<ModLogEntry[]> {
  const url = new URL(`${getBotApiBaseUrl()}/api/logs`);
  url.searchParams.set("guildId", guildId);

  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      Accept: "application/json",
      ...botAuthHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Bot logs API returned ${res.status}`);
  }

  const data = (await res.json()) as unknown;
  if (Array.isArray(data)) return data as ModLogEntry[];
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { logs?: unknown }).logs)
  ) {
    return (data as { logs: ModLogEntry[] }).logs;
  }
  return [];
}