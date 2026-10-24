"use client";

import { useEffect, useState } from "react";
import {
  clearGeminiKey,
  getGeminiKey,
  maskGeminiKey,
  setGeminiKey,
} from "@/lib/geminiKey";

export function GeminiKeyPanel({ guildId }: { guildId: string }) {
  const [value, setValue] = useState("");
  const [savedMasked, setSavedMasked] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const existing = getGeminiKey(guildId);
    setSavedMasked(existing ? maskGeminiKey(existing) : "");
    setValue("");
  }, [guildId]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setMessage("Paste a Gemini API key first.");
      return;
    }
    setGeminiKey(guildId, trimmed);
    setSavedMasked(maskGeminiKey(trimmed));
    setValue("");
    setMessage("Key saved on this device only.");
  }

  function handleRemove() {
    clearGeminiKey(guildId);
    setSavedMasked("");
    setValue("");
    setMessage("Key removed from this browser.");
  }

  return (
    <section className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <h2 className="font-display text-xl tracking-wide text-ink">
        Gemini API key
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Your personal Google Gemini API key is stored exclusively in this
        browser&apos;s <code className="text-accent">localStorage</code>. It is
        never written to Argus servers or our database. When you run an AI
        build, the key is sent only to the bot API for that request and is not
        logged or persisted there for storage.
      </p>

      <div
        role="note"
        className="mt-4 rounded-xl border border-accent/35 bg-bg/60 px-4 py-3 text-sm text-ink"
      >
        Privacy notice: keys stay on your device. Clearing site data or using
        another browser removes access to the saved key.
      </div>

      {savedMasked ? (
        <p className="mt-4 text-sm text-muted">
          Saved key:{" "}
          <span className="font-mono text-ink">{savedMasked}</span>
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted">No key saved on this device yet.</p>
      )}

      <form onSubmit={handleSave} className="mt-5 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          API key
          <input
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste Gemini API key"
            className="mt-2 w-full rounded-lg border border-line bg-bg px-3 py-2.5 font-mono text-sm text-ink placeholder:text-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-bg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Save key locally
          </button>
          {savedMasked && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex h-10 items-center rounded-lg border border-danger/50 px-4 text-sm text-danger transition hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Remove key
            </button>
          )}
        </div>
      </form>

      {message && (
        <p className="mt-3 text-sm text-online" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
