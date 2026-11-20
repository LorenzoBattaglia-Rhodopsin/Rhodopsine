import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Clock,
  ExternalLink,
  Globe,
  Info,
  MapPin,
  Navigation,
  Phone,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { routes } from "@/data/site";
import { detailCopy, nearbyCopy, professionalKinds } from "@/data/nearby";
import { getProfessionalDetail } from "@/features/nearby/details";
import { formatOpeningHours } from "@/features/nearby/opening-hours";
import { directionsUrl } from "@/features/nearby/directions";
import { osmElementUrl } from "@/features/nearby/ids";
import { Badge } from "@/components/ui/badge";
import { KIND_ICON } from "@/components/nearby/professional-kinds";
import { PlaceMapToggle } from "@/components/nearby/place-map-toggle";
import { BackToSearch } from "@/components/nearby/back-to-search";
import type { ProfessionalDetail } from "@/types/nearby";

/**
 * SCHEDA DI UN OTTICO / OCULISTA (Server Component)
 * --------------------------------------------------------------------------
 * Mostra SOLO i campi presenti nella fonte pubblica (OpenStreetMap): niente
 * dati dedotti o generati. Se un campo manca: "Informazione non disponibile".
 *
 * - `noindex`: le schede non entrano nei motori di ricerca (dati non
 *   verificati, nessuna "directory" promozionale — CLAUDE.md §6.2) e sono
 *   escluse dalla sitemap.
 * - Pagine generate alla prima visita e poi servite dalla cache: nessun
 *   dato dell'utente coinvolto, solo dati pubblici OSM.
 * - L'id è validato (formato OSM) prima di qualsiasi lettura: altrimenti 404.
 * - `params` è una Promise (Next.js 15+): va attesa.
 */
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

type PageProps = { params: Promise<{ id: string }> };

const FALLBACK_NAME = {
  ophthalmologist: "Studio oculistico",
  optician: "Ottica",
} as const;

const displayName = (p: ProfessionalDetail) => p.name || FALLBACK_NAME[p.kind];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const p = await getProfessionalDetail(id);
  if (!p) return buildMetadata({ title: "Scheda non trovata", noIndex: true });
  return buildMetadata({
    title: `${displayName(p)} — ${professionalKinds[p.kind].label}`,
    description: `Informazioni pubbliche da OpenStreetMap su ${displayName(p)}: indirizzo, orari e contatti, se disponibili.`,
    path: `${routes.professionals}/${p.id}`,
    noIndex: true,
  });
}

const externalLinkClass =
  "inline-flex min-h-11 items-center gap-1.5 rounded-md font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Riga della scheda: etichetta + valore, o "Informazione non disponibile". */
function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 py-5">
      <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <dt className="text-sm font-medium text-foreground">{label}</dt>
        <dd className="mt-1 text-[0.9375rem] leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
          {children ?? <span className="italic">{detailCopy.notAvailable}</span>}
        </dd>
      </div>
    </div>
  );
}

/** href `tel:` con sole cifre e "+" (il valore è già validato dallo script). */
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export default async function ProfessionalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const p = await getProfessionalDetail(id);
  if (!p) notFound();

  const name = displayName(p);
  const kind = professionalKinds[p.kind];
  const KindIcon = KIND_ICON[p.kind];
  const hours = p.openingHours ? formatOpeningHours(p.openingHours) : null;
  const website = p.website ? new URL(p.website) : null;

  return (
    <article className="py-12 sm:py-16">
      <div className="container">
        <div className="mx-auto max-w-prose">
          <BackToSearch />

          <header className="mt-6">
            <Badge variant="primary">
              <KindIcon className="size-3.5" aria-hidden="true" />
              {kind.label}
            </Badge>
            <h1 className="mt-4 text-title text-balance font-semibold text-foreground [overflow-wrap:anywhere]">
              {name}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{kind.body}</p>
          </header>

          <dl className="mt-8 divide-y divide-border rounded-lg border border-border bg-card px-6">
            <Field icon={MapPin} label={detailCopy.address}>
              {p.address}
            </Field>

            <Field icon={Clock} label={detailCopy.hours}>
              {hours && (
                <>
                  <ul className="space-y-0.5 tabular-nums text-foreground">
                    {hours.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs">{detailCopy.hoursNote}</p>
                </>
              )}
            </Field>

            <Field icon={Phone} label={detailCopy.phone}>
              {p.phones && (
                <ul>
                  {p.phones.map((phone) => (
                    <li key={phone}>
                      <a href={telHref(phone)} className={externalLinkClass}>
                        {phone}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Field>

            <Field icon={Globe} label={detailCopy.website}>
              {website && (
                <a
                  href={website.toString()}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={externalLinkClass}
                >
                  {website.hostname.replace(/^www\./, "")}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span className="sr-only"> (sito esterno, si apre in una nuova scheda)</span>
                </a>
              )}
            </Field>

            {/* Le specializzazioni si mostrano solo se la fonte le riporta. */}
            {p.specialities && (
              <Field icon={Tag} label={detailCopy.specialities}>
                <ul className="flex flex-wrap gap-2">
                  {p.specialities.map((s) => (
                    <li key={s}>
                      <Badge>{s}</Badge>
                    </li>
                  ))}
                </ul>
              </Field>
            )}

            <Field icon={Navigation} label={detailCopy.position}>
              <div className="space-y-4">
                <a
                  href={directionsUrl(p.position)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={externalLinkClass}
                >
                  {nearbyCopy.directions}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">{nearbyCopy.directionsSr(name)}</span>
                </a>
                <PlaceMapToggle position={p.position} kind={p.kind} label={name} />
              </div>
            </Field>
          </dl>

          {/* Fonte, correzioni, avvertenza */}
          <footer className="mt-8 space-y-4">
            <div
              role="note"
              className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-5"
            >
              <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {detailCopy.disclaimer}
              </p>
            </div>

            <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
              <p>
                {detailCopy.source(p.dataDate)}{" "}
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded underline underline-offset-4 hover:text-foreground"
                >
                  Licenza e attribuzione
                  <span className="sr-only"> (si apre in una nuova scheda)</span>
                </a>
                .
              </p>
              <p>{detailCopy.correctionNote}</p>
              <p className="flex flex-wrap gap-x-5">
                <a
                  href={osmElementUrl(p.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded underline underline-offset-4 hover:text-foreground"
                >
                  {detailCopy.viewOnOsm}
                  <span className="sr-only"> (si apre in una nuova scheda)</span>
                </a>
                <a
                  href={`https://www.openstreetmap.org/note/new#map=19/${p.position.lat}/${p.position.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded underline underline-offset-4 hover:text-foreground"
                >
                  {detailCopy.correction}
                  <span className="sr-only"> (si apre in una nuova scheda)</span>
                </a>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}
