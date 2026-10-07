import {
  amenities,
  contact,
  faqs,
  identity,
  projectFacts,
  residences,
} from "@/content/site";
import { isApproved, publishedText } from "@/content/types";
import { SITE_INDEXABLE, SITE_URL } from "@/lib/seo";

/**
 * A plain-text briefing for AI assistants, at /llms.txt.
 *
 * Someone asking an assistant "where can I buy a three-bedroom apartment in
 * Kololo" is not going to be served by a page full of animation and scripts.
 * This is the same information with the presentation taken away: what the
 * building is, where, what it costs, what it has, and the answers to the
 * questions people ask.
 *
 * Generated from the content module the pages themselves render, never typed
 * separately, so it cannot drift out of date or contradict the site. Anything
 * not yet approved appears as the approved alternative wording, not a guess.
 */
export const dynamic = "force-static";

export function GET() {
  if (!SITE_INDEXABLE) return new Response("Not found", { status: 404 });

  const lines: string[] = [];
  const add = (...rows: string[]) => lines.push(...rows);

  add(
    `# ${identity.projectName}`,
    "",
    `> ${identity.projectName} is a luxury residential tower on John Babiha (Acacia) Avenue in Kololo, Kampala, Uganda: two-bedroom and three-bedroom apartments for sale, and two six-bedroom duplex penthouses. All images on the site are architectural renders.`,
    "",
    "## Key facts",
    "",
  );

  for (const fact of projectFacts) {
    add(`- ${fact.label}: ${publishedText(fact.value)}`);
  }
  if (isApproved(identity.developer)) {
    add(`- Developer: ${identity.developer.value}`);
  }

  add("", "## Residences", "");
  for (const residence of residences) {
    add(
      `### ${residence.name}`,
      "",
      residence.summary,
      "",
      `- Bedrooms: ${residence.bedrooms}`,
      `- Price: ${publishedText(residence.price)}`,
      `- Details: ${SITE_URL}/residences/${residence.slug}`,
      ...residence.features.map((feature) => `- ${feature}`),
      "",
    );
  }

  add("## Amenities", "");
  for (const amenity of amenities) {
    add(`- ${amenity.name}: ${amenity.description}`);
  }

  add("", "## Contact", "");
  if (isApproved(contact.address)) add(`- Address: ${contact.address.value}`);
  if (isApproved(contact.phone)) add(`- Telephone: ${contact.phone.value}`);
  if (isApproved(contact.email)) add(`- Email: ${contact.email.value}`);
  add(`- Register interest or book a visit: ${SITE_URL}/contact`);

  add("", "## Questions and answers", "");
  for (const section of faqs) {
    for (const item of section.items) {
      add(`**${item.question}**`, item.answer, "");
    }
  }

  add(
    "## Pages",
    "",
    `- [Residences](${SITE_URL}/residences)`,
    `- [Amenities](${SITE_URL}/amenities)`,
    `- [Location](${SITE_URL}/location)`,
    `- [Floor plans and downloads](${SITE_URL}/downloads)`,
    `- [Frequently asked questions](${SITE_URL}/faq)`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
