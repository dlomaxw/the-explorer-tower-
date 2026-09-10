import { ButtonLink, Section } from "@/components/ui";
import { LogoMark } from "@/components/logo";

/** Spec §2: a helpful 404, not a dead end. */
export default function NotFound() {
  return (
    <Section className="min-h-[70svh]">
      <div className="mx-auto max-w-xl py-12 text-center">
        <LogoMark className="mx-auto h-20 w-auto text-gold" />
        <p className="kicker mt-8 text-stone-500">404</p>
        <h1 className="display-lg mt-3 text-balance">
          That page is not here
        </h1>
        <p className="mt-5 leading-relaxed text-stone-600 text-pretty">
          The link may be out of date, or the page may not have been published
          yet. These are the places most people are looking for.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/residences">Residences</ButtonLink>
          <ButtonLink href="/gallery" variant="secondary">
            Gallery
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Contact
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
