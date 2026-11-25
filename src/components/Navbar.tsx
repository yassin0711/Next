"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const ROLE_LABELS = { USER: "Utilisateur", RESPONSABLE: "Responsable", ADMIN: "Admin" };

// Lien de navigation, mis en évidence quand on est sur la page
function NavLink({ href, label }: { href: string; label: string }) {
  const active = usePathname() === href;
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        active ? "bg-teal-50 text-teal-800" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const role = session?.user.role;

  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
      <nav aria-label="Navigation principale" className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3">
        <Link href="/" className="mr-4 flex items-center gap-2 text-lg font-bold text-teal-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white">L</span>
          LocalImpact
        </Link>
        <NavLink href="/signalements" label="Signalements" />
        {session && <NavLink href="/signalements/nouveau" label="Signaler" />}
        {(role === "RESPONSABLE" || role === "ADMIN") && <NavLink href="/responsable" label="Mes affectations" />}
        {session && <NavLink href="/dashboard" label="Tableau de bord" />}
        {role === "ADMIN" && <NavLink href="/admin" label="Admin" />}

        <div className="ml-auto flex items-center gap-3">
          {session ? (
            <>
              <span className="hidden text-sm text-gray-600 sm:inline">
                {session.user.name}
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">{role && ROLE_LABELS[role]}</span>
              </span>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-outline py-1.5 text-sm">
                Déconnexion
              </button>
            </>
          ) : status === "loading" ? null : (
            <>
              <NavLink href="/login" label="Connexion" />
              <Link href="/register" className="btn py-1.5 text-sm">Inscription</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
