/**
 * TIMEOUT PER LE RICHIESTE DI RETE
 * Restituisce un segnale che si annulla dopo `ms` OPPURE quando si annulla
 * `parent` (es. "Cancella ricerca"). Implementato a mano invece di
 * `AbortSignal.any`, per compatibilità con browser meno recenti.
 */
export function timeoutSignal(ms: number, parent?: AbortSignal): AbortSignal {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException("Timeout", "TimeoutError")), ms);
  const onAbort = () => controller.abort(parent?.reason);
  if (parent?.aborted) onAbort();
  else parent?.addEventListener("abort", onAbort, { once: true });
  controller.signal.addEventListener(
    "abort",
    () => {
      clearTimeout(timer);
      parent?.removeEventListener("abort", onAbort);
    },
    { once: true },
  );
  return controller.signal;
}
