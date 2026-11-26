import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white/60 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-slate-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white shadow-xs">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </span>
              <span className="text-lg tracking-tight font-extrabold text-slate-900">
                Local<span className="text-teal-700">Impact</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500">
              Plateforme participative pour signaler, prioriser et suivre la résolution des incidents au quotidien.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Plateforme active &amp; opérationnelle
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Navigation</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/signalements" className="transition hover:text-teal-700">Tous les signalements</Link></li>
              <li><Link href="/signalements/nouveau" className="transition hover:text-teal-700">Signaler un problème</Link></li>
              <li><Link href="/dashboard" className="transition hover:text-teal-700">Statistiques &amp; Suivi</Link></li>
            </ul>
          </div>

          {/* Catégories principales */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Catégories</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/signalements?category=%C3%89clairage" className="transition hover:text-teal-700">Éclairage public &amp; intérieur</Link></li>
              <li><Link href="/signalements?category=Accessibilit%C3%A9" className="transition hover:text-teal-700">Accessibilité PMR</Link></li>
              <li><Link href="/signalements?category=Propret%C3%A9" className="transition hover:text-teal-700">Propreté &amp; espaces</Link></li>
              <li><Link href="/signalements?category=%C3%89quipement+informatique" className="transition hover:text-teal-700">Matériel informatique</Link></li>
            </ul>
          </div>

          {/* Démos & Accès */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Comptes de démo</p>
            <p className="mt-3 text-xs text-slate-500">Mot de passe unique : <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800">demo1234</code></p>
            <div className="mt-2 space-y-1.5 text-xs text-slate-600">
              <p><span className="font-semibold text-slate-700">Admin :</span> admin@demo.tn</p>
              <p><span className="font-semibold text-slate-700">Responsable :</span> responsable@demo.tn</p>
              <p><span className="font-semibold text-slate-700">Citoyen :</span> user@demo.tn</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 pt-6 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} LocalImpact. Améliorons ensemble notre environnement.</p>
          <div className="flex gap-4">
            <Link href="/signalements" className="hover:text-slate-600">Confidentialité</Link>
            <Link href="/signalements" className="hover:text-slate-600">Conditions</Link>
            <Link href="/dashboard" className="hover:text-slate-600">Tableau de bord</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
