"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getInviteUrl,
  guildIconUrl,
  type DiscordGuild,
} from "@/lib/discord";

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | {
      kind: "ready";
      guilds: DiscordGuild[];
      botGuildIds: Set<string>;
      botGuildsError?: string;
    };

export function ServerPicker() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [userRes, botRes] = await Promise.all([
          fetch("/api/discord/guilds", { cache: "no-store" }),
          fetch("/api/bot/guilds", { cache: "no-store" }),
        ]);

        const userData = (await userRes.json()) as {
          guilds?: DiscordGuild[];
          error?: string;
        };

        if (!userRes.ok) {
          throw new Error(userData.error ?? "Failed to load your servers");
        }

        const botData = (await botRes.json()) as {
          guildIds?: string[];
          error?: string;
        };

        if (cancelled) return;

        setState({
          kind: "ready",
          guilds: userData.guilds ?? [],
          botGuildIds: new Set(botData.guildIds ?? []),
          botGuildsError: botData.error,
        });
      } catch (err) {
        if (cancelled) return;
        setState({
          kind: "error",
          message:
            err instanceof Error ? err.message : "Failed to load servers",
        });
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === "loading") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl border border-line bg-panel"
          />
        ))}
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-danger/40 bg-panel px-5 py-6"
      >
        <p className="font-display text-lg text-ink">Could not load servers</p>
        <p className="mt-2 text-sm text-muted">{state.message}</p>
      </div>
    );
  }

  if (state.guilds.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-panel px-5 py-10 text-center">
        <p className="font-display text-xl text-ink">No manageable servers</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          You need Owner or Administrator permission on a Discord server to
          manage it here.
        </p>
        <a
          href={getInviteUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-bg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Invite Argus
        </a>
      </div>
    );
  }

  return (
    <div>
      {state.botGuildsError && (
        <p className="mb-4 rounded-xl border border-accent/30 bg-panel px-4 py-3 text-sm text-muted">
          Could not verify which servers already have Argus (
          {state.botGuildsError}). Invite buttons may still work — use Manage
          if you know the bot is present.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.guilds.map((guild) => {
          const icon = guildIconUrl(guild);
          const botPresent = state.botGuildIds.has(guild.id);

          return (
            <article
              key={guild.id}
              className="flex flex-col rounded-2xl border border-line bg-panel p-5 transition hover:border-accent/35"
            >
              <div className="flex items-center gap-3">
                {icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={icon}
                    alt=""
                    className="h-12 w-12 rounded-xl border border-line object-cover"
                  />
                ) : (
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-bg font-display text-lg text-accent"
                    aria-hidden
                  >
                    {guild.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="truncate font-display text-lg tracking-wide text-ink">
                    {guild.name}
                  </h2>
                  <p className="text-xs text-muted">
                    {guild.owner ? "Owner" : "Administrator"}
                    {botPresent ? " · Argus present" : ""}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-1 flex-col justify-end gap-2">
                {botPresent ? (
                  <Link
                    href={`/dashboard/${guild.id}`}
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-bg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    Manage Dashboard
                  </Link>
                ) : (
                  <>
                    <a
                      href={getInviteUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-bg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      Invite
                    </a>
                    <Link
                      href={`/dashboard/${guild.id}`}
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-line px-4 text-xs text-muted transition hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      Open dashboard anyway
                    </Link>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        By inviting Argus you agree to the{" "}
        <Link href="/terms" className="text-accent hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-accent hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
