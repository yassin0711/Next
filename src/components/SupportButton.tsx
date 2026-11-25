"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

// Bouton « Soutenir » avec le nombre de soutiens (un seul soutien par personne)
export default function SupportButton({
  reportId,
  initialTotal,
  alreadySupported,
}: {
  reportId: string;
  initialTotal: number;
  alreadySupported: boolean;
}) {
  const { data: session } = useSession();
  const [total, setTotal] = useState(initialTotal);
  const [supported, setSupported] = useState(alreadySupported);
  const [message, setMessage] = useState("");

  async function handleClick() {
    const res = await fetch(`/api/reports/${reportId}/support`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error);
    setTotal(data.total);
    setSupported(true);
    setMessage("Merci pour votre soutien !");
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClick}
        disabled={!session || supported}
        className="btn-outline border-teal-600 text-teal-700"
      >
        {supported ? `✓ Soutenu (${total})` : `👍 Soutenir (${total})`}
      </button>
      {!session && <span className="text-sm text-gray-500">Connectez-vous pour soutenir.</span>}
      {message && <span className="text-sm">{message}</span>}
    </div>
  );
}
