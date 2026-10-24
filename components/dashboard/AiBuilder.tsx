"use client";

import { useEffect, useState } from "react";
import { getGeminiKey } from "@/lib/geminiKey";

type Role = {
  name: string;
  color: string | null;
  hoist: boolean;
  mentionable: boolean;
  permissions: string[];
};
type Channel = {
  name: string;
  type: "text" | "voice" | "announcement" | "forum";
  topic: string;
  readOnly: boolean;
  visibleTo: string[];
};
type Category = { name: string; visibleTo: string[]; channels: Channel[] };
type Plan = { roles: Role[]; categories: Category[] };
type Progress = {
  done: number;
  total: number;
  roleIds: string[];
  categoryIds: string[];
  channelIds: string[];
  warnings: string[];
  errors: string[];
};
type Phase = "idle" | "planning" | "preview" | "building" | "finished";

const CHANNEL_ICON: Record<Channel["type"], string> = {
  text: "#",
  voice: "🔊",
  announcement: "📢",
  forum: "💬",
};

const buttonPrimary =
  "inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
const buttonGhost =
  "inline-flex h-10 items-center rounded-lg border border-line px-4 text-sm text-ink transition hover:bg-bg/60 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : `Request failed (${res.status})`,
    );
  }
  return data;
}

export function AiBuilder({ guildId }: { guildId: string }) {
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [buildId, setBuildId] = useState<number | null>(null);
  const [status, setStatus] = useState("pending");
  const [progress, setProgress] = useState<Progress | null>(null);

  async function generatePlan() {
    setError(null);
    const geminiKey = getGeminiKey(guildId);
    if (!geminiKey) {
      setError("Save your Gemini API key above first.");
      return;
    }
    if (!prompt.trim()) {
      setError("Describe the server you want first.");
      return;
    }
    setPhase("planning");
    try {
      const data = await postJson("/api/bot/aibuild/plan", {
        guildId,
        prompt,
        geminiKey,
      });
      setPlan(data.plan as Plan);
      setPhase("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("idle");
    }
  }

  async function startBuild() {
    if (!plan) return;
    setError(null);
    try {
      const data = await postJson("/api/bot/aibuild/execute", {
        guildId,
        plan,
        prompt,
      });
      setBuildId(Number(data.buildId));
      setStatus("pending");
      setProgress(null);
      setPhase("building");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  function reset() {
    setPlan(null);
    setPhase("idle");
    setError(null);
    setBuildId(null);
    setProgress(null);
    setStatus("pending");
  }

  function removeCategory(ci: number) {
    setPlan((p) =>
      p ? { ...p, categories: p.categories.filter((_, i) => i !== ci) } : p,
    );
  }

  function removeChannel(ci: number, hi: number) {
    setPlan((p) =>
      p
        ? {
            ...p,
            categories: p.categories
              .map((c, i) =>
                i === ci
                  ? { ...c, channels: c.channels.filter((_, j) => j !== hi) }
                  : c,
              )
              .filter((c) => c.channels.length > 0),
          }
        : p,
    );
  }

  // Poll build progress while building.
  useEffect(() => {
    if (phase !== "building" || buildId === null) return;
    let cancelled = false;
    let failures = 0;

    const tick = async () => {
      try {
        const res = await fetch(
          `/api/bot/aibuild/status?id=${buildId}&guildId=${guildId}`,
          { cache: "no-store" },
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
        if (cancelled) return;
        failures = 0;
        setStatus(String(data.status));
        setProgress((data.progress as Progress | null) ?? null);
        if (data.status === "done" || data.status === "failed") {
          setPhase("finished");
        }
      } catch (err) {
        failures += 1;
        if (failures >= 5 && !cancelled) {
          setError(
            err instanceof Error ? err.message : "Lost connection to the bot",
          );
          setPhase("finished");
        }
      }
    };

    void tick();
    const timer = setInterval(tick, 2000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [phase, buildId, guildId]);

  const channelCount =
    plan?.categories.reduce((n, c) => n + c.channels.length, 0) ?? 0;
  const pct =
    progress && progress.total > 0
      ? Math.min(100, Math.round((progress.done / progress.total) * 100))
      : 0;

  return (
    <section className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <h2 className="font-display text-xl tracking-wide text-ink">
        AI server builder
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Describe the server you want. Gemini proposes roles, categories and
        channels, you review the plan, and only then Argus creates them. Argus
        only <strong className="text-ink">adds</strong> things and never deletes
        existing channels or roles.
      </p>

      {(phase === "idle" || phase === "planning") && (
        <div className="mt-5 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Describe your server
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              maxLength={1500}
              rows={5}
              disabled={phase === "planning"}
              placeholder="e.g. A gaming community with general chat, voice rooms, a rules channel, moderator and VIP roles, and a private staff area."
              className="mt-2 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm normal-case tracking-normal text-ink placeholder:text-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted">{prompt.length}/1500</span>
            <button
              type="button"
              onClick={generatePlan}
              disabled={phase === "planning"}
              className={buttonPrimary}
            >
              {phase === "planning" ? "Generating plan…" : "Generate plan"}
            </button>
          </div>
        </div>
      )}

      {phase === "preview" && plan && (
        <div className="mt-5 space-y-5">
          <div className="rounded-xl border border-accent/35 bg-bg/60 px-4 py-3 text-sm text-ink">
            Plan: {plan.roles.length} roles, {plan.categories.length}{" "}
            categories, {channelCount} channels. Remove anything you don&apos;t
            want, then build.
          </div>

          {plan.roles.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Roles
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {plan.roles.map((r) => (
                  <span
                    key={r.name}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-sm text-ink"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-line"
                      style={{ backgroundColor: r.color ?? "transparent" }}
                    />
                    {r.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {plan.categories.map((c, ci) => (
              <div
                key={`${c.name}-${ci}`}
                className="rounded-xl border border-line bg-bg/60 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold uppercase tracking-wide text-ink">
                    {c.name}
                    {c.visibleTo.length > 0 && (
                      <span className="ml-2 text-xs font-normal normal-case text-muted">
                        🔒 {c.visibleTo.join(", ")}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCategory(ci)}
                    className="text-xs text-danger hover:underline"
                  >
                    Remove category
                  </button>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {c.channels.map((ch, hi) => (
                    <li
                      key={`${ch.name}-${hi}`}
                      className="flex items-start justify-between gap-3 text-sm"
                    >
                      <div className="min-w-0">
                        <span className="font-mono text-ink">
                          {CHANNEL_ICON[ch.type]} {ch.name}
                        </span>
                        {ch.readOnly && (
                          <span className="ml-2 text-xs text-muted">
                            read-only
                          </span>
                        )}
                        {ch.topic && (
                          <p className="truncate text-xs text-muted">
                            {ch.topic}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeChannel(ci, hi)}
                        className="shrink-0 text-xs text-danger hover:underline"
                        aria-label={`Remove channel ${ch.name}`}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startBuild}
              disabled={channelCount === 0}
              className={buttonPrimary}
            >
              Build this server
            </button>
            <button type="button" onClick={reset} className={buttonGhost}>
              Start over
            </button>
          </div>
        </div>
      )}

      {(phase === "building" || phase === "finished") && (
        <div className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm text-ink">
              <span>
                {phase === "building"
                  ? "Building…"
                  : status === "done"
                    ? "Build finished"
                    : "Build failed"}
              </span>
              <span className="font-mono text-muted">
                {progress ? `${progress.done}/${progress.total}` : "starting…"}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${phase === "finished" && status === "done" ? 100 : pct}%` }}
              />
            </div>
          </div>

          {phase === "finished" && progress && (
            <p className="text-sm text-muted">
              Created {progress.roleIds.length} roles,{" "}
              {progress.categoryIds.length} categories and{" "}
              {progress.channelIds.length} channels.
            </p>
          )}

          {progress && progress.warnings.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
              {progress.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
          {progress && progress.errors.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm text-danger">
              {progress.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}

          {phase === "finished" && (
            <button type="button" onClick={reset} className={buttonGhost}>
              Build another
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}