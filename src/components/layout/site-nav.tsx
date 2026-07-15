"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { mainNav, routes } from "@/data/site";

/**
 * Navigazione del sito (desktop + mobile).
 *
 * Le voci arrivano TUTTE da `mainNav` in `@/data/site` (fonte unica): qui sta
 * solo la presentazione. Componente client perché evidenzia la voce attiva con
 * `usePathname` e gestisce l'apertura del menu mobile.
 */

/**
 * Una voce è "attiva" quando combacia con la rotta corrente. I link ad ancore
 * (es. "/#chi-siamo") non sono mai marcati attivi. "/articoli" resta attivo
 * anche sulle pagine di dettaglio "/articoli/<slug>".
 */
function isNavActive(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const navLinkBase =
  "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Navigazione orizzontale — visibile da `md` in su. */
export function DesktopNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigazione principale" className={className}>
      <ul className="flex items-center gap-1">
        {mainNav.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  navLinkBase,
                  "relative inline-flex h-9 items-center px-3 text-sm font-medium",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.title}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-px h-px bg-primary"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Menu mobile (hamburger) — visibile sotto `lg` (incluso il tablet, dove le 5
 * voci + timer + CTA non entrerebbero comodamente nell'header).
 *
 * Pannello a comparsa sotto l'header, modale (role="dialog" + aria-modal):
 * - apertura/chiusura con `aria-expanded` sul toggle;
 * - focus trap manuale (Tab/Shift+Tab ciclano dentro al pannello);
 * - chiusura con Esc o tap sull'overlay;
 * - blocco dello scroll del body mentre è aperto;
 * - il focus torna al toggle alla chiusura;
 * - chiusura automatica al cambio di rotta.
 */
export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Chiudi quando cambia la rotta (es. dopo aver cliccato una voce).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Se si raggiunge il breakpoint desktop (lg = 1024px) mentre il menu è
  // aperto, chiudilo: il pannello diventa `display:none`, ma senza questo lo
  // stato resterebbe "aperto" e il blocco dello scroll del body rimarrebbe
  // attivo senza alcun menu visibile.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Esc + focus trap + blocco scroll, attivi solo a menu aperto.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    // Copia locale per la cleanup: il nodo del pulsante è stabile finché il
    // menu resta aperto, e la cleanup deve riportare il focus proprio a lui.
    const toggle = toggleRef.current;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusables = () =>
      panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled])',
            ),
          )
        : [];

    // Sposta il focus sul primo elemento del pannello (accessibilità tastiera).
    getFocusables()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      // Riporta il focus al pulsante che ha aperto il menu.
      toggle?.focus();
    };
  }, [open]);

  return (
    <div className={cn("lg:hidden", className)}>
      <Button
        ref={toggleRef}
        type="button"
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Chiudi il menu" : "Apri il menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Menu className="size-5" aria-hidden="true" />
        )}
      </Button>

      {open && (
        <>
          {/* Overlay: chiude al tap. Parte sotto l'header (top-16). */}
          <div
            aria-hidden="true"
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-background/60 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in"
            onClick={() => setOpen(false)}
          />

          <div
            id="mobile-nav-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-card/95 shadow-xl backdrop-blur-xl motion-safe:animate-in motion-safe:slide-in-from-top-2"
          >
            <nav
              aria-label="Navigazione principale"
              className="container flex flex-col gap-1 py-4"
            >
              {mainNav.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      navLinkBase,
                      "flex min-h-[44px] items-center px-3 text-base font-medium",
                      active
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}

              <Button asChild size="lg" className="mt-3">
                <Link href={routes.test} onClick={() => setOpen(false)}>
                  Inizia il test
                </Link>
              </Button>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
