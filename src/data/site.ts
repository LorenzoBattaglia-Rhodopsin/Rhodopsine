/**
 * CONFIGURAZIONE CENTRALE DEL SITO
 * --------------------------------------------------------------------------
 * Unica fonte di verità per nome, claim, URL e voci di navigazione.
 * Usata da layout, SEO, header e footer.
 */

export const siteConfig = {
  name: "Rhodopsin",
  shortName: "Rhodopsin",
  mission: "La tua vista conta",
  description:
    "Educazione al benessere visivo: contenuti scientificamente corretti e uno strumento pratico di autovalutazione dell'affaticamento visivo digitale.",
  // L'URL pubblico arriva dall'ambiente; fallback per lo sviluppo locale.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "it_IT",
  // Token di verifica proprietà del sito per Google Search Console.
  // Arriva dall'ambiente: se assente, il meta tag non viene emesso.
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  // Analytics privacy-first e COOKIELESS (Plausible): nessun cookie, nessun dato
  // personale, nessun banner di consenso bloccante. Si attiva SOLO se è
  // configurato il dominio; in sviluppo o senza config non viene iniettato nulla.
  analytics: {
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
  },
  // Contatti diretti dell'organizzazione (mostrati nel footer per trasparenza).
  // Sono contatti editoriali, NON un canale clinico o di emergenza.
  contact: {
    email: "redazione@wellbeingeye.it",
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
} as const;
