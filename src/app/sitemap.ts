import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getAllArticles } from "@/data/articles";
import { legalDocuments } from "@/data/legal";

/**
 * SITEMAP
 * --------------------------------------------------------------------------
 * Includiamo solo le pagine pubbliche indicizzabili. La pagina /risultati è
 * esclusa di proposito (è personale e marcata noindex).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const articleEntries: MetadataRoute.Sitemap = getAllArticles().map(
    (article) => ({
      url: new URL(`/articoli/${article.slug}`, siteConfig.url).toString(),
      lastModified: new Date(`${article.publishedAt}T00:00:00`),
      changeFrequency: "yearly",
      priority: 0.5,
    }),
  );

  // Pagine legali: pubbliche e indicizzabili, priorità bassa.
  const legalEntries: MetadataRoute.Sitemap = legalDocuments.map((doc) => ({
    url: new URL(`/${doc.slug}`, siteConfig.url).toString(),
    lastModified: new Date(`${doc.updatedAt}T00:00:00`),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/test", siteConfig.url).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/timer", siteConfig.url).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: new URL("/articoli", siteConfig.url).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: new URL("/fonti", siteConfig.url).toString(),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    ...articleEntries,
    ...legalEntries,
  ];
}
