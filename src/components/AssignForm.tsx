"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { assignSchema } from "@/lib/validations";

type User = { id: string; name: string; role: string };

// Attribuer un signalement à un responsable (admin uniquement)
export default function AssignForm({ reportId }: { reportId: string }) {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN";

  const [responsables, setResponsables] = useState<User[]>([]);
  const [assigneeId, setAssigneeId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    async function load() {
      const res = await fetch("/api/users");
      if (!res.ok) return setMessage("Impossible de charger les responsables");
      const users: User[] = await res.json();
      setResponsables(users.filter((u) => u.role === "RESPONSABLE"));
    }
    load();
  }, [isAdmin]);

  if (!isAdmin) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = assignSchema.safeParse({ assigneeId });
    if (!parsed.success) return setMessage(parsed.error.issues[0].message);

    const res = await fetch(`/api/reports/${reportId}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const data = await res.json();
    setMessage(res.ok ? "Signalement assigné." : data.error);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded bg-white p-4 shadow">
      <h2 className="font-semibold">Attribuer à un responsable</h2>
      <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="rounded border p-2">
        <option value="">Choisir un responsable</option>
        {responsables.map((r) => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
      <button className="ml-2 rounded bg-teal-700 px-4 py-2 text-white">Assigner</button>
      {message && <p className="text-sm">{message}</p>}
    </form>
  );
}
