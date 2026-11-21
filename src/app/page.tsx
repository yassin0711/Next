import Link from "next/link";

export default function Home() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-3xl font-bold">LocalImpact</h1>
      <p className="mt-3 text-gray-600">
        Signalez un problème sur le campus et suivez sa résolution.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/signalements" className="rounded border px-4 py-2">Voir les signalements</Link>
        <Link href="/signalements/nouveau" className="rounded bg-teal-700 px-4 py-2 text-white">Signaler un problème</Link>
      </div>
    </section>
  );
}
