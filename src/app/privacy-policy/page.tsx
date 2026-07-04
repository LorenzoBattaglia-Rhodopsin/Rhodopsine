import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { privacyPolicy } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";
import { routes } from "@/data/site";

/**
 * PAGINA PRIVACY POLICY (Server Component, statica e indicizzabile)
 * --------------------------------------------------------------------------
 * Il testo vive in `@/data/legal/privacy-policy` (in attesa di revisione
 * legale); questa pagina si limita a comporre metadata + renderer condiviso.
 */
export const metadata: Metadata = buildMetadata({
  title: privacyPolicy.title,
  description: privacyPolicy.description,
  path: routes.privacyPolicy,
});

export default function PrivacyPolicyPage() {
  return <LegalDocumentPage document={privacyPolicy} />;
}
