"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { IconThumbUp, IconCheck } from "@/components/Icons";

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
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleClick}
        disabled={!session || supported}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
          supported
            ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-teal-300 hover:text-teal-800 disabled:opacity-50"
        }`}
      >
        {supported ? (
          <>
            <IconCheck className="h-4 w-4 text-emerald-600" />
            <span>Soutenu ({total})</span>
          </>
        ) : (
          <>
            <IconThumbUp className="h-4 w-4 text-teal-700" />
            <span>Soutenir ({total})</span>
          </>
        )}
      </button>
      {!session && <span className="text-xs text-slate-500">Connectez-vous pour soutenir ce signalement.</span>}
      {message && <span className="text-xs font-medium text-emerald-700">{message}</span>}
    </div>
  );
}
