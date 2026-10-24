"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  type BotStats,
  formatUptime,
  isBotOnline,
} from "@/lib/botApi";

const REFRESH_MS = 15_000;

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; stats: BotStats; fetchedAt: number }
  | { kind: "error"; message: string };

export function StatusDashboard() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);

    try {
      const res = await fetch("/api/bot-stats", { cache: "no-store" });
      const data = (await res.json()) as BotStats & { error?: string };

      if (!res.ok && data.error) {
        setState({ kind: "error", message: data.error });
        return;
      }

      setState({
        kind: "ready",
        stats: {
          status: data.status,
          bot: data.bot,
          guilds: data.guilds,
          uptime: data.uptime,
        },
        fetchedAt: Date.now(),
      });
    } catch {
      setState({
        kind: "error",
        message: "Could not load bot status. Check your connection and try again.",
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), REFRESH_MS);
    return () => window.clearInterval(id);
  }, [load]);

  const online =
    state.kind === "ready" ? isBotOnline(state.stats.status) : false;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Status dashboard
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-wide text-ink sm:text-5xl">
            Argus
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            Live moderation bot health — status, servers, and uptime.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load(true)}
          disabled={refreshing || state.kind === "loading"}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      {state.kind === "loading" && (
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          aria-busy="true"
          aria-label="Loading bot status"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-2xl border border-line bg-panel"
            />
          ))}
        </div>
      )}

      {state.kind === "error" && (
        <div
          role="alert"
          className="rounded-2xl border border-danger/40 bg-panel px-5 py-6"
        >
          <p className="font-display text-lg text-ink">Unable to reach the bot</p>
          <p className="mt-2 text-sm text-muted">{state.message}</p>
          <button
            type="button"
            onClick={() => void load(true)}
            className="mt-4 inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-bg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Try again
          </button>
        </div>
      )}

      {state.kind === "ready" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Status">
              <div className="mt-4 flex items-center gap-3">
                <span
                  className={`relative flex h-3 w-3 shrink-0 rounded-full ${
                    online ? "bg-online" : "bg-danger"
                  }`}
                  aria-hidden
                >
                  {online && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-online/70" />
                  )}
                </span>
                <span className="font-display text-2xl tracking-wide text-ink">
                  {online ? "Online" : "Offline"}
                </span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-wider text-muted">
                Raw: {state.stats.status}
              </p>
            </StatCard>

            <StatCard label="Bot">
              <p className="mt-4 break-all font-display text-2xl tracking-wide text-ink">
                {state.stats.bot}
              </p>
            </StatCard>

            <StatCard label="Servers">
              <p className="mt-4 font-display text-3xl tracking-wide text-ink tabular-nums">
                {state.stats.guilds.toLocaleString("en-US")}
              </p>
              <p className="mt-2 text-sm text-muted">guilds connected</p>
            </StatCard>

            <StatCard label="Uptime">
              <p className="mt-4 font-display text-3xl tracking-wide text-ink tabular-nums">
                {formatUptime(state.stats.uptime)}
              </p>
              <p className="mt-2 text-sm text-muted">
                {Math.floor(state.stats.uptime).toLocaleString("en-US")}s total
              </p>
            </StatCard>
          </div>

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-xs text-muted">
            <p>
              Auto-refreshes every {REFRESH_MS / 1000}s · Last update{" "}
              {new Date(state.fetchedAt).toLocaleTimeString()}
            </p>
            <p className="font-display tracking-wider text-accent/80">ARGUS</p>
          </footer>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-line bg-panel p-5 shadow-[0_0_0_1px_rgba(242,181,68,0.04)] transition hover:border-accent/35">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </h2>
      {children}
    </article>
  );
}
