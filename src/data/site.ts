/**
 * CONFIGURAZIONE CENTRALE DEL SITO
 * --------------------------------------------------------------------------
 * Unica fonte di verità per nome, claim, URL e voci di navigazione.
 * Usata da layout, SEO, header e footer.
 */

/**
 * URL pubblico canonico del sito (senza slash finale).
 * Arriva da `NEXT_PUBLIC_SITE_URL`; il fallback è il dominio di produzione,
 * così canonical/OG/sitemap non puntano MAI a localhost, nemmeno se la
 * variabile manca (o è vuota) sull'hosting. `||` e non `??`: una variabile
 * definita ma vuota farebbe fallire `new URL(...)` in build.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://rhodopsine.com"
).replace(/\/+$/, "");

export const siteConfig = {
  name: "Rhodopsine",
  shortName: "Rhodopsine",
  mission: "Il benessere visivo a portata di mano",
  description:
    "Educazione al benessere visivo: contenuti scientificamente corretti e uno strumento pratico di autovalutazione dell'affaticamento visivo digitale.",
  url: SITE_URL,
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
  { title: "Ottici e oculisti", href: "/trova-ottici-oculisti" },
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
  professionals: "/trova-ottici-oculisti",
  articles: "/articoli",
  sources: "/fonti",
  privacy: "/privacy",
  cookiePolicy: "/cookie-policy",
  legalNotes: "/note-legali",
  disclaimer: "/disclaimer",
} as const;
