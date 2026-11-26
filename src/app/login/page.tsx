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
    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        return setError("Email ou mot de passe incorrect");
      }
      return setError(res.error);
    }
    router.push("/signalements");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card mx-auto mt-6 max-w-sm space-y-4 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="mt-1 text-sm text-gray-500">Heureux de vous revoir</p>
      </div>
      {error && <ErrorMessage message={error} />}
      <label className="label">Email<input name="email" type="email" required className="input" /></label>
      <label className="label">Mot de passe<input name="password" type="password" required className="input" /></label>
      <button disabled={loading} className="btn w-full">
        {loading ? "Connexion..." : "Se connecter"}
      </button>
      <p className="text-center text-sm text-gray-600">
        Pas de compte ? <Link href="/register" className="font-medium text-teal-700 hover:underline">Inscription</Link>
      </p>
    </form>
  );
}
