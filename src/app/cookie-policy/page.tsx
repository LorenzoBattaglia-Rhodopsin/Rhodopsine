import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { cookiePolicy } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

/** COOKIE POLICY — contenuti in `@/data/legal`. */
export const metadata: Metadata = buildMetadata({
  title: cookiePolicy.title,
  description: cookiePolicy.description,
  path: cookiePolicy.path,
});

export default function CookiePolicyPage() {
  return <LegalPage document={cookiePolicy} />;
}
