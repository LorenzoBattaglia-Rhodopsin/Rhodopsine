import type { MetadataRoute } from "next";
import { routes, siteConfig } from "@/data/site";
import { getAllArticles } from "@/data/articles";
import { legalDocuments, legalLastUpdated } from "@/data/legal";

/**
 * SITEMAP
 * --------------------------------------------------------------------------
 * Includiamo solo le pagine pubbliche indicizzabili. La pagina /risultati è
 * esclusa di proposito (è personale e marcata noindex).
 *
 * `lastModified` è una data STABILE dell'ultima modifica significativa del
 * contenuto, non la data della build: Google ignora `lastmod` quando cambia a
 * ogni deploy senza che la pagina cambi davvero.
 * ⚠️ Quando modifichi in modo sostanziale una pagina, aggiorna la sua data qui.
 */

/** Ultima modifica significativa delle pagine statiche (AAAA-MM-GG). */
const PAGES_UPDATED_AT = {
  home: "2026-11-19",
  test: "2026-11-19",
  timer: "2026-11-19",
  sources: "2026-11-19",
} as const;

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const absolute = (path: string) => new URL(path, siteConfig.url).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absolute(`${routes.articles}/${article.slug}`),
    lastModified: toDate(article.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // L'indice degli articoli cambia quando ne esce uno nuovo.
  const latestArticle = articles
    .map((article) => article.publishedAt)
    .sort()
    .at(-1);

  const legalEntries: MetadataRoute.Sitemap = legalDocuments.map((doc) => ({
    url: absolute(doc.path),
    lastModified: toDate(legalLastUpdated),
    changeFrequency: "yearly",
    priority: 0.2,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: toDate(PAGES_UPDATED_AT.home),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absolute(routes.test),
      lastModified: toDate(PAGES_UPDATED_AT.test),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absolute(routes.timer),
      lastModified: toDate(PAGES_UPDATED_AT.timer),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absolute(routes.articles),
      lastModified: toDate(latestArticle ?? PAGES_UPDATED_AT.home),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...articleEntries,
    {
      url: absolute(routes.sources),
      lastModified: toDate(PAGES_UPDATED_AT.sources),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    ...legalEntries,
  ];
}
