import { Info } from "lucide-react";

/**
 * SEZIONE DISCLAIMER (landing)
 * Richiamo sintetico e ben visibile: il test è educativo e non diagnostico,
 * e i contenuti si basano sulla letteratura su DES/CVS. È l'unico richiamo
 * in home: il disclaimer completo, con valore medico-legale, è nel footer.
 */
export function DisclaimerSection() {
  return (
    <section aria-labelledby="disclaimer-heading" className="py-8">
      <div className="container">
        {/* role="note": marca il riquadro come avvertenza complementare, così
            crawler e AT lo associano al contenuto del test, non al corpo. */}
        <div
          role="note"
          className="mx-auto flex max-w-prose items-start gap-3 rounded-lg border border-border bg-muted/40 p-5"
        >
          <Info
            className="mt-0.5 size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span id="disclaimer-heading" className="font-medium text-foreground">
              Test educativo.
            </span>{" "}
            Questo strumento non costituisce una diagnosi medica e non
            sostituisce la visita di un professionista della visione. I
            contenuti si basano sulla letteratura scientifica sul Digital Eye
            Strain e sulla Computer Vision Syndrome e hanno scopo informativo.
          </p>
        </div>
      </div>
    </section>
  );
}
