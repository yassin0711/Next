import Link from "next/link";

// Page 404 (adresse inconnue ou signalement introuvable)
export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl space-y-4 py-16 text-center">
      <h1 className="page-title">Page introuvable</h1>
      <p className="text-gray-600">Cette page ou ce signalement n&apos;existe pas.</p>
      <Link href="/signalements" className="btn inline-block">Voir les signalements</Link>
    </section>
  );
}
