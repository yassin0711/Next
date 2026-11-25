import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, HttpError } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { assignSchema } from "@/lib/validations";

// Attribution d'un signalement à un responsable (admin uniquement)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireRole("ADMIN");
    const { id } = await params;
    const { assigneeId } = assignSchema.parse(await req.json());

    const report = await prisma.report.findUnique({ where: { id }, select: { id: true, status: true } });
    if (!report) throw new HttpError(404, "Signalement introuvable");

    const assignee = await prisma.user.findUnique({ where: { id: assigneeId }, select: { role: true, name: true } });
    if (!assignee || assignee.role !== "RESPONSABLE") {
      throw new HttpError(400, "Cet utilisateur n'est pas responsable");
    }

    // Attribution + ligne d'historique (le statut ne change pas : fromStatus = toStatus)
    const [updated] = await prisma.$transaction([
      prisma.report.update({
        where: { id },
        data: { assigneeId },
        include: { assignee: { select: { id: true, name: true } } },
      }),
      prisma.statusHistory.create({
        data: {
          reportId: id,
          fromStatus: report.status,
          toStatus: report.status,
          note: `Attribué à ${assignee.name}`,
          authorId: admin.id,
        },
      }),
    ]);
    return NextResponse.json(updated);
  } catch (e) {
    return handleApiError(e);
  }
}
