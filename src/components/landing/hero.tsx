import Link from "next/link";
import { ShieldCheck, FlaskConical, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EyeIllustration } from "@/components/shared/eye-illustration";
import { routes, siteConfig } from "@/data/site";

/**
 * HERO — Chi siamo / Mission.
 * Sezione che apre la pagina presentando il progetto e la sua missione.
 * L'iride resta l'elemento-firma del marchio. Il disclaimer medico-legale è
 * mantenuto a fondo pagina (vedi DisclaimerSection).
 *
 * Layout:
 * - Mobile (base): colonna unica centrata, iride in alto e testo sotto.
 * - Desktop (lg+): griglia a due colonne affiancate — testo a sinistra,
 *   iride (ingrandita) a destra. Nessuna classe base viene modificata: il
 *   comportamento mobile resta identico.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container py-16 sm:py-24 lg:py-28">
        <div className="flex flex-col items-center text-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:text-left">
          {/* Elemento-firma: l'iride — su desktop passa nella colonna destra.
              È l'unico elemento con l'entrata animata: il testo (H1 = LCP)
              compare subito, senza partire da opacità 0. */}
          <div className="animate-fade-in-up lg:order-2 lg:flex lg:justify-end">
            <EyeIllustration className="mb-8 h-auto w-32 sm:w-40 lg:mb-0 lg:w-full lg:max-w-sm" />
          </div>

          {/* Blocco testuale — su desktop nella colonna sinistra */}
          <div className="flex max-w-2xl flex-col items-center lg:order-1 lg:items-start">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
              <Eye className="size-3.5 text-primary" aria-hidden="true" />
              Chi siamo
            </p>

            <h1 className="text-display text-balance font-semibold text-foreground">
              Il benessere visivo, a portata di mano.
            </h1>

            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {siteConfig.name}{" "}
              nasce per aiutarti a capire e prendere cura della
              tua vista nell&apos;era degli schermi. Uniamo contenuti
              scientificamente corretti e strumenti pratici per ridurre
              l&apos;affaticamento visivo digitale, con un approccio educativo e
              preventivo &mdash; mai diagnostico.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg">
                <Link href={routes.test}>Fai ora il test gratuito</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/#come-funziona">Scopri di più</Link>
              </Button>
            </div>

            {/* Indicatori di affidabilità */}
            <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground lg:justify-start">
              <li className="inline-flex items-center gap-2">
                <FlaskConical className="size-4" aria-hidden="true" />
                Basato sulla letteratura su DES/CVS
              </li>
              <li className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Nessuna diagnosi, solo prevenzione
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
