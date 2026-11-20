import { Section } from "@/components/shared/section";
import { Card, CardContent } from "@/components/ui/card";

/**
 * SEZIONE "COME FUNZIONA"
 * Tre passaggi numerati: qui la numerazione è giustificata perché descrive
 * una sequenza reale (compila → analisi → suggerimenti).
 * Nessuna CTA: il test è già proposto dall'hero, subito sopra (evita di
 * ripetere "fai il test" due volte di seguito).
 */
const steps = [
  {
    n: "01",
    title: "Compila il test",
    body: "Rispondi a una serie di brevi domande sulle tue abitudini e sui sintomi che avverti. Richiede pochi minuti.",
  },
  {
    n: "02",
    title: "Analisi delle abitudini",
    body: "Le risposte vengono elaborate per individuare le aree che incidono di più sul tuo affaticamento visivo.",
  },
  {
    n: "03",
    title: "Ricevi suggerimenti personalizzati",
    body: "Ottieni consigli pratici basati su evidenze, calibrati sul tuo profilo, per migliorare il benessere dei tuoi occhi.",
  },
];

export function HowItWorks() {
  return (
    <Section id="come-funziona" title="Tre passi verso occhi più riposati">
      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <li key={step.n}>
            <Card tone="tinted" className="h-full">
              <CardContent className="flex h-full flex-col p-6">
                <span className="inline-flex h-8 w-fit items-center rounded-full bg-primary/20 px-3 font-mono text-sm font-medium tabular-nums text-primary ring-1 ring-inset ring-primary/30">
                  {step.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
}
