import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { routes } from "@/data/site";
import { findPageCopy, kindsSummary } from "@/data/nearby";
import { ProfessionalKinds } from "@/components/nearby/professional-kinds";
import { NearbySearch } from "@/components/nearby/nearby-search";

/**
 * TROVA OTTICI E OCULISTI (Server Component statico)
 * --------------------------------------------------------------------------
 * La stessa ricerca di /risultati, raggiungibile senza fare il test.
 * <NearbySearch /> è montata SENZA props (CLAUDE.md §6.8): nessun dato del
 * test, nessuna richiesta esterna prima di un click.
 */
export const metadata: Metadata = buildMetadata({
  title: findPageCopy.metaTitle,
  description: findPageCopy.metaDescription,
  path: routes.professionals,
});

export default function FindProfessionalsPage() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container">
        <header className="max-w-prose">
          <p className="mb-3 text-eyebrow font-medium uppercase text-primary">
            {findPageCopy.eyebrow}
          </p>
          <h1 className="text-title text-balance font-semibold text-foreground">
            {findPageCopy.title}
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {findPageCopy.description}
          </p>
          {/* Distinzione tra le due figure, in una riga neutra. */}
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
            {kindsSummary}
          </p>
        </header>

        <section aria-labelledby="find-search-title" className="mt-10">
          <h2 id="find-search-title" className="sr-only">
            {findPageCopy.searchTitle}
          </h2>
          <NearbySearch />
        </section>

        <section aria-labelledby="find-kinds-title" className="mt-16 sm:mt-20">
          <h2
            id="find-kinds-title"
            className="text-heading font-semibold text-foreground"
          >
            {findPageCopy.kindsTitle}
          </h2>
          <div className="mt-6">
            <ProfessionalKinds />
          </div>
        </section>
      </div>
    </section>
  );
}
