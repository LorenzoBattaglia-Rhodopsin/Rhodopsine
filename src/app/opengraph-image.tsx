import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

/**
 * OPEN GRAPH IMAGE (file convention Next.js)
 * --------------------------------------------------------------------------
 * Genera in build un PNG 1200×630 (formato richiesto da Facebook/X/LinkedIn,
 * che NON supportano gli SVG) e inietta og:image con URL assoluto — derivato
 * da `metadataBase` — più un hash di cache-busting, su tutte le pagine.
 *
 * Il design replica il marchio: sfondo caldo scuro, iride teal, claim.
 * NB: qui i colori sono hex hardcoded perché l'immagine è un asset renderizzato
 * server-side (Satori) che non vede le variabili CSS del tema — stessa
 * eccezione degli SVG standalone in /public (vedi CLAUDE.md §5).
 */

export const alt = `${siteConfig.name} — ${siteConfig.mission}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TEAL = "#67ADA3";
const CREAM = "#E6DFD3";
const MUTED = "#A89F90";
const BACKGROUND = "#1A1816";

/** Teal/crema con trasparenza (rgba: massima compatibilità con Satori). */
const tealAlpha = (a: number) => `rgba(103, 173, 163, ${a})`;
const creamAlpha = (a: number) => `rgba(230, 223, 211, ${a})`;

/** Anello decorativo dell'iride: cerchio centrato in (910, 315). */
function ring(radius: number, style: React.CSSProperties): React.CSSProperties {
  return {
    position: "absolute",
    left: 910 - radius,
    top: 315 - radius,
    width: radius * 2,
    height: radius * 2,
    borderRadius: "50%",
    ...style,
  };
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: BACKGROUND,
        }}
      >
        {/* Iride decorativa a destra (alone, anelli, iride, pupilla, riflesso) */}
        <div
          style={ring(300, {
            background: `radial-gradient(circle, ${tealAlpha(0.18)} 0%, ${tealAlpha(0)} 70%)`,
          })}
        />
        <div style={ring(150, { border: `2px solid ${creamAlpha(0.12)}` })} />
        <div style={ring(118, { border: `2px solid ${creamAlpha(0.16)}` })} />
        <div
          style={ring(86, {
            background: `radial-gradient(circle, ${tealAlpha(0.95)} 0%, ${tealAlpha(0.35)} 55%, ${tealAlpha(0)} 100%)`,
          })}
        />
        <div
          style={ring(30, {
            backgroundColor: BACKGROUND,
            border: `2px solid ${creamAlpha(0.25)}`,
          })}
        />
        <div
          style={{
            position: "absolute",
            left: 889,
            top: 294,
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: CREAM,
            opacity: 0.55,
          }}
        />

        {/* Marchio e claim */}
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 122,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 6,
              color: TEAL,
            }}
          >
            {siteConfig.name.toUpperCase()}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 92,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.1,
              color: CREAM,
            }}
          >
            La tua vista
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.1,
              color: CREAM,
            }}
          >
            conta.
          </div>
          <div style={{ marginTop: 36, fontSize: 30, color: MUTED }}>
            Educazione e prevenzione per il benessere visivo digitale.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
