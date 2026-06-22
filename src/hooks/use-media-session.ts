"use client";

import { useCallback, useEffect, useRef } from "react";
import { siteConfig } from "@/data/site";

/**
 * Hook Media Session API — simula una "Live Activity / Dynamic Island" su
 * browser mobile mostrando il countdown nella lockscreen e nel centro
 * notifiche, con barra di avanzamento e controlli (play/pausa/stop).
 *
 * Meccanismo: si riproduce in loop una micro-clip di SILENZIO. Un elemento
 * <audio> attivo è il prerequisito perché il browser esponga i metadati della
 * Media Session; come effetto collaterale, un tab che riproduce media tende a
 * essere esente dal throttling dei timer in background. La correttezza del
 * countdown resta comunque garantita dal ricalcolo su `targetMs` (Page
 * Visibility) in use-timer-machine.
 *
 * Tutto è tipato con i tipi standard di `lib.dom` (MediaMetadata, MediaSession,
 * MediaPositionState): nessun `any`, nessuna estensione di `navigator`.
 */

/** Clip di silenzio (~0.4s) caricata in loop. Asset statico same-origin. */
const SILENCE_SRC = "/silence.wav";

const ALBUM = `${siteConfig.shortName} · Timer 20-20-20`;
const ARTWORK: MediaImage[] = [
  { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // I callback più recenti, senza dover riregistrare gli action handler.
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  const supported =
    typeof navigator !== "undefined" && "mediaSession" in navigator;

  const getAudio = useCallback((): HTMLAudioElement | null => {
    if (typeof window === "undefined") return null;
    if (!audioRef.current) {
      const audio = new Audio(SILENCE_SRC);
      audio.loop = true;
      audio.preload = "auto";
      // Volume di default (1): la clip è già silenziosa. Mutare l'audio può
      // impedire ad alcuni browser di esporre la Media Session.
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

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
    const audio = getAudio();
    // play() può essere rifiutata senza gesto utente: degradiamo in silenzio.
    if (audio) void audio.play().catch(() => {});
    registerHandlers();
    navigator.mediaSession.playbackState = "playing";
  }, [supported, getAudio, registerHandlers]);

  /** Aggiorna titolo/sottotitolo e (se possibile) la barra di avanzamento. */
  const update = useCallback(
    (meta: MediaSessionMeta, position?: MediaSessionPosition) => {
      if (!supported) return;
      const ms = navigator.mediaSession;
      ms.metadata = new MediaMetadata({
        title: meta.title,
        artist: meta.artist ?? siteConfig.mission,
        album: ALBUM,
        artwork: ARTWORK,
      });
      if (position && typeof ms.setPositionState === "function") {
        try {
          const duration = Math.max(0, position.duration);
          const pos = Math.min(Math.max(0, position.position), duration);
          ms.setPositionState({ duration, position: pos, playbackRate: 1 });
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

  return { supported, activate, update, pauseSession, deactivate };
}
