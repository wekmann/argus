import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginButton } from "@/components/LoginButton";
import { StatusDashboard } from "@/components/StatusDashboard";
import { authOptions } from "@/lib/auth";
import { authErrorMessage } from "@/lib/authErrors";

async function AuthCheck() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/servers");
  }
  return null;
}

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { error } = await searchParams;
  const errorMessage = authErrorMessage(
    Array.isArray(error) ? error[0] : error,
  );

  return (
    <main className="flex flex-1 flex-col">
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>

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
          {errorMessage && (
            <p
              role="alert"
              className="max-w-sm rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-ink"
            >
              {errorMessage}
            </p>
          )}
          <LoginButton />
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