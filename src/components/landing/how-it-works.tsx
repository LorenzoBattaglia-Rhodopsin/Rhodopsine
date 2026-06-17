import Link from "next/link";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { routes } from "@/data/site";

/**
 * SEZIONE "COME FUNZIONA"
 * Tre passaggi numerati: qui la numerazione è giustificata perché descrive
 * una sequenza reale (compila → analisi → suggerimenti).
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
    <Section
      id="come-funziona"
      eyebrow="Come funziona"
      title="Tre passi verso occhi più riposati"
    >
      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <li key={step.n} className="relative">
            <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
              <span className="font-mono text-sm font-medium text-primary">
                {step.n}
              </span>
              <h3 className="mt-3 text-heading font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <Button asChild size="lg">
          <Link href={routes.test}>Inizia ora il test</Link>
        </Button>
      </div>
    </Section>
  );
}
