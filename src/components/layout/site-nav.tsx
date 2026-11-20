"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { isNavGroup, mainNav, routes, type NavGroup } from "@/data/site";

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

/** Un gruppo è "attivo" quando lo è una delle sue voci. */
function isGroupActive(pathname: string, group: NavGroup): boolean {
  return group.items.some((item) => isNavActive(pathname, item.href));
}

const navLinkBase =
  "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Trattino sotto la voce attiva (desktop). */
function ActiveIndicator() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-3 bottom-1.5 h-px bg-primary"
    />
  );
}

/**
 * Menu a tendina desktop (pattern "disclosure" WAI-ARIA, non `role="menu"`:
 * contiene link di navigazione, che restano raggiungibili con Tab).
 * - si apre SOLO con click / Invio / Spazio sul bottone (mai all'hover);
 * - `aria-expanded` + `aria-controls` sul bottone;
 * - si chiude con Esc (il focus torna al bottone), con click fuori, quando
 *   il focus esce dal gruppo e al cambio di rotta.
 */
function NavDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = `${useId()}-panel`;
  const active = isGroupActive(pathname, group);

  // Chiudi quando cambia la rotta (es. dopo aver scelto una voce).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Esc e click fuori, attivi solo a menu aperto.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <li
      ref={rootRef}
      className="relative"
      // Chiudi quando il focus esce dal gruppo (Tab oltre l'ultima voce).
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          navLinkBase,
          "relative inline-flex h-11 items-center gap-1 px-3 text-sm font-medium",
          active || open
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {group.title}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
        {active && <ActiveIndicator />}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute left-0 top-full z-50 mt-2 w-80 rounded-lg border border-border bg-card p-2 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150"
      >
        <ul className="flex flex-col gap-1">
          {group.items.map((item) => {
            const itemActive = isNavActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={itemActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    navLinkBase,
                    "flex min-h-[44px] flex-col justify-center px-3 py-2",
                    itemActive ? "bg-accent" : "hover:bg-accent",
                  )}
                >
                  <span className="text-sm font-medium text-foreground">
                    {item.title}
                  </span>
                  {item.description && (
                    <span className="mt-0.5 text-sm leading-snug text-muted-foreground">
                      {item.description}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

/** Navigazione orizzontale — visibile da `lg` in su. */
export function DesktopNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigazione principale" className={className}>
      <ul className="flex items-center gap-1">
        {mainNav.map((item) => {
          if (isNavGroup(item)) {
            return (
              <NavDropdown key={item.title} group={item} pathname={pathname} />
            );
          }
          const active = isNavActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  navLinkBase,
                  "relative inline-flex h-11 items-center px-3 text-sm font-medium",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.title}
                {active && <ActiveIndicator />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Sottomenu espandibile del pannello mobile (disclosure con `aria-expanded`).
 * Parte aperto se la pagina corrente è una delle sue voci, così la posizione
 * è visibile senza tap aggiuntivi. Righe alte almeno 44px.
 */
function MobileNavGroup({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  onNavigate: () => void;
}) {
  const active = isGroupActive(pathname, group);
  const [expanded, setExpanded] = useState(active);
  const listId = `${useId()}-list`;

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={listId}
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          navLinkBase,
          "flex min-h-[44px] w-full items-center justify-between px-3 text-left text-base font-medium",
          active
            ? "text-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
        )}
      >
        {group.title}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-5 transition-transform duration-150",
            expanded && "rotate-180",
          )}
        />
      </button>

      <ul
        id={listId}
        // Classe `hidden` e non l'attributo: `flex` lo sovrascriverebbe.
        className={cn(
          "ml-3 mt-1 flex-col gap-1 border-l border-border pl-3",
          expanded ? "flex" : "hidden",
        )}
      >
        {group.items.map((item) => {
          const itemActive = isNavActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={itemActive ? "page" : undefined}
                onClick={onNavigate}
                className={cn(
                  navLinkBase,
                  "flex min-h-[44px] items-center px-3 text-base",
                  itemActive
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Menu mobile (hamburger) — visibile sotto `lg` (incluso il tablet, dove le
 * voci + timer + CTA non entrerebbero comodamente nell'header). Il gruppo
 * "Strumenti" è un sottomenu espandibile (MobileNavGroup).
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
  // Il pannello resta montato durante l'animazione di uscita, così esce
  // lungo lo stesso percorso da cui è entrato (coerenza spaziale). Si smonta
  // a fine animazione (onAnimationEnd). Pattern "aggiorna lo stato durante il
  // render": nessun effetto, nessun frame vuoto all'apertura.
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  const state = open ? "open" : "closed";

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

      {mounted && (
        <>
          {/* Overlay: chiude al tap. Parte sotto l'header (top-16).
              Le animazioni NON sono dietro `motion-safe:`: con "riduci
              animazioni" la regola globale le porta a ~0ms, ma l'evento
              animationend scatta comunque e il pannello si smonta. */}
          <div
            aria-hidden="true"
            data-state={state}
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-background/60 backdrop-blur-sm duration-200 data-[state=closed]:pointer-events-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out data-[state=closed]:fill-mode-forwards"
            onClick={() => setOpen(false)}
          />

          <div
            id="mobile-nav-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
            data-state={state}
            inert={!open}
            onAnimationEnd={(e) => {
              if (e.target === e.currentTarget && !open) setMounted(false);
            }}
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-card/95 shadow-xl backdrop-blur-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2 data-[state=closed]:fill-mode-forwards"
          >
            <nav
              aria-label="Navigazione principale"
              className="container flex flex-col gap-1 py-4"
            >
              {mainNav.map((item) => {
                if (isNavGroup(item)) {
                  return (
                    <MobileNavGroup
                      key={item.title}
                      group={item}
                      pathname={pathname}
                      onNavigate={() => setOpen(false)}
                    />
                  );
                }
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
                  Fai il test
                </Link>
              </Button>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
