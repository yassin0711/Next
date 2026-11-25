"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ROLES, type Role } from "@/lib/constants";
import { EmptyState, ErrorMessage, Loading } from "@/components/States";

type User = { id: string; name: string; email: string; role: Role };

const ROLE_LABELS: Record<Role, string> = {
  USER: "Utilisateur",
  RESPONSABLE: "Responsable",
  ADMIN: "Administrateur",
};

export default function AdminPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then(async (r) => (r.ok ? r.json() : Promise.reject((await r.json()).error)))
      .then(setUsers)
      .catch((e) => setError(typeof e === "string" ? e : "Impossible de charger les utilisateurs"));
  }, []);

  async function changeRole(id: string, role: Role) {
    setError("");
    setSavingId(id);
    const res = await fetch(`/api/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setSavingId(null);
    if (!res.ok) return setError((await res.json()).error ?? "Erreur");
    const updated: User = await res.json();
    setUsers((list) => list?.map((u) => (u.id === id ? updated : u)) ?? null);
  }

  return (
    <section className="space-y-6">
      <h1 className="page-title">Administration : utilisateurs</h1>
      {error && <ErrorMessage message={error} />}
      {!users && !error && <Loading />}
      {users?.length === 0 && <EmptyState message="Aucun utilisateur." />}
      {users && users.length > 0 && (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr><th className="p-3">Nom</th><th className="p-3">Email</th><th className="p-3">Rôle</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <label className="sr-only" htmlFor={`role-${u.id}`}>Rôle de {u.name}</label>
                    <select
                      id={`role-${u.id}`}
                      value={u.role}
                      disabled={savingId === u.id || u.id === session?.user.id}
                      onChange={(e) => changeRole(u.id, e.target.value as Role)}
                      className="rounded-lg border border-gray-300 px-2 py-1"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
