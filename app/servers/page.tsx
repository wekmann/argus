import type { Metadata } from "next";
import { ServerPicker } from "@/components/ServerPicker";

export const metadata: Metadata = {
  title: "Your servers",
};

export default function ServersPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
      <header className="mb-8">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Server picker
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-wide text-ink sm:text-4xl">
          Choose a server
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Showing servers where you are the owner or have Administrator
          permissions. Invite Argus if it is not there yet, or open the
          dashboard to manage settings, AI builds, and logs.
        </p>
      </header>

      <ServerPicker />
    </main>
  );
}
