import type { Metadata } from "next";

import { ResidenceCard } from "@/components/residence-card";
import { PageHeader, Section } from "@/components/ui";
import { residences } from "@/content/site";

export const metadata: Metadata = {
  title: "Residences",
  description:
    "Two-bedroom, three-bedroom and penthouse residences at Explorer Towers, each opening along curved floor-to-ceiling glazing onto a private balcony.",
};

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
