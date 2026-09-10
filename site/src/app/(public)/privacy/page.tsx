import type { Metadata } from "next";

import { PageHeader, Section } from "@/components/ui";
import { CONSENT_NOTICE_VERSION } from "@/lib/inquiry-schema";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Explorer Towers handles the details you send through this site.",
};

/**
 * Working draft. Spec §12 requires the client to review the wording and set
 * the retention periods before launch, so this page says so plainly rather than
 * presenting unreviewed text as settled policy.
 */
const SECTIONS = [
  {
    heading: "What this site collects",
    body: [
      "When you send an inquiry, callback, meeting or site-visit request, we store what you type into the form: your name, the contact details you give us, the residence you are interested in, your message and any preferred time.",
      "We also record when the request arrived, which page you sent it from, and any campaign parameters that were in the link you followed. These tell us which marketing brought you here. They are not linked to anything you do elsewhere on the internet.",
    ],
  },
  {
    heading: "Why we hold it",
    body: [
      "To answer you. Replying to a request you sent is the service you asked for, and we do not need separate permission for it.",
      "Marketing updates are separate and optional. The checkbox on each form is unticked by default, is never required to get a reply, and can be withdrawn at any time by telling us.",
    ],
  },
  {
    heading: "Who sees it",
    body: [
      "The sales team handling Explorer Towers, and the authorised representatives of the developer. Access is limited by role, so a person only sees the records their role requires.",
      "We do not sell your details, and we do not pass them to unrelated third parties.",
    ],
  },
  {
    heading: "Analytics",
    body: [
      "Where measurement is enabled, events record actions such as viewing a residence or submitting a form. They use non-identifying event, campaign and unit identifiers. Names, email addresses and phone numbers are never placed into analytics URLs or event labels.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Retention periods are set by the developer and are pending confirmation. Once agreed they will be stated here, along with how to ask for your record to be deleted or anonymised.",
    ],
  },
  {
    heading: "Asking us about your record",
    body: [
      "Use the contact page and quote the reference number you were given when you submitted. We can tell you what is held, correct it, or remove it.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        kicker="Privacy"
        title="Privacy notice"
        lead={`Working draft, version ${CONSENT_NOTICE_VERSION}. The wording and the retention periods are subject to the developer's review before launch, and the version in force when you submit is recorded with your request.`}
      />

      <Section>
        <div className="max-w-2xl space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="display-md text-balance">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="mt-4 leading-relaxed text-stone-600 text-pretty"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
