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

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Header di sicurezza applicati a tutte le rotte.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
