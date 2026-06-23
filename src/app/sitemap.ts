import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getAllArticles } from "@/data/articles";

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
    ...articleEntries,
  ];
}
