import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

const STEPS = [
  {
    step: "01",
    title: "Signalez en direct",
    text: "Une lampe défectueuse, un ascenseur bloqué, un PC en panne ? Décrivez le problème en quelques secondes avec lieu et photo.",
    icon: (
      <svg className="h-6 w-6 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    badgeColor: "bg-teal-50 border-teal-200 text-teal-700",
  },
  {
    step: "02",
    title: "Soutenez les urgences",
    text: "Votez d'un clic pour les signalements qui impactent votre quotidien. Plus un problème est soutenu, plus il est prioritaire.",
    icon: (
      <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
    ),
    badgeColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    step: "03",
    title: "Suivez l'intervention",
    text: "Attribution à un responsable, passage en cours, compte-rendu de réparation : chaque étape est tracée en toute transparence.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    badgeColor: "bg-blue-50 border-blue-200 text-blue-700",
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Matériel défectueux": "🛠️",
  "Accessibilité": "♿",
  "Éclairage": "💡",
  "Propreté": "🧹",
  "Équipement informatique": "💻",
  "Autre": "📌",
};

export default function Home() {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 px-6 py-16 text-center text-white shadow-2xl ring-1 ring-white/10 sm:px-12 sm:py-24">
        {/* Glow ambient background effects */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-teal-500/25 blur-3xl sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative mx-auto max-w-3xl space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-900/40 px-3.5 py-1.5 text-xs font-medium text-teal-200 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Plateforme collaborative pour votre cadre de vie</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Améliorons notre <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-200 via-emerald-300 to-teal-100 bg-clip-text text-transparent">
              cadre de vie ensemble
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Campus, résidence ou quartier : signalez un problème du quotidien, mobilisez votre communauté et suivez chaque étape de la résolution avec une traçabilité totale.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/signalements/nouveau"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all duration-200 hover:from-emerald-400 hover:to-teal-400 hover:shadow-teal-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Signaler un problème</span>
            </Link>

            <Link
              href="/signalements"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg className="h-4 w-4 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Voir les signalements</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-teal-300">✓</span>
              <span>Prise en charge rapide</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-teal-300">✓</span>
              <span>Démocratie participative</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-teal-300">✓</span>
              <span>100% transparent</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="space-y-10">
        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-widest text-teal-700">Fonctionnement</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Un processus simple, collaboratif et efficace
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Chaque voix compte. Notre plateforme connecte directement les usagers aux équipes d'intervention technique.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.title}
              className="group relative rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200/70 shadow-xs transition-colors group-hover:bg-teal-50 group-hover:border-teal-200">
                  {s.icon}
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${s.badgeColor}`}>
                  Étape {s.step}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-bold text-slate-900 transition group-hover:text-teal-800">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories quick explorer */}
      <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/70 p-8 shadow-xs sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-teal-700">Thématiques</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Types d&apos;incidents pris en charge
            </h2>
            <p className="mt-1 text-sm text-slate-500">Sélectionnez une catégorie pour filtrer les signalements en cours.</p>
          </div>
          <Link href="/signalements" className="btn-outline text-xs">
            Voir tous les incidents →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/signalements?category=${encodeURIComponent(cat)}`}
              className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50/30 hover:shadow-md"
            >
              <span className="text-2xl">{CATEGORY_ICONS[cat] ?? "📌"}</span>
              <span className="mt-2 text-xs font-semibold text-slate-800 line-clamp-1">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 to-emerald-700 p-8 text-white shadow-xl sm:p-12">
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Un problème repéré sur les lieux ?
            </h2>
            <p className="text-sm leading-relaxed text-teal-100">
              Ne laissez pas les désagréments s&apos;accumuler. Prenez une photo, remplissez le formulaire en 1 minute et aidez les équipes techniques à intervenir.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signalements/nouveau"
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-900 shadow-md transition-all hover:bg-teal-50 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Créer un signalement
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 hover:-translate-y-0.5"
            >
              Consulter les statistiques
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
