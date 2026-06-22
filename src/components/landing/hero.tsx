import Link from "next/link";
import { ShieldCheck, FlaskConical, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EyeIllustration } from "@/components/shared/eye-illustration";
import { routes } from "@/data/site";

/**
 * HERO — Tesi della pagina.
 * Apre con il claim "La tua vista conta." e l'elemento-firma (l'iride),
 * due CTA chiare e indicatori di affidabilità.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-8 lg:py-28">
        {/* Colonna testo */}
        <div className="max-w-xl animate-fade-in-up">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
            <Eye className="size-3.5 text-primary" aria-hidden="true" />
            La tua vista conta.
          </p>

          <h1 className="text-display text-balance font-semibold text-foreground">
            Il benessere visivo a portata di mano.
          </h1>

          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Passi più di 6 ore al giorno davanti a uno schermo? <br/>
            Scopri in 2 minuti se le tue abitudini stanno affaticando i tuoi occhi.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={routes.test}>Fai ora il test gratuito</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/#come-funziona">Scopri di più</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Cerchi solo una pausa veloce?{" "}
            <Link
              href={routes.timer}
              className="rounded font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              
                Prova il Timer 20‑20‑20
            
            </Link>
          </p>

          {/* Indicatori di affidabilità */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <li className="inline-flex items-center gap-2">
              <FlaskConical className="size-4 text-primary" aria-hidden="true" />
              Basato sulla letteratura su DES/CVS
            </li>
            <li className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
              Nessuna diagnosi, solo prevenzione
            </li>
          </ul>
        </div>

        {/* Colonna illustrazione (decorativa, in secondo piano su mobile) */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <EyeIllustration className="mx-auto h-auto w-2/3 max-w-sm lg:w-full" />
        </div>
      </div>
    </section>
  );
}
