import Link from "next/link";
import { Monitor, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EyeIllustration } from "@/components/shared/eye-illustration";
import { HERO_CTA_ID, routes } from "@/data/site";

/**
 * HERO — Il problema.
 * Apre la pagina con il problema che il sito aiuta ad affrontare
 * (affaticamento visivo digitale) e una sola CTA primaria: il test.
 * I tre fatti chiave sono affermazioni prudenti, sostenute dalla letteratura
 * su DES/CVS (nessuna percentuale non verificabile). L'iride resta
 * l'elemento-firma del marchio. La presentazione del progetto ("Chi siamo")
 * vive nel footer (#chi-siamo); l'avvertenza in fondo alla home.
 *
 * Layout:
 * - Mobile (base): colonna unica centrata, iride in alto e testo sotto.
 * - Desktop (lg+): due colonne — testo a sinistra, iride a destra.
 */
const facts = [
  { icon: Monitor, text: "Passiamo gran parte della giornata davanti agli schermi." },
  { icon: Eye, text: "Davanti a uno schermo ammicchiamo molto meno: gli occhi si seccano." },
  { icon: Clock, text: "Stanchezza oculare, vista offuscata e mal di testa si accumulano." },
] as const;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container py-16 sm:py-24 lg:py-28">
        <div className="flex flex-col items-center text-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:text-left">
          {/* Elemento-firma: l'iride — su desktop passa nella colonna destra.
              È l'unico elemento con l'entrata animata: il testo (H1 = LCP)
              compare subito, senza partire da opacità 0. */}
          <div className="animate-fade-in-up lg:order-2 lg:flex lg:justify-end">
            <EyeIllustration className="mb-8 h-auto w-32 sm:w-40 lg:mb-0 lg:w-full lg:max-w-sm" />
          </div>

          <div className="flex max-w-2xl flex-col items-center lg:order-1 lg:items-start">
            <h1
              id="hero-title"
              className="text-display text-balance font-semibold text-foreground"
            >
              Occhi stanchi dopo ore davanti allo schermo?
            </h1>

            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              È l&apos;affaticamento visivo digitale, sempre più comune. Con un
              breve test scopri quali abitudini pesano di più sui tuoi occhi e
              ricevi consigli pratici per alleggerirle.
            </p>

            <ul className="mt-6 flex flex-col gap-3 text-left text-[0.9375rem] leading-relaxed text-muted-foreground">
              {facts.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex w-full flex-col sm:w-auto">
              <Button asChild size="lg">
                <Link id={HERO_CTA_ID} href={routes.test}>
                  Fai il test gratuito
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
