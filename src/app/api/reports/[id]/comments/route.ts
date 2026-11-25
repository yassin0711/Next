import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, HttpError } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { commentSchema } from "@/lib/validations";

// Liste des commentaires d'un signalement (public)
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const comments = await prisma.comment.findMany({
      where: { reportId: id },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(comments);
  } catch (e) {
    return handleApiError(e);
  }
}

// Ajout d'un commentaire (utilisateur connecté)
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole();
    const { id } = await params;
    const { content } = commentSchema.parse(await req.json());

    const report = await prisma.report.findUnique({ where: { id }, select: { id: true } });
    if (!report) throw new HttpError(404, "Signalement introuvable");

    const comment = await prisma.comment.create({
      data: { content, reportId: id, authorId: user.id },
      include: { author: { select: { name: true } } },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
