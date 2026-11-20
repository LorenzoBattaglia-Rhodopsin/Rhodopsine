import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { domainLabels } from "@/data/questions";
import type { Recommendation } from "@/types/assessment";

/**
 * Elenco dei consigli pratici, in forma di card.
 * Ogni card mostra il dominio (etichetta leggibile), il titolo e la
 * descrizione del suggerimento. Layout responsivo: 1 colonna su mobile,
 * 2 da tablet in su.
 */
export function RecommendationList({ items }: { items: Recommendation[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((rec) => (
        <li key={rec.id}>
          <Card tone="tinted" className="h-full">
            <CardHeader>
              <Badge variant="primary" className="w-fit">
                {domainLabels[rec.domain]}
              </Badge>
              <CardTitle className="mt-2">{rec.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {rec.description}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
