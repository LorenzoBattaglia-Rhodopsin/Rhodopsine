"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { likertOptions } from "@/data/questions";
import type { LikertValue } from "@/types/assessment";
import { cn } from "@/lib/utils";

/**
 * Scala Likert 1–5 accessibile.
 * - Costruita su Radix RadioGroup: navigazione con le frecce, focus gestito.
 * - Ogni opzione è un'area cliccabile ampia (>= 44px) adatta al tocco.
 * - L'etichetta e l'eventuale testo di aiuto sono collegati tramite ARIA.
 */
interface LikertScaleProps {
  questionId: string;
  value?: LikertValue;
  onChange: (value: LikertValue) => void;
  ariaLabelledBy: string;
  ariaDescribedBy?: string;
}

export function LikertScale({
  questionId,
  value,
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
}: LikertScaleProps) {
  return (
    <RadioGroup
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      value={value !== undefined ? String(value) : ""}
      onValueChange={(v) => onChange(Number(v) as LikertValue)}
      className="mt-6 gap-2.5"
    >
      {likertOptions.map((option) => {
        const itemId = `${questionId}-${option.value}`;
        const isSelected = value === option.value;
        return (
          <Label
            key={option.value}
            htmlFor={itemId}
            className={cn(
              "flex min-h-[3rem] cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-base font-normal transition-colors",
              "hover:bg-accent",
              isSelected
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground",
            )}
          >
            <RadioGroupItem id={itemId} value={String(option.value)} />
            <span className="select-none">{option.label}</span>
          </Label>
        );
      })}
    </RadioGroup>
  );
}
