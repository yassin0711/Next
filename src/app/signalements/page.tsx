"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORIES, STATUSES, STATUS_LABELS, type Status } from "@/lib/constants";
import { EmptyState, ErrorMessage, Loading } from "@/components/States";
import ReportCard from "@/components/ReportCard";

type Report = {
  id: string;
  title: string;
  category: string;
  location: string;
  status: Status;
  _count: { supports: number };
};

export default function ReportsPage() {
  const [filters, setFilters] = useState({ q: "", category: "", location: "", status: "" });
  const [reports, setReports] = useState<Report[] | null>(null);
  const [error, setError] = useState("");

  // Recharge la liste à chaque changement de filtre
  useEffect(() => {
    async function load() {
      setError("");
      try {
        const res = await fetch(`/api/reports?${new URLSearchParams(filters)}`);
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          return setError(data?.error ?? "Impossible de charger les signalements");
        }
        setReports(await res.json());
      } catch {
        setError("Impossible de joindre le serveur");
      }
    }
    load();
  }, [filters]);

  function update(name: string, value: string) {
    setFilters({ ...filters, [name]: value });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Signalements</h1>
          <p className="text-sm text-gray-500">{reports ? `${reports.length} résultat(s)` : " "}</p>
        </div>
        <Link href="/signalements/nouveau" className="btn">+ Nouveau signalement</Link>
      </div>

      <div className="card grid gap-3 sm:grid-cols-4">
        <input
          value={filters.q}
          onChange={(e) => update("q", e.target.value)}
          placeholder="🔍 Rechercher..."
          aria-label="Recherche"
          className="input mt-0"
        />
        <select value={filters.category} onChange={(e) => update("category", e.target.value)} aria-label="Catégorie" className="input mt-0">
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input
          value={filters.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="Lieu"
          aria-label="Lieu"
          className="input mt-0"
        />
        <select value={filters.status} onChange={(e) => update("status", e.target.value)} aria-label="Statut" className="input mt-0">
          <option value="">Tous les statuts</option>
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {error && <ErrorMessage message={error} />}
      {!reports && !error && <Loading />}
      {reports?.length === 0 && <EmptyState message="Aucun signalement trouvé." />}

      <div className="grid gap-4 sm:grid-cols-2">
        {reports?.map((r) => (
          <ReportCard key={r.id} {...r} supports={r._count.supports} />
        ))}
      </div>
    </section>
  );
}
