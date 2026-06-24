"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useTimerMachine,
  WORK_DURATION_S,
  BREAK_DURATION_S,
  type TimerPhase,
} from "@/hooks/use-timer-machine";
import { useTimerSound } from "@/hooks/use-timer-sound";
import {
  useBreakNotifications,
  type NotifPermission,
} from "@/hooks/use-break-notifications";
import { useMediaSession, SILENCE_SRC } from "@/hooks/use-media-session";

/**
 * TimerProvider — sorgente di verità UNICA del Timer 20-20-20.
 *
 * Avvolge l'intera app (vedi `app/layout.tsx`) così la state machine vive una
 * sola volta: header globale (TimerTrigger), pagina /timer (Timer202020) e
 * sezione dedicata (FocusHub) leggono e comandano lo STESSO timer. Senza questo
 * provider, ogni componente che chiamasse `useTimerMachine()` avrebbe uno stato
 * separato → timer "doppi" e non sincronizzati.
 *
 * Qui vivono anche tutti gli effetti collaterali trasversali (suono, notifiche
 * di sistema, Media Session per la lockscreen, annunci per screen reader),
 * prima ospitati in Timer202020. I consumer sono puramente presentazionali.
 */

interface TimerContextValue {
  phase: TimerPhase;
  workLeft: number;
  breakLeft: number;
  cycles: number;
  soundOn: boolean;
  isHydrated: boolean;
  /** Azioni già integrate con la Media Session (lockscreen). */
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  startBreak: () => void;
  endBreak: () => void;
  skipBreak: () => void;
  toggleSound: () => void;
  /** Stato permesso notifiche di sistema + richiesta (gesto utente). */
  notifPermission: NotifPermission;
  requestNotif: () => Promise<void>;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function useTimerContext(): TimerContextValue {
  const ctx = useContext(TimerContext);
  if (!ctx) {
    throw new Error(
      "useTimerContext deve essere usato all'interno di <TimerProvider>.",
    );
  }
  return ctx;
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const {
    phase,
    workLeft,
    breakLeft,
    cycles,
    soundOn,
    isHydrated,
    start: machineStart,
    pause: machinePause,
    resume: machineResume,
    reset: machineReset,
    startBreak,
    endBreak,
    skipBreak,
    toggleSound,
  } = useTimerMachine();

  const { playWorkEnd, playBreakEnd } = useTimerSound();
  const {
    permission: notifPermission,
    request: requestNotif,
    notify,
  } = useBreakNotifications();

  // Media Session: countdown in lockscreen / Dynamic Island. Gli action handler
  // catturano `phase` fresco (il hook li rimemorizza ad ogni render).
  const {
    audioRef,
    activate: activateMedia,
    update: updateMedia,
    pauseSession: pauseMedia,
    deactivate: deactivateMedia,
  } = useMediaSession({
    onPause: () => {
      if (phase === "running") machinePause();
    },
    onResume: () => {
      if (phase === "paused") machineResume();
    },
    onStop: () => machineReset(),
  });

  // null = non ancora idratato; distingue "primo mount" da "fase cambiata".
  const prevPhaseRef = useRef<TimerPhase | null>(null);
  const [announcement, setAnnouncement] = useState("");

  // Post-idratazione: inizializza prevPhaseRef con la fase reale ripristinata e
  // gestisce il caso "pagina ricaricata mentre era in break-prompt".
  useEffect(() => {
    if (!isHydrated) return;
    if (prevPhaseRef.current !== null) return; // già inizializzato
    prevPhaseRef.current = phase;

    if (phase === "break-prompt") {
      if (soundOn) playWorkEnd();
      notify("Pausa visiva", "Guarda qualcosa a 6 metri di distanza per 20 secondi.");
      setAnnouncement("Pausa visiva: guarda un oggetto lontano per 20 secondi.");
    }
  }, [isHydrated, phase, soundOn, playWorkEnd, notify]);

  // Side-effect alle transizioni di fase (non quella iniziale di idratazione).
  useEffect(() => {
    if (prevPhaseRef.current === null) return; // aspetta idratazione
    if (prevPhaseRef.current === phase) return; // stessa fase
    const prev = prevPhaseRef.current;
    const next = phase;
    prevPhaseRef.current = next;

    if (next === "break-prompt" && prev === "running") {
      if (soundOn) playWorkEnd();
      notify("Pausa visiva", "Guarda qualcosa a 6 metri di distanza per 20 secondi.");
      setAnnouncement("Pausa visiva: guarda un oggetto lontano per 20 secondi.");
    }
    if (next === "break-complete" && prev === "break-active") {
      if (soundOn) playBreakEnd();
      setAnnouncement("Ottimo! Pausa visiva completata. Timer ripartito tra poco.");
    }
    if (next === "running" && prev === "idle") {
      setAnnouncement("Timer avviato. Prossima pausa tra 20 minuti.");
    }
    if (next === "paused") {
      setAnnouncement("Timer in pausa.");
    }
    if (next === "running" && prev === "paused") {
      setAnnouncement("Timer ripreso.");
    }
  }, [phase, soundOn, playWorkEnd, playBreakEnd, notify]);

  // ─── Sincronizzazione Media Session (lockscreen / Dynamic Island) ─────────
  //
  // ROOT CAUSE del bug iOS Safari (flicker dell'icona): la vecchia versione
  // riassegnava `navigator.mediaSession.metadata = new MediaMetadata` (ARTWORK
  // incluso) ad OGNI secondo. Su iOS ogni riassegnazione dei metadati fa
  // ri-renderizzare l'artwork della card "In riproduzione" → icona che lampeggia
  // di continuo.
  //
  // Ma la card su iOS va anche TENUTA VIVA: tra un loop dell'audio di keep-alive
  // e l'altro, se non si aggiorna nulla la card sparisce. Per questo l'effetto
  // continua a girare ad ogni tick (dipende da workLeft/breakLeft) e chiama
  // `updateMedia` ogni secondo. La distinzione la fa il hook (vedi
  // use-media-session): aggiorna `setPositionState` ad ogni tick (economico,
  // niente artwork → niente flicker, mantiene viva la sessione), ma riscrive i
  // `metadata` SOLO quando cambia il TITOLO. Per questo qui i titoli sono
  // COSTANTI per fase: i metadati vengono scritti una sola volta per fase, il
  // countdown lo mostra iOS dalla `setPositionState` (durata + posizione).
  useEffect(() => {
    if (!isHydrated || phase === "idle") return;

    switch (phase) {
      case "running":
        updateMedia(
          { title: "Al lavoro · prossima pausa visiva", artist: "Timer 20-20-20" },
          { duration: WORK_DURATION_S, position: WORK_DURATION_S - workLeft },
          1,
        );
        break;
      case "break-active":
        updateMedia(
          { title: "Pausa visiva · guarda lontano 6 metri", artist: "Timer 20-20-20" },
          { duration: BREAK_DURATION_S, position: BREAK_DURATION_S - breakLeft },
          1,
        );
        break;
      case "break-prompt":
        updateMedia({
          title: "È ora di una pausa visiva",
          artist: "Guarda lontano per 20 secondi",
        });
        break;
      case "break-complete":
        updateMedia({
          title: "Pausa completata · ottimo lavoro",
          artist: "Timer 20-20-20",
        });
        break;
      case "paused":
        updateMedia(
          { title: "Timer in pausa", artist: "Timer 20-20-20" },
          { duration: WORK_DURATION_S, position: WORK_DURATION_S - workLeft },
          0, // barra ferma mentre è in pausa
        );
        break;
    }
  }, [isHydrated, phase, workLeft, breakLeft, updateMedia]);

  // Auto-avanzamento break-complete → running, GLOBALE. Prima viveva solo nella
  // DynamicReminderBar (montata solo su /timer): con il trigger nell'header il
  // ciclo può chiudersi da qualsiasi pagina, e senza questo effetto il timer
  // resterebbe bloccato in "break-complete". Unico owner della transizione.
  useEffect(() => {
    if (phase !== "break-complete") return;
    const t = setTimeout(() => endBreak(), 3350);
    return () => clearTimeout(t);
  }, [phase, endBreak]);

  // ─── Azioni integrate con la Media Session ────────────────────────────────
  // `activate()` deve avvenire dentro un gesto utente (autoplay policy): per
  // questo l'avvio della lockscreen è legato ai click su start/resume.
  const start = useCallback(() => {
    // Il permesso notifiche si richiede al primo avvio (gesto utente): più
    // affidabile di un prompt automatico al caricamento e meno invasivo, ora
    // che il provider è montato su tutte le pagine.
    if (notifPermission === "default") void requestNotif();
    activateMedia();
    machineStart();
  }, [notifPermission, requestNotif, activateMedia, machineStart]);

  const pause = useCallback(() => {
    machinePause();
    pauseMedia();
  }, [machinePause, pauseMedia]);

  const resume = useCallback(() => {
    activateMedia();
    machineResume();
  }, [activateMedia, machineResume]);

  const reset = useCallback(() => {
    machineReset();
    deactivateMedia();
  }, [machineReset, deactivateMedia]);

  const value: TimerContextValue = {
    phase,
    workLeft,
    breakLeft,
    cycles,
    soundOn,
    isHydrated,
    start,
    pause,
    resume,
    reset,
    startBreak,
    endBreak,
    skipBreak,
    toggleSound,
    notifPermission,
    requestNotif,
  };

  return (
    <TimerContext.Provider value={value}>
      {/* Audio di keep-alive (silenzio reale) per la Media Session: montato nel
          DOM — su iOS Safari più affidabile di `new Audio()` — e inerte
          (nessun `controls`, invisibile, fuori dal tab order, aria-hidden).
          NON aggiungere `muted`: bloccherebbe l'esposizione della Media Session.
          `preload="metadata"`: il WAV si scarica solo all'avvio del timer, non
          al caricamento di ogni pagina (budget performance / Lighthouse). */}
      <audio
        ref={audioRef}
        src={SILENCE_SRC}
        loop
        preload="metadata"
        aria-hidden="true"
      />

      {/* Regione live UNICA per gli screen reader: annunci ai cambi di fase.
          Il countdown visuale NON ha aria-live (evita flood ogni secondo). */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
      {children}
    </TimerContext.Provider>
  );
}
