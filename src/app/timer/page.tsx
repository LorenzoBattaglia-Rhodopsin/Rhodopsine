import type { Metadata } from "next";
import { Eye, Clock, Microscope } from "lucide-react";
import { Timer202020 } from "@/components/timer/timer-20-20-20";
import { FocusHub } from "@/components/timer/focus-hub";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Timer 20-20-20",
  description:
    "Proteggi i tuoi occhi dagli schermi con la regola 20-20-20: ogni 20 minuti fissa un oggetto a 6 metri per 20 secondi. Timer gratuito con promemoria e notifiche.",
  path: "/timer",
});

const benefits = [
  {
    icon: Clock,
    title: "Ogni 20 minuti",
    text: "Il timer conta in silenzio. Quando scadono 20 minuti, una notifica ti avviserà.",
  },
  {
    icon: Eye,
    title: "20 secondi di riposo",
    text: "Fissa un punto a oltre 6 metri. I tuoi occhi ti ringrazieranno.",
  },
  {
    icon: Microscope,
    title: "Basato su evidenze scientifiche",
    text: "La regola 20-20-20 è raccomandata da ottici e optometristi per ridurre l'affaticamento da schermo.",
  },
] as const;

export default function TimerPage() {
  return (
    <section className="scroll-mt-24 py-12 sm:py-16">
      <div className="container">
        {/* Intestazione */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-eyebrow font-medium uppercase text-primary">
            Benessere visivo
          </p>
          <h1 className="text-title text-balance font-semibold text-foreground">
            Timer 20‑20‑20
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Ogni 20 minuti, fissa un punto a almeno 6 metri di distanza
            per 20 secondi. Una pausa semplice che fa la differenza.
          </p>
        </div>

        {/* Componente timer (client) */}
        <Timer202020 />

        {/* Sezione "focus" dedicata: stessa state machine, presentazione a Card
            con barra di avanzamento lineare e display in Geist Mono. */}
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="mb-6 text-center">
            <p className="mb-2 text-eyebrow font-medium uppercase text-primary">
              Modalità focus
            </p>
            <h2 className="text-heading font-semibold text-foreground">
              La tua sessione in un colpo d'occhio
            </h2>
          </div>
          <FocusHub />
        </div>

        {/* Card informative */}
        <div className="mx-auto mt-14 max-w-2xl">
          <ul className="grid gap-4 sm:grid-cols-3" role="list">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div
                  aria-hidden="true"
                  className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10"
                >
                  <Icon className="size-4 text-primary" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">{title}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Nota educativa */}
        <p className="mx-auto mt-10 max-w-md text-center text-xs leading-relaxed text-muted-foreground">
          Questo strumento è preventivo ed educativo. Non è una diagnosi e non
          sostituisce il parere di un professionista. Se i disturbi visivi sono
          frequenti o persistenti, rivolgiti a un oculista.
        </p>
      </div>
    </section>
  );
}
