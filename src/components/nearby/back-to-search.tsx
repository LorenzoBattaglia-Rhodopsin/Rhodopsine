"use client";

import { ArrowLeft } from "lucide-react";
import { routes } from "@/data/site";
import { detailCopy } from "@/data/nearby";

/**
 * "TORNA ALLA RICERCA"
 * Se l'utente arriva da una pagina del sito, torna indietro nella cronologia:
 * il browser può così ripristinare la ricerca (che vive solo in memoria).
 * Altrimenti (link aperto da fuori) porta alla pagina di ricerca.
 */
export function BackToSearch() {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    let sameOrigin = false;
    try {
      sameOrigin =
        document.referrer !== "" &&
        new URL(document.referrer).origin === window.location.origin;
    } catch {
      sameOrigin = false;
    }
    if (sameOrigin && window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
  }

  return (
    <a
      href={routes.professionals}
      onClick={handleClick}
      className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {detailCopy.back}
    </a>
  );
}
