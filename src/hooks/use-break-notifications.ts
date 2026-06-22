"use client";

import { useCallback, useEffect, useState } from "react";

export type NotifPermission = "default" | "granted" | "denied" | "unsupported";

export function useBreakNotifications() {
  const [permission, setPermission] = useState<NotifPermission>("unsupported");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission as NotifPermission);
    }
  }, []);

  const request = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotifPermission);
    } catch {
      // Alcuni browser richiedono un gesto utente — silenziamo l'errore
    }
  }, []);

  const notify = useCallback(
    (title: string, body: string) => {
      if (permission !== "granted") return;
      try {
        new Notification(title, { body, silent: true });
      } catch {}
    },
    [permission],
  );

  return { permission, request, notify };
}
