import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole, HttpError } from "@/lib/auth";
import { handleApiError } from "@/lib/api";

// Soutenir un signalement (utilisateur connecté, une seule fois par personne)
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole();
    const { id } = await params;

    const report = await prisma.report.findUnique({ where: { id }, select: { id: true } });
    if (!report) throw new HttpError(404, "Signalement introuvable");

    await prisma.support.create({ data: { userId: user.id, reportId: id } });
    const total = await prisma.support.count({ where: { reportId: id } });
    return NextResponse.json({ total }, { status: 201 });
  } catch (e) {
    // P2002 = contrainte @@unique violée : la personne a déjà soutenu ce signalement
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Vous soutenez déjà ce signalement" }, { status: 409 });
    }
    return handleApiError(e);
  }
}
