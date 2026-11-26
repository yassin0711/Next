import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { HttpError, isDatabaseDown } from "@/lib/auth";

/** Transforme une erreur en réponse JSON propre (401/403/400/404/409/503/500). */
export function handleApiError(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Données invalides", details: error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  if (isDatabaseDown(error)) {
    console.warn("[API] Base de données inaccessible :", (error as Error).message);
    return NextResponse.json(
      { error: "Impossible de se connecter à la base de données. Veuillez vérifier que PostgreSQL est bien démarré sur le port 5432." },
      { status: 503 }
    );
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Cette entrée existe déjà." }, { status: 409 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Ressource introuvable." }, { status: 404 });
    }
  }
  console.error(error);
  return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
}
