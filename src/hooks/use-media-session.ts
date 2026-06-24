"use client";

import { useCallback, useEffect, useRef } from "react";
import { siteConfig } from "@/data/site";

/**
 * Hook Media Session API — simula una "Live Activity / Dynamic Island" su
 * browser mobile mostrando il countdown nella lockscreen e nel centro
 * notifiche, con barra di avanzamento e controlli (play/pausa/stop).
 *
 * Meccanismo: si riproduce in loop una clip di SILENZIO. Un elemento
 * <audio> attivo è il prerequisito perché il browser esponga i metadati della
 * Media Session; come effetto collaterale, un tab che riproduce media tende a
 * essere esente dal throttling dei timer in background. La correttezza del
 * countdown resta comunque garantita dal ricalcolo su `targetMs` (Page
 * Visibility) in use-timer-machine.
 *
 * Tutto è tipato con i tipi standard di `lib.dom` (MediaMetadata, MediaSession,
 * MediaPositionState): nessun `any`, nessuna estensione di `navigator`.
 */

/**
 * Clip di silenzio reale (~30s) riprodotta in loop. Asset statico same-origin.
 * Durata "lunga" voluta: iOS Safari tende a sospendere un loop sub-secondo
 * quando lo schermo si blocca, perdendo la Media Session. Esportata perché
 * l'elemento <audio> è ora montato nel DOM dal TimerProvider (vedi sotto).
 */
export const SILENCE_SRC = "/silence.wav";

const ALBUM = `${siteConfig.shortName} · Timer 20-20-20`;
// iOS Now Playing NON renderizza artwork SVG: servono PNG raster. Più dimensioni
// così il sistema sceglie quella adatta a lockscreen/Control Center.
const ARTWORK: MediaImage[] = [
  { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
  { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
];

export interface MediaSessionMeta {
  /** Titolo prominente: il countdown (es. "04:59 rimanenti"). */
  title: string;
  /** Sottotitolo (mappato su `artist`). */
  artist?: string;
}

export interface MediaSessionPosition {
  /** Durata totale del countdown, in secondi. */
  duration: number;
  /** Tempo trascorso, in secondi (verrà clampato a 0..duration). */
  position: number;
}

interface MediaSessionHandlers {
  /** Azione "play" della lockscreen. */
  onResume?: () => void;
  /** Azione "pause" della lockscreen. */
  onPause?: () => void;
  /** Azione "stop" della lockscreen. */
  onStop?: () => void;
}

export function useMediaSession(handlers: MediaSessionHandlers) {
  // Ref all'elemento <audio> di keep-alive, MONTATO NEL DOM dal TimerProvider
  // (non più un `new Audio()` staccato): su iOS Safari un <audio> presente nel
  // documento è molto più affidabile per esporre la card "In riproduzione".
  // L'elemento non va mutato (volume di default 1, clip già silenziosa): alcuni
  // browser smettono di esporre la Media Session se l'audio è `muted`.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // I callback più recenti, senza dover riregistrare gli action handler.
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });
  // Ultimo titolo scritto nei metadati. È la chiave per NON riassegnare
  // `mediaSession.metadata` (artwork incluso) ad ogni tick: su iOS Safari ogni
  // riassegnazione fa ri-renderizzare la card "In riproduzione" → flicker.
  // Riscriviamo i metadati solo quando il titolo cambia davvero (cambio fase).
  const lastTitleRef = useRef<string | null>(null);

  const supported =
    typeof navigator !== "undefined" && "mediaSession" in navigator;

  const registerHandlers = useCallback(() => {
    if (!supported) return;
    const ms = navigator.mediaSession;
    const set = (action: MediaSessionAction, cb: () => void) => {
      try {
        ms.setActionHandler(action, () => cb());
      } catch {
        // Azione non supportata dal browser corrente.
      }
    };
    set("play", () => handlersRef.current.onResume?.());
    set("pause", () => handlersRef.current.onPause?.());
    set("stop", () => handlersRef.current.onStop?.());
  }, [supported]);

  /** Avvia la sessione media. DEVE essere chiamata dentro un gesto utente. */
  const activate = useCallback(() => {
    if (!supported) return;
    const audio = audioRef.current;
    // play() può essere rifiutata senza gesto utente: degradiamo in silenzio.
    if (audio) void audio.play().catch(() => {});
    registerHandlers();
    navigator.mediaSession.playbackState = "playing";
  }, [supported, registerHandlers]);

  /**
   * Aggiorna la card "In riproduzione" (lockscreen / Dynamic Island).
   *
   * Può (e DOVREBBE) essere chiamata ad ogni secondo: è ciò che TIENE VIVA la
   * card su iOS Safari tra un loop dell'audio e l'altro. Per evitare il flicker
   * dell'icona, le due scritture hanno cadenze diverse:
   *
   * - `metadata` (titolo/artist/ARTWORK): riassegnata SOLO quando il titolo
   *   cambia (cioè al cambio di fase). Riassegnarla ad ogni tick fa
   *   ri-renderizzare l'artwork → icona che lampeggia (era questo il bug iOS).
   * - `setPositionState` (barra + tempo rimanente): aggiornata ad OGNI chiamata.
   *   È economica, NON tocca l'artwork (niente flicker) e mantiene attiva la
   *   sessione, così la card resta visibile e iOS mostra il countdown da sé.
   *
   * `playbackRate`: 1 mentre scorre (iOS anima la barra), 0 in pausa (ferma).
   */
  const update = useCallback(
    (
      meta: MediaSessionMeta,
      position?: MediaSessionPosition,
      playbackRate = 1,
    ) => {
      if (!supported) return;
      const ms = navigator.mediaSession;

      // Metadati (con artwork): solo al cambio di titolo → niente flicker.
      if (meta.title !== lastTitleRef.current) {
        lastTitleRef.current = meta.title;
        ms.metadata = new MediaMetadata({
          title: meta.title,
          artist: meta.artist ?? siteConfig.mission,
          album: ALBUM,
          artwork: ARTWORK,
        });
      }

      // Posizione: aggiornata ad ogni tick (keep-alive + countdown preciso).
      if (position && typeof ms.setPositionState === "function") {
        try {
          const duration = Math.max(0, position.duration);
          const pos = Math.min(Math.max(0, position.position), duration);
          ms.setPositionState({ duration, position: pos, playbackRate });
        } catch {
          // Alcuni browser lanciano se i valori sono incoerenti: best-effort.
        }
      }
    },
    [supported],
  );

  /** Mette in pausa la sessione (timer in pausa): l'audio si ferma. */
  const pauseSession = useCallback(() => {
    if (!supported) return;
    audioRef.current?.pause();
    navigator.mediaSession.playbackState = "paused";
  }, [supported]);

  /** Chiude la sessione: ferma l'audio, pulisce metadati e handler. */
  const deactivate = useCallback(() => {
    if (!supported) return;
    const ms = navigator.mediaSession;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    ms.playbackState = "none";
    ms.metadata = null;
    // Azzera la chiave così la prossima sessione riscrive sempre i metadati.
    lastTitleRef.current = null;
    (["play", "pause", "stop"] as const).forEach((action) => {
      try {
        ms.setActionHandler(action, null);
      } catch {
        // ignora
      }
    });
    if (typeof ms.setPositionState === "function") {
      try {
        ms.setPositionState();
      } catch {
        // ignora
      }
    }
  }, [supported]);

  // Cleanup su unmount (navigazione SPA): chiude COMPLETAMENTE la sessione —
  // inclusi gli action handler registrati sul singleton globale
  // navigator.mediaSession, che altrimenti resterebbero agganciati a closure
  // di un componente smontato. `deactivate` è stabile (dep su `supported`),
  // quindi la teardown gira solo all'unmount.
  useEffect(() => {
    return () => {
      deactivate();
      audioRef.current = null;
    };
  }, [deactivate]);

  return { audioRef, supported, activate, update, pauseSession, deactivate };
}
