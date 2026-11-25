import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { Status } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";
import SupportButton from "@/components/SupportButton";
import AssignForm from "@/components/AssignForm";
import StatusForm from "@/components/StatusForm";
import StatusHistoryList from "@/components/StatusHistoryList";
import CommentSection from "@/components/CommentSection";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      assignee: { select: { name: true } },
      _count: { select: { supports: true } },
      history: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!report) notFound();

  // L'utilisateur connecté a-t-il déjà soutenu ce signalement ?
  const user = await getCurrentUser();
  const mySupport = user
    ? await prisma.support.findUnique({ where: { userId_reportId: { userId: user.id, reportId: id } } })
    : null;

  return (
    <section className="space-y-4">
      <Link href="/signalements" className="text-sm text-gray-500 hover:text-teal-700">← Retour aux signalements</Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne principale : infos et commentaires */}
        <div className="space-y-6 lg:col-span-2">
          <article className="card space-y-4 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="page-title">{report.title}</h1>
              <StatusBadge status={report.status as Status} />
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span className="rounded-md bg-teal-50 px-2 py-0.5 text-teal-800">{report.category}</span>
              <span>📍 {report.location}</span>
              <span>· par {report.author.name} le {report.createdAt.toLocaleDateString("fr-FR")}</span>
            </div>
            <p className="whitespace-pre-line leading-relaxed text-gray-800">{report.description}</p>
            {report.photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={report.photoUrl} alt={`Photo : ${report.title}`} className="max-h-96 w-full rounded-lg object-cover" />
            )}
            {report.resolution && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                <p className="font-semibold">✅ Intervention réalisée</p>
                <p className="mt-1">{report.resolution}</p>
              </div>
            )}
            <SupportButton reportId={report.id} initialTotal={report._count.supports} alreadySupported={!!mySupport} />
          </article>

          <CommentSection reportId={report.id} />
        </div>

        {/* Colonne de droite : suivi */}
        <aside className="space-y-6">
          <div className="card">
            <p className="text-sm text-gray-500">Responsable</p>
            <p className="mt-1 font-semibold">{report.assignee?.name ?? "Non assigné"}</p>
          </div>
          <AssignForm reportId={report.id} />
          <StatusForm reportId={report.id} status={report.status as Status} assigneeId={report.assigneeId} />
          <StatusHistoryList history={report.history} />
        </aside>
      </div>
    </section>
  );
}
