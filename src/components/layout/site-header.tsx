import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { TimerTrigger } from "@/components/timer/timer-trigger";
import { DesktopNav, MobileNav } from "@/components/layout/site-nav";
import { routes, siteConfig } from "@/data/site";

/**
 * Header del sito (Server Component).
 * Sticky, con sfondo semitrasparente sfocato.
 * - Desktop: marchio + navigazione a sinistra, controllo timer + CTA a destra.
 * - Mobile: marchio + timer + menu hamburger (le voci e la CTA vivono nel
 *   pannello a comparsa, vedi MobileNav).
 * Le voci di navigazione arrivano da `mainNav` (fonte unica in `@/data/site`).
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href={routes.home}
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`${siteConfig.name} — home`}
          >
            <Logo />
          </Link>
          <DesktopNav className="hidden lg:block" />
        </div>

        {/* Controllo timer globale + CTA: il trigger comanda lo stesso timer
            della pagina /timer (stato condiviso via TimerProvider). */}
        <div className="flex items-center gap-2 sm:gap-3">
          <TimerTrigger />
          <Button asChild size="sm" className="hidden shrink-0 lg:inline-flex">
            <Link href={routes.test}>Inizia il test</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
