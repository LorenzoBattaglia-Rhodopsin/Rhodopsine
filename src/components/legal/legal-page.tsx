import { Fragment, type ReactNode } from "react";
import {
  legalDocuments,
  legalLastUpdated,
  type LegalBlock,
  type LegalDocument,
} from "@/data/legal";
import Link from "next/link";

/**
 * GUSCIO DELLE PAGINE LEGALI (Server Component)
 * --------------------------------------------------------------------------
 * Impagina un `LegalDocument` (contenuti in `@/data/legal`): intestazione con
 * data di aggiornamento, indice, sezioni e link agli altri documenti legali.
 * Email e URL presenti nei testi diventano link automaticamente.
 */

const linkClass =
  "rounded text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Trasforma email e URL https in link, lasciando invariato il resto. */
function linkify(text: string): ReactNode {
  const parts = text.split(/([\w.+-]+@[\w-]+(?:\.[\w-]+)+|https:\/\/[^\s)]+[^\s).,;])/g);
  return parts.map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    const isEmail = part.includes("@") && !part.startsWith("https://");
    return (
      <a
        key={i}
        href={isEmail ? `mailto:${part}` : part}
        className={linkClass}
        {...(isEmail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      >
        {part}
      </a>
    );
  });
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === "ul") {
    return (
      <ul className="list-disc space-y-2 pl-5 marker:text-primary">
        {block.items.map((item) => (
          <li key={item}>{linkify(item)}</li>
        ))}
      </ul>
    );
  }
  return <p>{linkify(block.text)}</p>;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function LegalPage({ document }: { document: LegalDocument }) {
  const others = legalDocuments.filter((doc) => doc.path !== document.path);

  return (
    <article className="py-12 sm:py-16">
      <div className="container">
        <div className="mx-auto max-w-prose">
          <header>
            <p className="mb-3 text-eyebrow font-medium uppercase text-primary">
              Informazioni legali
            </p>
            <h1 className="text-title text-balance font-semibold text-foreground">
              {document.heading}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Ultimo aggiornamento:{" "}
              <time dateTime={legalLastUpdated}>
                {formatDate(legalLastUpdated)}
              </time>
            </p>
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground">
              {linkify(document.intro)}
            </p>
          </header>

          {/* Indice delle sezioni */}
          <nav
            aria-labelledby="legal-toc"
            className="mt-8 rounded-lg border border-border bg-card/40 p-5"
          >
            <h2 id="legal-toc" className="text-sm font-semibold text-foreground">
              In questa pagina
            </h2>
            <ol className="mt-2 space-y-1 text-sm">
              {document.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex min-h-11 items-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 space-y-10">
            {document.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-24"
              >
                <h2
                  id={`${section.id}-title`}
                  className="text-lg font-semibold text-foreground"
                >
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-base leading-relaxed text-muted-foreground">
                  {section.blocks.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Collegamenti agli altri documenti legali */}
          <nav
            aria-label="Altri documenti legali"
            className="mt-12 border-t border-border pt-6"
          >
            <ul className="flex flex-wrap gap-x-6 text-sm">
              {others.map((doc) => (
                <li key={doc.path}>
                  <Link
                    href={doc.path}
                    className="inline-flex min-h-11 items-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </article>
  );
}
