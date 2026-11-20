"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Coordinates,
  NearbyErrorCode,
  NearbySearchState,
  SearchOrigin,
} from "@/types/nearby";
import { roundCoords } from "@/features/nearby/geo";
import { geocodeQuery } from "@/features/nearby/nominatim";
import { searchProfessionals } from "@/features/nearby/overpass";

/**
 * HOOK — stato della ricerca professionisti.
 * --------------------------------------------------------------------------
 * PRIVACY BY DESIGN
 * - Lo stato vive solo in memoria (React): niente storage, cookie o URL.
 * - Le coordinate della Geolocation API vengono arrotondate DENTRO la
 *   callback: quelle esatte non entrano mai nello stato.
 * - Nessuna chiamata parte senza un'azione esplicita dell'utente.
 * - Non riceve né conosce i risultati del test.
 */

/** Errore di geolocalizzazione → codice d'interfaccia (1 = PERMISSION_DENIED). */
function geoErrorCode(err: unknown): NearbyErrorCode {
  const code =
    typeof err === "object" && err !== null && "code" in err
      ? (err as { code: unknown }).code
      : undefined;
  return code === 1 ? "geo-denied" : "geo-unavailable";
}

function getRoundedPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        // Unico punto in cui esistono le coordinate esatte: arrotondate subito.
        resolve(
          roundCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        ),
      reject,
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 600_000 },
    );
  });
}

export function useNearbySearch() {
  const [state, setState] = useState<NearbySearchState>({ status: "idle" });
  const controllerRef = useRef<AbortController | null>(null);

  /** Annulla la ricerca in corso e ne prepara una nuova. */
  const restart = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    return controller.signal;
  }, []);

  // Alla chiusura della pagina/smontaggio: niente richieste orfane.
  useEffect(() => () => controllerRef.current?.abort(), []);

  const runSearch = useCallback(
    async (center: Coordinates, origin: SearchOrigin, signal: AbortSignal) => {
      setState({ status: "searching" });
      const { radiusKm, professionals } = await searchProfessionals(
        center,
        signal,
      );
      if (signal.aborted) return;
      setState({
        status: "done",
        result: { center, radiusKm, origin, professionals },
      });
    },
    [],
  );

  const searchByLocation = useCallback(async () => {
    if (!("geolocation" in navigator)) {
      setState({ status: "error", code: "geo-unsupported" });
      return;
    }
    const signal = restart();
    setState({ status: "locating" });

    let center: Coordinates;
    try {
      center = await getRoundedPosition();
    } catch (err) {
      if (signal.aborted) return;
      setState({ status: "error", code: geoErrorCode(err) });
      return;
    }
    if (signal.aborted) return;

    try {
      await runSearch(center, "geolocation", signal);
    } catch {
      if (!signal.aborted) setState({ status: "error", code: "network" });
    }
  }, [restart, runSearch]);

  const searchByQuery = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query) return;
      const signal = restart();
      setState({ status: "geocoding" });

      try {
        const center = await geocodeQuery(query, signal);
        if (signal.aborted) return;
        if (!center) {
          setState({ status: "error", code: "not-found" });
          return;
        }
        await runSearch(center, "query", signal);
      } catch {
        if (!signal.aborted) setState({ status: "error", code: "network" });
      }
    },
    [restart, runSearch],
  );

  /** Azzera tutto: annulla le richieste e dimentica il centro di ricerca. */
  const clear = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setState({ status: "idle" });
  }, []);

  const isLoading =
    state.status === "locating" ||
    state.status === "geocoding" ||
    state.status === "searching";

  return { state, isLoading, searchByLocation, searchByQuery, clear };
}
