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
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    setLoading(false);
    if (!res.ok) return setError((await res.json()).error ?? "Erreur");
    router.push("/login");
  }

  return (
    <form onSubmit={onSubmit} className="card mx-auto mt-6 max-w-sm space-y-4 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Inscription</h1>
        <p className="mt-1 text-sm text-gray-500">Créez votre compte en quelques secondes</p>
      </div>
      {error && <ErrorMessage message={error} />}
      <label className="label">Nom<input name="name" required className="input" /></label>
      <label className="label">Email<input name="email" type="email" required className="input" /></label>
      <label className="label">Mot de passe<input name="password" type="password" required minLength={6} className="input" /></label>
      <button disabled={loading} className="btn w-full">
        {loading ? "Création..." : "Créer mon compte"}
      </button>
      <p className="text-center text-sm text-gray-600">
        Déjà inscrit ? <Link href="/login" className="font-medium text-teal-700 hover:underline">Connexion</Link>
      </p>
    </form>
  );
}
