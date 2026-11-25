import Link from "next/link";

// Affichée quand un utilisateur connecté n'a pas le bon rôle (voir middleware.ts)
export default function AccessDenied() {
  return (
    <section className="mx-auto max-w-xl space-y-4 py-16 text-center">
      <h1 className="page-title">Accès refusé</h1>
      <p className="text-gray-600">Votre rôle ne permet pas d&apos;accéder à cette page.</p>
      <Link href="/signalements" className="btn inline-block">Voir les signalements</Link>
    </section>
  );
}
