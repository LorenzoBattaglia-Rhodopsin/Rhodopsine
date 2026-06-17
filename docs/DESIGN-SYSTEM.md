# Design System — WELL-BEING-EYE (WBe)

> Palette, tipografia, spaziature e principi visivi. I valori sono definiti come
> variabili CSS HSL in `src/app/globals.css` e mappati in `tailwind.config.ts`.

## 1. Principi

- **Calmo, premium, scientifico.** Niente colori aggressivi (no verde acido, no
  rosso d'allarme). Il tono rassicura e informa.
- **Niente bianco o nero puri.** Sfondo caldo scuro, testo crema.
- **Un solo elemento distintivo:** il motivo a **iride** (logo, hero, gauge dei
  risultati). Riconoscibile e coerente.
- **Accessibilità prima dell'estetica:** contrasti AA+, focus visibile, movimento
  riducibile.

Ispirazioni: Apple HIG, Stripe, Linear, Notion, Headspace.

## 2. Palette

I colori sono in HSL (token CSS). Di seguito l'equivalente esadecimale e il
ruolo. I due colori di marca canonici sono **#1A1816** (sfondo) e **#E6DFD3**
(testo); i valori calcolati dall'HSL coincidono a meno dell'arrotondamento.

### Superfici e testo
| Token              | HSL              | Hex      | Uso |
|--------------------|------------------|----------|-----|
| `background`       | `30 8% 9%`       | #1A1816  | Sfondo pagina |
| `foreground`       | `38 27% 86%`     | #E6DFD3  | Testo principale |
| `card`             | `30 8% 12%`      | #211F1C  | Superfici rialzate |
| `muted`            | `30 6% 16%`      | #2B2926  | Riempimenti tenui |
| `muted-foreground` | `38 14% 68%`     | #B9B0A2  | Testo secondario |
| `border` / `input` | `30 7% 20–22%`   | #37332F  | Bordi e campi |

### Accento e stati
| Token         | HSL            | Hex      | Uso |
|---------------|----------------|----------|-----|
| `primary`     | `172 30% 54%`  | #67ADA4  | Accento (teal): CTA, link, dettagli |
| `primary-hover` | `172 32% 47%`| #519E94  | Hover del primario |
| `ring`        | `172 45% 62%`  | —        | Anello di focus |
| `success`     | `150 30% 52%`  | #60A985  | Livello **basso** (salvia) |
| `warning`     | `38 58% 60%`   | #D4A95E  | Livello **moderato** (ambra) |
| `elevated`    | `16 52% 57%`   | #CA7758  | Livello **elevato** (terracotta, non rosso) |

> La scelta del **teal** come accento e della **terracotta** (non rosso) per il
> livello elevato è deliberata: evita sia i toni "da IA" (verde acido/vermiglio)
> sia l'allarmismo, in linea con un prodotto sul benessere.

## 3. Contrasto (WCAG 2.2)

Rapporti calcolati (testo su sfondo). Soglie AA: 4.5:1 (testo normale), 3:1
(testo grande); AAA: 7:1.

| Coppia                                   | Rapporto | Esito |
|------------------------------------------|----------|-------|
| `foreground` su `background`             | 13.4 : 1 | AAA |
| `muted-foreground` su `background`       | 8.4 : 1  | AAA |
| `primary` su `background`                | 6.9 : 1  | AA (AAA su testo grande) |
| `success` su `background`                | 6.4 : 1  | AA |
| `warning` su `background`                | 8.2 : 1  | AAA |
| `elevated` su `background`               | 5.4 : 1  | AA |
| `foreground` su `card`                   | 12.3 : 1 | AAA |
| `muted-foreground` su `card`             | 7.7 : 1  | AAA |
| `primary-foreground` su `primary` (bottone) | 6.9 : 1 | AA |

Tutte le combinazioni di testo usate nel prodotto superano AA; la maggior parte
raggiunge AAA.

## 4. Tipografia

- **Famiglia:** stack di sistema (vedi ARCHITETTURA §2.1).
- **Scala fluida** (`clamp`, mobile-first) definita in `tailwind.config.ts`:
  - `display` — 2.5 → 4.25rem (titolo hero)
  - `title` — 1.75 → 2.5rem (titoli di sezione)
  - `heading` — 1.35 → 1.75rem (sotto-titoli)
  - `eyebrow` — 0.78rem, maiuscoletto spaziato (etichette sopra i titoli)
- **Misura di lettura** limitata (`max-w-prose`, ~68ch) per leggibilità.
- `text-balance` / `text-pretty` su titoli e paragrafi.

## 5. Spaziatura, raggi, layout

- **Container** centrato, max **1200px**, padding responsivo (1.25 → 2rem).
- **Ritmo verticale** delle sezioni: `py-16` (mobile) → `py-24` (desktop).
- **Raggio** base `--radius: 0.75rem` (con varianti sm/md/lg/xl derivate).
- **scroll-margin** sulle sezioni per compensare l'header sticky nelle ancore.

## 6. Movimento

- Due sole animazioni decorative: `fade-in-up` (comparsa) e `soft-pulse`
  (alone dell'iride).
- **`prefers-reduced-motion: reduce`** azzera animazioni, transizioni e
  smooth-scroll (regola globale in `globals.css`).

## 7. Componenti chiave

- **Button** — varianti `primary`/`secondary`/`ghost`/`link`; altezze 44–56px.
- **Badge** — `neutral`/`primary`/`success`/`warning`/`elevated`.
- **Card** — bordo morbido, sfondo `card`.
- **LikertScale** — righe intere tappabili (≥48px), stato selezionato evidente.
- **ScoreGauge** — arco radiale "a iride", colore in base al livello.

## 8. Come cambiare tema

Modificare i valori in `:root` dentro `globals.css`. Tutto il sito si adegua
perché ogni colore Tailwind punta a `hsl(var(--token))`. Nessuna modifica ai
componenti è necessaria.
