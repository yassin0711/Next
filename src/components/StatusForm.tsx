"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { NEXT_STATUS, STATUS_LABELS, type Status } from "@/lib/constants";

// Bouton pour passer au statut suivant (responsable assigné ou admin)
export default function StatusForm({
  reportId,
  status,
  assigneeId,
}: {
  reportId: string;
  status: Status;
  assigneeId: string | null;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const next = NEXT_STATUS[status];
  const user = session?.user;
  const canChange = user && (user.role === "ADMIN" || user.id === assigneeId);
  if (!next || !canChange) return null;

  // Pas de changement de statut tant qu'aucun responsable n'est assigné (règle vérifiée aussi côté serveur)
  if (!assigneeId) {
    return (
      <div className="card text-sm text-gray-600">
        <h2 className="mb-1 font-semibold text-gray-900">Changer le statut</h2>
        Assignez d&apos;abord un responsable pour faire avancer ce signalement.
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next === "RESOLU" && !note.trim()) {
      return setMessage("Décrivez l'intervention avant de passer à Résolu.");
    }

    const res = await fetch(`/api/reports/${reportId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next, note: note.trim() || undefined }),
    });
    if (!res.ok) return setMessage((await res.json()).error);

    setNote("");
    setMessage("");
    router.refresh(); // recharge la page pour afficher le nouveau statut et l'historique
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <h2 className="font-semibold">Changer le statut</h2>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={next === "RESOLU" ? "Description de l'intervention (obligatoire)" : "Note (facultative)"}
        className="input mt-0"
      />
      <button className="btn w-full">Passer à : {STATUS_LABELS[next]}</button>
      {message && <p className="text-sm text-red-700">{message}</p>}
    </form>
  );
}
