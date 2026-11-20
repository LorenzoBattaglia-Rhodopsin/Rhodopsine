import { Monitor, Eye, Clock } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Card, CardContent } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/icon-badge";

/**
 * SEZIONE "IL PROBLEMA"
 * Spiega l'affaticamento visivo digitale con affermazioni prudenti e
 * sostenute dalla letteratura (DES/CVS). Si evitano percentuali specifiche
 * non verificabili: i punti descrivono fenomeni documentati.
 */
const points = [
  {
    icon: Monitor,
    title: "Viviamo davanti agli schermi",
    body: "Tra lavoro, studio e tempo libero, molte persone passano gran parte della giornata davanti a smartphone, computer e tablet, spesso senza interruzioni adeguate.",
  },
  {
    icon: Eye,
    title: "Ammicchiamo di meno",
    body: "Durante l'uso intenso degli schermi la frequenza di ammiccamento tende a ridursi in modo marcato: questo favorisce secchezza e sensazione di affaticamento.",
  },
  {
    icon: Clock,
    title: "I sintomi si accumulano",
    body: "Una quota rilevante di chi usa schermi a lungo riferisce sintomi come stanchezza oculare, visione offuscata temporanea o mal di testa: è il cosiddetto affaticamento visivo digitale.",
  },
];

export function Problem() {
  return (
    <Section
      id="problema"
      eyebrow="Il problema"
      title="L'affaticamento visivo digitale è sempre più comune"
      description="L'uso prolungato dei dispositivi mette alla prova il sistema visivo. Conoscere i meccanismi è il primo passo per prendersene cura."
    >
      {/* Elenco vero (ul/li) per l'estrazione semantica: vedi Benefits. */}
      <ul role="list" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {points.map(({ icon: Icon, title, body }) => (
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

      <p
        role="note"
        className="mt-8 max-w-prose text-xs leading-relaxed text-muted-foreground"
      >
        Le affermazioni di questa sezione si basano sulla letteratura
        scientifica relativa al Digital Eye Strain e alla Computer Vision
        Syndrome. Hanno scopo informativo e non sostituiscono un parere
        professionale.
      </p>
    </Section>
  );
}
