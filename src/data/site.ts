/**
 * CONFIGURAZIONE CENTRALE DEL SITO
 * --------------------------------------------------------------------------
 * Unica fonte di verità per nome, claim, URL e voci di navigazione.
 * Usata da layout, SEO, header e footer.
 */

export const siteConfig = {
  name: "Rhodopsine",
  shortName: "Rhodopsine",
  mission: "La tua vista conta",
  description:
    "Educazione al benessere visivo: contenuti scientificamente corretti e uno strumento pratico di autovalutazione dell'affaticamento visivo digitale.",
  // L'URL pubblico arriva dall'ambiente; il fallback è il dominio di produzione
  // così canonical/OG/sitemap non puntano MAI a localhost, nemmeno se la
  // variabile manca sull'hosting.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rhodopsine.com",
  locale: "it_IT",
  // Targeting geografico e linguistico — unica fonte per hreflang (Metadata
  // API) e per i parametri geo del JSON-LD Organization (vedi lib/seo.ts).
  geo: {
    country: "IT",
    countryName: "Italia",
    language: "it-IT",
  },
  // Token di verifica proprietà del sito per Google Search Console.
  // Arriva dall'ambiente: se assente, il meta tag non viene emesso.
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  // Analytics privacy-first e COOKIELESS (Plausible): nessun cookie, nessun dato
  // personale, nessun banner di consenso bloccante. Si attiva SOLO se è
  // configurato il dominio; in sviluppo o senza config non viene iniettato nulla.
  analytics: {
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
    // Google Analytics 4: si attiva SOLO se l'ID è configurato nell'ambiente.
    // GA4 usa cookie → richiede consenso preventivo: viene caricato insieme al
    // banner Iubenda (vedi `iubenda` sotto e components/shared/cookie-consent).
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  },
  // Iubenda Cookie Solution: banner di consenso + blocco preventivo degli
  // script che usano cookie (GA4). Gli ID non sono segreti: identificano solo
  // la configurazione pubblica del banner.
  iubenda: {
    siteId: 4593728,
    cookiePolicyId: 55560426,
  },
  // Contatti diretti dell'organizzazione (mostrati nel footer per trasparenza).
  // Sono contatti editoriali, NON un canale clinico o di emergenza.
  contact: {
    email: "info.rhodopsine@gmail.com",
  },
  // Parole chiave principali (vedi docs e Metadata API).
  keywords: [
    "affaticamento visivo",
    "benessere visivo",
    "stanchezza degli occhi",
    "vista e smartphone",
    "salute visiva digitale",
    "digital eye strain",
    "computer vision syndrome",
  ],
} as const;

/**
 * Voci di navigazione principali — UNICA fonte per header (desktop + mobile) e
 * footer. Aggiungere/spostare una voce qui la propaga ovunque: niente liste di
 * link hard-coded nei componenti.
 */
export type NavItem = {
  title: string;
  href: string;
};

export const mainNav: readonly NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Test", href: "/test" },
  { title: "Metodo 20-20-20", href: "/timer" },
  { title: "Articoli", href: "/articoli" },
  { title: "Fonti", href: "/fonti" },
  { title: "Chi siamo", href: "/#chi-siamo" },
] as const;

/** Rotte applicative riutilizzabili (evita stringhe magiche sparse). */
export const routes = {
  home: "/",
  test: "/test",
  results: "/risultati",
  timer: "/timer",
  articles: "/articoli",
  sources: "/fonti",
  privacyPolicy: "/privacy-policy",
  cookiePolicy: "/cookie-policy",
  terms: "/termini",
} as const;

/**
 * Voci della colonna «Legale» del footer — unica fonte per i collegamenti ai
 * documenti legali (i testi vivono in `@/data/legal`).
 */
export const legalNav: readonly NavItem[] = [
  { title: "Privacy Policy", href: routes.privacyPolicy },
  { title: "Cookie Policy", href: routes.cookiePolicy },
  { title: "Termini e note legali", href: routes.terms },
] as const;
