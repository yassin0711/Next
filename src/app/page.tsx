import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import {
  IconPin,
  IconThumbUp,
  IconCheck,
  IconPlus,
  IconSearch,
  IconArrowRight,
  IconCategory,
} from "@/components/Icons";

const STEPS = [
  {
    step: "01",
    title: "Signaler",
    text: "Une panne, une dégradation ou un problème d'accès ? Remplissez une fiche descriptive avec le lieu et une photo.",
    icon: <IconPin className="h-5 w-5 text-teal-700" />,
  },
  {
    step: "02",
    title: "Soutenir",
    text: "Apportez votre soutien aux signalements qui vous concernent pour aider les équipes à identifier les urgences collectives.",
    icon: <IconThumbUp className="h-5 w-5 text-teal-700" />,
  },
  {
    step: "03",
    title: "Suivre",
    text: "Dès l'attribution à un responsable jusqu'à la résolution finale, chaque étape d'intervention est historisée en clair.",
    icon: <IconCheck className="h-5 w-5 text-teal-700" />,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 space-y-20">
      {/* Hero Section Épurée et Moderne */}
      <section className="relative rounded-3xl border border-slate-200/80 bg-gradient-to-b from-teal-50/40 via-white to-white px-6 py-16 text-center sm:px-12 sm:py-20 shadow-2xs">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Améliorons notre <br className="hidden sm:inline" />
            <span className="text-teal-700">cadre de vie</span> ensemble
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Signalez un dysfonctionnement du quotidien, mobilisez les usagers et suivez la prise en charge par les équipes techniques en toute transparence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/signalements/nouveau"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-teal-800 hover:shadow-sm"
            >
              <IconPlus className="h-4 w-4" />
              <span>Signaler un problème</span>
            </Link>

            <Link
              href="/signalements"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
            >
              <IconSearch className="h-4 w-4 text-slate-500" />
              <span>Consulter les signalements</span>
            </Link>
          </div>

          {/* Indicateurs clés */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 border-t border-slate-100 pt-8 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                <IconCheck className="h-3 w-3" />
              </span>
              <span>Traitement étape par étape</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                <IconCheck className="h-3 w-3" />
              </span>
              <span>Priorisation par vote collectif</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                <IconCheck className="h-3 w-3" />
              </span>
              <span>Traçabilité complète</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section : Comment ça fonctionne */}
      <section className="space-y-8">
        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Méthodologie</p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Un processus simple en 3 étapes
          </h2>
          <p className="text-sm text-slate-500">Du signalement initial à la clôture de l&apos;intervention.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 border border-teal-100">
                  {s.icon}
                </div>
                <span className="text-xs font-bold font-mono text-slate-400">{s.step}</span>
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section : Catégories d'intervention (100% SVG Icons, 0 emoji) */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Domaines</p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Catégories d&apos;incidents
            </h2>
            <p className="text-sm text-slate-500">Filtrer directement les signalements selon le type de problème.</p>
          </div>
          <Link href="/signalements" className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline">
            Voir toute la liste →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/signalements?category=${encodeURIComponent(cat)}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-4 text-center transition hover:border-teal-300 hover:bg-teal-50/40 hover:shadow-xs"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-700 transition group-hover:bg-teal-100 group-hover:text-teal-800">
                <IconCategory category={cat} className="h-5 w-5" />
              </div>
              <span className="mt-3 text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-teal-900">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bannière d'appel à l'action sobre */}
      <section className="rounded-2xl border border-teal-200/80 bg-teal-50/70 p-8 sm:p-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-xl font-bold text-teal-950 sm:text-2xl">
              Vous constatez un problème aujourd&apos;hui ?
            </h3>
            <p className="text-sm text-teal-800/90 leading-relaxed">
              Il suffit d&apos;une minute pour créer une fiche et permettre à l&apos;équipe en charge d&apos;intervenir rapidement.
            </p>
          </div>
          <Link
            href="/signalements/nouveau"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-teal-800 shrink-0"
          >
            <span>Créer un signalement</span>
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
