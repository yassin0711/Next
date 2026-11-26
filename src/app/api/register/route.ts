import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { handleApiError } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const data = registerSchema.parse(await req.json());
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });

    // Toute inscription publique crée un USER : les rôles sont attribués par l'admin
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: await bcrypt.hash(data.password, 10) },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
    }
    return handleApiError(e);
  }
}
