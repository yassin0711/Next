"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema } from "@/lib/validations";
import { ErrorMessage } from "@/components/States";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) return setError(parsed.error.issues[0].message);

    setLoading(true);
    const res = await signIn("credentials", { ...parsed.data, redirect: false });
    setLoading(false);
    if (res?.error) return setError("Email ou mot de passe incorrect");
    router.push("/signalements");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-sm space-y-4 rounded bg-white p-6 shadow">
      <h1 className="text-xl font-bold">Connexion</h1>
      {error && <ErrorMessage message={error} />}
      <label className="block">Email<input name="email" type="email" required className="mt-1 w-full rounded border p-2" /></label>
      <label className="block">Mot de passe<input name="password" type="password" required className="mt-1 w-full rounded border p-2" /></label>
      <button disabled={loading} className="w-full rounded bg-teal-700 p-2 text-white disabled:opacity-50">
        {loading ? "Connexion..." : "Se connecter"}
      </button>
      <p className="text-sm">Pas de compte ? <Link href="/register" className="text-teal-700 underline">Inscription</Link></p>
    </form>
  );
}
