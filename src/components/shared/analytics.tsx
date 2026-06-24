import Script from "next/script";
import { siteConfig } from "@/data/site";

/**
 * ANALYTICS — Statistiche privacy-first e COOKIELESS (Plausible)
 * --------------------------------------------------------------------------
 * Si attiva SOLO se `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` è configurato: in sviluppo
 * o senza configurazione non viene iniettato nulla.
 *
 * Perché Plausible (e non Google Analytics classico):
 * - Nessun cookie e nessun dato personale → niente banner di consenso bloccante
 *   ("niente dati su server" e con un approccio
 *   educativo/preventivo rispettoso della privacy).
 * - Conteggi aggregati e anonimi delle visite, sufficienti per capire cosa
 *   funziona senza profilare le persone.
 *
 * Server Component: `next/script` con strategia "afterInteractive" carica lo
 * snippet dopo l'idratazione, senza bloccare il rendering.
 */
export function Analytics() {
  const domain = siteConfig.analytics.plausibleDomain;

  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
