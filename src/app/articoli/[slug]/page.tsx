import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";
import { routes } from "@/data/site";
import {
  articles,
  formatArticleDate,
  getArticleBySlug,
} from "@/data/articles";

/**
 * PAGINA DETTAGLIO ARTICOLO (Server Component, generata staticamente)
 * --------------------------------------------------------------------------
 * Pattern App Router:
 * - `generateStaticParams` pre-renderizza una pagina per ogni slug noto.
 * - `dynamicParams = false`: slug sconosciuti → 404 (niente rendering on-demand),
 *   così tutte le pagine articolo restano statiche.
 * - `params` è una Promise in Next 15/16: va atteso (vedi CLAUDE.md §6/punto 4).
 *
 * Il contenuto arriva da `@/data/articles`: nessun testo hard-coded qui.
 * Per ora il corpo è segnaposto, pronto a essere arricchito.
 */

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): Array<{ slug: string }> {
  return articles.map((article) => ({ slug: article.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return buildMetadata({ title: "Articolo non trovato", noIndex: true });
  }

  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `${routes.articles}/${article.slug}`,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="py-12 sm:py-16">
      <div className="container">
        <div className="mx-auto max-w-prose">
          <Link
            href={routes.articles}
            className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Tutti gli articoli
          </Link>

          <header className="mt-6">
            <Badge variant="primary" className="tracking-wide">
              {article.category}
            </Badge>
            <h1 className="mt-4 text-title text-balance font-semibold text-foreground">
              {article.title}
            </h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <time dateTime={article.publishedAt}>
                {formatArticleDate(article.publishedAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{article.readingTime} di lettura</span>
            </div>
          </header>

          <div className="mt-8 space-y-4 text-pretty text-base leading-relaxed text-muted-foreground">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Nota educativa coerente col vincolo non-diagnostico del progetto. */}
          <p className="mt-10 rounded-lg border border-border bg-muted/40 p-5 text-sm leading-relaxed text-muted-foreground">
            Questo articolo ha finalità informative ed educative. Non costituisce
            una diagnosi né sostituisce il parere di un professionista della
            visione. In presenza di disturbi persistenti o che destano
            preoccupazione, rivolgiti a un oculista.
          </p>
        </div>
      </div>
    </article>
  );
}
