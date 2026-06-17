import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Compone classi condizionali (clsx) e risolve i conflitti Tailwind
 * (tailwind-merge). È l'helper standard usato da shadcn/ui.
 *
 * @example cn("px-2", condizione && "px-4") // -> "px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
