import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

/**
 * ROBOTS
 * --------------------------------------------------------------------------
 * Indicizzazione aperta, tranne la pagina dei risultati personali.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/risultati",
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
