import Link from "next/link";

const STEPS = [
  { title: "1. Signalez", text: "Une lampe cassée, une rampe inaccessible, un PC en panne ? Décrivez le problème en quelques secondes." },
  { title: "2. Soutenez", text: "Soutenez les signalements des autres pour montrer quels problèmes sont les plus urgents." },
  { title: "3. Suivez", text: "Un responsable prend en charge le problème. Suivez chaque étape jusqu'à la résolution." },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 px-6 py-16 text-center text-white shadow-lg">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Améliorons notre cadre de vie ensemble</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-teal-100">
          Campus, résidence ou quartier : signalez un problème du quotidien et suivez sa résolution, étape par étape.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/signalements/nouveau" className="rounded-lg bg-white px-5 py-2.5 font-semibold text-teal-800 hover:bg-teal-50">
            Signaler un problème
          </Link>
          <Link href="/signalements" className="rounded-lg border border-white/40 px-5 py-2.5 font-semibold hover:bg-white/10">
            Voir les signalements
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.title} className="card">
            <h2 className="text-lg font-semibold text-teal-800">{s.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{s.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
