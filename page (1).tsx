import type { Metadata } from "next";
import Link from "next/link";
import {
  B,
  ContactLink,
  LegalPage,
  P,
  Ul,
  type LegalSection,
} from "@/components/LegalPage";
import { LEGAL_EFFECTIVE, LEGAL_UPDATED, legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The rules for using the Argus Discord bot, its dashboard and the AI server builder.",
};

// Read operator details at request time so changing the environment variables
// does not require a new build.
export const dynamic = "force-dynamic";

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Accepting these terms",
    body: (
      <>
        <P>
          By adding Argus to a server, logging in to this website or otherwise
          using the Service, you agree to these terms. If you do not agree,
          please do not use it.
        </P>
        <P>
          You must follow Discord’s Terms of Service and Community Guidelines and
          meet Discord’s minimum age. If you accept these terms for a server or
          a community, you confirm you are allowed to do so on its behalf.
        </P>
      </>
    ),
  },
  {
    id: "the-service",
    title: "What Argus is",
    body: (
      <P>
        Argus is a Discord moderation bot (commands such as mute, purge, kick
        and ban), a web dashboard with per-server moderation logs, and an
        optional AI server builder that proposes roles, categories and channels
        from your description. Features can change, be added or be removed.
      </P>
    ),
  },
  {
    id: "your-responsibility",
    title: "Your account and your server",
    body: (
      <>
        <P>
          You can manage a server in the dashboard only if you are its owner or
          have the Administrator permission. You are responsible for what is done
          through your account and for keeping your Discord account secure.
        </P>
        <P>
          You decide how Argus is used on your server. Moderation actions have
          real effects: bans and kicks remove people, and a purge permanently
          deletes messages. You are responsible for those decisions and for
          having the right to make them.
        </P>
      </>
    ),
  },
  {
    id: "gemini-key",
    title: "Your Gemini API key",
    body: (
      <>
        <P>
          The AI server builder works with your own Google Gemini API key. You
          provide it, you pay for any usage, and you must follow Google’s terms.
          We are not responsible for Google charges, quota limits or a key that
          is misused or leaked because of how you handled it.
        </P>
        <P>
          The key is kept in your browser only (see the{" "}
          <Link
            href="/privacy"
            className="rounded text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Privacy Policy
          </Link>
          ). You can remove it at any time in the dashboard.
        </P>
      </>
    ),
  },
  {
    id: "ai-content",
    title: "AI-generated content",
    body: (
      <P>
        AI output can be wrong, odd or unsuitable. Argus shows you a plan before
        anything is created, and nothing is built until you approve it. You are
        responsible for reviewing the plan and for the result on your server.
      </P>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <P>You agree not to:</P>
        <Ul>
          <li>use Argus to break Discord’s rules or the law, or to harass, discriminate against or harm people;</li>
          <li>attack, scrape, overload or try to break the Service, or get around its limits;</li>
          <li>try to read or change data of servers you do not manage;</li>
          <li>use the Service to build or distribute malware or spam.</li>
        </Ul>
      </>
    ),
  },
  {
    id: "availability",
    title: "Availability",
    body: (
      <P>
        The Service is provided “as is” and “as available”, free of charge. It
        is run by an individual and may be offline, slow or changed without
        notice, for example for maintenance or because of problems at Discord,
        Google or our hosting providers. We do not promise a particular
        uptime.
      </P>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    body: (
      <P>
        How we handle personal data is described in the{" "}
        <Link
          href="/privacy"
          className="rounded text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Privacy Policy
        </Link>
        , which is part of these terms.
      </P>
    ),
  },
  {
    id: "ownership",
    title: "Ownership",
    body: (
      <>
        <P>
          The Argus name, logo, code and design belong to the operator. Your
          server and its content stay yours; you allow us to process them only as
          needed to provide the Service.
        </P>
        <P>
          Argus is an independent project. It is not affiliated with, endorsed
          by or sponsored by Discord Inc. or Google. Discord is a trademark of
          Discord Inc.
        </P>
      </>
    ),
  },
  {
    id: "termination",
    title: "Suspension and ending use",
    body: (
      <P>
        We may restrict access or remove the bot from servers that break these
        terms or abuse the Service. You can stop at any time by removing Argus
        from your server and logging out. Server data is deleted as described in
        the Privacy Policy.
      </P>
    ),
  },
  {
    id: "liability",
    title: "Warranties and liability",
    body: (
      <>
        <P>
          To the extent the law allows, we give no warranty that the Service is
          error free, uninterrupted or fit for a particular purpose, and we are
          not liable for indirect or consequential loss, lost data or disruption
          of your server, including from moderation actions you or your
          moderators take or from AI-generated plans you approve.
        </P>
        <P>
          Nothing in these terms excludes or limits liability that cannot be
          excluded by law, or any mandatory consumer rights you have where you
          live.
        </P>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    body: (
      <P>
        These terms are governed by the law of <B>{legal.operatorCountry}</B>,
        without taking away the mandatory consumer protection rules of the
        country where you live.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: (
      <P>
        We may update these terms. The “Last updated” date at the top shows the
        latest version, and continuing to use the Service after a change means
        you accept it. We will point out significant changes on the website.
        Questions: <ContactLink />. The Service is run by{" "}
        <B>{legal.operatorName}</B>.
      </P>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="These terms are the rules for using the Argus Discord bot, its dashboard and the AI server builder. Please read them before you add Argus to a server."
      effective={LEGAL_EFFECTIVE}
      updated={LEGAL_UPDATED}
      sections={sections}
      related={{ href: "/privacy", label: "Privacy Policy" }}
    />
  );
}
