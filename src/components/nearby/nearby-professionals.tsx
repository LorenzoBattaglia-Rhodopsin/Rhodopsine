import { nearbyCopy } from "@/data/nearby";
import { ProfessionalKinds } from "@/components/nearby/professional-kinds";
import { NearbySearch } from "@/components/nearby/nearby-search";

/**
 * SEZIONE "PROFESSIONISTI" DI /risultati
 * --------------------------------------------------------------------------
 * Intestazione + differenza oculista/ottico + la stessa <NearbySearch /> della
 * pagina /trova-ottici-oculisti (nessuna duplicazione).
 *
 * PRIVACY: nessuna prop, qui come in <NearbySearch />. La ricerca non può
 * essere collegata al punteggio del test.
 */
export function NearbyProfessionals() {
  return (
    <section
      aria-labelledby="nearby-title"
      className="mt-16 border-t border-border pt-16 sm:mt-24 sm:pt-24"
    >
      <header className="max-w-prose">
        <p className="mb-3 text-eyebrow font-medium uppercase text-primary">
          {nearbyCopy.eyebrow}
        </p>
        <h2
          id="nearby-title"
          className="text-title text-balance font-semibold text-foreground"
        >
          {nearbyCopy.title}
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {nearbyCopy.description}
        </p>
      </header>

      <div className="mt-10">
        <ProfessionalKinds />
      </div>

      <div className="mt-10">
        <NearbySearch />
      </div>
    </section>
  );
}
