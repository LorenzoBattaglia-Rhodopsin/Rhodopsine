import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { privacyPolicy } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

/** PRIVACY POLICY (GDPR) — contenuti in `@/data/legal`. */
export const metadata: Metadata = buildMetadata({
  title: privacyPolicy.title,
  description: privacyPolicy.description,
  path: privacyPolicy.path,
});

export default function PrivacyPage() {
  return <LegalPage document={privacyPolicy} />;
}
