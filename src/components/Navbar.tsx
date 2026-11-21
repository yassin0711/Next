"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const role = session?.user.role;

  return (
    <header className="border-b bg-white">
      <nav aria-label="Navigation principale" className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 p-4">
        <Link href="/" className="text-lg font-bold text-teal-700">LocalImpact</Link>
        <Link href="/signalements">Signalements</Link>
        {session && <Link href="/signalements/nouveau">Signaler</Link>}
        {(role === "RESPONSABLE" || role === "ADMIN") && <Link href="/responsable">Mes affectations</Link>}
        {session && <Link href="/dashboard">Tableau de bord</Link>}
        {role === "ADMIN" && <Link href="/admin">Admin</Link>}
        <div className="ml-auto flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-gray-600">{session.user.name} ({role})</span>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded border px-3 py-1">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Connexion</Link>
              <Link href="/register" className="rounded bg-teal-700 px-3 py-1 text-white">Inscription</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
