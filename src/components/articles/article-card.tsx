import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/data/site";
import { formatArticleDate, type Article } from "@/data/articles";

/**
 * Card di un articolo (Server Component, puramente presentazionale).
 * Riceve i dati via prop: nessun contenuto di dominio hard-coded qui.
 * L'intera card è un link accessibile (etichetta = titolo dell'articolo).
 */
export function ArticleCard({ article }: { article: Article }) {
  const href = `${routes.articles}/${article.slug}`;

  return (
    <li className="h-full">
      <Link
        href={href}
        aria-label={`Leggi l'articolo: ${article.title}`}
        className="group block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Card className="flex h-full flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="primary" className="tracking-wide">
              {article.category}
            </Badge>
            <ArrowUpRight
              className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
              aria-hidden="true"
            />
          </div>

          <h2 className="mt-4 text-heading font-semibold leading-snug text-foreground">
            {article.title}
          </h2>

          <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
            {article.description}
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <time dateTime={article.publishedAt}>
              {formatArticleDate(article.publishedAt)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{article.readingTime} di lettura</span>
          </div>
        </Card>
      </Link>
    </li>
  );
}
