import type { Metadata } from "next";
import { SourcesList } from "@/components/shared/sources-list";
import { buildMetadata } from "@/lib/seo";
import { contentReviewer, formatReviewDate } from "@/data/e-e-a-t";

/**
 * PAGINA FONTI (Server Component)
 * --------------------------------------------------------------------------
 * Trasparenza ed E-E-A-T: elenca le referenze scientifiche e gli enti ufficiali
 * su cui si basano i contenuti. I dati vivono in `@/data/sources`; questa pagina
 * si limita a comporre intestazione + lista. Contenuto informativo, non
 * diagnostico (vedi CLAUDE.md §6).
 */
export const metadata: Metadata = buildMetadata({
  title: "Fonti scientifiche",
  description:
    "Le referenze scientifiche e le fonti ufficiali su cui si basano i contenuti di Rhodopsin in tema di affaticamento visivo digitale (DES/CVS). Informazioni educative, mai diagnosi.",
  path: "/fonti",
});

export default function SourcesPage() {
  return (
    <section className="scroll-mt-24 py-12 sm:py-16">
      <div className="container">
        {/* Intestazione */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <p className="mb-3 text-eyebrow font-medium uppercase text-primary">
            Trasparenza
          </p>
          <h1 className="text-title text-balance font-semibold text-foreground">
            Le nostre fonti
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            I contenuti si basano sulla letteratura scientifica sull&apos;affaticamento
            visivo digitale e su fonti ufficiali. Qui trovi le referenze
            principali, così puoi approfondire e verificare di persona.
          </p>
        </div>

        <SourcesList />

        {/* Nota su revisione e natura non diagnostica dei contenuti. */}
        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
          Contenuti con revisione scientifica a cura di {contentReviewer.name} (
          {contentReviewer.jobTitle}). Ultima revisione: {formatReviewDate()}.
          Le informazioni hanno finalità educativa e preventiva e non
          sostituiscono il parere di un professionista.
        </p>
      </div>
    </section>
  );
}
