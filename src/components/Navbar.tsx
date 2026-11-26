"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { IconLogo, IconPlus } from "@/components/Icons";

const ROLE_LABELS = { USER: "Utilisateur", RESPONSABLE: "Responsable", ADMIN: "Admin" };
const ROLE_BADGE = {
  USER: "bg-teal-50 text-teal-700 border-teal-200",
  RESPONSABLE: "bg-blue-50 text-blue-700 border-blue-200",
  ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
};

// Lien de navigation, mis en évidence quand on est sur la page
function NavLink({ href, label }: { href: string; label: string }) {
  const active = usePathname() === href;
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-slate-100 text-slate-900 font-semibold"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <nav aria-label="Navigation principale" className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Logo & Navigation principale */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs transition group-hover:bg-teal-800">
              <IconLogo className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Local<span className="text-teal-700">Impact</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink href="/signalements" label="Signalements" />
            {(role === "RESPONSABLE" || role === "ADMIN") && <NavLink href="/responsable" label="Mes affectations" />}
            {session && <NavLink href="/dashboard" label="Tableau de bord" />}
            {role === "ADMIN" && <NavLink href="/admin" label="Administration" />}
          </div>
        </div>

        {/* Bouton d'action et utilisateur */}
        <div className="flex items-center gap-3">
          <Link
            href="/signalements/nouveau"
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white shadow-xs transition hover:bg-teal-800"
          >
            <IconPlus className="h-3.5 w-3.5" />
            <span>Signaler</span>
          </Link>

          {session ? (
            <div className="flex items-center gap-2 pl-2">
              <span className="hidden items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 sm:inline-flex border border-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {session.user.name}
                {role && (
                  <span className={`rounded border px-1.5 py-0.2 text-[10px] font-semibold ${ROLE_BADGE[role]}`}>
                    {ROLE_LABELS[role]}
                  </span>
                )}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
              >
                Déconnexion
              </button>
            </div>
          ) : status === "loading" ? null : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900">
                Connexion
              </Link>
              <Link href="/register" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-xs transition hover:bg-slate-50">
                Inscription
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
