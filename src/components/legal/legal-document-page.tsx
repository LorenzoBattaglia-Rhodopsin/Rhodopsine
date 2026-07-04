import { Section } from "@/components/shared/section";
import { formatLegalDate, type LegalDocument } from "@/data/legal";

/**
 * Pagina documentale legale (Server Component).
 * Rende un `LegalDocument` con layout leggibile: intestazione, data di ultimo
 * aggiornamento, indice dei contenuti con ancore e sezioni con heading
 * gerarchici (h1 → h2). Il testo arriva da `@/data/legal`: nessun contenuto
 * legale è hard-coded qui.
 */

const anchorLinkClasses =
  "rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <Section className="py-12 sm:py-16">
      <article className="mx-auto max-w-prose">
        <header>
          <p className="mb-3 text-eyebrow font-medium uppercase text-primary">
            {document.eyebrow}
          </p>
          <h1 className="text-title text-balance font-semibold text-foreground">
            {document.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Ultimo aggiornamento:{" "}
            <time dateTime={document.updatedAt}>
              {formatLegalDate(document.updatedAt)}
            </time>
          </p>
        </header>

        <div className="mt-6 space-y-4 text-pretty text-base leading-relaxed text-muted-foreground">
          {document.intro.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Indice dei contenuti: ancore alle sezioni (scroll-mt compensa
            l'header sticky, come per le ancore della landing). */}
        <nav
          aria-label="Indice dei contenuti"
          className="mt-8 rounded-lg border border-border bg-muted/40 p-5"
        >
          <h2 className="text-eyebrow font-medium uppercase text-muted-foreground">
            Contenuti di questa pagina
          </h2>
          <ol className="mt-3 space-y-2 text-sm">
            {document.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={anchorLinkClasses}>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {document.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-titolo`}
            className="mt-10 scroll-mt-24"
          >
            <h2
              id={`${section.id}-titolo`}
              className="text-heading font-semibold text-foreground"
            >
              {section.title}
            </h2>
            <div className="mt-3 space-y-4 text-pretty text-base leading-relaxed text-muted-foreground">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {section.items && (
                <ul className="list-disc space-y-2 pl-5">
                  {section.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
              {section.closing?.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </article>
    </Section>
  );
}
