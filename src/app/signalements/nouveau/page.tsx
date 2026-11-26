"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { reportSchema } from "@/lib/validations";
import { CATEGORIES } from "@/lib/constants";
import { ErrorMessage } from "@/components/States";
import SimilarReports from "@/components/SimilarReports";

export default function NewReportPage() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const parsed = reportSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) return setError(parsed.error.issues[0].message);

    setLoading(true);
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    setLoading(false);
    if (!res.ok) return setError((await res.json()).error ?? "Erreur");

    const report = await res.json();
    router.push(`/signalements/${report.id}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <form onSubmit={onSubmit} className="card mx-auto max-w-2xl space-y-5 p-8">
        <div>
          <h1 className="page-title">Nouveau signalement</h1>
          <p className="mt-1 text-sm text-gray-500">Décrivez le problème le plus précisément possible.</p>
        </div>
      <label className="label">Titre
        <input name="title" required placeholder="Ex : Lampe cassée dans le couloir" className="input" />
      </label>
      <label className="label">Description
        <textarea name="description" required rows={4} className="input" />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="label">Catégorie
          <select name="category" required value={category} onChange={(e) => setCategory(e.target.value)} className="input">
            <option value="">Choisir une catégorie</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="label">Lieu
          <input
            name="location"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex : Bâtiment B, salle 12"
            className="input"
          />
        </label>
      </div>

      {/* Fonctionnalité originale : signalements similaires déjà existants */}
      <SimilarReports category={category} location={location} />

      <label className="label">Photo <span className="font-normal text-gray-400">(lien, facultatif)</span>
        <input name="photoUrl" type="url" placeholder="https://..." className="input" />
      </label>

      {/* Message d'erreur juste au-dessus du bouton, pour qu'il soit visible */}
      {error && <ErrorMessage message={error} />}
      <button disabled={loading} className="btn w-full">
        {loading ? "Envoi..." : "Envoyer le signalement"}
      </button>
    </form>
  </div>
  );
}
