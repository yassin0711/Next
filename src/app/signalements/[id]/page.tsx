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
import { IconPin, IconCheck } from "@/components/Icons";

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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="space-y-6">
        <Link href="/signalements" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition">
          ← Retour aux signalements
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Colonne principale : infos et commentaires */}
          <div className="space-y-6 lg:col-span-2">
            <article className="card space-y-5 p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{report.title}</h1>
                <StatusBadge status={report.status as Status} />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded-md bg-teal-50 px-2.5 py-1 font-semibold text-teal-800 border border-teal-100">
                  {report.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <IconPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{report.location}</span>
                </span>
                <span>· Par {report.author.name} le {report.createdAt.toLocaleDateString("fr-FR")}</span>
              </div>

              <p className="whitespace-pre-line leading-relaxed text-slate-700 text-sm sm:text-base">{report.description}</p>

              {report.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={report.photoUrl} alt={`Photo : ${report.title}`} className="max-h-96 w-full rounded-xl object-cover border border-slate-200" />
              )}

              {report.resolution && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs sm:text-sm text-emerald-950">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <IconCheck className="h-4 w-4 text-emerald-700" />
                    <span>Intervention réalisée</span>
                  </p>
                  <p className="mt-1 text-emerald-800">{report.resolution}</p>
                </div>
              )}

              <div className="pt-2">
                <SupportButton reportId={report.id} initialTotal={report._count.supports} alreadySupported={!!mySupport} />
              </div>
            </article>

            <CommentSection reportId={report.id} />
          </div>

          {/* Colonne de droite : suivi */}
          <aside className="space-y-6">
            <div className="card space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Responsable assigné</p>
              <p className="text-base font-bold text-slate-900">{report.assignee?.name ?? "Non assigné pour l'instant"}</p>
            </div>
            <AssignForm reportId={report.id} />
            <StatusForm reportId={report.id} status={report.status as Status} assigneeId={report.assigneeId} />
            <StatusHistoryList history={report.history} />
          </aside>
        </div>
      </section>
    </div>
  );
}
