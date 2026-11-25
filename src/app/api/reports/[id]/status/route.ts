import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, HttpError } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { statusSchema } from "@/lib/validations";
import { NEXT_STATUS, type Status } from "@/lib/constants";

// Passage au statut suivant (responsable assigné ou admin)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole("RESPONSABLE", "ADMIN");
    const { id } = await params;
    const { status, note } = statusSchema.parse(await req.json());

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) throw new HttpError(404, "Signalement introuvable");

    if (user.role !== "ADMIN" && report.assigneeId !== user.id) {
      throw new HttpError(403, "Vous n'êtes pas assigné à ce signalement");
    }
    if (!report.assigneeId) {
      throw new HttpError(400, "Assignez d'abord un responsable à ce signalement");
    }
    if (status !== NEXT_STATUS[report.status as Status]) {
      throw new HttpError(400, "Transition non autorisée");
    }
    if (status === "RESOLU" && !note) {
      throw new HttpError(400, "Description de l'intervention obligatoire");
    }

    // Mise à jour du signalement et ajout dans l'historique en une seule fois
    const [updated] = await prisma.$transaction([
      prisma.report.update({
        where: { id },
        data: {
          status,
          resolution: status === "RESOLU" ? note : undefined,
          resolvedAt: status === "RESOLU" ? new Date() : undefined,
        },
      }),
      prisma.statusHistory.create({
        data: { reportId: id, fromStatus: report.status, toStatus: status, note, authorId: user.id },
      }),
    ]);
    return NextResponse.json(updated);
  } catch (e) {
    return handleApiError(e);
  }
}
