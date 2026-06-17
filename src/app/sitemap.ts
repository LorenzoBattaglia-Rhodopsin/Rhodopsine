import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

/**
 * SITEMAP
 * --------------------------------------------------------------------------
 * Includiamo solo le pagine pubbliche indicizzabili. La pagina /risultati è
 * esclusa di proposito (è personale e marcata noindex).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
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
  ];
}
