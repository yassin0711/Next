import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("demo1234", 10);
  const accounts = [
    { name: "Admin Démo", email: "admin@demo.tn", role: "ADMIN" },
    { name: "Responsable Démo", email: "responsable@demo.tn", role: "RESPONSABLE" },
    { name: "Étudiant Démo", email: "user@demo.tn", role: "USER" },
  ];
  for (const a of accounts) {
    await prisma.user.upsert({ where: { email: a.email }, update: {}, create: { ...a, password } });
  }
  console.log("Comptes de démonstration créés (mot de passe : demo1234)");
}

main().finally(() => prisma.$disconnect());
