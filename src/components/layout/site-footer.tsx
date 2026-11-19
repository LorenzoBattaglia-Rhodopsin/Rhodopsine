import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { mainNav, siteConfig } from "@/data/site";
import {
  contentAuthor,
  contentReviewer,
  formatReviewDate,
} from "@/data/e-e-a-t";

/**
 * Footer del sito (Server Component).
 * Contiene il DISCLAIMER MEDICO-LEGALE, requisito centrale del progetto:
 * il sito non fornisce diagnosi e non sostituisce visite professionali.
 *
 * Per l'E-E-A-T espone in modo sobrio: contatti diretti dell'organizzazione,
 * autore dei contenuti e revisore scientifico (vedi @/data/e-e-a-t).
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Identità + claim + crediti. id="chi-siamo": destinazione della voce
              di nav "Chi siamo" (il footer è presente su tutte le pagine). */}
          <div id="chi-siamo" className="max-w-prose scroll-mt-24">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.name} ({siteConfig.shortName}) — “{siteConfig.mission}”.
              Educazione al benessere visivo attraverso contenuti affidabili e
              strumenti pratici di autovalutazione.
            </p>

            {/* Trasparenza editoriale: autore + revisione scientifica. */}
            <dl className="mt-6 space-y-4">
              <div>
                <dt className="text-eyebrow font-medium uppercase text-muted-foreground">
                  A cura di
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {contentAuthor.name}
                </dd>
                <dd className="text-xs text-muted-foreground">
                  {contentAuthor.role}
                </dd>
              </div>
              {/* Mostrato solo con un revisore reale (nome compilato in
                  data/e-e-a-t.ts), come già avviene per `reviewedBy` nel JSON-LD. */}
              {contentReviewer.name && (
                <div>
                  <dt className="text-eyebrow font-medium uppercase text-muted-foreground">
                    Revisione scientifica
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {contentReviewer.name}
                  </dd>
                  {contentReviewer.credentials && (
                    <dd className="text-xs text-muted-foreground">
                      {contentReviewer.credentials}
                    </dd>
                  )}
                  <dd className="text-xs text-muted-foreground">
                    Ultima revisione: {formatReviewDate()}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Navigazione */}
          <nav aria-label="Navigazione footer">
            <h2 className="text-eyebrow font-medium uppercase text-muted-foreground">
              Esplora
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contatti diretti dell'organizzazione (canale editoriale). */}
          <div>
            <h2 className="text-eyebrow font-medium uppercase text-muted-foreground">
              Contatti
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center gap-2 rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Mail className="size-4 text-primary" aria-hidden="true" />
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Per richieste editoriali e segnalazioni sui contenuti. Non è un
              canale per consulenze cliniche, urgenze o emergenze sanitarie.
            </p>
          </div>
        </div>

        {/* DISCLAIMER MEDICO-LEGALE */}
        <section
          aria-labelledby="footer-disclaimer"
          className="mt-12 rounded-lg border border-border bg-muted/40 p-5 sm:p-6"
        >
          <h2
            id="footer-disclaimer"
            className="text-sm font-semibold text-foreground"
          >
            Avvertenze importanti
          </h2>
          <div className="mt-2 space-y-2 text-xs leading-relaxed text-muted-foreground">
            <p>
              I contenuti e gli strumenti presenti su {siteConfig.name} hanno
              esclusivamente finalità informative, educative e preventive. Non
              costituiscono in alcun modo una diagnosi medica, un parere clinico
              o una prescrizione.
            </p>
            <p>
              Il test di autovalutazione e i relativi risultati non sostituiscono
              la visita, la valutazione o la consulenza di un professionista. Per
              sintomi, sospette patologie o una diagnosi rivolgiti a un{" "}
              <span className="text-foreground">medico oculista</span>; per un
              controllo della vista o degli occhiali la figura di riferimento è
              l&apos;<span className="text-foreground">ottico-optometrista</span>,
              che non effettua diagnosi.
            </p>
            <p>
              In caso di disturbi improvvisi della vista (per esempio perdita
              della visione, dolore oculare acuto, lampi di luce) contatta
              tempestivamente un medico o i servizi di emergenza.
            </p>
          </div>
        </section>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {siteConfig.name}. Tutti i diritti riservati.
          </p>
          <p>Realizzato con cura per i tuoi occhi.</p>
        </div>
      </div>
    </footer>
  );
}
