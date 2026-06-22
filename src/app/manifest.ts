import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

/**
 * WEB APP MANIFEST (PWA di base)
 * --------------------------------------------------------------------------
 * Colori coerenti con il tema scuro (#1A1816). L'icona è un SVG scalabile.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#1A1816",
    theme_color: "#1A1816",
    lang: "it-IT",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      // PNG raster: richiesti da iOS/Android per home screen e Now Playing.
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
