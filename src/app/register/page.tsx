"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema } from "@/lib/validations";
import { ErrorMessage } from "@/components/States";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const parsed = registerSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) return setError(parsed.error.issues[0].message);

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      setLoading(false);
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return setError(data?.error ?? "Une erreur est survenue");
      }
      router.push("/login");
    } catch {
      setLoading(false);
      setError("Impossible de joindre le serveur");
    }
  }

  return (
    <div className="mx-auto max-w-md py-6 sm:py-12">
      <form onSubmit={onSubmit} className="card space-y-5 p-8 shadow-md">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-600 text-white shadow-sm shadow-teal-700/20">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Créer un compte</h1>
          <p className="text-xs text-slate-500">Rejoignez la communauté pour signaler et soutenir des interventions</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="space-y-4">
          <div>
            <label className="label">Nom complet</label>
            <input name="name" required placeholder="ex: Sarah Martin" className="input" />
          </div>

          <div>
            <label className="label">Adresse Email</label>
            <input name="email" type="email" required placeholder="ex: sarah@domaine.com" className="input" />
          </div>

          <div>
            <label className="label">Mot de passe</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 caractères"
              className="input"
            />
          </div>
        </div>

        <button disabled={loading} className="btn w-full py-3 shadow-md">
          {loading ? "Création en cours..." : "Créer mon compte citoyen"}
        </button>

        <p className="text-center text-xs text-slate-500">
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-800 hover:underline">
            Accéder à la connexion
          </Link>
        </p>
      </form>
    </div>
  );
}
