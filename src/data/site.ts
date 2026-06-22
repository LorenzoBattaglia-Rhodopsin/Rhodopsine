/**
 * CONFIGURAZIONE CENTRALE DEL SITO
 * --------------------------------------------------------------------------
 * Unica fonte di verità per nome, claim, URL e voci di navigazione.
 * Usata da layout, SEO, header e footer.
 */

export const siteConfig = {
  name: "WELL-BEING-EYE",
  shortName: "WBe",
  mission: "La tua vista conta",
  description:
    "Educazione al benessere visivo: contenuti scientificamente corretti e uno strumento pratico di autovalutazione dell'affaticamento visivo digitale.",
  // L'URL pubblico arriva dall'ambiente; fallback per lo sviluppo locale.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "it_IT",
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

/** Voci di navigazione principali. */
export const mainNav = [
  { title: "Il problema", href: "/#problema" },
  { title: "Benefici", href: "/#benefici" },
  { title: "Come funziona", href: "/#come-funziona" },
  { title: "Timer 20-20-20", href: "/timer" },
] as const;

/** Rotte applicative riutilizzabili (evita stringhe magiche sparse). */
export const routes = {
  home: "/",
  test: "/test",
  results: "/risultati",
  timer: "/timer",
} as const;
