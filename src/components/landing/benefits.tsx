import { Lightbulb, Sparkles, HeartPulse } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Card, CardContent } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/icon-badge";

/**
 * SEZIONE "BENEFICI"
 * Card che riassumono il valore offerto: consapevolezza, abitudini migliori
 * (che includono la prevenzione), benessere digitale.
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
    body: "Suggerimenti concreti e sostenibili: piccoli accorgimenti che, applicati con costanza, aiutano a ridurre il disagio legato agli schermi.",
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
      title="Cosa puoi ottenere"
    >
      {/* Elenco vero (ul/li): i benefici sono voci enumerabili e i crawler
          (anche AI) li estraggono meglio da una lista semantica che da una
          griglia di div. role="list" ripristina la semantica dove il reset
          Tailwind rimuove lo stile lista. */}
      <ul role="list" className="grid gap-6 md:grid-cols-3">
        {benefits.map(({ icon: Icon, title, body }) => (
          <li key={title}>
            <Card tone="tinted" className="h-full">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <IconBadge icon={Icon} />
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
