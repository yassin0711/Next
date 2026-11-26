import { prisma } from "@/lib/prisma";
import { CATEGORIES, STATUSES, STATUS_LABELS } from "@/lib/constants";
import Chart from "@/components/Chart";

export const dynamic = "force-dynamic"; // statistiques recalculées à chaque visite

export default async function Page() {
  const byStatus = await prisma.report.groupBy({ by: ["status"], _count: true });
  const byCategory = await prisma.report.groupBy({ by: ["category"], _count: true });
  const resolved = await prisma.report.findMany({
    where: { status: "RESOLU", resolvedAt: { not: null } },
    select: { createdAt: true, resolvedAt: true },
  });

  // Toutes les valeurs sont affichées, même celles à 0
  const statusData = STATUSES.map((s) => ({
    name: STATUS_LABELS[s],
    total: byStatus.find((r) => r.status === s)?._count ?? 0,
  }));
  const categoryData = CATEGORIES.map((c) => ({
    name: c,
    total: byCategory.find((r) => r.category === c)?._count ?? 0,
  }));

  // Délai moyen de résolution en jours
  const ONE_DAY = 1000 * 60 * 60 * 24;
  let averageDays = 0;
  if (resolved.length > 0) {
    const totalMs = resolved.reduce((sum, r) => sum + (r.resolvedAt!.getTime() - r.createdAt.getTime()), 0);
    averageDays = totalMs / resolved.length / ONE_DAY;
  }

  const total = statusData.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="space-y-6">
        <h1 className="page-title">Tableau de bord</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-gray-500">Signalements</p>
          <p className="mt-1 text-3xl font-bold text-teal-800">{total}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Résolus</p>
          <p className="mt-1 text-3xl font-bold text-teal-800">{resolved.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Délai moyen de résolution</p>
          <p className="mt-1 text-3xl font-bold text-teal-800">{resolved.length > 0 ? `${averageDays.toFixed(1)} jours` : "—"}</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Chart title="Signalements par statut" data={statusData} />
        <Chart title="Signalements par catégorie" data={categoryData} horizontal />
      </div>
    </section>
  </div>
  );
}
