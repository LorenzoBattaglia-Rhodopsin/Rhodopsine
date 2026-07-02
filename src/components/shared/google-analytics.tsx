import Script from "next/script";
import { siteConfig } from "@/data/site";

/**
 * GOOGLE ANALYTICS 4 — configurazione privacy-friendly
 * --------------------------------------------------------------------------
 * Si attiva SOLO se `NEXT_PUBLIC_GA_MEASUREMENT_ID` è configurato: in sviluppo
 * o senza configurazione non viene iniettato nulla (stesso pattern di
 * `analytics.tsx` per Plausible).
 *
 * Impostazioni privacy esplicite:
 * - `anonymize_ip`: IP anonimizzato (in GA4 è già il default, reso esplicito);
 * - `allow_google_signals: false`: disattiva Google Signals (niente dati
 *   cross-device/demografici);
 * - `allow_ad_personalization_signals: false`: nessun segnale per la
 *   personalizzazione degli annunci.
 *
 * GA4 usa comunque cookie (_ga): il caricamento è quindi subordinato al
 * consenso raccolto da Iubenda (vedi `cookie-consent.tsx`), il cui script di
 * autoblocking intercetta gtag.js e lo sblocca solo dopo il consenso.
 * Le risposte del test NON vengono mai inviate (CLAUDE.md §6.3): qui si
 * misurano solo pagine viste aggregate.
 *
 * Server Component: `next/script` con "afterInteractive" carica lo snippet
 * dopo l'idratazione — e quindi sempre DOPO l'autoblocking Iubenda.
 */
export function GoogleAnalytics() {
  const gaId = siteConfig.analytics.gaMeasurementId;

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  );
}
