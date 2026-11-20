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
    >
      {/* Elenco vero (ul/li): i benefici sono voci enumerabili e i crawler
          (anche AI) li estraggono meglio da una lista semantica che da una
          griglia di div. role="list" ripristina la semantica dove il reset
          Tailwind rimuove lo stile lista. */}
      <ul role="list" className="grid gap-6 sm:grid-cols-2">
        {benefits.map(({ icon: Icon, title, body }) => (
          <li key={title}>
            <Card className="h-full">
              <CardContent className="flex items-start gap-4 p-6">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
