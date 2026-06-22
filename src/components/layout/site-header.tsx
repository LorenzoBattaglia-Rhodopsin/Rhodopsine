import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { TimerTrigger } from "@/components/timer/timer-trigger";
import { mainNav, routes, siteConfig } from "@/data/site";

/**
 * Header del sito (Server Component).
 * Sticky, con sfondo semitrasparente sfocato. Su mobile la navigazione
 * secondaria è nascosta per privilegiare la CTA (mobile-first); le ancore
 * restano raggiungibili dal footer e dalle sezioni.
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

        {/* Navigazione principale (visibile da tablet in su) */}
        <nav aria-label="Navigazione principale" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

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
