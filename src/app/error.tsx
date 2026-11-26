"use client";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "@/components/States";

// Affiché automatiquement par Next.js si une page plante (ex : base de données inaccessible)
export default function PageError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  // reset() seul réaffiche la page sans redemander les données : router.refresh() les recharge
  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <section className="mx-auto max-w-xl space-y-4 py-10 text-center">
      <ErrorMessage message="Une erreur est survenue lors du chargement de la page." />
      <button onClick={retry} className="btn">Réessayer</button>
    </section>
  );
}
