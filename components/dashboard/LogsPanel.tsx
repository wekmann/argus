"use client";

import { useCallback, useEffect, useState } from "react";
import type { ModLogEntry } from "@/lib/botApi";

type State =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; logs: ModLogEntry[] };

export function LogsPanel({ guildId }: { guildId: string }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      const res = await fetch(
        `/api/bot/logs?guildId=${encodeURIComponent(guildId)}`,
        { cache: "no-store" },
      );
      const data = (await res.json()) as {
        logs?: ModLogEntry[];
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? `Failed to load logs (${res.status})`);
      }

      setState({ kind: "ready", logs: data.logs ?? [] });
    } catch (err) {
      setState({
        kind: "error",
        message:
          err instanceof Error ? err.message : "Failed to load moderation logs",
      });
    }
  }, [guildId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl tracking-wide text-ink">
            Moderation logs
          </h2>
          <p className="mt-1 text-sm text-muted">
            Entries for this server only (
            <code className="text-accent">guild_id</code>).
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex h-10 items-center rounded-lg border border-line px-4 text-sm text-ink transition hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Refresh
        </button>
      </div>

      {state.kind === "loading" && (
        <div className="mt-6 space-y-2" aria-busy>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg border border-line bg-bg"
            />
          ))}
        </div>
      )}

      {state.kind === "error" && (
        <p className="mt-6 text-sm text-danger" role="alert">
          {state.message}
        </p>
      )}

      {state.kind === "ready" && state.logs.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted">
          No moderation logs for this server yet.
        </p>
      )}

      {state.kind === "ready" && state.logs.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-[0.14em] text-muted">
                <th className="px-2 py-3 font-semibold">When</th>
                <th className="px-2 py-3 font-semibold">Action</th>
                <th className="px-2 py-3 font-semibold">Target</th>
                <th className="px-2 py-3 font-semibold">Moderator</th>
                <th className="px-2 py-3 font-semibold">Reason</th>
              </tr>
            </thead>
            <tbody>
              {state.logs.map((log) => (
                <tr
                  key={String(log.id)}
                  className="border-b border-line/70 align-top"
                >
                  <td className="whitespace-nowrap px-2 py-3 text-muted">
                    {formatWhen(log.created_at)}
                  </td>
                  <td className="px-2 py-3 text-ink">{log.action}</td>
                  <td className="px-2 py-3 text-ink">
                    {log.target_tag || log.target_id || "—"}
                  </td>
                  <td className="px-2 py-3 text-ink">
                    {log.moderator_tag || log.moderator_id || "—"}
                  </td>
                  <td className="max-w-xs break-words px-2 py-3 text-muted">
                    {log.reason || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}
