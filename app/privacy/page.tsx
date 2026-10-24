import type { Metadata } from "next";
import {
  B,
  Code,
  ContactLink,
  Ext,
  LegalPage,
  P,
  Ul,
  type LegalSection,
} from "@/components/LegalPage";
import { LEGAL_EFFECTIVE, LEGAL_UPDATED, legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What personal data Argus processes, why, how long it is kept, and your rights.",
};

// Read operator details at request time so changing the environment variables
// does not require a new build.
export const dynamic = "force-dynamic";

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <P>
          Argus is a Discord moderation bot together with this website, where
          server administrators can see moderation logs and use the optional AI
          server builder. We call them the “Service”.
        </P>
        <P>
          The Service is run by <B>{legal.operatorName}</B> (
          {legal.operatorCountry}), who is the controller of the personal data
          described in this policy. Contact: <ContactLink />.
        </P>
      </>
    ),
  },
  {
    id: "data-we-process",
    title: "What data we process",
    body: (
      <>
        <P>We process only what the Service needs to work:</P>
        <Ul>
          <li>
            <B>Discord login (website).</B> When you log in with Discord we
            receive your Discord user ID, username and avatar, and the list of
            servers you are in together with your permissions there. The server
            list is requested from Discord when it is needed to show which
            servers you can manage; we do not copy it into a database. We do not
            ask for your email address.
          </li>
          <li>
            <B>Moderation logs (bot).</B> When a moderator uses Argus (for
            example mute, kick, ban or purge) the bot stores a log entry: the
            server ID, the action, the ID and tag of the affected user, the ID
            and tag of the moderator, the reason, extra details such as how many
            messages were removed, and the time.
          </li>
          <li>
            <B>Server settings (bot).</B> Per-server settings such as the
            mod-log channel, and whether the bot is still on the server.
          </li>
          <li>
            <B>AI builder records.</B> If you use the AI server builder: the
            prompt you write, the plan that was generated, the build status, and
            the IDs of the roles and channels that were created.
          </li>
          <li>
            <B>Gemini API key.</B> If you add a Google Gemini API key, it is
            kept only in your browser’s local storage, on your own device. It is
            not written to our database. When you generate or apply an AI build,
            the key is sent over HTTPS through the website to the bot API solely
            to make that request to Google, and it is not logged or stored
            there.
          </li>
          <li>
            <B>Technical data.</B> Our hosting providers automatically process
            technical data such as IP address, browser type and request time to
            deliver pages and keep them secure. We do not add analytics,
            advertising or tracking tools.
          </li>
        </Ul>
        <P>
          <B>What we do not store:</B> the content of ordinary chat messages
          (Argus reads messages only to detect its own commands), passwords,
          email addresses or payment details.
        </P>
      </>
    ),
  },
  {
    id: "why-and-basis",
    title: "Why we use your data",
    body: (
      <>
        <Ul>
          <li>
            To let you log in and manage your servers, and to run AI builds you
            ask for, using your own Gemini key. Legal basis: providing the
            Service you requested (GDPR Art. 6(1)(b)).
          </li>
          <li>
            To record moderation actions so that a server’s administrators can
            review them. Legal basis: the legitimate interest of servers and of
            the operator in accountable moderation (Art. 6(1)(f)).
          </li>
          <li>
            To keep the Service secure, prevent abuse and fix problems. Legal
            basis: legitimate interests (Art. 6(1)(f)).
          </li>
        </Ul>
        <P>
          We do not sell your data and we do not use it for advertising.
          Moderation decisions are made by the moderators of each server, not by
          us.
        </P>
      </>
    ),
  },
  {
    id: "who-receives-data",
    title: "Who receives your data",
    body: (
      <>
        <Ul>
          <li>
            <B>Discord Inc.</B> provides the login and the platform the bot runs
            on (<Ext href="https://discord.com/privacy">privacy policy</Ext>).
          </li>
          <li>
            <B>Google.</B> When you run an AI build, your prompt is sent to the
            Gemini API with your own key and is processed under Google’s terms (
            <Ext href="https://policies.google.com/privacy">privacy policy</Ext>
            ).
          </li>
          <li>
            <B>Vercel Inc.</B> hosts this website and processes the requests to
            it (<Ext href="https://vercel.com/legal/privacy-policy">privacy policy</Ext>
            ).
          </li>
          <li>
            <B>
              <Ext href="https://bot-hosting.net/">Bot-Hosting.net</Ext>
            </B>{" "}
            hosts the bot and the database where moderation logs and settings
            are stored.
          </li>
        </Ul>
        <P>
          We may disclose data if the law requires it. Some of these providers
          are located outside the European Economic Area; where data leaves it,
          the transfer relies on the safeguards the provider offers, such as
          standard contractual clauses. Their own policies have the details.
        </P>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep data",
    body: (
      <>
        <Ul>
          <li>
            <B>Login session:</B> up to 30 days, then you log in again. Logging
            out ends it immediately.
          </li>
          <li>
            <B>Moderation logs:</B> deleted automatically after 90 days by
            default.
          </li>
          <li>
            <B>Server data</B> (settings, logs and AI build records): deleted 30
            days after Argus is removed from the server. If the bot is added
            back within those 30 days, the deletion is cancelled.
          </li>
          <li>
            <B>Gemini API key:</B> stays in your browser until you press “Remove
            key” in the dashboard or clear the site’s data.
          </li>
          <li>
            <B>Technical logs:</B> kept by the hosting providers according to
            their own policies.
          </li>
        </Ul>
        <P>
          Server administrators who want their data deleted sooner can email us
          at <ContactLink />.
        </P>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <P>
        All traffic to the website is encrypted with HTTPS. The login session
        cookie is encrypted and cannot be read by scripts on the page. Dashboard
        data is shown only to people whom Discord confirms as the owner or an
        Administrator of that server, and the website talks to the bot through a
        protected API. No online service is perfectly secure; if a breach
        affects you, we will tell you and the authorities where the law
        requires it.
      </P>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <P>
          If you are in the EEA or the UK you have the right to access, correct,
          delete and restrict the processing of your personal data, to object to
          it, and to receive a copy of it. To use these rights, email{" "}
          <ContactLink />; we may need to confirm who you are first. This also
          applies if you were the target of a moderation action and want to know
          whether a log entry about you exists.
        </P>
        <P>
          If you think we handle your data unlawfully you can complain to your
          data protection authority (in Poland: the President of the Personal
          Data Protection Office, UODO).
        </P>
        <P>
          Quick controls: remove your Gemini key in the dashboard, log out, or
          remove Argus from your server to start the 30-day deletion.
        </P>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    body: (
      <>
        <Ul>
          <li>
            <Code>next-auth.session-token</Code> keeps you logged in (up to 30
            days).
          </li>
          <li>
            <Code>next-auth.csrf-token</Code> and{" "}
            <Code>next-auth.callback-url</Code> protect the login and are short
            lived. On HTTPS their names may start with <Code>__Secure-</Code> or{" "}
            <Code>__Host-</Code>.
          </li>
          <li>
            <Code>argus:gemini-key:&lt;server ID&gt;</Code> in local storage
            holds your Gemini API key, only if you save one.
          </li>
        </Ul>
        <P>
          These are needed for features you ask for, so there is no cookie
          banner. We use no advertising or analytics cookies.
        </P>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <P>
        The Service is not directed at children. You must meet Discord’s minimum
        age requirement to use Discord, and therefore the Service. If you
        believe we hold a child’s data, contact us and we will delete it.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: (
      <P>
        We may update this policy. The “Last updated” date at the top shows the
        latest version, and we will point out significant changes on the
        website. Questions about privacy: <ContactLink />.
      </P>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This policy explains what personal data Argus (the Discord bot and this website) processes, why, and what choices you have. If something here does not match what you see, please tell us."
      effective={LEGAL_EFFECTIVE}
      updated={LEGAL_UPDATED}
      sections={sections}
      related={{ href: "/terms", label: "Terms of Service" }}
    />
  );
}
