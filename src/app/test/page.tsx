import type { Metadata } from "next";
import { AssessmentWizard } from "@/components/assessment/assessment-wizard";
import { JsonLd } from "@/components/shared/json-ld";
import { buildMetadata, getAssessmentJsonLd } from "@/lib/seo";
import { totalQuestions } from "@/data/questions";

/**
 * PAGINA DEL TEST (Server Component che monta il wizard client)
 * --------------------------------------------------------------------------
 * Intestazione informativa + nota su privacy/non-diagnosi, poi il wizard
 * interattivo. Il JSON-LD descrive lo strumento come pagina informativa.
 */
export const metadata: Metadata = buildMetadata({
  title: "Test affaticamento visivo",
  description:
    "Un breve questionario per riflettere sulle tue abitudini visive digitali e sui sintomi più comuni. Strumento educativo, non diagnostico.",
  path: "/test",
});

export default function TestPage() {
  return (
    <section className="scroll-mt-24 py-12 sm:py-16">
      <div className="container">
        {/*
          Mobile: intro centrata sopra il wizard (layout invariato).
          Desktop (lg+): due colonne affiancate — contesto/istruzioni a sinistra
          (sticky), wizard interattivo a destra.
        */}
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="mx-auto mb-10 max-w-2xl text-center lg:mx-0 lg:mb-0 lg:text-left lg:sticky lg:top-24">
            <p className="mb-3 text-eyebrow font-medium uppercase text-primary">
              Autovalutazione
            </p>
            <h1 className="text-title text-balance font-semibold text-foreground">
              Quanto affaticano i tuoi occhi gli schermi?
            </h1>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Rispondi a {totalQuestions} domande sulle tue abitudini e su come ti
              senti. Bastano pochi minuti. Riceverai un riscontro educativo con
              consigli pratici, mai una diagnosi.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Le risposte restano nel tuo browser e non vengono inviate ad alcun
              server.
            </p>
          </div>

          <AssessmentWizard />
        </div>
      </div>

      <JsonLd data={getAssessmentJsonLd()} />
    </section>
  );
}
