"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Glasses,
  Info,
  Loader2,
  LocateFixed,
  Lock,
  Search,
  Stethoscope,
  X,
} from "lucide-react";
import type { NearbySearchState, ProfessionalKind } from "@/types/nearby";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNearbySearch } from "@/features/nearby/use-nearby-search";
import {
  nearbyCopy,
  nearbyErrors,
  nearbySummary,
  professionalKinds,
} from "@/data/nearby";
import { ProfessionalList } from "@/components/nearby/professional-list";
import { legendSwatchClass, markerBaseClass } from "@/components/nearby/marker-style";

/**
 * RICERCA PROFESSIONISTI NELLE VICINANZE (/risultati)
 * --------------------------------------------------------------------------
 * PRIVACY BY DESIGN — vincoli rispettati qui:
 * - Il componente NON riceve props: non conosce punteggio né risposte.
 * - Nessuna richiesta esterna finché l'utente non clicca/invia.
 * - La mappa (Leaflet) è un chunk separato caricato solo a risultato pronto.
 * - Lo stato vive in memoria: "Cancella ricerca" lo azzera e smonta la mappa.
 *
 * Accessibilità: stato annunciato via aria-live, errori con role="alert",
 * focus spostato sul riepilogo a ricerca completata, sul campo CAP se la
 * posizione viene negata, e sul titolo dopo "Cancella ricerca".
 */
const NearbyMap = dynamic(() => import("@/components/nearby/nearby-map"), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
      Carico la mappa…
    </div>
  ),
});

const KIND_ICON: Record<ProfessionalKind, typeof Glasses> = {
  ophthalmologist: Stethoscope,
  optician: Glasses,
};

/** Oltre questa attesa spieghiamo che il servizio è lento (riscontro di stato). */
const SLOW_AFTER_MS = 8000;

type Filter = "all" | ProfessionalKind;
type Action = "geo" | "query";

export function NearbyProfessionals() {
  const { state, isLoading, searchByLocation, searchByQuery, clear } =
    useNearbySearch();
  const [query, setQuery] = useState("");
  const [action, setAction] = useState<Action | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const noteId = useId();

  // Gestione del focus sulle transizioni di stato (mai al primo render: lo
  // stato iniziale è "idle" e non sposta nulla).
  useEffect(() => {
    if (state.status === "done") summaryRef.current?.focus();
    if (
      state.status === "error" &&
      (state.code === "geo-denied" ||
        state.code === "geo-unavailable" ||
        state.code === "geo-unsupported")
    ) {
      inputRef.current?.focus();
    }
  }, [state]);

  // Attesa lunga: si ricorda QUALE ricerca è lenta (nessun setState sincrono
  // nell'effetto; una nuova ricerca crea un nuovo oggetto stato e azzera).
  const [slowFor, setSlowFor] = useState<NearbySearchState | null>(null);
  useEffect(() => {
    if (state.status !== "searching") return;
    const t = setTimeout(() => setSlowFor(state), SLOW_AFTER_MS);
    return () => clearTimeout(t);
  }, [state]);
  const isSlow = slowFor === state && state.status === "searching";

  const result = state.status === "done" ? state.result : null;

  const counts = useMemo(() => {
    const c: Record<ProfessionalKind, number> = { ophthalmologist: 0, optician: 0 };
    for (const p of result?.professionals ?? []) c[p.kind] += 1;
    return c;
  }, [result]);

  const filtered = useMemo(
    () =>
      (result?.professionals ?? []).filter(
        (p) => filter === "all" || p.kind === filter,
      ),
    [result, filter],
  );

  const statusText =
    state.status === "locating"
      ? nearbyCopy.status.locating
      : state.status === "geocoding"
        ? nearbyCopy.status.geocoding
        : state.status === "searching"
          ? isSlow
            ? nearbyCopy.status.slow
            : nearbyCopy.status.searching
          : "";

  function handleLocate() {
    setAction("geo");
    setFilter("all");
    void searchByLocation();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) {
      inputRef.current?.focus();
      return;
    }
    setAction("query");
    setFilter("all");
    void searchByQuery(query);
  }

  function handleClear() {
    clear();
    setQuery("");
    setAction(null);
    setFilter("all");
    headingRef.current?.focus();
  }

  const spinner = <Loader2 className="animate-spin" aria-hidden="true" />;

  return (
    <section
      aria-labelledby="nearby-title"
      className="mt-16 border-t border-border pt-16 sm:mt-24 sm:pt-24"
    >
      {/* Intestazione */}
      <header className="max-w-prose">
        <p className="mb-3 text-eyebrow font-medium uppercase text-primary">
          {nearbyCopy.eyebrow}
        </p>
        <h2
          id="nearby-title"
          ref={headingRef}
          tabIndex={-1}
          className="text-title text-balance font-semibold text-foreground focus:outline-none"
        >
          {nearbyCopy.title}
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {nearbyCopy.description}
        </p>
      </header>

      {/* Oculista vs ottico-optometrista: card statiche, nessun hover. */}
      <ul role="list" className="mt-10 grid gap-6 sm:grid-cols-2">
        {(Object.keys(professionalKinds) as ProfessionalKind[]).map((kind) => {
          const Icon = KIND_ICON[kind];
          const k = professionalKinds[kind];
          return (
            <li key={kind}>
              <Card className="h-full">
                <CardContent className="flex items-start gap-4 p-6">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {k.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {k.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

      {/* Pannello di ricerca */}
      <div className="mt-10 rounded-lg border border-border bg-card p-6 sm:p-8">
        {/* Informativa: sempre visibile PRIMA di qualsiasi ricerca. */}
        <p
          id={noteId}
          className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
        >
          <Lock className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
          <span>
            {nearbyCopy.privacyNote}{" "}
            <Link
              href={nearbyCopy.privacyHref}
              className="rounded font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              {nearbyCopy.privacyLinkLabel}
            </Link>
            .
          </span>
        </p>

        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-6">
          <Button
            type="button"
            size="lg"
            onClick={handleLocate}
            disabled={isLoading}
            aria-describedby={noteId}
            className="lg:shrink-0"
          >
            {isLoading && action === "geo" ? spinner : <LocateFixed aria-hidden="true" />}
            {nearbyCopy.useLocation}
          </Button>

          <div
            className="flex items-center gap-3 text-xs uppercase tracking-[0.08em] text-muted-foreground lg:h-14"
            aria-hidden="true"
          >
            <span className="h-px flex-1 bg-border lg:hidden" />
            {nearbyCopy.or}
            <span className="h-px flex-1 bg-border lg:hidden" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1"
            role="search"
            aria-label="Cerca per CAP o città"
          >
            <Label htmlFor={inputId} className="mb-2 block text-foreground">
              {nearbyCopy.queryLabel}
            </Label>
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                id={inputId}
                name="localita"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={nearbyCopy.queryPlaceholder}
                // Niente cronologia dei moduli: il CAP non resta nel browser.
                autoComplete="off"
                enterKeyHint="search"
                aria-describedby={noteId}
                disabled={isLoading}
                className="h-14"
              />
              <Button
                type="submit"
                size="lg"
                variant="secondary"
                disabled={isLoading}
                className="shrink-0 px-6"
              >
                {isLoading && action === "query" ? spinner : <Search aria-hidden="true" />}
                {nearbyCopy.querySubmit}
              </Button>
            </div>
          </form>
        </div>

        {/* Stato (annunciato) ed errori */}
        <p role="status" aria-live="polite" className="mt-5 min-h-6 text-sm text-muted-foreground empty:mt-0 empty:min-h-0">
          {statusText}
        </p>
        {state.status === "error" && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-md border border-border bg-muted/50 p-4 text-sm leading-relaxed text-foreground"
          >
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            {nearbyErrors[state.code]}
          </div>
        )}
      </div>

      {/* Risultati */}
      {result && (
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3
              ref={summaryRef}
              tabIndex={-1}
              className="text-heading font-semibold text-foreground focus:outline-none"
            >
              {nearbySummary(result.professionals.length, result.radiusKm)}
            </h3>
            {/* Margine negativo = allineamento ottico del testo al titolo
                quando va a capo (mobile) e al bordo destro su desktop. */}
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              className="-ml-6 sm:-mr-6 sm:ml-0"
            >
              <X aria-hidden="true" />
              {nearbyCopy.clear}
            </Button>
          </div>

          {result.professionals.length > 0 && (
            <>
              {/* Filtro + legenda: lo stesso simbolo dei marker. */}
              <div
                role="group"
                aria-label="Filtra per tipo"
                className="mt-5 flex flex-wrap gap-2"
              >
                {(
                  [
                    ["all", "Tutti", result.professionals.length],
                    ["ophthalmologist", "Oculisti", counts.ophthalmologist],
                    ["optician", "Ottici", counts.optician],
                  ] as const
                ).map(([value, label, count]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={filter === value}
                    onClick={() => setFilter(value)}
                    disabled={count === 0}
                    className={cn(
                      "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-[color,background-color,transform] duration-100 ease-out active:scale-[0.97] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      filter === value
                        ? "border-foreground/30 bg-accent text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {value !== "all" && (
                      <span aria-hidden="true" className="size-3">
                        <span className={cn(markerBaseClass, legendSwatchClass[value], "border")} />
                      </span>
                    )}
                    {label}
                    <span className="tabular-nums text-muted-foreground">{count}</span>
                  </button>
                ))}
                <span className="inline-flex h-11 items-center gap-2 px-2 text-sm text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className="size-3.5 rounded-full border-2 border-dashed border-primary bg-primary/10"
                  />
                  {nearbyCopy.approxArea}
                </span>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
                {/* Mappa: complemento visivo. Altezza fissa = nessun salto di layout. */}
                <div className="h-80 overflow-hidden rounded-lg border border-border bg-muted sm:h-96 lg:sticky lg:top-24 lg:h-[34rem]">
                  <NearbyMap
                    key={`${result.center.lat},${result.center.lon},${result.radiusKm}`}
                    center={result.center}
                    professionals={filtered}
                  />
                </div>
                <ProfessionalList key={filter} items={filtered} />
              </div>
            </>
          )}

          <div className="mt-6 max-w-prose space-y-2 text-xs leading-relaxed text-muted-foreground">
            <p>{nearbyCopy.disclaimer}</p>
            <p>{nearbyCopy.approxDistances}</p>
          </div>
        </div>
      )}
    </section>
  );
}
