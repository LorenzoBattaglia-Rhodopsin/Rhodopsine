import { Glasses, Stethoscope } from "lucide-react";
import type { ProfessionalKind } from "@/types/nearby";
import { Card, CardContent } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/icon-badge";
import { professionalKinds } from "@/data/nearby";

/**
 * OCULISTA vs OTTICO-OPTOMETRISTA — card statiche, nessun hover.
 * Condivise da /risultati e /trova-ottici-oculisti.
 */
export const KIND_ICON: Record<ProfessionalKind, typeof Glasses> = {
  ophthalmologist: Stethoscope,
  optician: Glasses,
};

export function ProfessionalKinds() {
  return (
    <ul role="list" className="grid gap-6 sm:grid-cols-2">
      {(Object.keys(professionalKinds) as ProfessionalKind[]).map((kind) => {
        const Icon = KIND_ICON[kind];
        const k = professionalKinds[kind];
        return (
          <li key={kind}>
            <Card tone="tinted" className="h-full">
              <CardContent className="flex items-start gap-4 p-6">
                <IconBadge icon={Icon} />
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {k.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {k.body}
                  </p>
                </div>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
