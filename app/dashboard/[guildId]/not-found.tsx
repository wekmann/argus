import Link from "next/link";

export default function GuildNotFound() {
  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="font-display text-3xl text-ink">Server not available</h1>
      <p className="mt-3 text-sm text-muted">
        You need Owner or Administrator access, and a valid Discord session.
      </p>
      <Link
        href="/servers"
        className="mt-6 inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-bg"
      >
        Back to servers
      </Link>
    </main>
  );
}
