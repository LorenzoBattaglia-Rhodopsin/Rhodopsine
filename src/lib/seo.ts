import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import {
  contentAuthor,
  contentReviewer,
  contentReviewedAt,
  type ContentContributor,
} from "@/data/e-e-a-t";

/**
 * SEO — Helper centralizzati
 * --------------------------------------------------------------------------
 * `buildMetadata` produce un oggetto Metadata coerente (title, description,
 * canonical, Open Graph, Twitter Card) a partire da pochi parametri.
 *
 * Le immagini social (og:image / twitter:image) NON sono definite qui: le
 * generano le file convention `src/app/opengraph-image.tsx` e
 * `src/app/twitter-image.tsx` (PNG 1200×630, URL assoluto via `metadataBase`,
 * con hash di cache-busting aggiunto da Next). Non aggiungere `images` qui,
 * o creeresti metadata duplicati/conflittuali.
 */

interface BuildMetadataParams {
  title?: string;
  description?: string;
  /** Path relativo (es. "/test") per canonical e Open Graph. */
  path?: string;
  /** Se true, la pagina non viene indicizzata (es. risultati personali). */
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  noIndex = false,
}: BuildMetadataParams = {}): Metadata {
  const url = new URL(path, siteConfig.url).toString();

  // Title pattern: pagina interna "Titolo · Rhodopsine", home con claim completo.
  const computedTitle = title
    ? `${title} · ${siteConfig.shortName}`
    : `${siteConfig.name} — ${siteConfig.mission}`;

  return {
    title: computedTitle,
    description,
    keywords: [...siteConfig.keywords],
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url,
      title: computedTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: computedTitle,
      description,
    },
  };
}

/**
 * JSON-LD (Schema.org) per l'organizzazione/sito.
 * Da iniettare in pagina con un tag <script type="application/ld+json">.
 */
export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "it-IT",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      slogan: siteConfig.mission,
    },
  };
}

/**
 * Converte un contributore (autore/revisore) in un nodo Schema.org Person/
 * Organization, includendo solo i campi valorizzati. Usato per le proprietà
 * `author` e `reviewedBy` (segnali di E-E-A-T).
 */
function contributorToSchema(
  contributor: ContentContributor,
): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@type": contributor.schemaType,
    name: contributor.name,
  };
  if (contributor.jobTitle) node.jobTitle = contributor.jobTitle;
  if (contributor.url) node.url = contributor.url;
  return node;
}

/**
 * JSON-LD per lo strumento di autovalutazione, modellato come MedicalWebPage
 * a scopo informativo. Esplicita che NON fornisce diagnosi.
 *
 * `author` e `reviewedBy` comunicano paternità e revisione dei contenuti
 * (E-E-A-T). I dati provengono da `@/data/e-e-a-t`.
 */
export function getAssessmentJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "Test di autovalutazione dell'affaticamento visivo",
    description:
      "Strumento educativo per riflettere sulle proprie abitudini visive digitali. Non fornisce diagnosi e non sostituisce una visita professionale.",
    inLanguage: "it-IT",
    url: new URL("/test", siteConfig.url).toString(),
    audience: { "@type": "Audience", audienceType: "Pubblico generale" },
    author: contributorToSchema(contentAuthor),
    reviewedBy: contributorToSchema(contentReviewer),
    lastReviewed: contentReviewedAt,
    // Nota: nessuna proprietà diagnostica viene dichiarata, di proposito.
  };
}
