import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { reportSchema } from "@/lib/validations";
import { includesText } from "@/lib/text";

// Liste des signalements avec recherche et filtres (public)
// Exemple : GET /api/reports?q=lampe&category=Éclairage&location=B12&status=NOUVEAU
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const category = searchParams.get("category") ?? "";
    const location = searchParams.get("location") ?? "";
    const status = searchParams.get("status") ?? "";

    const reports = await prisma.report.findMany({
      where: {
        // Un filtre vide est ignoré (undefined)
        category: category || undefined,
        status: status || undefined,
      },
      include: { _count: { select: { supports: true } } },
      orderBy: { createdAt: "desc" },
    });
    // Recherche et lieu : comparés sans les accents ni les majuscules (un texte vide accepte tout)
    const found = reports.filter(
      (r) => (includesText(r.title, q) || includesText(r.description, q)) && includesText(r.location, location)
    );
    return NextResponse.json(found);
  } catch (e) {
    return handleApiError(e);
  }
}

// Création d'un signalement (utilisateur connecté)
export async function POST(req: Request) {
  try {
    const user = await requireRole();
    const data = reportSchema.parse(await req.json());

    // La création est la première ligne de l'historique
    const report = await prisma.report.create({
      data: {
        ...data,
        photoUrl: data.photoUrl || null,
        authorId: user.id,
        history: { create: { fromStatus: null, toStatus: "NOUVEAU", authorId: user.id } },
      },
    });
    return NextResponse.json(report, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
