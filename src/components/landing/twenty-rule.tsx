import Link from "next/link";
import { Clock, Eye, Hourglass } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Card, CardContent } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/icon-badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/data/site";

/**
 * REGOLA 20-20-20 (Server Component).
 * Spiega la regola in tre passi e rimanda al timer guidato su /timer
 * (lo strumento vero e proprio vive lì, con stato condiviso via TimerProvider).
 * CTA secondaria: in home la CTA primaria resta il test.
 */
const steps = [
  {
    icon: Clock,
    title: "Ogni 20 minuti",
    text: "Concediti una breve pausa dallo schermo.",
  },
  {
    icon: Eye,
    title: "Guarda a 6 metri",
    text: "Sposta lo sguardo su un punto lontano (circa 20 piedi).",
  },
  {
    icon: Hourglass,
    title: "Per 20 secondi",
    text: "Lascia rilassare la messa a fuoco prima di riprendere.",
  },
] as const;

export function TwentyRule() {
  return (
    <Section
      id="regola-20-20-20"
      title="La regola del 20-20-20"
      description="Un'abitudine semplice per dare sollievo agli occhi durante le lunghe sessioni davanti allo schermo."
    >
      <ul className="grid gap-6 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <Card tone="tinted" className="h-full">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <IconBadge icon={Icon} />
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
                <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Button asChild size="lg" variant="secondary">
          <Link href={routes.timer}>Apri il timer guidato</Link>
        </Button>
      </div>
    </Section>
  );
}
