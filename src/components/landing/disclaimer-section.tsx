import { Info } from "lucide-react";

/**
 * SEZIONE DISCLAIMER (landing)
 * Richiamo sintetico e ben visibile: il test è educativo e non diagnostico.
 * Il disclaimer completo, con valore medico-legale, è nel footer.
 */
export function DisclaimerSection() {
  return (
    <section aria-labelledby="disclaimer-heading" className="py-8">
      <div className="container">
        <div className="mx-auto flex max-w-prose items-start gap-3 rounded-lg border border-border bg-muted/40 p-5">
          <Info
            className="mt-0.5 size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span id="disclaimer-heading" className="font-medium text-foreground">
              Test educativo.
            </span>{" "}
            Questo strumento non costituisce una diagnosi medica e non
            sostituisce la visita di un professionista della visione.
          </p>
        </div>
      </div>
    </section>
  );
}
