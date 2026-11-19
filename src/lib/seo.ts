import type { Metadata } from "next";
import { routes, siteConfig } from "@/data/site";
import type { Article } from "@/data/articles";
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
 * canonical, hreflang, robots, Open Graph, Twitter Card) a partire da pochi
 * parametri.
 *
 * Le immagini social (og:image / twitter:image) NON sono definite qui: le
 * generano le file convention `src/app/opengraph-image.tsx` e
 * `src/app/twitter-image.tsx` (PNG 1200×630, URL assoluto via `metadataBase`,
 * con hash di cache-busting aggiunto da Next). Non aggiungere `images` qui,
 * o creeresti metadata duplicati/conflittuali.
 *
 * JSON-LD: i nodi `Organization` e `WebSite` (iniettati una volta nel layout)
 * espongono un `@id` stabile; i nodi di pagina (`MedicalWebPage`, `Article`)
 * li referenziano via `publisher`/`isPartOf`, formando su ogni pagina un
 * grafo Schema.org coerente senza duplicare i dati.
 */

/** `@id` stabili dei nodi JSON-LD globali (per i riferimenti nel grafo). */
const ORGANIZATION_JSONLD_ID = new URL(
  "/#organization",
  siteConfig.url,
).toString();
const WEBSITE_JSONLD_ID = new URL("/#website", siteConfig.url).toString();

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
    // Paternità dei contenuti (E-E-A-T): la redazione firma come autore,
    // l'organizzazione come publisher.
    authors: [{ name: contentAuthor.name, url: siteConfig.url }],
    creator: contentAuthor.name,
    publisher: siteConfig.name,
    alternates: {
      canonical: url,
      // hreflang: oggi il sito esiste solo in italiano; `x-default` àncora
      // la versione di riferimento e prepara l'espansione multilingua senza
      // cambiare struttura. Omesso sulle pagine noindex (sarebbe incoerente
      // dichiarare alternative di una pagina esclusa dall'indice).
      ...(noIndex
        ? {}
        : { languages: { [siteConfig.geo.language]: url, "x-default": url } }),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            // Nessun limite a snippet e anteprime: massimizza l'idoneità dei
            // contenuti come estratti ricchi (SERP classica e AI Overviews).
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },
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
 * JSON-LD (Schema.org) per l'ORGANIZZAZIONE editoriale.
 * Nodo globale (iniettato nel layout) con `@id` stabile, referenziato dagli
 * altri nodi. Include i parametri geografici (pubblico e territorio italiani)
 * per la rilevanza locale, e i contatti per la trasparenza (E-E-A-T).
 */
export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_JSONLD_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    slogan: siteConfig.mission,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    logo: {
      "@type": "ImageObject",
      url: new URL("/icon-512.png", siteConfig.url).toString(),
      width: 512,
      height: 512,
    },
    // Rilevanza geografica: progetto italiano rivolto al pubblico italiano.
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.geo.country,
    },
    areaServed: {
      "@type": "Country",
      name: siteConfig.geo.countryName,
    },
    knowsLanguage: siteConfig.geo.language,
    // Ambiti tematici dell'organizzazione (aiuta i crawler a classificare
    // l'authority del progetto sul benessere visivo digitale).
    knowsAbout: [...siteConfig.keywords],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contact.email,
      // Canale editoriale, NON clinico (coerente con il footer).
      contactType: "informazioni editoriali",
      areaServed: siteConfig.geo.country,
      availableLanguage: "Italian",
    },
  };
}

/**
 * JSON-LD (Schema.org) per il sito web.
 * Da iniettare in pagina con un tag <script type="application/ld+json">.
 */
export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_JSONLD_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.geo.language,
    publisher: { "@id": ORGANIZATION_JSONLD_ID },
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
 * (E-E-A-T). I dati provengono da `@/data/e-e-a-t`. Finché il revisore è un
 * placeholder senza nome (vedi e-e-a-t.ts), `reviewedBy` NON viene emesso:
 * un nodo Person con nome vuoto sarebbe un segnale negativo, non positivo.
 */
export function getAssessmentJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "Test di autovalutazione dell'affaticamento visivo",
    description:
      "Strumento educativo per riflettere sulle proprie abitudini visive digitali. Non fornisce diagnosi e non sostituisce una visita professionale.",
    // Ribadisce ai crawler la natura NON diagnostica dello strumento.
    disambiguatingDescription:
      "Autovalutazione educativa e preventiva: non è un dispositivo medico, non produce diagnosi e non sostituisce la visita di un professionista della visione.",
    inLanguage: siteConfig.geo.language,
    url: new URL(routes.test, siteConfig.url).toString(),
    isPartOf: { "@id": WEBSITE_JSONLD_ID },
    publisher: { "@id": ORGANIZATION_JSONLD_ID },
    isAccessibleForFree: true,
    audience: { "@type": "Audience", audienceType: "Pubblico generale" },
    // Argomento della pagina (informativo: dice DI COSA parla, non che
    // diagnostica). Gli alternateName coprono le denominazioni in letteratura.
    about: {
      "@type": "MedicalCondition",
      name: "Affaticamento visivo digitale",
      alternateName: ["Digital Eye Strain", "Computer Vision Syndrome"],
    },
    author: contributorToSchema(contentAuthor),
    // Revisore e data di revisione solo se la revisione esiste davvero.
    ...(contentReviewer.name
      ? {
          reviewedBy: contributorToSchema(contentReviewer),
          lastReviewed: contentReviewedAt,
        }
      : {}),
    // Nota: nessuna proprietà diagnostica viene dichiarata, di proposito.
  };
}

/**
 * JSON-LD per un articolo educativo (pagina /articoli/[slug]).
 * `publisher` e `isPartOf` referenziano i nodi globali del layout; l'autore è
 * la redazione (E-E-A-T). Nessuna immagine dedicata: l'OG image di pagina è
 * generata dalle file convention.
 */
export function getArticleJsonLd(article: Article) {
  const url = new URL(
    `${routes.articles}/${article.slug}`,
    siteConfig.url,
  ).toString();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: siteConfig.geo.language,
    datePublished: article.publishedAt,
    articleSection: article.category,
    isAccessibleForFree: true,
    author: contributorToSchema(contentAuthor),
    publisher: { "@id": ORGANIZATION_JSONLD_ID },
    isPartOf: { "@id": WEBSITE_JSONLD_ID },
  };
}

/**
 * JSON-LD per il percorso di navigazione (BreadcrumbList).
 * `items` in ordine dalla radice alla pagina corrente; i path relativi
 * vengono resi assoluti rispetto all'URL del sito.
 */
export function getBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteConfig.url).toString(),
    })),
  };
}
