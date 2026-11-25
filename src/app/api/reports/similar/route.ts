import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { includesText } from "@/lib/text";

// Signalements non résolus de même catégorie et de même lieu (détection de doublons)
// Exemple : GET /api/reports/similar?category=Éclairage&location=B12
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? "";
    const location = searchParams.get("location")?.trim() ?? "";
    if (!category || location.length < 2) return NextResponse.json([]);

    const candidates = await prisma.report.findMany({
      where: { category, status: { not: "RESOLU" } },
      select: { id: true, title: true, location: true, status: true },
    });
    // Même lieu, sans tenir compte des accents ni des majuscules
    const similar = candidates.filter((r) => includesText(r.location, location)).slice(0, 5);
    return NextResponse.json(similar);
  } catch (e) {
    return handleApiError(e);
  }
}
