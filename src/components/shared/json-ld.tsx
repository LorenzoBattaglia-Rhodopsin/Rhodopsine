/**
 * Inietta dati strutturati Schema.org come <script type="application/ld+json">.
 * Riceve un oggetto già pronto (vedi lib/seo.ts) e lo serializza.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // I dati provengono da costanti interne controllate, non da input utente.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
