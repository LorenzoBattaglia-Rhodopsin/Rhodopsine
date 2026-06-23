import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { TimerTrigger } from "@/components/timer/timer-trigger";
import { routes, siteConfig } from "@/data/site";

/**
 * Header del sito (Server Component).
 * Sticky, con sfondo semitrasparente sfocato. Flusso volutamente essenziale:
 * marchio a sinistra, controllo timer globale + CTA principale a destra.
 * I link di navigazione di sezione restano raggiungibili dal footer.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href={routes.home}
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`${siteConfig.name} — home`}
        >
          <Logo />
        </Link>

        {/* Controllo timer globale + CTA: il trigger comanda lo stesso timer
            della pagina /timer (stato condiviso via TimerProvider). */}
        <div className="flex items-center gap-2 sm:gap-3">
          <TimerTrigger />
          <Button asChild size="sm" className="shrink-0">
            <Link href={routes.test}>Inizia il test</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
