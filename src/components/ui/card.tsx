import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Contenitore "card" con bordo morbido e sfondo leggermente rialzato.
 *
 * Toni:
 * - `default`: neutro (timer, articoli, superfici funzionali).
 * - `tinted`: riflesso teal statico nell'angolo + bordo teal tenue. Dà
 *   colore e identità alle card di contenuto SENZA stato hover.
 *
 * Volutamente senza hover: una card statica che reagisce al mouse promette
 * un'azione che non esiste (affordance falsa). Le card cliccabili (es.
 * ArticleCard) aggiungono il proprio hover tramite `group-hover` sul link.
 */
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground",
  {
    variants: {
      tone: {
        default: "border-border",
        tinted:
          "border-primary/[0.28] bg-[radial-gradient(130%_100%_at_0%_0%,hsl(var(--primary)/0.16),transparent_60%)]",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, tone, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ tone }), className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
