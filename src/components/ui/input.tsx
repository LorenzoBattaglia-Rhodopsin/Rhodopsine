import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Campo di testo (stile shadcn/ui, token di tema).
 * - Altezza 48px (target ≥ 44px) e testo a 16px: sotto i 16px iOS Safari
 *   ingrandisce la pagina al focus.
 * - Focus visibile con lo stesso anello dei bottoni.
 */
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-12 w-full rounded-full border border-input bg-background/60 px-5 text-base text-foreground transition-colors",
      "placeholder:text-muted-foreground/80",
      "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
