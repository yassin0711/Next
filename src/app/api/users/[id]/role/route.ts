import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, HttpError } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { ROLES } from "@/lib/constants";

const schema = z.object({ role: z.enum(ROLES) });

// Changement de rôle (admin uniquement)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireRole("ADMIN");
    const { id } = await params;
    const { role } = schema.parse(await req.json());
    if (id === admin.id) throw new HttpError(400, "Vous ne pouvez pas modifier votre propre rôle");

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(user);
  } catch (e) {
    return handleApiError(e);
  }
}
