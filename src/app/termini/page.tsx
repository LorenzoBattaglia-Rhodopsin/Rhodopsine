import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { termini } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";
import { routes } from "@/data/site";

/**
 * PAGINA TERMINI E NOTE LEGALI (Server Component, statica e indicizzabile)
 * --------------------------------------------------------------------------
 * Il testo vive in `@/data/legal/termini` (in attesa di revisione legale);
 * questa pagina si limita a comporre metadata + renderer condiviso.
 */
export const metadata: Metadata = buildMetadata({
  title: termini.title,
  description: termini.description,
  path: routes.terms,
});

export default function TerminiPage() {
  return <LegalDocumentPage document={termini} />;
}
