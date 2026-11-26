import Link from "next/link";
import { IconLogo } from "@/components/Icons";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-slate-50/80">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white shadow-xs">
                <IconLogo className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Local<span className="text-teal-700">Impact</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500">
              Plateforme citoyenne et collaborative pour signaler, prioriser et suivre la résolution des incidents au quotidien.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Navigation</p>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li><Link href="/signalements" className="transition hover:text-teal-700">Tous les signalements</Link></li>
              <li><Link href="/signalements/nouveau" className="transition hover:text-teal-700">Signaler un problème</Link></li>
              <li><Link href="/dashboard" className="transition hover:text-teal-700">Tableau de bord &amp; statistiques</Link></li>
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Catégories fréquentes</p>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li><Link href="/signalements?category=%C3%89clairage" className="transition hover:text-teal-700">Éclairage</Link></li>
              <li><Link href="/signalements?category=Accessibilit%C3%A9" className="transition hover:text-teal-700">Accessibilité</Link></li>
              <li><Link href="/signalements?category=Propret%C3%A9" className="transition hover:text-teal-700">Propreté</Link></li>
              <li><Link href="/signalements?category=%C3%89quipement+informatique" className="transition hover:text-teal-700">Matériel informatique</Link></li>
            </ul>
          </div>

          {/* Démonstration */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Comptes de test</p>
            <p className="mt-3 text-xs text-slate-500">Mot de passe : <code className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-slate-800">demo1234</code></p>
            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <p><span className="font-semibold text-slate-700">Admin :</span> admin@demo.tn</p>
              <p><span className="font-semibold text-slate-700">Responsable :</span> responsable@demo.tn</p>
              <p><span className="font-semibold text-slate-700">Utilisateur :</span> user@demo.tn</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 pt-6 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} LocalImpact. Suivi des interventions citoyennes.</p>
          <div className="flex gap-4">
            <Link href="/signalements" className="hover:text-slate-600">Signalements</Link>
            <Link href="/dashboard" className="hover:text-slate-600">Statistiques</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
