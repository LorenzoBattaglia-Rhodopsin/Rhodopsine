import type { Metadata } from "next";
import { ArticleCard } from "@/components/articles/article-card";
import { buildMetadata } from "@/lib/seo";
import { getAllArticles } from "@/data/articles";

/**
 * PAGINA ARTICOLI (Server Component)
 * --------------------------------------------------------------------------
 * Vetrina educativa: griglia responsiva di articoli sul benessere visivo
 * digitale. I contenuti vivono in `@/data/articles`; questa pagina si limita a
 * comporre la lista. Struttura pronta all'espansione (empty-state incluso).
 */
export const metadata: Metadata = buildMetadata({
  title: "Articoli sul benessere visivo",
  description:
    "Approfondimenti educativi su affaticamento visivo digitale, regola 20-20-20, luce blu e abitudini per proteggere la vista davanti agli schermi.",
  path: "/articoli",
});

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <section className="scroll-mt-24 py-12 sm:py-16">
      <div className="container">
        {/* Intestazione */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h1 className="text-title text-balance font-semibold text-foreground">
            Articoli sul benessere visivo
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Contenuti educativi per capire l&apos;affaticamento visivo digitale e
            adottare abitudini semplici davanti agli schermi. Informazioni
            preventive, mai diagnosi.
          </p>
        </div>

        {articles.length > 0 ? (
          <ul
            role="list"
            className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </ul>
        ) : (
          /* Empty-state: nessun articolo ancora pubblicato. */
          <div className="mx-auto max-w-md rounded-xl border border-dashed border-border bg-card/40 p-10 text-center">
            <h2 className="text-heading font-semibold text-foreground">
              Presto nuovi contenuti
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Stiamo preparando approfondimenti sul benessere visivo digitale.
              Torna a trovarci tra qualche giorno.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
