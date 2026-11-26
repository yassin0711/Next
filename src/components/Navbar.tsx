"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const ROLE_LABELS = { USER: "Utilisateur", RESPONSABLE: "Responsable", ADMIN: "Admin" };
const ROLE_BADGE = {
  USER: "bg-teal-50 text-teal-700 border-teal-200",
  RESPONSABLE: "bg-blue-50 text-blue-700 border-blue-200",
  ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
};

// Lien de navigation, mis en évidence quand on est sur la page
function NavLink({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  const active = usePathname() === href;
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-teal-50 text-teal-800 shadow-xs ring-1 ring-teal-600/10 font-semibold"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <nav aria-label="Navigation principale" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-emerald-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:shadow-md">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Local<span className="bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent">Impact</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden items-center gap-1 md:flex">
            <NavLink href="/signalements" label="Signalements" />
            {(role === "RESPONSABLE" || role === "ADMIN") && <NavLink href="/responsable" label="Mes affectations" />}
            {session && <NavLink href="/dashboard" label="Tableau de bord" />}
            {role === "ADMIN" && <NavLink href="/admin" label="Administration" />}
          </div>
        </div>

        {/* Action & User */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/signalements/nouveau"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-xs transition hover:from-teal-800 hover:to-emerald-700 hover:shadow-md"
          >
            <span className="text-base leading-none">+</span>
            <span>Signaler</span>
          </Link>

          {session ? (
            <div className="flex items-center gap-2 pl-2">
              <span className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 sm:inline-flex border border-slate-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {session.user.name}
                {role && (
                  <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${ROLE_BADGE[role]}`}>
                    {ROLE_LABELS[role]}
                  </span>
                )}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-outline px-3 py-1.5 text-xs text-slate-600 hover:text-red-600"
              >
                Déconnexion
              </button>
            </div>
          ) : status === "loading" ? null : (
            <div className="flex items-center gap-1.5">
              <Link href="/login" className="btn-ghost px-3 py-1.5 text-sm">
                Connexion
              </Link>
              <Link href="/register" className="btn-outline px-3 py-1.5 text-sm">
                Inscription
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
