import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { StatusDashboard } from "@/components/StatusDashboard";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/servers");
  }

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-3xl px-4 pb-6 pt-14 text-center sm:px-6 sm:pt-20">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Discord moderation
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-wide text-ink sm:text-6xl">
          Argus
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          A multi-server moderation bot with a web dashboard. Sign in with
          Discord to manage servers you own or administrate.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/api/auth/signin/discord?callbackUrl=/servers"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-accent px-8 text-sm font-semibold text-bg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Login with Discord
          </Link>
          <p className="max-w-sm text-xs leading-relaxed text-muted">
            By continuing you agree to the{" "}
            <Link href="/terms" className="text-accent hover:underline">
              Terms of Service
            </Link>{" "}
            and the{" "}
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>

      <StatusDashboard />
    </main>
  );
}