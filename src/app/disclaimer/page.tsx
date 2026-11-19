import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { disclaimer } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

/** DISCLAIMER — contenuti in `@/data/legal`. */
export const metadata: Metadata = buildMetadata({
  title: disclaimer.title,
  description: disclaimer.description,
  path: disclaimer.path,
});

export default function DisclaimerPage() {
  return <LegalPage document={disclaimer} />;
}
