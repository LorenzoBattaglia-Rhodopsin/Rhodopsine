/* eslint-disable @next/next/no-before-interactive-script-outside-document --
   Regola pensata per il Pages Router (_document). In App Router
   "beforeInteractive" è corretto se reso dal root layout, ed è esattamente il
   caso: questo componente è montato in app/layout.tsx. Verificato a runtime:
   gli script finiscono nella coda pre-idratazione di Next (__next_s), quindi
   l'autoblocking esegue sempre PRIMA di gtag.js. */
import Script from "next/script";
import { siteConfig } from "@/data/site";

/**
 * CONSENSO COOKIE — Iubenda Cookie Solution con blocco preventivo
 * --------------------------------------------------------------------------
 * Mostra il banner di consenso e BLOCCA preventivamente gli script che usano
 * cookie (Google Analytics 4) finché l'utente non acconsente, come richiesto
 * dalla normativa italiana/UE. È la "base privacy esplicita" prevista da
 * CLAUDE.md §6.3 per le chiamate di rete di terze parti.
 *
 * Ordine di caricamento (critico):
 * 1. configurazione `_iub.csConfiguration` e script di autoblocking con
 *    strategia "beforeInteractive" → eseguiti prima di qualsiasi script
 *    applicativo, così gtag.js viene intercettato e bloccato;
 * 2. stub GPP e `iubenda_cs.js` (il banner vero e proprio) in "afterInteractive".
 *
 * Il banner viene reso solo se GA è configurato: senza script che usano
 * cookie non c'è alcun consenso da raccogliere (Plausible è cookieless).
 */
export function CookieConsent() {
  // Nessuno script con cookie configurato → nessun banner necessario.
  if (!siteConfig.analytics.gaMeasurementId) return null;

  const { siteId, cookiePolicyId } = siteConfig.iubenda;
  const csConfiguration = {
    siteId,
    cookiePolicyId,
    lang: "it",
    storage: { useSiteId: true },
  };

  return (
    <>
      <Script id="iubenda-cs-configuration" strategy="beforeInteractive">
        {`var _iub = _iub || []; _iub.csConfiguration = ${JSON.stringify(csConfiguration)};`}
      </Script>
      <Script
        src={`https://cs.iubenda.com/autoblocking/${siteId}.js`}
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.iubenda.com/cs/gpp/stub.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.iubenda.com/cs/iubenda_cs.js"
        strategy="afterInteractive"
      />
    </>
  );
}
