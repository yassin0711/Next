"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema } from "@/lib/validations";
import { ErrorMessage } from "@/components/States";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@demo.tn", color: "hover:border-purple-300 hover:bg-purple-50 hover:text-purple-800" },
  { role: "Responsable", email: "responsable@demo.tn", color: "hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800" },
  { role: "Utilisateur", email: "user@demo.tn", color: "hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail);
    setPassword("demo1234");
    setError("");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const parsed = loginSchema.safeParse({ email, password });
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
    <div className="mx-auto max-w-md py-6 sm:py-12">
      <form onSubmit={onSubmit} className="card space-y-5 p-8 shadow-md">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-600 text-white shadow-sm shadow-teal-700/20">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Espace de connexion</h1>
          <p className="text-xs text-slate-500">Accédez à votre compte pour gérer ou voter pour des signalements</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="space-y-4">
          <div>
            <label className="label">Adresse Email</label>
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: user@demo.tn"
              className="input"
            />
          </div>

          <div>
            <label className="label">Mot de passe</label>
            <input
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
            />
          </div>
        </div>

        <button disabled={loading} className="btn w-full py-3 shadow-md">
          {loading ? "Connexion en cours..." : "Se connecter à mon compte"}
        </button>

        {/* Demo Fast Fill Chips */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Comptes de test (remplissage 1-clic)
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                type="button"
                key={acc.role}
                onClick={() => fillDemo(acc.email)}
                className={`rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs transition active:scale-95 ${acc.color}`}
              >
                {acc.role}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-semibold text-teal-700 hover:text-teal-800 hover:underline">
            Créer un compte citoyen
          </Link>
        </p>
      </form>
    </div>
  );
}
