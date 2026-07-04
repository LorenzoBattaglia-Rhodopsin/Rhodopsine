import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { cookiePolicy } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";
import { routes } from "@/data/site";

/**
 * PAGINA COOKIE POLICY (Server Component, statica e indicizzabile)
 * --------------------------------------------------------------------------
 * Il testo vive in `@/data/legal/cookie-policy` (in attesa di revisione
 * legale); questa pagina si limita a comporre metadata + renderer condiviso.
 */
export const metadata: Metadata = buildMetadata({
  title: cookiePolicy.title,
  description: cookiePolicy.description,
  path: routes.cookiePolicy,
});

export default function CookiePolicyPage() {
  return <LegalDocumentPage document={cookiePolicy} />;
}
