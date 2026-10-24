"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

/**
 * Starts the Discord login.
 *
 * next-auth v4 only starts an OAuth login from a POST (with a CSRF token),
 * which `signIn()` does for us. A plain link to /api/auth/signin/discord is a
 * GET and, because `pages.signIn` is a custom page, it just bounces back to
 * "/?error=discord" without ever reaching Discord.
 */
export function LoginButton() {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void signIn("discord", { callbackUrl: "/servers" });
      }}
      className="inline-flex h-12 items-center justify-center rounded-lg bg-accent px-8 text-sm font-semibold text-bg transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {busy ? "Redirecting to Discord…" : "Login with Discord"}
    </button>
  );
}
