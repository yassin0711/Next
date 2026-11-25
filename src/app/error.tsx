"use client";
import { ErrorMessage } from "@/components/States";

// Affiché automatiquement par Next.js si une page plante (ex : base de données inaccessible)
export default function PageError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto max-w-xl space-y-4 py-10 text-center">
      <ErrorMessage message="Une erreur est survenue lors du chargement de la page." />
      <button onClick={reset} className="btn">Réessayer</button>
    </section>
  );
}
