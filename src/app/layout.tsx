import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/shared/json-ld";
import { Analytics } from "@/components/shared/analytics";
import { TimerProvider } from "@/components/timer/timer-provider";
import {
  buildMetadata,
  getOrganizationJsonLd,
  getWebsiteJsonLd,
} from "@/lib/seo";
import { siteConfig } from "@/data/site";

/**
 * LAYOUT RADICE
 * --------------------------------------------------------------------------
 * Imposta lingua, metadati di base, font (Geist, self-hosted) e la struttura
 * comune (skip-link → header → main → footer). Inietta il JSON-LD del sito una
 * volta sola, qui, così è presente su tutte le pagine.
 */

// `metadataBase` permette a Next di rendere assoluti gli URL relativi (OG, canonical).
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata(),
  // Verifica proprietà del sito su Google Search Console. Il meta tag viene
  // emesso solo se il token è presente nell'ambiente (niente tag vuoto).
  ...(siteConfig.googleSiteVerification
    ? { verification: { google: siteConfig.googleSiteVerification } }
    : {}),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    // iOS usa un PNG raster per l'icona "Aggiungi a Home" (no SVG).
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#1A1816",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh text-foreground antialiased">
        {/* Link di salto: visibile solo con tastiera, porta al contenuto. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Vai al contenuto
        </a>

        {/* Grafo Schema.org globale: Organization (con @id referenziato dagli
            altri nodi) + WebSite. Presenti su ogni pagina, una volta sola. */}
        <JsonLd data={getOrganizationJsonLd()} />
        <JsonLd data={getWebsiteJsonLd()} />

        {/* Statistiche aggregate, cookieless e senza dati personali (Plausible).
            Attivo solo se NEXT_PUBLIC_PLAUSIBLE_DOMAIN è configurato. È l'UNICO
            analytics ammesso: il sito è cookie-free per scelta (nessun banner
            di consenso necessario). Non reintrodurre tracker basati su cookie
            senza pagine legali e base privacy (CLAUDE.md §6.3). */}
        <Analytics />

        {/* Provider del Timer 20-20-20: avvolge tutta l'app così header,
            pagina /timer e FocusHub condividono un'unica state machine. */}
        <TimerProvider>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </TimerProvider>
      </body>
    </html>
  );
}
