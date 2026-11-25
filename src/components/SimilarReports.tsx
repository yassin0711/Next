"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Report = { id: string; title: string; location: string };

// Affiche les signalements déjà existants qui ressemblent à celui en cours de création
// À placer dans le formulaire de création : <SimilarReports category={category} location={location} />
export default function SimilarReports({ category, location }: { category: string; location: string }) {
  const [similar, setSimilar] = useState<Report[]>([]);

  useEffect(() => {
    async function load() {
      const query = new URLSearchParams({ category, location });
      const res = await fetch(`/api/reports/similar?${query}`);
      if (res.ok) setSimilar(await res.json());
    }
    load();
  }, [category, location]);

  if (similar.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-semibold">Ce problème a peut-être déjà été signalé :</p>
      <ul className="ml-5 list-disc">
        {similar.map((r) => (
          <li key={r.id}>
            <Link href={`/signalements/${r.id}`} className="font-medium underline hover:text-amber-700">{r.title}</Link> ({r.location})
          </li>
        ))}
      </ul>
    </div>
  );
}
