import type { Config } from "tailwindcss";

/**
 * DESIGN SYSTEM — TailwindCSS
 * --------------------------------------------------------------------------
 * I colori sono definiti come variabili CSS HSL in `src/app/globals.css`
 * (convenzione shadcn/ui) e mappati qui. Questo permette di cambiare l'intero
 * tema modificando un solo punto e di supportare in futuro più temi.
 *
 * Vincoli di progetto rispettati:
 * - Nessun bianco puro (#FFFFFF) o nero puro (#000000).
 * - Background caldo scuro (#1A1816), testo crema (#E6DFD3).
 * - Contrasti WCAG AA o superiori (vedi docs/DESIGN-SYSTEM.md).
 * - Palette calmante, niente colori aggressivi (no verde acido, no rosso vivo).
 */
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // Colori semantici per i livelli di risultato e gli stati.
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        elevated: {
          DEFAULT: "hsl(var(--elevated))",
          foreground: "hsl(var(--elevated-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        xl: "calc(var(--radius) + 6px)",
      },
      fontFamily: {
        // Stack di sistema: zero richieste di rete (ottimo per LCP/Lighthouse),
        // rende come San Francisco su Apple, Segoe su Windows, Roboto su Android.
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        // Scala tipografica intenzionale (mobile-first, fluida su desktop).
        "display": ["clamp(2.5rem, 7vw, 4.25rem)", { lineHeight: "1.04", letterSpacing: "-0.03em" }],
        "title": ["clamp(1.75rem, 4vw, 2.5rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        "heading": ["clamp(1.35rem, 3vw, 1.75rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "eyebrow": ["0.78rem", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      maxWidth: {
        prose: "68ch",
      },
      keyframes: {
        // Comparsa morbida (rispetta prefers-reduced-motion via globals.css).
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // Pulsazione lentissima per l'alone "soft focus" dell'hero.
        "soft-pulse": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.04)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "soft-pulse": "soft-pulse 9s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
