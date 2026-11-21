"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-sm space-y-4 rounded bg-white p-6 shadow">
      <h1 className="text-xl font-bold">Inscription</h1>
      {error && <ErrorMessage message={error} />}
      <label className="block">Nom<input name="name" required className="mt-1 w-full rounded border p-2" /></label>
      <label className="block">Email<input name="email" type="email" required className="mt-1 w-full rounded border p-2" /></label>
      <label className="block">Mot de passe<input name="password" type="password" required minLength={6} className="mt-1 w-full rounded border p-2" /></label>
      <button disabled={loading} className="w-full rounded bg-teal-700 p-2 text-white disabled:opacity-50">
        {loading ? "Création..." : "Créer mon compte"}
      </button>
    </form>
  );
}
