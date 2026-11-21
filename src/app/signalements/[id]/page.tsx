import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Status } from "@/lib/constants";
import Todo from "@/components/Todo";
import AssignForm from "@/components/AssignForm";
import StatusForm from "@/components/StatusForm";
import StatusHistoryList from "@/components/StatusHistoryList";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      history: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!report) notFound();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Détail du signalement</h1>
      <Todo
        owner="Rayen (infos du signalement) + Saif (bouton Soutenir)"
        items={["Rayen : affichage des infos du signalement", "Saif : bouton Soutenir"]}
      />
      <AssignForm reportId={report.id} />
      <StatusForm reportId={report.id} status={report.status as Status} assigneeId={report.assigneeId} />
      <StatusHistoryList history={report.history} />
    </section>
  );
}
