"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HERO_CTA_ID, routes } from "@/data/site";

/**
 * CTA "Fai il test" dell'header (desktop).
 *
 * In home l'hero propone già il test: per non mostrare due volte la stessa
 * azione nella stessa schermata, qui il bottone compare solo quando la CTA
 * dell'hero è uscita dal viewport (IntersectionObserver). Nelle altre pagine
 * è sempre visibile, tranne su /test, dove sarebbe un link alla pagina stessa.
 *
 * Nascosto con `invisible` (visibility: hidden) e non smontato: l'header non
 * cambia larghezza (niente salti del timer accanto) e il bottone esce anche
 * da tastiera e lettori di schermo.
 */
export function HeaderCta({ className }: { className?: string }) {
  const pathname = usePathname();
  const isHome = pathname === routes.home;
  const [heroCtaVisible, setHeroCtaVisible] = useState(isHome);

  useEffect(() => {
    if (!isHome) return;
    const target = document.getElementById(HERO_CTA_ID);
    if (!target) {
      setHeroCtaVisible(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setHeroCtaVisible(entry.isIntersecting);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [isHome]);

  if (pathname === routes.test) return null;

  const hidden = isHome && heroCtaVisible;

  return (
    <Button
      asChild
      size="sm"
      variant="secondary"
      className={cn(
        "shrink-0 transition-[opacity,visibility] duration-200",
        hidden && "invisible opacity-0",
        className,
      )}
    >
      <Link href={routes.test} aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined}>
        Fai il test
      </Link>
    </Button>
  );
}
