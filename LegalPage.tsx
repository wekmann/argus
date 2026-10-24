import Link from "next/link";
import type { ReactNode } from "react";
import { legal } from "@/lib/legal";

export type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function Ul({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-accent/70">
      {children}
    </ul>
  );
}

export function B({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
      {children}
    </code>
  );
}

export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded text-accent underline-offset-2 hover:underline ${focusRing}`}
    >
      {children}
    </a>
  );
}

export function ContactLink() {
  if (!legal.contactEmail) {
    return <span>[contact email – set CONTACT_EMAIL]</span>;
  }
  return (
    <a
      href={`mailto:${legal.contactEmail}`}
      className={`rounded text-accent underline-offset-2 hover:underline ${focusRing}`}
    >
      {legal.contactEmail}
    </a>
  );
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  effective,
  updated,
  sections,
  related,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  effective: string;
  updated: string;
  sections: LegalSection[];
  related: { href: string; label: string };
}) {
  return (
    <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <header>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-wide text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">{intro}</p>
        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 text-sm">
          <div>
            <dt className="text-muted">Effective date</dt>
            <dd className="mt-0.5 text-ink">{effective}</dd>
          </div>
          <div>
            <dt className="text-muted">Last updated</dt>
            <dd className="mt-0.5 text-ink">{updated}</dd>
          </div>
        </dl>
      </header>

      <nav
        aria-label="Table of contents"
        className="mt-8 rounded-2xl border border-line bg-panel p-5 sm:p-6"
      >
        <h2 className="font-display text-sm uppercase tracking-[0.18em] text-accent">
          Contents
        </h2>
        <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`block rounded py-0.5 text-muted transition hover:text-accent ${focusRing}`}
              >
                <span className="mr-2 tabular-nums text-accent/70">{i + 1}.</span>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-10">
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-title`}
            className="scroll-mt-6"
          >
            <h2
              id={`${s.id}-title`}
              className="font-display text-2xl tracking-wide text-ink"
            >
              <span className="mr-2 text-accent/70">{i + 1}.</span>
              {s.title}
            </h2>
            <div className="mt-3 space-y-4 text-[0.95rem] leading-relaxed text-muted">
              {s.body}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 border-t border-line/80 pt-6 text-sm text-muted">
        Also read:{" "}
        <Link
          href={related.href}
          className={`rounded text-accent underline-offset-2 hover:underline ${focusRing}`}
        >
          {related.label}
        </Link>
      </p>
    </main>
  );
}
