"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "", label: "Settings", match: "exact" as const },
  { href: "/aibuild", label: "AI Builder", match: "suffix" as const },
  { href: "/logs", label: "Logs", match: "suffix" as const },
];

export function DashboardNav({ guildId }: { guildId: string }) {
  const pathname = usePathname();
  const base = `/dashboard/${guildId}`;

  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-line pb-4"
      aria-label="Server dashboard"
    >
      {tabs.map((tab) => {
        const href = `${base}${tab.href}`;
        const active =
          tab.match === "exact"
            ? pathname === base || pathname === `${base}/`
            : pathname.startsWith(href);

        return (
          <Link
            key={tab.href || "settings"}
            href={href}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
              active
                ? "bg-accent text-bg"
                : "border border-line bg-panel text-muted hover:border-accent/40 hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
