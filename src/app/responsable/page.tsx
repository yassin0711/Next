import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { Status } from "@/lib/constants";
import { EmptyState } from "@/components/States";
import ReportCard from "@/components/ReportCard";

export const dynamic = "force-dynamic"; // liste propre à l'utilisateur connecté

// Signalements assignés au responsable connecté (page protégée par le middleware)
export default async function Page() {
  const user = await getCurrentUser();
  const reports = await prisma.report.findMany({
    where: { assigneeId: user?.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="page-title">Mes affectations</h1>
        <p className="text-sm text-gray-500">Signalements qui vous sont assignés</p>
      </div>
      {reports.length === 0 && <EmptyState message="Aucun signalement assigné." />}
      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((r) => (
          <ReportCard key={r.id} {...r} status={r.status as Status} />
        ))}
      </div>
    </section>
  );
}
