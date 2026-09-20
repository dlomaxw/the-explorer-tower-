import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

import { ResidenceCard } from "@/components/residence-card";
import { PageHeader, Section } from "@/components/ui";
import { residences } from "@/content/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/residences",
    title: "Apartments for sale in Kololo, Kampala",
    description:
      "Apartments for sale in Kololo, Kampala. Two-bedroom from USD 300,000, three-bedroom from USD 400,000, and a six-bedroom penthouse with its own suspended pool and private cinema.",
  });
}

export default function ResidencesPage() {
  return (
    <>
      <PageHeader
        kicker="Residences"
        title="Three ways to live in the building"
        lead="Every residence runs along the curve of the facade. Areas, prices, payment terms and availability are released by the developer and confirmed in writing — this page shows what has been approved for publication."
      />

      <Section>
        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {residences.map((residence, index) => (
            <ResidenceCard
              key={residence.slug}
              residence={residence}
              priority={index === 0}
            />
          ))}
        </div>
      </Section>
    </>
  );
}
