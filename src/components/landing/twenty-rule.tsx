import Link from "next/link";
import { Clock, Eye, Hourglass } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { routes } from "@/data/site";

/**
 * REGOLA 20-20-20 — Sezione promozionale (Server Component).
 * Spiega la regola in tre passi e rimanda al timer guidato su /timer
 * (lo strumento vero e proprio vive lì, con stato condiviso via TimerProvider).
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
      eyebrow="Pausa visiva"
      title="La regola del 20-20-20"
      description="Un'abitudine semplice per dare sollievo agli occhi durante le lunghe sessioni davanti allo schermo."
      centered
    >
      <ul className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <Card className="h-full">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-muted text-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
                <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <Button asChild size="lg" variant="secondary">
          <Link href={routes.timer}>Apri il timer guidato</Link>
        </Button>
        <p className="max-w-prose text-sm text-muted-foreground">
          Te lo ricordiamo noi: avvia il timer e continua a lavorare in
          tranquillità.
        </p>
      </div>
    </Section>
  );
}
