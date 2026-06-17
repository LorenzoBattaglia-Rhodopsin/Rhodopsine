import { Lightbulb, Sparkles, ShieldCheck, HeartPulse } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Card, CardContent } from "@/components/ui/card";

/**
 * SEZIONE "BENEFICI"
 * Card che riassumono il valore offerto: consapevolezza, abitudini migliori,
 * prevenzione, benessere digitale.
 */
const benefits = [
  {
    icon: Lightbulb,
    title: "Maggiore consapevolezza",
    body: "Riconosci le abitudini che incidono di più sui tuoi occhi, in pochi minuti e in modo guidato.",
  },
  {
    icon: Sparkles,
    title: "Abitudini visive migliori",
    body: "Ricevi suggerimenti concreti e sostenibili, da integrare facilmente nella tua routine quotidiana.",
  },
  {
    icon: ShieldCheck,
    title: "Prevenzione",
    body: "Piccoli accorgimenti, applicati con costanza, aiutano a ridurre il disagio legato all'uso degli schermi.",
  },
  {
    icon: HeartPulse,
    title: "Benessere digitale",
    body: "Un rapporto più equilibrato con i dispositivi, a beneficio degli occhi e del tuo comfort generale.",
  },
];

export function Benefits() {
  return (
    <Section
      id="benefici"
      eyebrow="Benefici"
      title="Cosa puoi ottenere"
      description="Uno strumento semplice per trasformare la consapevolezza in abitudini migliori."
      className="bg-card/30"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {benefits.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="h-full">
            <CardContent className="flex items-start gap-4 p-6">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-heading font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
