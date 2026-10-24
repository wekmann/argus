/**
 * Client-only helpers for the per-guild Gemini API key.
 * Keys are stored exclusively in localStorage — never sent to our DB.
 */

const PREFIX = "argus:gemini-key:";

export function geminiStorageKey(guildId: string): string {
  return `${PREFIX}${guildId}`;
}

export function getGeminiKey(guildId: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(geminiStorageKey(guildId)) ?? "";
  } catch {
    return "";
  }
}

export function setGeminiKey(guildId: string, key: string): void {
  if (typeof window === "undefined") return;
  const trimmed = key.trim();
  if (!trimmed) {
    window.localStorage.removeItem(geminiStorageKey(guildId));
    return;
  }
  window.localStorage.setItem(geminiStorageKey(guildId), trimmed);
}

export function clearGeminiKey(guildId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(geminiStorageKey(guildId));
}

export function maskGeminiKey(key: string): string {
  const trimmed = key.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 8) return "••••••••";
  return `${trimmed.slice(0, 4)}…${trimmed.slice(-4)}`;
}
