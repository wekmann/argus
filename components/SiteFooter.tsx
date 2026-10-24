import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-display tracking-wider text-accent/80">ARGUS</p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/privacy"
            className="transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
