"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-line/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={session ? "/servers" : "/"}
          className="font-display text-xl tracking-wide text-ink transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Argus
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/privacy"
            className="hidden text-sm text-muted transition hover:text-ink sm:inline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hidden text-sm text-muted transition hover:text-ink sm:inline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Terms
          </Link>

          {status === "loading" && (
            <span className="text-sm text-muted">…</span>
          )}

          {status === "authenticated" && session?.user && (
            <div className="flex items-center gap-3">
              {session.user.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt=""
                  className="h-8 w-8 rounded-full border border-line"
                />
              )}
              <span className="hidden max-w-[10rem] truncate text-sm text-muted sm:inline">
                {session.user.name}
              </span>
              <button
                type="button"
                onClick={() => void signOut({ callbackUrl: "/" })}
                className="rounded-lg border border-line bg-panel px-3 py-1.5 text-sm text-ink transition hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                Log out
              </button>
            </div>
          )}

          {status === "unauthenticated" && (
            <button
              type="button"
              onClick={() => void signIn("discord", { callbackUrl: "/servers" })}
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-bg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Login with Discord
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
