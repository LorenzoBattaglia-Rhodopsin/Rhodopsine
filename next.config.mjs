/**
 * Configurazione Next.js (App Router).
 *
 * Note di manutenzione:
 * - `eslint.ignoreDuringBuilds`: il lint NON blocca la build di produzione.
 *   Eseguire il lint separatamente in CI con `npm run lint`. Questo mantiene
 *   le build deterministiche e veloci.
 * - `headers()`: header di sicurezza di base (best practices Lighthouse).
 *   Per una CSP completa si veda docs/ROADMAP.md.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,


  // Header di sicurezza applicati a tutte le rotte.
  async headers() {
    return [
      // Estratto OSM dei professionisti: file statico identico per tutti,
      // aggiornato una volta al mese → cache di 1 giorno (+ 1 settimana
      // stale-while-revalidate). Non contiene né riceve dati degli utenti.
      {
        source: "/data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // geolocation=(self): solo il nostro sito (mai iframe di terzi) può
          // chiedere la posizione, e solo su click esplicito nella ricerca
          // professionisti di /risultati. La posizione resta nel browser.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
