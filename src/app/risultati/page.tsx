import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/shared/section";
import { ScoreGauge } from "@/components/results/score-gauge";
import { RecommendationList } from "@/components/results/recommendation-list";
import { NearbyProfessionals } from "@/components/nearby/nearby-professionals";
import { getResultLevel } from "@/features/assessment/scoring";
import { getResultContent } from "@/features/assessment/results-content";
import { getRecommendations } from "@/data/recommendations";
import { domainLabels } from "@/data/questions";
import { buildMetadata } from "@/lib/seo";
import { routes } from "@/data/site";
import type { AssessmentDomain, ResultLevel } from "@/types/assessment";

/**
 * PAGINA RISULTATI (Server Component asincrono)
 * --------------------------------------------------------------------------
 * In Next.js 15 `searchParams` è una Promise: va atteso. Leggiamo il punteggio
 * normalizzato (`s`, 0–100) e il dominio più critico (`d`), li validiamo, e
 * mostriamo un esito EDUCATIVO (mai diagnostico) con consigli pratici.
 *
 * La pagina è esclusa dall'indicizzazione (noindex): riflette dati personali
 * della sessione e non ha valore come pagina pubblica.
 */
export const metadata: Metadata = buildMetadata({
  title: "I tuoi risultati",
  description:
    "Riscontro educativo sulla tua autovalutazione dell'affaticamento visivo digitale, con consigli pratici di igiene visiva.",
  path: "/risultati",
  noIndex: true,
});

const LEVEL_BADGE: Record<ResultLevel, "success" | "warning" | "elevated"> = {
  low: "success",
  medium: "warning",
  high: "elevated",
};

/** Verifica che la stringa sia un dominio valido del questionario. */
function parseDomain(value?: string): AssessmentDomain | undefined {
  if (value && value in domainLabels) return value as AssessmentDomain;
  return undefined;
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string; d?: string }>;
}) {
  const sp = await searchParams;

  const parsed = sp.s === undefined ? NaN : Number(sp.s);
  const hasValidScore = Number.isFinite(parsed);

  // Stato senza punteggio valido: invitiamo a svolgere il test.
  if (!hasValidScore) {
    return (
      <Section
        centered
        eyebrow="Risultati"
        title="Non abbiamo trovato un punteggio da mostrare"
        description="Per vedere il tuo riscontro, completa prima il breve test di autovalutazione."
      >
        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href={routes.test}>
              Fai il test
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Section>
    );
  }

  const score = Math.min(100, Math.max(0, Math.round(parsed)));
  const level = getResultLevel(score);
  const content = getResultContent(level);
  const topDomain = parseDomain(sp.d);
  const recommendations = getRecommendations(level, topDomain);

  return (
    <Section eyebrow="Risultati" className="pt-12 sm:pt-16">
      <div className="mx-auto max-w-3xl lg:max-w-none">
        {/*
          Mobile: blocco verticale unico (sintesi → summary → consigli → avvertenza).
          Desktop (lg+): due colonne — sintesi (gauge + esito) a sinistra e sticky,
          consigli pratici + avvertenza a destra. L'ordine nel DOM è invariato,
          così il mobile resta identico.
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12">
          {/* COLONNA SINISTRA — sintesi del risultato */}
          <div className="lg:sticky lg:top-24">
            {/* Sintesi: gauge + testo educativo */}
            <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr] sm:gap-10 lg:grid-cols-1 lg:gap-8">
              <ScoreGauge score={score} level={level} levelLabel={content.badge} />

              <div>
                <Badge variant={LEVEL_BADGE[level]}>
                  Affaticamento {content.badge.toLowerCase()}
                </Badge>
                <h1 className="mt-3 text-heading font-semibold text-balance text-foreground">
                  {content.title}
                </h1>
                {topDomain && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Area che incide di più:{" "}
                    <span className="text-foreground">
                      {domainLabels[topDomain]}
                    </span>
                    .
                  </p>
                )}
              </div>
            </div>

            <p className="mt-8 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {content.summary}
            </p>
          </div>

          {/* COLONNA DESTRA — consigli pratici + avvertenza */}
          <div>
            {/* Consigli pratici */}
            <div className="mt-12 lg:mt-0">
              <h2 className="text-heading font-semibold text-foreground">
                Consigli pratici per te
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Suggerimenti generali di igiene visiva, ordinati per pertinenza.
                Sono indicazioni educative, NON prescrizioni mediche.
              </p>
              <div className="mt-6">
                <RecommendationList items={recommendations} />
              </div>
            </div>

            {/* Avvertenza + ripeti. <aside role="note"> con etichetta: i
                crawler (anche AI) associano l'avvertenza all'esito del test
                come contenuto complementare, non come parte del risultato. */}
            <aside
              role="note"
              aria-labelledby="results-reminder"
              className="mt-12 rounded-lg border border-border bg-muted/40 p-6"
            >
              <h2
                id="results-reminder"
                className="text-base font-semibold text-foreground"
              >
                Un promemoria importante
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Questo riscontro è puramente informativo e preventivo: non è una
                diagnosi e non sostituisce il parere di un professionista della
                visione. Se i disturbi sono frequenti, intensi o persistenti,
                rivolgiti a un oculista o a un ottico-optometrista.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild variant="secondary">
                  <Link href={routes.test}>
                    <RotateCcw aria-hidden="true" />
                    Ripeti il test
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href={routes.home}>Torna alla home</Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>

        {/* Ricerca professionisti nelle vicinanze. PRIVACY: nessuna prop —
            il componente non riceve punteggio, livello né dominio, quindi
            la ricerca non può essere collegata al risultato del test. */}
        <NearbyProfessionals />
      </div>
    </Section>
  );
}
