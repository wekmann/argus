import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { authOptions } from "@/lib/auth";
import {
  fetchUserGuilds,
  guildIconUrl,
  hasAdminOrOwner,
} from "@/lib/discord";

type Props = {
  children: React.ReactNode;
  params: Promise<{ guildId: string }>;
};

export default async function GuildDashboardLayout({ children, params }: Props) {
  const { guildId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/");
  }

  let guildName = "Server";
  let icon: string | null = null;

  try {
    const guilds = await fetchUserGuilds(session.accessToken);
    const guild = guilds.find((g) => g.id === guildId);
    if (!guild || !hasAdminOrOwner(guild)) {
      notFound();
    }
    guildName = guild.name;
    icon = guildIconUrl(guild);
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/servers"
          className="text-sm text-muted transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          ← Servers
        </Link>
      </div>

      <header className="mb-6 flex items-center gap-4">
        {icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={icon}
            alt=""
            className="h-14 w-14 rounded-xl border border-line object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-panel font-display text-xl text-accent">
            {guildName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Dashboard
          </p>
          <h1 className="font-display text-2xl tracking-wide text-ink sm:text-3xl">
            {guildName}
          </h1>
        </div>
      </header>

      <DashboardNav guildId={guildId} />
      <div className="mt-6">{children}</div>
    </main>
  );
}
