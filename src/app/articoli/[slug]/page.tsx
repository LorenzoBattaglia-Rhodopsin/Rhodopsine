import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/shared/json-ld";
import {
  buildMetadata,
  getArticleJsonLd,
  getBreadcrumbJsonLd,
} from "@/lib/seo";
import { routes } from "@/data/site";
import {
  articles,
  formatArticleDate,
  getArticleBySlug,
} from "@/data/articles";
import { getSourcesByIds } from "@/data/sources";

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
 * Le fonti citate (id in `article.sources`) sono risolte da `@/data/sources`.
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

  const articleSources = getSourcesByIds(article.sources);

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

          {articleSources.length > 0 && (
            <section aria-labelledby="fonti-articolo" className="mt-10">
              <h2
                id="fonti-articolo"
                className="text-sm font-semibold text-foreground"
              >
                Fonti
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                {articleSources.map((source) => (
                  <li key={source.id}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {source.title}
                      <span className="sr-only"> (si apre in una nuova scheda)</span>
                    </a>
                    {" — "}
                    {source.authors}, {source.publication}, {source.year}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Nota educativa coerente col vincolo non-diagnostico del progetto.
              role="note": i crawler (anche AI) la associano al contenuto come
              avvertenza complementare, non come parte del corpo. */}
          <p
            role="note"
            className="mt-10 rounded-lg border border-border bg-muted/40 p-5 text-sm leading-relaxed text-muted-foreground"
          >
            Questo articolo ha finalità informative ed educative. Non costituisce
            una diagnosi né sostituisce il parere di un professionista della
            visione. In presenza di disturbi persistenti o che destano
            preoccupazione, rivolgiti a un oculista.
          </p>
        </div>
      </div>

      {/* Dati strutturati: Article (E-E-A-T: autore/publisher) + breadcrumb. */}
      <JsonLd data={getArticleJsonLd(article)} />
      <JsonLd
        data={getBreadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: "Articoli", path: routes.articles },
          { name: article.title, path: `${routes.articles}/${article.slug}` },
        ])}
      />
    </article>
  );
}
