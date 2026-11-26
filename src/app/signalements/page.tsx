"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORIES, STATUSES, STATUS_LABELS, type Status } from "@/lib/constants";
import { EmptyState, ErrorMessage, Loading } from "@/components/States";
import ReportCard from "@/components/ReportCard";
import { IconSearch, IconPin, IconPlus } from "@/components/Icons";

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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="page-title">Signalements</h1>
            <p className="page-subtitle">
              {reports ? `${reports.length} problème(s) répertorié(s)` : "Chargement..."}
            </p>
          </div>
          <Link href="/signalements/nouveau" className="btn shadow-xs">
            <IconPlus className="h-4 w-4" />
            <span>Nouveau signalement</span>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="card grid gap-3 sm:grid-cols-2 lg:grid-cols-4 p-4">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <IconSearch className="h-4 w-4" />
            </span>
            <input
              value={filters.q}
              onChange={(e) => update("q", e.target.value)}
              placeholder="Rechercher par mot-clé..."
              aria-label="Recherche"
              className="input mt-0 pl-9"
            />
          </div>

          <div>
            <select
              value={filters.category}
              onChange={(e) => update("category", e.target.value)}
              aria-label="Catégorie"
              className="input mt-0"
            >
              <option value="">Toutes les catégories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <IconPin className="h-4 w-4" />
            </span>
            <input
              value={filters.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Filtrer par lieu..."
              aria-label="Lieu"
              className="input mt-0 pl-9"
            />
          </div>

          <div>
            <select
              value={filters.status}
              onChange={(e) => update("status", e.target.value)}
              aria-label="Statut"
              className="input mt-0"
            >
              <option value="">Tous les statuts</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}
        {!reports && !error && <Loading />}
        {reports?.length === 0 && (
          <EmptyState message="Aucun signalement ne correspond à vos critères de recherche." />
        )}

        {/* Grid of cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports?.map((r) => (
            <ReportCard key={r.id} {...r} supports={r._count.supports} />
          ))}
        </div>
      </section>
    </div>
  );
}
